class AlterNotificationAddSenderId < ActiveRecord::Migration
  def up
  	add_column :notifications, :sender_id, :integer	
  	
  	Notification.all.each do |notification|
  		@data = JSON.parse(notification.data)
  		@sender_id =@data['sender_id']		
  		update "UPDATE notifications SET sender_id=#{@sender_id} WHERE id=#{notification.id}"  		
  	end
  end
end

