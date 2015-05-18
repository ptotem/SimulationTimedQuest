class AddCategoryToUsers < ActiveRecord::Migration
  def change
    add_column :users, :category, :string, :default => "jr"
  end
end
