class CreateRecipes < ActiveRecord::Migration[8.1]
  def change
    create_table :recipes do |t|
      t.string :title, null: false, unique: true
      t.string :image
      t.integer :cook_time, limit: 2
      t.integer :prep_tipe, limit: 2
      t.decimal :rating, precision: 2, scale: 1
      t.references :author, null: true, foreign_key: true
      t.references :category, null: true, foreign_key: true

      t.timestamps
    end
  end
end
