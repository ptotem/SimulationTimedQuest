class ChangeColumnOptionStatus < ActiveRecord::Migration
  def change
  	remove_column :user_results, :option_status
  	add_column :user_results, :option_status, :string
  end
end
