class NotificationsController < ApplicationController
	before_action :authenticate_request, only: [:index, :destroy, :update]

	def index
		if params[:limit] 
			limit =  params[:limit]
			offset = params[:offset]
		end

		@notifications = Notification.where(user_id: @current_user.id).order(sent_time: :desc).limit(15).offset(0)

		@notifications.each do |n|
			n.json_data = n.data
			n.sender = n.sender_id
		end	

		render json: @notifications, methods: ['sender']
	end

	def destroy
		@notification = Notification.find(params[:id])
		@notification.destroy
	end

	def update
		@notification = Notification.find(params[:id])

		if @notification.present?
			@notification.update_attributes(		
				:read_time => Time.current.utc.iso8601				
			)
			render json: @notification
		else 
			@error = {}
			@error['message'] =  'Not Found'
			@error['code'] =  500

      		render @error
		end	
	end

	def notification_params
		params.require(:notification).permit(:limit, :user_id, :id)
	end
end
