class AlterNotificationTable < ActiveRecord::Migration
  def change
  	add_column :notifications, :reference_id, :integer
  	add_column :notifications, :notification_type, :string
  	add_column :notifications, :data, :text
  	remove_column :notifications, :message, :string
  	remove_column :notifications, :created_at, :datetime
  	remove_column :notifications, :updated_at, :datetime
  end
end
