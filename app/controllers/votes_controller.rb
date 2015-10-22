class VotesController < ApplicationController
	before_action :authenticate_request, only: [:create, :destroy]
	def create
	  logger.info "PARAMS VOTE "
	  logger.info params
	  @vote = Vote.new(vote_params)
	  @vote.user_id = @current_user.id
	  #update the post associated
	  post = Post.find(@vote.post_id)
	  if @vote.save
	  	if post.vote_count.nil?
	  		post.vote_count = 0
	  	end
	  	vc = post.vote_count += 1
	  	logger.info vc
	  	logger.info post.vote_count
		post.update( { 'vote_count' =>  vc } )
		post.save
		logger.info post.vote_count
		render json: @vote
	  else
		render json: @vote.errors, status: :unprocessable_entity
	  end
	end

	def destroy
		post_id = vote_params[:post_id]
		@vote_to_destory = Vote.where(post_id: post_id, user_id: @current_user.id)
		if @vote_to_destory.destroy
			render json: "Destroy complete"
		else 
			@vote_to_destory.errors
		end
	end

private
	def vote_params
		params.require(:vote).permit(:post_id, :user_id)
	end
end
