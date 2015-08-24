class CreateGameStatuses < ActiveRecord::Migration
  def change
    create_table :game_statuses do |t|
      t.integer :user_id
      t.boolean :mcq, :default => false
      t.boolean :msq, :default => false
      t.boolean :quinterrogation, :default => false

      t.timestamps null: false
    end
  end
end
