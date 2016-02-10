class PostsController < ApplicationController
	before_action :authenticate_request, only: [:create]

	def index
	  @posts = Post.all.order(date: :desc).ranking.limit(50)
	  #@posts = Post.where(status: "approved").order(date: :desc).ranking.limit(50)
      render json: @posts, include: { tags:{}, votes:{}, comments:{}, user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } } 
	end
	
	def create
	  @post = @current_user.posts.build(post_params)
	  @post.date = Date.today
	  @post.vote_count = 1

	  if @post.save
	  	@vote = Vote.new()
	  	@vote.user_id = @current_user.id
	  	@vote.post_id = @post.id
	  	@vote.save

	  	#send notifications to all users who are following that user
	  	@user_followings = Follower.where(follow_id: @current_user.id)
	  	
	  	@user_followings.each do |user|
	  		notification = Notification.new()
	  		notification.user_id = user.user_id
			notification.notification_type = 'POSTED_NEW_TRACK'
			notification.reference_id = @post.id

			@data = {
				:src_user_id => @current_user.id,
				:src_user_name => @current_user.username,
				:src_user_img => @current_user.img,
				:src_user_profile_url => "profile/#{@current_user.id}",
				:post_id => @post.id,
				:post_name => @post.title
			}

			notification.sent_time = Time.current.utc.iso8601		
			notification.data = @data.to_json
		
			if notification.save
				logger.info "notification sent for follow user"
			end
		end


	    render json: @post, include: { user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :created_at, :duration, :genre, :vote_count], status: :created, location: post_url(@post, format: :json)
	  else
	    render json: @post.errors, status: :unprocessable_entity
	  end
	end

	def show
	  	@post = Post.find(params[:id])
	    logger.info "POST FOR DETAIL PAGE"

	    @comments = Comment.where(post_id: @post.id, parent_id: nil)	    
		@post.post_comments = @comments

		@votes = Vote.where(post_id: @post.id)
		@post.post_votes = @votes

	  	render json: @post, include: { tags:{}, user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, methods: ['post_comments', 'post_votes'], only: [:id, :title, :stream_url, :duration, :artist, :img_url, :img_url_lg, :date, :created_at, :duration, :genre, :vote_count, :hot_score, :status] 
	end

	private
  	  def post_params
    	params.require(:post).permit(:url, :user_id, :img_url, :img_url_lg, :stream_url, :waveform_url, :artist, :title, :duration, :genre, :votes, :vote_count, :all_tags)
  	  end
end
