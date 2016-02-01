class NotificationsController < ApplicationController
	before_action :authenticate_request, only: [:index, :destroy]

	def index
		@notifications = Notification.where(user_id: @current_user.id, read_time: nil).order(sent_time: :desc)
		render json: @notifications, include: { user:{} }
	end

	def destroy
		@notification = Notification.find(params[:id])
		@notification.destroy
	end

	def notification_params
		params.require(:notification).permit(:user_id, :id)
	end
end
