# frozen_string_literal: true

class CreateAuthors < ActiveRecord::Migration[8.1]
  def change
    create_table :authors do |t|
      t.string :name, null: false, unique: true
      t.timestamps
    end
  end
end
