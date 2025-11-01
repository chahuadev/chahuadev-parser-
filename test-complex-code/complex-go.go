// Complex Go - Concurrency and Interfaces
// Testing: goroutines, channels, interfaces, generics, error handling

package complex

import (
    "context"
    "errors"
    "fmt"
    "sync"
    "time"
)

// 1. Complex generic constraints (Go 1.18+)
type Number interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
    ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 |
    ~float32 | ~float64
}

type Ordered interface {
    Number | ~string
}

func Max[T Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 2. Complex interface composition
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type Closer interface {
    Close() error
}

type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}

// 3. Complex struct with embedded types and tags
type ComplexStruct struct {
    sync.RWMutex
    ID        string                 `json:"id" db:"id" validate:"required"`
    Name      string                 `json:"name" db:"name"`
    Tags      []string               `json:"tags,omitempty" db:"-"`
    Metadata  map[string]interface{} `json:"metadata,omitempty"`
    CreatedAt time.Time              `json:"created_at" db:"created_at"`
    UpdatedAt *time.Time             `json:"updated_at,omitempty" db:"updated_at"`
}

// 4. Complex method receivers with generics
type Container[T any] struct {
    items []T
    mu    sync.RWMutex
}

func (c *Container[T]) Add(item T) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items = append(c.items, item)
}

func (c *Container[T]) Get(index int) (T, error) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    
    var zero T
    if index < 0 || index >= len(c.items) {
        return zero, errors.New("index out of range")
    }
    return c.items[index], nil
}

func (c *Container[T]) Map[U any](fn func(T) U) *Container[U] {
    c.mu.RLock()
    defer c.mu.RUnlock()
    
    result := &Container[U]{
        items: make([]U, len(c.items)),
    }
    
    for i, item := range c.items {
        result.items[i] = fn(item)
    }
    
    return result
}

// 5. Complex channel patterns
func FanOut[T any](
    ctx context.Context,
    input <-chan T,
    workers int,
    process func(T) error,
) error {
    var wg sync.WaitGroup
    errChan := make(chan error, workers)
    
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                case item, ok := <-input:
                    if !ok {
                        return
                    }
                    if err := process(item); err != nil {
                        errChan <- err
                        return
                    }
                }
            }
        }()
    }
    
    go func() {
        wg.Wait()
        close(errChan)
    }()
    
    for err := range errChan {
        if err != nil {
            return err
        }
    }
    
    return nil
}

// 6. Complex pipeline pattern
func Pipeline[T, U, V any](
    ctx context.Context,
    input <-chan T,
    stage1 func(T) U,
    stage2 func(U) V,
) <-chan V {
    output := make(chan V)
    
    go func() {
        defer close(output)
        
        intermediate := make(chan U)
        
        go func() {
            defer close(intermediate)
            for item := range input {
                select {
                case <-ctx.Done():
                    return
                case intermediate <- stage1(item):
                }
            }
        }()
        
        for item := range intermediate {
            select {
            case <-ctx.Done():
                return
            case output <- stage2(item):
            }
        }
    }()
    
    return output
}

// 7. Complex error wrapping and handling
type ComplexError struct {
    Op      string
    Code    int
    Message string
    Err     error
}

func (e *ComplexError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%s: %s: %v", e.Op, e.Message, e.Err)
    }
    return fmt.Sprintf("%s: %s", e.Op, e.Message)
}

func (e *ComplexError) Unwrap() error {
    return e.Err
}

func (e *ComplexError) Is(target error) bool {
    t, ok := target.(*ComplexError)
    if !ok {
        return false
    }
    return e.Code == t.Code
}

// 8. Complex context patterns
type key int

const (
    userIDKey key = iota
    requestIDKey
    tenantIDKey
)

func WithUserID(ctx context.Context, userID string) context.Context {
    return context.WithValue(ctx, userIDKey, userID)
}

func GetUserID(ctx context.Context) (string, bool) {
    userID, ok := ctx.Value(userIDKey).(string)
    return userID, ok
}

// 9. Complex functional options pattern
type Config struct {
    timeout     time.Duration
    retries     int
    concurrency int
    middleware  []func(interface{}) interface{}
}

type Option func(*Config)

func WithTimeout(d time.Duration) Option {
    return func(c *Config) {
        c.timeout = d
    }
}

func WithRetries(n int) Option {
    return func(c *Config) {
        c.retries = n
    }
}

func WithConcurrency(n int) Option {
    return func(c *Config) {
        c.concurrency = n
    }
}

func WithMiddleware(mw func(interface{}) interface{}) Option {
    return func(c *Config) {
        c.middleware = append(c.middleware, mw)
    }
}

func NewConfig(opts ...Option) *Config {
    cfg := &Config{
        timeout:     30 * time.Second,
        retries:     3,
        concurrency: 10,
    }
    
    for _, opt := range opts {
        opt(cfg)
    }
    
    return cfg
}

// 10. Complex worker pool pattern
type Job[T any] struct {
    Data   T
    Result chan<- error
}

type WorkerPool[T any] struct {
    workers int
    jobs    chan Job[T]
    process func(T) error
    wg      sync.WaitGroup
}

func NewWorkerPool[T any](workers int, process func(T) error) *WorkerPool[T] {
    return &WorkerPool[T]{
        workers: workers,
        jobs:    make(chan Job[T], workers*2),
        process: process,
    }
}

func (wp *WorkerPool[T]) Start(ctx context.Context) {
    for i := 0; i < wp.workers; i++ {
        wp.wg.Add(1)
        go func() {
            defer wp.wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                case job, ok := <-wp.jobs:
                    if !ok {
                        return
                    }
                    err := wp.process(job.Data)
                    job.Result <- err
                }
            }
        }()
    }
}

func (wp *WorkerPool[T]) Submit(job Job[T]) {
    wp.jobs <- job
}

func (wp *WorkerPool[T]) Stop() {
    close(wp.jobs)
    wp.wg.Wait()
}

// 11. Complex select patterns
func ComplexSelect(ctx context.Context, ch1, ch2 <-chan int) {
    timeout := time.After(5 * time.Second)
    ticker := time.NewTicker(1 * time.Second)
    defer ticker.Stop()
    
    for {
        select {
        case <-ctx.Done():
            fmt.Println("Context cancelled")
            return
        case <-timeout:
            fmt.Println("Timeout")
            return
        case <-ticker.C:
            fmt.Println("Tick")
        case val, ok := <-ch1:
            if !ok {
                ch1 = nil
                continue
            }
            fmt.Printf("Received from ch1: %d\n", val)
        case val, ok := <-ch2:
            if !ok {
                ch2 = nil
                continue
            }
            fmt.Printf("Received from ch2: %d\n", val)
        }
        
        if ch1 == nil && ch2 == nil {
            return
        }
    }
}

// 12. Complex sync patterns
type SafeCounter struct {
    mu    sync.RWMutex
    value map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value[key]++
}

func (c *SafeCounter) Get(key string) int {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.value[key]
}

var (
    once     sync.Once
    instance *SafeCounter
)

func GetInstance() *SafeCounter {
    once.Do(func() {
        instance = &SafeCounter{
            value: make(map[string]int),
        }
    })
    return instance
}
