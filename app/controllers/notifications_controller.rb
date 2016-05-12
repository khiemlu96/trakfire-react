class NotificationsController < ApplicationController
	before_action :authenticate_request, only: [:index, :destroy, :update]

	def index
		if params[:limit] 
			limit =  params[:limit]
			offset = params[:offset]
		end
		#if @current_user.id != nil @current_user.id
		logger.info "THE USER W NOTIES\n"
		logger.info params[:user_id]
		@notifications = Notification.where(user_id: params[:user_id]).order(sent_time: :desc).limit(15).offset(0)
		logger.info "LIST NOTIFICATIONS"
		logger.info @notifications
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

	def pending_notifications 
	  @response = {}
	  @response['exists'] = false
	  @response['notifications'] = []

	  @unread_notifications = Notification.where("user_id = ? AND read_time != nil", params[:user_id]);

	  if @unread_notifications.count > 0
	  	@response['exists'] = true
	  	@response['notifications'] = @unread_notifications
	  end
	  render json: @response
	end

	def notification_params
		params.require(:notification).permit(:limit, :user_id, :id, :sender_id)
	end
end
