// Complex TypeScript - Advanced Type System
// Testing: generics, conditional types, mapped types, template literals, decorators

// 1. Complex generic constraints and conditional types
type IsArray<T> = T extends any[] ? true : false;
type ArrayElement<T> = T extends (infer E)[] ? E : never;
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
type DeepReadonly<T> = T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T;

// 2. Complex mapped types with template literals
type EventMap<T extends Record<string, any>> = {
    [K in keyof T as `on${Capitalize<string & K>}`]: (data: T[K]) => void;
};

type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
    [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// 3. Complex utility types composition
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];

type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 4. Complex function overloads with generics
function complex<T extends string>(value: T): T;
function complex<T extends number>(value: T): T;
function complex<T extends object>(value: T): DeepReadonly<T>;
function complex<T>(value: T): T {
    return value;
}

// 5. Complex class with decorators and private fields
function logged(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
        console.log(`Calling ${key} with`, args);
        return original.apply(this, args);
    };
    return descriptor;
}

function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class ComplexClass<T extends object> {
    #privateField: Map<string, T>;
    
    constructor(private readonly config: DeepReadonly<T>) {
        this.#privateField = new Map();
    }
    
    @logged
    async process<U>(
        data: T,
        transformer: (item: T) => Promise<U>
    ): Promise<U[]> {
        const results: U[] = [];
        for (const [key, value] of Object.entries(data)) {
            results.push(await transformer(value as T));
        }
        return results;
    }
    
    get<K extends keyof T>(key: K): T[K] | undefined {
        return this.config[key];
    }
}

// 6. Complex intersection and union types
type Status = 'pending' | 'success' | 'error';
type Result<T> = 
    | { status: 'pending'; data: null }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };

type Merge<A, B> = {
    [K in keyof A | keyof B]: K extends keyof A & keyof B
        ? A[K] | B[K]
        : K extends keyof A
        ? A[K]
        : K extends keyof B
        ? B[K]
        : never;
};

// 7. Complex template literal types
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/posts' | '/comments';
type APIRoute = `${HTTPMethod} ${Endpoint}`;

type CamelCase<S extends string> = S extends `${infer A}-${infer B}`
    ? `${A}${Capitalize<CamelCase<B>>}`
    : S;

// 8. Complex recursive types
type JSONValue = 
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

type DeepNullable<T> = {
    [K in keyof T]: T[K] extends object
        ? DeepNullable<T[K]> | null
        : T[K] | null;
};

// 9. Complex conditional type inference
type UnwrapPromise<T> = T extends Promise<infer U>
    ? UnwrapPromise<U>
    : T;

type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;
type ParametersOf<T> = T extends (...args: infer P) => any ? P : never;

// 10. Complex abstract class with generics
abstract class Repository<T extends { id: string | number }> {
    abstract find(id: T['id']): Promise<T | null>;
    abstract findAll(filter?: Partial<T>): Promise<T[]>;
    abstract create(data: Omit<T, 'id'>): Promise<T>;
    abstract update(id: T['id'], data: Partial<T>): Promise<T>;
    abstract delete(id: T['id']): Promise<boolean>;
    
    protected cache = new Map<T['id'], T>();
    
    async findOrCreate(
        id: T['id'],
        factory: () => Promise<Omit<T, 'id'>>
    ): Promise<T> {
        const cached = this.cache.get(id);
        if (cached) return cached;
        
        const existing = await this.find(id);
        if (existing) {
            this.cache.set(id, existing);
            return existing;
        }
        
        const data = await factory();
        const created = await this.create(data);
        this.cache.set(id, created);
        return created;
    }
}

// 11. Complex type guards and predicates
interface User { type: 'user'; name: string; }
interface Admin { type: 'admin'; name: string; permissions: string[]; }
type Person = User | Admin;

function isAdmin(person: Person): person is Admin {
    return person.type === 'admin' && 'permissions' in person;
}

function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

function handlePerson(person: Person) {
    if (isAdmin(person)) {
        return person.permissions; // TypeScript knows it's Admin
    } else {
        return person.name; // TypeScript knows it's User
    }
}

// 12. Complex async iterators and generators
async function* complexAsyncGenerator<T>(
    items: AsyncIterable<T>
): AsyncGenerator<T[], void, unknown> {
    const batch: T[] = [];
    
    for await (const item of items) {
        batch.push(item);
        if (batch.length >= 10) {
            yield [...batch];
            batch.length = 0;
        }
    }
    
    if (batch.length > 0) {
        yield batch;
    }
}

// 13. Complex module augmentation
declare global {
    interface Window {
        customProperty: string;
    }
    
    namespace NodeJS {
        interface ProcessEnv {
            CUSTOM_VAR: string;
        }
    }
}

// 14. Complex builder pattern with fluent API
class QueryBuilder<T> {
    private filters: ((item: T) => boolean)[] = [];
    private sortFn?: (a: T, b: T) => number;
    private limitValue?: number;
    
    where(predicate: (item: T) => boolean): this {
        this.filters.push(predicate);
        return this;
    }
    
    orderBy<K extends keyof T>(key: K, direction: 'asc' | 'desc' = 'asc'): this {
        this.sortFn = (a, b) => {
            const modifier = direction === 'asc' ? 1 : -1;
            return a[key] < b[key] ? -modifier : modifier;
        };
        return this;
    }
    
    limit(count: number): this {
        this.limitValue = count;
        return this;
    }
    
    execute(data: T[]): T[] {
        let result = data.filter(item => 
            this.filters.every(f => f(item))
        );
        
        if (this.sortFn) {
            result = result.sort(this.sortFn);
        }
        
        if (this.limitValue !== undefined) {
            result = result.slice(0, this.limitValue);
        }
        
        return result;
    }
}

// 15. Complex type extraction and manipulation
type Props<T> = T extends { props: infer P } ? P : never;
type State<T> = T extends { state: infer S } ? S : never;

type ExtractRouteParams<T extends string> = 
    T extends `${infer Start}:${infer Param}/${infer Rest}`
        ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
        : T extends `${infer Start}:${infer Param}`
        ? { [K in Param]: string }
        : {};

type Route = ExtractRouteParams<'/users/:userId/posts/:postId'>;
// Result: { userId: string; postId: string }
