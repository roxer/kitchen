# frozen_string_literal: true

require "tsort"

class DAGraph
  include TSort

  def initialize(g)
    @g = g
  end

  def tsort_each_child(n, &b) @g[n].each(&b) end

  def tsort_each_node(&b) @g.each_key(&b) end
end
