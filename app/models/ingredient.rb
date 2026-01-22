# frozen_string_literal: true

class Ingredient < ApplicationRecord
  has_many :recipe_ingredients
end
