class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
	   	t.integer  :user_id
	   	t.string :message
	   	t.datetime  :read_time
	   	t.datetime	:sent_time
	   	t.timestamps null: false
    end
  end
end
