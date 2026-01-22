class AddDependenciesToRecipeIngredients < ActiveRecord::Migration[8.1]
  def change
    add_column :recipe_ingredients, :dependencies, :bigint, array: true, default: []
  end
end
