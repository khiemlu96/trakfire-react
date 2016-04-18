class Notification < ActiveRecord::Base
	belongs_to :user
	belongs_to :notification

	def self.sendNotification(notification, params)
		# Is there an unread notification for this reference_id?
		n = {}
		count = 0

		if params[:consolidate] == true
			n = Notification.where(
										user_id: notification[:user_id],
										notification_type: notification[:n_type],
										reference_id: notification[:reference_id],
										read_time: nil
									)
			count = n.count
		end

		# If there is not any existing notification
		# create a new notification
		if count == 0
			n = Notification.new()
			n[:user_id] = notification[:user_id]
			n[:notification_type] = notification[:n_type]
			n[:reference_id] = notification[:reference_id]
			n[:sent_time] = Time.current.utc.iso8601
			n[:read_time] = nil
			n[:data] = notification[:data].to_json

			if n.save			
				return true
			else
				return false
			end
		else
			n.each do |item|				
				data = JSON.parse(item.data)

				sender_ids = data['sender_id'].split(",").map do |id|
					id
				end

				if sender_ids.index(notification[:data][:sender_id]) == nil
					data['sender_id'] = data['sender_id'] + "," + notification[:data][:sender_id]
					data['screen_name'] = data['screen_name'] + "," + notification[:data][:screen_name]
					data['sender_img'] = data['sender_img'] + "," + notification[:data][:sender_img]
					data['sender_profile_url'] = data['sender_profile_url'] + "," + notification[:data][:sender_profile_url]
				end

				item.sent_time = Time.current.utc.iso8601				
				item.data = data.to_json
				
				if item.save			
					return true
				else
					return false
				end

			end
		end
	end

	def json_data=(data)
		@data = JSON.parse(data)
	end

	def json_data
		@data
	end

	def as_json(options={})
  		super({ methods: ['json_data', 'sendNotification'] })
	end
end