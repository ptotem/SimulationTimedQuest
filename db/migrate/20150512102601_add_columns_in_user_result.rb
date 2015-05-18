class AddColumnsInUserResult < ActiveRecord::Migration
  def change
  	add_column :user_results, :selected_option, :string
  end
end
