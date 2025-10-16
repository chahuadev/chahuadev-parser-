import { promises as fsPromises } from 'fs';
import path from 'path';

const ERROR_ROOT = path.join(process.cwd(), 'logs', 'errors');
const FILE_REPORTS_DIR = path.join(ERROR_ROOT, 'file-reports');
const MAX_BLOCK_LINE_COUNT = 200;

async function ensureDirectory(targetDir) {
    try {
        await fsPromises.mkdir(targetDir, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

function sanitizeSegment(segment) {
    if (!segment || typeof segment !== 'string') {
        return 'global';
    }

    const sanitized = segment
        .replace(/[\\/:]+/g, '__')
        .replace(/[^a-zA-Z0-9_.-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/\.{2,}/g, '.');

    return sanitized || 'global';
}

function parseStackFrames(stack) {
    const frames = [];
    if (typeof stack !== 'string' || stack.trim().length === 0) {
        return frames;
    }

    const frameRegex = /file:\/\/(\/[^)\s]+):(\d+):(\d+)/g;
    let match;
    while ((match = frameRegex.exec(stack)) !== null) {
        frames.push({
            path: decodeURI(match[1]),
            line: Number(match[2]),
            column: Number(match[3])
        });
    }

    return frames;
}

function normalizeStackPath(rawPath) {
    if (!rawPath || typeof rawPath !== 'string') {
        return null;
    }

    let candidate = rawPath;
    if (candidate.startsWith('/') && /^[A-Za-z]:/.test(candidate.slice(1, 3))) {
        candidate = candidate.slice(1);
    }

    try {
        return path.resolve(candidate);
    } catch (error) {
        return null;
    }
}

function resolveFileDetails(errorInfo) {
    const contextPath = errorInfo?.context?.filePath || errorInfo?.filePath;
    const frames = parseStackFrames(errorInfo?.stack);

    let absolutePath = null;
    if (typeof contextPath === 'string' && contextPath.trim().length > 0) {
        absolutePath = path.isAbsolute(contextPath)
            ? path.normalize(contextPath)
            : path.resolve(contextPath);
    }

    let matchedFrame = null;
    if (frames.length > 0) {
        if (absolutePath) {
            matchedFrame = frames.find(frame => {
                const normalizedFramePath = normalizeStackPath(frame.path);
                return normalizedFramePath && path.normalize(normalizedFramePath) === path.normalize(absolutePath);
            }) || null;
        }

        if (!absolutePath && frames[0]) {
            const inferredPath = normalizeStackPath(frames[0].path);
            if (inferredPath) {
                absolutePath = inferredPath;
                matchedFrame = frames[0];
            }
        }

        if (!matchedFrame && frames[0]) {
            matchedFrame = frames[0];
        }
    }

    if (!absolutePath && matchedFrame) {
        const inferredPath = normalizeStackPath(matchedFrame.path);
        if (inferredPath) {
            absolutePath = inferredPath;
        }
    }

    if (!absolutePath && typeof contextPath === 'string' && contextPath.trim().length > 0) {
        absolutePath = path.resolve(contextPath);
    }

    const relativePath = absolutePath
        ? (path.normalize(absolutePath).startsWith(path.normalize(process.cwd()))
            ? path.relative(process.cwd(), absolutePath)
            : absolutePath)
        : (typeof contextPath === 'string' ? contextPath : 'global');

    return {
        absolutePath: absolutePath ? path.normalize(absolutePath) : null,
        relativePath: relativePath || 'global',
        line: matchedFrame?.line || null,
        column: matchedFrame?.column || null
    };
}

function findBraceDefinedBlock(content, targetLine) {
    if (typeof targetLine !== 'number' || Number.isNaN(targetLine)) {
        return null;
    }

    const stack = [];
    let line = 1;

    for (let i = 0; i < content.length; i += 1) {
        const char = content[i];

        if (char === '{') {
            stack.push({ line });
        } else if (char === '}') {
            const start = stack.pop();
            if (start) {
                const blockStartLine = start.line;
                const blockEndLine = line;
                if (blockStartLine <= targetLine && targetLine <= blockEndLine) {
                    return { startLine: blockStartLine, endLine: blockEndLine };
                }
            }
        }

        if (char === '\n') {
            line += 1;
        }
    }

    return null;
}

function findBlankDelimitedBlock(lines, targetIndex) {
    if (!Array.isArray(lines) || lines.length === 0) {
        return { startLine: 1, endLine: 1 };
    }

    let start = targetIndex;
    while (start > 0 && lines[start - 1].trim() !== '') {
        start -= 1;
    }

    let end = targetIndex;
    while (end < lines.length - 1 && lines[end + 1].trim() !== '') {
        end += 1;
    }

    return {
        startLine: start + 1,
        endLine: end + 1
    };
}

async function extractCodeBlock(absolutePath, targetLine) {
    if (!absolutePath || !targetLine) {
        return null;
    }

    try {
        const content = await fsPromises.readFile(absolutePath, 'utf8');
        const lines = content.split(/\r?\n/);
        if (lines.length === 0) {
            return null;
        }

        const safeLine = Math.max(1, Math.min(targetLine, lines.length));
        const targetIndex = safeLine - 1;

        const braceBlock = findBraceDefinedBlock(content, safeLine);
        let startLine;
        let endLine;

        if (braceBlock) {
            startLine = braceBlock.startLine;
            endLine = braceBlock.endLine;
        } else {
            const fallbackBlock = findBlankDelimitedBlock(lines, targetIndex);
            startLine = fallbackBlock.startLine;
            endLine = fallbackBlock.endLine;
        }

        if (endLine - startLine + 1 > MAX_BLOCK_LINE_COUNT) {
            const halfWindow = Math.floor(MAX_BLOCK_LINE_COUNT / 2);
            startLine = Math.max(safeLine - halfWindow, 1);
            endLine = Math.min(startLine + MAX_BLOCK_LINE_COUNT - 1, lines.length);
        }

        const snippetLines = lines.slice(startLine - 1, endLine);

        return {
            snippet: snippetLines.join('\n'),
            startLine,
            endLine
        };
    } catch (error) {
        return null;
    }
}

async function buildCodeContext(fileDetails) {
    if (!fileDetails?.absolutePath || !fileDetails.line) {
        return null;
    }

    const block = await extractCodeBlock(fileDetails.absolutePath, fileDetails.line);
    if (!block) {
        return null;
    }

    return {
        startLine: block.startLine,
        endLine: block.endLine,
        highlightLine: fileDetails.line,
        highlightColumn: fileDetails.column || null,
        snippet: block.snippet
    };
}

export async function streamErrorReport(errorInfo) {
    try {
        await ensureDirectory(FILE_REPORTS_DIR);

        const fileDetails = resolveFileDetails(errorInfo);
        const baseName = path.basename(fileDetails.relativePath || 'global');
        const safeSegment = sanitizeSegment(baseName);
        const fileName = `${safeSegment}.log`;
        const targetPath = path.join(FILE_REPORTS_DIR, fileName);

        const codeContext = await buildCodeContext(fileDetails);

        const payload = {
            capturedAt: new Date().toISOString(),
            file: {
                absolutePath: fileDetails.absolutePath,
                relativePath: fileDetails.relativePath,
                line: fileDetails.line,
                column: fileDetails.column
            },
            codeContext,
            errorInfo
        };

    const header = `${'='.repeat(80)}\nERROR STREAM REPORT\n${'='.repeat(80)}\n`;
    const body = `${JSON.stringify(payload, null, 2)}\n`;
    const footer = `${'='.repeat(80)}\n`;

    await fsPromises.appendFile(targetPath, header + body + footer, 'utf8');
    } catch (streamError) {
        const fallbackMessage = `[#ERROR_LOG_STREAM] Failed to stream error report: ${streamError?.message ?? 'unknown error'}\n`;
        process.stderr.write(fallbackMessage);
    }
}
