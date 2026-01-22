class AddNameAndSurnameToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :name, :string, limit: 100
    add_column :users, :surname, :string, limit: 100
  end
end
