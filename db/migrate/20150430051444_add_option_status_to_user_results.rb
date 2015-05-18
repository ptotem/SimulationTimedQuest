class AddOptionStatusToUserResults < ActiveRecord::Migration
  def change
    add_column :user_results, :option_status, :boolean
  end
end
