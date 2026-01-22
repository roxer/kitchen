# frozen_string_literal: true

class DAGGenerator
  attr_reader :size, :adj_list

  def initialize(size, edge_probability = 0.3)
    @size = size
    @edge_probability = edge_probability
    @adj_list = Hash.new { |h, k| h[k] = [] }
  end

  def generate
    # To ensure no cycles, we only allow edges from a lower index to a higher index
    (0...size).each do |i|
      ((i + 1)...size).each do |j|
        adj_list[i] << j if rand < @edge_probability
      end
    end

    adj_list
  end

  def tsort
    generate
    graph = DAGraph.new(adj_list)
    graph.tsort
  end

  def display
    puts "Random DAG with #{size} elements (Edge Probability: #{@edge_probability}):"
    (0...size).each do |node|
      neighbors = adj_list[node].join(", ")
      puts "#{node} -> [#{neighbors}]"
    end

    ing = [
      { 'a' => { a: 1 } },
      { 'b' => { b: 2 } },
      { 'c' => { c: 3 } },
      { 'd' => { d: 4 } },
      { 'e' => { e: 5 } },
      { 'f' => { f: 5 } },
    ]

    puts adj_list.inspect
    graph = DAGraph.new(adj_list)
    ing2 = process_dependencies(ing)
    puts ing2.inspect
    puts graph.tsort
  end

  def process_dependencies(ing)
    size = ing.size
    # dag = DAGGenerator.new(size, 0.5)
    # result = dag.generate

    adj_list.each do |key, val|
      idx = ing[key].keys.first
      ing[key][idx][:dependencies] = val.map do |x|
        ing[x].keys.first
      end
    end

    ing
  end
end
