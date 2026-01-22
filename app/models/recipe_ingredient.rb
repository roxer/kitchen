# frozen_string_literal: true

class RecipeIngredient < ApplicationRecord
  belongs_to :ingredient
  belongs_to :recipe

  scope :by_recipe, ->(recipe_id) {
    where(:recipe_id => user_id)
  }

  def self.sort_by_dependencies(items)
    graph = {}

    items.each do |x|
      nodes = []
      x.dependencies.each do |y|
        nodes << items.find { |n| n.id == y }
      end
      graph[x] = nodes
    end

    dag = DAGraph.new(graph)
    dag.tsort
  end
end
