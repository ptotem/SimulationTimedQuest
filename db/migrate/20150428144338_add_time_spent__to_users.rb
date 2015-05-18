class AddTimeSpentToUsers < ActiveRecord::Migration
  def change
    add_column :users, :time_spent, :integer, :null => false, :default => 0
  end
end
