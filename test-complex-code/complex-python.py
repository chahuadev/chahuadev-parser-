# Complex Python - Advanced Features
# Testing: decorators, context managers, comprehensions, async/await, type hints

from typing import TypeVar, Generic, Protocol, Optional, Union, List, Dict, Callable
from dataclasses import dataclass, field
from contextlib import contextmanager, asynccontextmanager
import asyncio
from functools import wraps, lru_cache
from collections import defaultdict, Counter
from itertools import chain, groupby

# 1. Complex decorator with parameters and wrapper
def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    await asyncio.sleep(delay * (2 ** attempt))
        return wrapper
    return decorator

# 2. Complex class with multiple inheritance and metaclass
class Meta(type):
    def __new__(mcs, name, bases, namespace, **kwargs):
        namespace['_meta'] = kwargs
        return super().__new__(mcs, name, bases, namespace)

class Mixin:
    def mixin_method(self):
        return "mixin"

@dataclass
class ComplexClass(Mixin, metaclass=Meta, version="1.0"):
    name: str
    value: Optional[int] = None
    items: List[str] = field(default_factory=list)
    metadata: Dict[str, any] = field(default_factory=dict)
    
    def __post_init__(self):
        self.items = [item.strip() for item in self.items if item]
    
    def __repr__(self):
        return f"{self.__class__.__name__}(name={self.name!r}, value={self.value})"
    
    @property
    def computed_value(self) -> int:
        return (self.value or 0) * len(self.items)

# 3. Complex comprehensions (list, dict, set, generator)
nested_list = [
    [x * y for x in range(5) if x % 2 == 0]
    for y in range(10) if y % 3 == 0
]

complex_dict = {
    k: {
        inner_k: inner_v ** 2
        for inner_k, inner_v in enumerate(range(k))
        if inner_v % 2 == 0
    }
    for k in range(10)
    if k > 5
}

generator_expr = (
    (x, y, z)
    for x in range(10)
    for y in range(x)
    for z in range(y)
    if x + y + z > 10
)

# 4. Complex async functions with context managers
@asynccontextmanager
async def complex_async_context():
    resource = await acquire_resource()
    try:
        yield resource
    finally:
        await release_resource(resource)

async def complex_async_function(items: List[str]) -> Dict[str, any]:
    async with complex_async_context() as resource:
        results = await asyncio.gather(
            *[process_item(item, resource) for item in items],
            return_exceptions=True
        )
        
        return {
            'success': [r for r in results if not isinstance(r, Exception)],
            'errors': [str(r) for r in results if isinstance(r, Exception)]
        }

# 5. Complex protocol and generic types
T = TypeVar('T')
U = TypeVar('U')

class Processor(Protocol[T]):
    def process(self, item: T) -> T: ...

class GenericContainer(Generic[T]):
    def __init__(self):
        self._items: List[T] = []
    
    def add(self, item: T) -> None:
        self._items.append(item)
    
    def map(self, func: Callable[[T], U]) -> 'GenericContainer[U]':
        result = GenericContainer[U]()
        result._items = [func(item) for item in self._items]
        return result

# 6. Complex pattern matching (Python 3.10+)
def complex_match(value):
    match value:
        case {'type': 'user', 'data': {'name': name, 'age': age}} if age > 18:
            return f"Adult user: {name}"
        case {'type': 'user', 'data': {'name': name}}:
            return f"User: {name}"
        case {'type': 'admin', **rest}:
            return f"Admin with data: {rest}"
        case [first, *middle, last]:
            return f"List: {first} ... {last}"
        case _:
            return "Unknown pattern"

# 7. Complex lambda and functional programming
complex_pipeline = (
    lambda data: [
        item
        for item in data
        if item.get('active', False)
    ]
    | (lambda items: map(lambda x: {**x, 'processed': True}, items))
    | (lambda items: filter(lambda x: x.get('value', 0) > 10, items))
    | list
)

# 8. Complex descriptor protocol
class Descriptor:
    def __init__(self, validator=None):
        self.validator = validator
        self.data = {}
    
    def __set_name__(self, owner, name):
        self.name = name
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return self.data.get(id(obj))
    
    def __set__(self, obj, value):
        if self.validator and not self.validator(value):
            raise ValueError(f"Invalid value for {self.name}: {value}")
        self.data[id(obj)] = value

# 9. Complex walrus operator usage
if (n := len(data := [x for x in range(100) if x % 2 == 0])) > 10:
    print(f"Data has {n} items")

# 10. Complex exception handling
class CustomException(Exception):
    def __init__(self, message, code, *args, **kwargs):
        super().__init__(message)
        self.code = code
        self.extra_args = args
        self.extra_kwargs = kwargs

try:
    complex_operation()
except (ValueError, TypeError) as e:
    handle_value_type_error(e)
except CustomException as e:
    if e.code == 404:
        handle_not_found(e)
    else:
        raise
except* ExceptionGroup as eg:  # Python 3.11+
    for error in eg.exceptions:
        log_error(error)
finally:
    cleanup()

# 11. Complex iterator protocol
class ComplexIterator:
    def __init__(self, data):
        self.data = data
        self.index = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.index >= len(self.data):
            raise StopIteration
        value = self.data[self.index]
        self.index += 1
        return value ** 2

# 12. Complex property with getter, setter, deleter
class PropertyClass:
    def __init__(self):
        self._value = None
    
    @property
    def value(self):
        return self._value
    
    @value.setter
    def value(self, val):
        if val is not None and val < 0:
            raise ValueError("Value must be non-negative")
        self._value = val
    
    @value.deleter
    def value(self):
        print("Deleting value")
        self._value = None

# 13. Complex multiple assignment and unpacking
a, b, *rest, c = range(10)
(x, y), (z, w) = [(1, 2), (3, 4)]
{'key1': val1, 'key2': val2, **remaining} = complex_dict

# 14. Complex f-string formatting
name = "Test"
value = 42.123456
formatted = f"""
Complex formatting:
    Name: {name!r}
    Value: {value:.2f}
    Hex: {value:x}
    Expression: {2 + 2 = }
    Debug: {complex_var = !r}
"""

# 15. Complex slice operations and custom __getitem__
class CustomSequence:
    def __init__(self, data):
        self.data = data
    
    def __getitem__(self, key):
        if isinstance(key, slice):
            return [self.data[i] for i in range(*key.indices(len(self.data)))]
        elif isinstance(key, tuple):
            return [self.data[k] for k in key if 0 <= k < len(self.data)]
        return self.data[key]
