class VotesController < ApplicationController
	before_action :authenticate_request, only: [:create]
	def create
	  @vote = Vote.new(vote_params)
	  @vote.user_id = @current_user.id
	  #update the post associated
	  post = Post.find(@vote.post_id)
	  if @vote.save
	  	vc = post.votes += 1
	  	logger.info vc
		post.update( { 'votes' =>  vc } )
		post.save
		logger.info post
		render json: @vote
	  else
		render json: @vote.errors, status: :unprocessable_entity
	  end
	end

private
	def vote_params
		params.require(:vote).permit(:post_id, :user_id)
	end
end
