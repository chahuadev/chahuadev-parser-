# Complex Ruby - Metaprogramming and DSL
# Testing: blocks, procs, lambdas, metaprogramming, mixins, method_missing

require 'forwardable'
require 'singleton'
require 'observer'

# 1. Complex module with class and instance methods
module ComplexMixin
  extend ActiveSupport::Concern if defined?(ActiveSupport)
  
  included do
    class_attribute :registry, default: []
    before_save :validate_complex_data if respond_to?(:before_save)
  end
  
  class_methods do
    def register(name, &block)
      registry << { name: name, block: block }
    end
    
    def find_registered(name)
      registry.find { |entry| entry[:name] == name }
    end
  end
  
  def complex_method
    self.class.registry.each do |entry|
      instance_eval(&entry[:block])
    end
  end
end

# 2. Complex metaprogramming with method_missing
class DynamicProxy
  def initialize(target)
    @target = target
    @method_cache = {}
  end
  
  def method_missing(method, *args, &block)
    if @target.respond_to?(method)
      define_cached_method(method)
      send(method, *args, &block)
    else
      super
    end
  end
  
  def respond_to_missing?(method, include_private = false)
    @target.respond_to?(method, include_private) || super
  end
  
  private
  
  def define_cached_method(method)
    self.class.class_eval do
      define_method(method) do |*args, &block|
        @method_cache[method] ||= @target.method(method)
        @method_cache[method].call(*args, &block)
      end
    end
  end
end

# 3. Complex DSL with instance_eval and class_eval
class QueryBuilder
  attr_reader :conditions, :joins, :limit_value
  
  def initialize(&block)
    @conditions = []
    @joins = []
    @limit_value = nil
    instance_eval(&block) if block_given?
  end
  
  def where(condition = nil, **kwargs, &block)
    if block_given?
      @conditions << block
    elsif condition
      @conditions << condition
    else
      @conditions << kwargs
    end
    self
  end
  
  def join(table, **options)
    @joins << { table: table, **options }
    self
  end
  
  def limit(value)
    @limit_value = value
    self
  end
  
  def to_sql
    # Complex SQL generation logic
    "SELECT * FROM table WHERE #{build_conditions} #{build_joins} LIMIT #{@limit_value}"
  end
  
  private
  
  def build_conditions
    @conditions.map { |c| evaluate_condition(c) }.join(' AND ')
  end
  
  def build_joins
    @joins.map { |j| "JOIN #{j[:table]} ON #{j[:on]}" }.join(' ')
  end
  
  def evaluate_condition(condition)
    case condition
    when Proc then instance_eval(&condition)
    when Hash then condition.map { |k, v| "#{k} = #{v}" }.join(' AND ')
    else condition.to_s
    end
  end
end

# 4. Complex block, proc, and lambda usage
class ComplexProcessor
  def initialize
    @filters = []
    @transformers = []
  end
  
  def add_filter(&block)
    @filters << block
    self
  end
  
  def add_transformer(transformer = nil, &block)
    @transformers << (transformer || block)
    self
  end
  
  def process(data)
    result = data
    
    # Apply filters
    result = result.select do |item|
      @filters.all? { |filter| filter.call(item) }
    end
    
    # Apply transformers
    @transformers.reduce(result) do |acc, transformer|
      case transformer
      when Proc
        transformer.arity == 1 ? acc.map(&transformer) : transformer.call(acc)
      when Symbol
        acc.map(&transformer)
      else
        acc
      end
    end
  end
end

# 5. Complex class with delegation and forwardable
class ComplexClass
  extend Forwardable
  include Singleton
  include Observable
  
  def_delegators :@collection, :<<, :[], :size, :empty?
  def_delegator :@processor, :process, :process_data
  
  attr_reader :collection, :processor
  
  def initialize
    @collection = []
    @processor = ComplexProcessor.new
    @observers = []
  end
  
  def add(item)
    @collection << item
    changed
    notify_observers(item)
  end
end

# 6. Complex eigenclass and singleton methods
class MetaClass
  class << self
    attr_accessor :configuration
    
    def configure(&block)
      self.configuration ||= Configuration.new
      configuration.instance_eval(&block) if block_given?
      configuration
    end
    
    def method_added(method_name)
      puts "Method #{method_name} was added to #{self}"
      super
    end
  end
  
  def self.inherited(subclass)
    puts "#{subclass} inherits from #{self}"
    super
  end
