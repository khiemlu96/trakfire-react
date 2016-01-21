class FollowerController < ApplicationController
	before_action :authenticate_request, only: [:create]
	
	def create
		@follower = Follower.new(follower_params)
	  	@follower.user_id = @current_user.id
	  	@follower.follow_id = follower_params[:follow_id]

		if @follower.save
		  	render json: @follower, status: :created
		else
			render json: @follower.errors, status: :unprocessable_entity
	  	end	
	end	

	def destroy
		follow_id = follower_params[:follow_id]
		@follow_to_destory = Follower.where(follow_id: follow_id, user_id: @current_user.id)
		if @follow_to_destory.destroy
			render json: "Destroy complete"
		else 
			@follow_to_destory.errors
		end
	end

	def follower_params
		params.require(:follow).permit(:follow_id, :user_id)
	end
end
