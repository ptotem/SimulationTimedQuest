class AddCorrectOptionToUserResults < ActiveRecord::Migration
  def change
    add_column :user_results, :correct_option, :text
  end
end
