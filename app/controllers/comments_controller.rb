class CommentsController < ApplicationController
	before_action :authenticate_request, only: [:create, :destroy]

	def create
		logger.info "PARAMS COMMENT "
		logger.info params
		@comment = Comment.new(comment_params)
		@comment.user_id = @current_user.id
		@comment.updated_at = Time.now
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

			if @comment.parent_id == nil
				if post.user_id != @comment.user_id
					notification = Notification.new()
					notification.user_id = post.user_id
					notification.notification_type = 'COMMENT_ON_POST'
					notification.reference_id = post.id

					@data = {
						:commenter_id => @current_user.id,
						:commenter_name => @current_user.username,
						:commenter_img => @current_user.img,
						:commenter_profile_url => "profile/#{@current_user.id}",
						:post_id => post.id
					}
					notification.sent_time = Time.current.utc.iso8601		
					notification.data = @data.to_json
				
					if notification.save
						logger.info "notification sent for follow user"
					end
				end				
			else				
				parent_comment = Comment.find(comment_params[:parent_id])
				if parent_comment.user_id != @comment.user_id					
					notification = Notification.new()
					notification.user_id = parent_comment.user_id
					notification.notification_type = 'REPLY_ON_COMMENT'
					notification.reference_id = parent_comment.id

					@data = {
						:commenter_id => @current_user.id,
						:commenter_name => @current_user.username,
						:commenter_img => @current_user.img,
						:commenter_profile_url => "profile/#{@current_user.id}",
						:post_id => post.id
					}

					notification.sent_time = Time.current.utc.iso8601		
					notification.data = @data.to_json
				
					if notification.save
						logger.info "notification sent for follow user"
					end
				end
			end

			@comment.user = @comment.user_id
			render json: @comment, methods: ['user']
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
		params.require(:comment).permit(:id, :comment_id, :post_id, :user_id, :comment_detail, :parent_id)
	end
end
