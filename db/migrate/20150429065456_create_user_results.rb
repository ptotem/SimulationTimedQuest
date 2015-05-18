class CreateUserResults < ActiveRecord::Migration
  def change
    create_table :user_results do |t|
      t.text :question
      t.text :option_selected
      t.integer :option_score, :default => 0
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
