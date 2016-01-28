class CommentsController < ApplicationController
	before_action :authenticate_request, only: [:create, :destroy]

	def create
	  logger.info "PARAMS COMMENT "
	  logger.info params
	  @comment = Comment.new(comment_params)
	  @comment.user_id = @current_user.id
	  #update the post associated
	  post = Post.find(@comment.post_id)
	  if @comment.save
	  	if post.comment_count.nil?
	  		comment_count = 1
	  	else 
  			comment_count = post.comment_count + 1
  		end
		post.update( { 'comment_count' =>  comment_count } )
		post.save

		render json: @comment
	  else
		render json: @comment.errors, status: :unprocessable_entity
	  end
	end

	def destroy
		post_id = comment_params[:post_id]
		@comment_to_destory = Comment.where(post_id: post_id, user_id: @current_user.id)
		if @comment_to_destory.destroy
			render json: "Destroy complete"
		else 
			@comment_to_destory.errors
		end
	end

private
	def comment_params
		params.require(:comment).permit(:id, :comment_id, :post_id, :user_id, :comment_detail)
	end
end
