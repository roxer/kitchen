class CreateRecipeIngredients < ActiveRecord::Migration[8.1]
  def change
    create_table :recipe_ingredients do |t|
      t.references :recipe, null: false, foreign_key: true
      t.references :ingredient, null: false, foreign_key: true
      t.decimal :quantity, precision: 19, scale: 16
      t.timestamps
    end

    execute <<~SQL
      CREATE INDEX idx_ri_recipe_grouping
      ON public.recipe_ingredients (recipe_id, ingredient_id)
      INCLUDE (quantity);
    SQL
  end
end
