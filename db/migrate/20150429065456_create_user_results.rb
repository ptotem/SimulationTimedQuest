class CreateUserResults < ActiveRecord::Migration
  def change
    create_table :user_results do |t|
      t.integer   :user_id
      t.string 		:user_name
      t.text      :section
      t.text      :question
      t.text      :selected_option
      t.text      :correct_option
      t.text    :option_status
      t.float   :option_score, :default => 0

      t.timestamps null: false
    end
  end
end
