class VotesController < ApplicationController
	#before_filter :authenticate_user!
	def create
		if current_user.present?
			# Create a new vote
			@vote = Vote.new(vote_params)
			@vote.user_id = current_user.id

			#update the post associated
			post = Post.find(@vote.post_id)

			if @vote.save
				post.update( { 'id' => post.id } )
				render json: @vote
			else
				render json: @post.errors, status: :unprocessable_entity
			end
		end

	end

	def vote_params
		params.require(:vote).permit(:post_id, :user_id)
	end
end
