class AddLastStartedAtToUser < ActiveRecord::Migration
  def change
  	add_column :users, :last_started_at, :datetime
  end
end