end

# 7. Complex refinements (Ruby 2.0+)
module StringExtensions
  refine String do
    def reverse_words
      split.reverse.join(' ')
    end
    
    def titleize
      split.map(&:capitalize).join(' ')
    end
  end
end

class TextProcessor
  using StringExtensions
  
  def process(text)
    text.reverse_words.titleize
  end
end

# 8. Complex pattern matching (Ruby 2.7+)
def complex_pattern_match(value)
  case value
  in { type: 'user', data: { name:, age: } } if age > 18
    "Adult user: #{name}"
  in { type: 'user', data: { name: } }
    "User: #{name}"
  in { type: 'admin', **rest }
    "Admin with data: #{rest}"
  in [first, *middle, last]
    "List: #{first} ... #{last}"
  in String => str if str.length > 5
    "Long string: #{str}"
  else
    "Unknown pattern"
  end
end

# 9. Complex inheritance chain with prepend and include
module ModuleA
  def method_a
    "A: #{super rescue 'no super'}"
  end
end

module ModuleB
  def method_a
    "B: #{super rescue 'no super'}"
  end
end

class BaseClass
  def method_a
    "Base"
  end
end

class DerivedClass < BaseClass
  prepend ModuleA
  include ModuleB
  
  def method_a
    "Derived: #{super}"
  end
end

# 10. Complex exception handling with custom exceptions
class ComplexError < StandardError
  attr_reader :code, :context
  
  def initialize(message, code: nil, context: {})
    super(message)
    @code = code
    @context = context
  end
end

def complex_error_handling
  begin
    raise ComplexError.new("Something went wrong", code: 500, context: { user_id: 123 })
  rescue ComplexError => e
    case e.code
    when 404
      handle_not_found(e)
    when 500
      handle_server_error(e)
    else
      raise
    end
  rescue StandardError => e
    log_error(e)
    retry if should_retry?
  ensure
    cleanup
  end
end

# 11. Complex struct and OpenStruct usage
ComplexStruct = Struct.new(:id, :name, :data, keyword_init: true) do
  def to_h
    super.merge(computed: computed_value)
  end
  
  def computed_value
    data&.values&.sum || 0
  end
  
  def deconstruct
    [id, name]
  end
  
  def deconstruct_keys(keys)
    super.merge(type: 'complex')
  end
end

# 12. Complex Enumerator and lazy evaluation
class LazyProcessor
  def self.process(data)
    Enumerator.new do |yielder|
      data.lazy
        .select { |item| item[:active] }
        .map { |item| transform(item) }
        .each_slice(10)
        .with_index do |slice, index|
          yielder << { batch: index, items: slice }
        end
    end
  end
  
  def self.transform(item)
    { **item, processed: true, timestamp: Time.now }
  end
end

# 13. Complex monkey patching with refinements
module CoreExtensions
  refine Array do
    def average
      return 0 if empty?
      sum.to_f / size
    end
    
    def deep_compact
      map { |item| item.is_a?(Array) ? item.deep_compact : item }.compact
    end
  end
  
  refine Hash do
    def deep_merge(other)
      merge(other) do |_, old_val, new_val|
        old_val.is_a?(Hash) && new_val.is_a?(Hash) ? old_val.deep_merge(new_val) : new_val
      end
    end
  end
end

# 14. Complex fiber usage
class FiberPool
  def initialize(size)
    @size = size
    @queue = Queue.new
    @fibers = Array.new(size) { create_fiber }
  end
  
  def submit(&block)
    @queue << block
    resume_fiber
  end
  
  private
  
  def create_fiber
    Fiber.new do
      loop do
        task = Fiber.yield
        task.call if task
      end
    end
  end
  
  def resume_fiber
    @fibers.each do |fiber|
      if fiber.alive? && !@queue.empty?
        fiber.resume(@queue.pop)
      end
    end
  end
end

# 15. Complex thread safety with Monitor
require 'monitor'

class ThreadSafeCollection
  include MonitorMixin
  
  def initialize
    super
    @items = []
    @condition = new_cond
  end
  
  def add(item)
    synchronize do
      @items << item
      @condition.signal
    end
  end
  
  def wait_for_item
    synchronize do
      @condition.wait_while { @items.empty? }
      @items.shift
    end
  end
end
