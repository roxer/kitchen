class CreateIngredients < ActiveRecord::Migration[8.1]
  def change
    create_table :ingredients do |t|
      t.string :name, null: false, unique: true
      t.timestamps
    end
  end
end
