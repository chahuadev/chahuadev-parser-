// Complex JavaScript - All Modern Features
// Testing: async/await, generators, destructuring, spread, optional chaining, nullish coalescing

// 1. Complex async generator with error handling
async function* complexAsyncGenerator(items) {
    for await (const item of items) {
        try {
            const result = await processItem(item);
            yield* result?.data ?? [];
        } catch (error) {
            yield { error: error?.message || 'Unknown error' };
        }
    }
}

// 2. Deep destructuring with default values
const { 
    user: { 
        profile: { 
            name = 'Anonymous',
            settings: { 
                theme = 'dark',
                notifications: { 
                    email = true,
                    push = false 
                } = {} 
            } = {} 
        } = {} 
    } = {} 
} = complexObject ?? {};

// 3. Complex arrow function with destructuring parameters
const processData = ({ id, type, ...rest }) => ({
    ...rest,
    processed: true,
    timestamp: Date.now(),
    metadata: { id, type }
});

// 4. Ternary chains with optional chaining
const value = a?.b?.c ? x?.y?.z ?? 0 : 
              d?.e?.f ? m?.n?.o ?? 1 : 
              defaultValue ?? 2;

// 5. Complex class with private fields and static methods
class ComplexClass {
    #privateField = new WeakMap();
    static #staticPrivate = Symbol('secret');
    
    constructor(data) {
        this.#privateField.set(this, data);
    }
    
    static async create(config) {
        const instance = new this(config);
        await instance.#initialize();
        return instance;
    }
    
    async #initialize() {
        const data = this.#privateField.get(this);
        return await this.#process(data);
    }
    
    async #process(data) {
        return data?.items?.map(item => ({
            ...item,
            processed: true
        })) ?? [];
    }
    
    get value() {
        return this.#privateField.get(this)?.value ?? null;
    }
    
    set value(newValue) {
        const current = this.#privateField.get(this) ?? {};
        this.#privateField.set(this, { ...current, value: newValue });
    }
}

// 6. Complex promise chain with error recovery
Promise.resolve(data)
    .then(d => d?.items ?? [])
    .then(items => items.map(i => ({ ...i, processed: true })))
    .catch(error => console.error(error?.message ?? 'Error'))
    .finally(() => cleanup?.() ?? void 0);

// 7. Complex object literal with computed properties and methods
const complexObject = {
    [Symbol.iterator]: function* () {
        yield* this.items ?? [];
    },
    async [Symbol.asyncIterator]() {
        for (const item of this.items ?? []) {
            yield await process(item);
        }
    },
    get length() {
        return this.items?.length ?? 0;
    },
    set items(value) {
        this._items = Array.isArray(value) ? value : [];
    }
};

// 8. Complex function composition with currying
const compose = (...fns) => x => 
    fns.reduceRight((acc, fn) => fn(acc), x);

const curry = fn => {
    const arity = fn.length;
    return function curried(...args) {
        return args.length >= arity
            ? fn(...args)
            : (...more) => curried(...args, ...more);
    };
};

// 9. Complex template literal with nested expressions
const message = `
    User: ${user?.name ?? 'Unknown'}
    Status: ${user?.active ? 'Active' : 'Inactive'}
    Last Login: ${user?.lastLogin?.toLocaleDateString() ?? 'Never'}
    Permissions: ${user?.roles?.map(r => r.name).join(', ') ?? 'None'}
`;

// 10. Complex regex with named groups and unicode
const complexRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
const unicodeRegex = /\p{Script=Han}+/gu;

// 11. Complex array operations
const result = data
    ?.filter(item => item?.active ?? false)
    ?.map(({ id, name, ...rest }) => ({
        id: id ?? generateId(),
        name: name?.trim() ?? 'Unknown',
        ...rest
    }))
    ?.reduce((acc, item) => ({
        ...acc,
        [item.id]: item
    }), {}) ?? {};

// 12. Complex error handling with custom errors
class CustomError extends Error {
    constructor(message, code, ...params) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.params = params;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

// 13. Complex proxy with traps
const handler = {
    get(target, prop, receiver) {
        return prop in target 
            ? Reflect.get(target, prop, receiver)
            : undefined;
    },
    set(target, prop, value, receiver) {
        if (typeof value === 'object' && value !== null) {
            return Reflect.set(target, prop, new Proxy(value, handler), receiver);
        }
        return Reflect.set(target, prop, value, receiver);
    },
    has(target, prop) {
        return prop in target || prop === Symbol.toStringTag;
    }
};

// 14. Complex module imports/exports pattern
export const config = { version: '1.0.0' };
export default class Main {}
export { processData as process };
export * from './utils';

// 15. Complex IIFE with complex logic
(async function complexIIFE({ config, plugins = [] } = {}) {
    const initialized = await Promise.all(
        plugins.map(async plugin => {
            try {
                return await plugin?.init?.(config) ?? null;
            } catch (error) {
                console.error(`Plugin init failed: ${error?.message}`);
                return null;
            }
        })
    );
    
    return initialized.filter(Boolean);
})({ config: globalConfig, plugins: registeredPlugins });
