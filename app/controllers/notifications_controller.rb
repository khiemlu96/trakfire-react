class NotificationsController < ApplicationController
	before_action :authenticate_request, only: [:index, :destroy]

	def index
		if params[:limit] 
			limit =  params[:limit]
			offset = params[:offset]
		end

		@notifications = Notification.where(user_id: @current_user.id).order(sent_time: :desc).limit(15).offset(0)

		@notifications.each do |n|
			n.json_data = n.data
		end

		render json: @notifications
	end

	def destroy
		@notification = Notification.find(params[:id])
		@notification.destroy
	end

	def notification_params
		params.require(:notification).permit(:limit, :user_id, :id)
	end
end
