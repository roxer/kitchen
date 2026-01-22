class CreateUserIngredients < ActiveRecord::Migration[8.1]
  def change
    create_table :user_ingredients do |t|
      t.references :user, null: false, foreign_key: true
      t.references :ingredient, null: false, foreign_key: true
      t.decimal :quantity, precision: 19, scale: 16
      t.timestamps
    end

    execute <<~SQL
      CREATE UNIQUE INDEX idx_ui_user_ingredient_lookup
      ON public.user_ingredients (user_id, ingredient_id)
      INCLUDE (quantity);
    SQL
  end
end
