class FollowerController < ApplicationController
	before_action :authenticate_request, only: [:create, :destroy]
	
	def create
		@follower = Follower.new(follower_params)
	  	@follower.user_id = @current_user.id
	  	@follower.follow_id = follower_params[:follow_id]

		if @follower.save
			
			@notification = {
				:user_id => follower_params[:follow_id],
				:n_type => 'FOLLOW_USER',
				:reference_id => @current_user.id,
				:data =>{
							:sender_id => @current_user.id.to_s,
							:screen_name => @current_user.username,
							:sender_img => @current_user.img,
							:sender_profile_url => "profile/#{@current_user.id}"
						}
			}
		
			if Notification.sendNotification( @notification, {:consolidate => false} )
				logger.info("Notification sent successfully")
			end

			@user = User.find(@follower.follow_id);

		  	render json: @user, status: :created
		else
			render json: @follower.errors, status: :unprocessable_entity
	  	end
	end	

	def destroy
		follow_id = follower_params[:follow_id]
		@follow_to_destroy = Follower.where(follow_id: follow_id, user_id: @current_user.id).first

		if @follow_to_destroy.destroy
			@user = User.find(@follow_to_destroy.follow_id);
			render json: @user
		else 
			@follow_to_destroy.errors
		end
	end

	def follower_params
		params.require(:follow).permit(:follow_id, :user_id, :id)
	end
end
