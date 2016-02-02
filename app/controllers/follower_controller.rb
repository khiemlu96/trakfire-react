class FollowerController < ApplicationController
	before_action :authenticate_request, only: [:create, :destroy]
	
	def create
		@follower = Follower.new(follower_params)
	  	@follower.user_id = @current_user.id
	  	@follower.follow_id = follower_params[:follow_id]

		if @follower.save
			notification = Notification.new();
			notification.user_id = follower_params[:follow_id]
			notification.notification_type = 'FOLLOW_USER'
			notification.sent_time = Time.current.utc.iso8601
			notification.reference_id = @current_user.id

			@data = {
				:userid => @current_user.id,
				:username => @current_user.username,
				:userimg => @current_user.img,
				:profile_url => "profile/#{@current_user.id}"
			}
			
			notification.data = @data.to_json

			if notification.save
				logger.info "notification sent for follow user"
			end

		  	render json: @follower, status: :created
		else
			render json: @follower.errors, status: :unprocessable_entity
	  	end
	end	

	def destroy
		follow_id = follower_params[:follow_id]
		@follow_to_destroy = Follower.where(follow_id: follow_id, user_id: @current_user.id).first

		if @follow_to_destroy.destroy
			render json: "Destroy complete"
		else 
			@follow_to_destroy.errors
		end
	end

	def follower_params
		params.require(:follow).permit(:follow_id, :user_id, :id)
	end
end
