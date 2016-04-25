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
			post.update({'comment_count'=> comment_count})
			post.save
			
			if(params[:comment][:tagged_members] != nil)
				params[:comment][:tagged_members].each do |user|
					@tagged_member = MemberTag.where(comment_id: @comment.id, user_id: user['user_id'])

					if @tagged_member != nil
						member_tag = MemberTag.new({comment_id: @comment.id, user_id: user['user_id']})
						member_tag.save
					end
				end
			end

			if @comment.parent_id == nil
				if post.user_id != @comment.user_id

					@notification = {
						:user_id => post.user_id,
						:n_type => 'COMMENT_ON_POST',
						:reference_id => post.id,
						:data =>{
									:sender_id => @current_user.id.to_s,
									:screen_name => @current_user.username,
									:sender_img => @current_user.img,
									:sender_profile_url => "profile/#{@current_user.id}",
									:post_id => post.id,
									:post_name => post.title,
									:comment_text => @comment.comment_detail
								},
						:sender_id => @current_user.id.to_s
					}
				
					if Notification.sendNotification( @notification, {:consolidate => false} )
						logger.info("Notification sent successfully")
					end
				end				
			else				
				parent_comment = Comment.find(comment_params[:parent_id])
				if parent_comment.user_id != @comment.user_id					
					@notification = {
						:user_id => parent_comment.user_id,
						:n_type => 'REPLY_ON_COMMENT',
						:reference_id => post.id,
						:data =>{
									:sender_id => @current_user.id.to_s,
									:screen_name => @current_user.username,
									:sender_img => @current_user.img,
									:sender_profile_url => "profile/#{@current_user.id}",
									:post_id => post.id,
									:post_name => post.title,
									:parent_comment_id => parent_comment.id,
									:comment_text => @comment.comment_detail
								},
						:sender_id => @current_user.id.to_s
					}
				
					if Notification.sendNotification( @notification, {:consolidate => false} )
						logger.info("Notification sent successfully")
					end
				end
			end

			@comment.user = @comment.user_id
			@comment.tagged_members = @comment.id

			render json: @comment, methods: ['user', 'tagged_members']
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
		params.require(:comment).permit(:id, :comment_id, :post_id, :user_id, :comment_detail, :parent_id, :tagged_members)
	end
end
