class PostsController < ApplicationController
	before_action :authenticate_request, only: [:create]

	def index
	  # get all dates 

		@dates = []
		logger.info "--------------------------------"
		logger.info params
		# if date is set in the parameter then only select 10 posts
		# which are posted on that date
		# else select 
		# 10 posts for each day initially
		if( params[:date] != nil ) 
			# get subsquent posts for perticular day
			@dates.push(params[:date])
			@offset = params[:offset]
		else
			# get posts for next subsequent day if date is not set
			@offset = 0
			page_num = params[:page] ? params[:page] : 0

			# get dates of top 3 days			
			if page_num == 0
				offset = 0
				limit = 3
			else
				# get the next subsequent date for each scroll
				offset = 2 + page_num.to_i
				limit = 1
			end

		  	sql = "	SELECT created_at::date as created
		     		FROM posts
						GROUP BY created_at::date
						ORDER BY created_at::date DESC 
						OFFSET " + offset.to_s + " LIMIT " + limit.to_s

			Post.find_by_sql(sql).each do |row|
			  	@dates.push(row.created)
			end
		end

		@posts = []
		@dates.each do |date|
			#select only 10 posts on each days or selected date
			posts = Post.where(["created_at::date = ?", date]).order(created_at: :desc).ranking.offset(@offset).limit(10)
			posts.each do |post|				
				@posts.push(post)
			end
		end

	  	# @posts = Post.where(status: "approved").order(date: :desc).ranking.limit(10)
      	render json: @posts, include: { tags:{}, votes:{}, comments:{}, user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :img_url_lg, :date, :created_at, :duration, :genre, :vote_count, :hot_score, :status] 
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
	  	
	  	logger.info({v:@user_followings})
	  	@user_followings.each do |user|

			@notification = {
				:user_id => user.user_id,
				:n_type => 'POSTED_NEW_TRACK',
				:reference_id => @post.id,
				:data =>{
							:sender_id => @current_user.id.to_s,
							:screen_name => @current_user.username,
							:sender_img => @current_user.img,
							:sender_profile_url => "profile/#{@current_user.id}",
							:post_id => @post.id,
							:post_name => @post.title
						}
			}
			
			if Notification.sendNotification( @notification, {:consolidate => false} )
				logger.info("Notification sent successfully")
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
    	params.require(:post).permit(:url, :user_id, :img_url, :stream_url, :waveform_url, :artist, :title, :duration, :genre, :votes, :vote_count, :all_tags)
  	  end
end
