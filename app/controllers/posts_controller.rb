#require '../tweet.rb'
class PostsController < ApplicationController
	before_action :authenticate_request, only: [:create, :destroy]

	def index

		if(params[:action_type] != 'admin_post_batch')
			# get all dates 
			@dates = []
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

			p = Post.order(date: :desc, vote_count: :desc).offset(@offset).limit(100)
			@posts = p.group_by { |pp| pp.date }
			logger.info "DAYS #{@posts.keys} POSTS #{@posts.count}"
			#@dates.each do |date|
				#select only 10 posts on each days or selected date
				#posts = Post.where(["created_at::date = ?", date]).order(created_at: :desc).ranking.offset(@offset).limit(10)
				#posts.each do |post|				
					#@posts.push(post)
				#end
			#end	

			# @posts = Post.where(status: "approved").order(date: :desc).ranking.limit(10)
      		render json: @posts#, include: { tags:{}, votes:{}, comments:{}, user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :img_url_lg, :date, :created_at, :duration, :genre, :vote_count, :comment_count, :hot_score, :status] 
		
		else

			@offset = params[:offset].to_i
			@limit = params[:limit].to_i

			page = params[:page].to_i
			page_count = params[:limit].to_i
			@offset = (page - 1) * page_count;

			if ( params[:search_key] != nil )
				@search_key = params[:search_key]
				@posts = Post.where("lower(title) like ?", ('%'+@search_key.downcase+'%')).order(created_at: :desc).ranking.offset(@offset).limit(@limit)
				page_count = @posts.size
				total_count = Post.where("lower(title) like ?", ('%'+@search_key.downcase+'%')).distinct.count('id')
			else
				@posts = Post.order(created_at: :desc).ranking.offset(@offset).limit(@limit)
				page_count = @posts.size
				total_count = Post.distinct.count('id')
			end

			no_of_page = (total_count.to_f / @limit.to_f).round(2).ceil
			

			@state = {
				total_count: total_count,
				page_count: page_count,
				current_page: page,
				no_of_page: no_of_page,
				limit: @limit,
				offset: @offset
			}

			@data = {
				posts: @posts,
				state: @state
			}

			render json: @data, include: {user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }
		end	  	
	end

	def create
	  logger.info @current_user.username
	  logger.info @current_user.posts
	  logger.info "/n"
	  logger.info "building"
	  logger.info post_params
	  logger.info params[:admin]

	  @post = Post.new(post_params) #@current_user.posts.build(post_params)
	  if params[:admin]
	  	@post_user = User.where(handle: params[:admin]).first
	  else
	  	@post_user = @current_user;
	  end
	  @post.user_id = @post_user.id
	  @post.date = Date.today
	  @post.vote_count = 1

	  if @post.save

	  	#tweet
	  	twt_user = User.find(@post.user_id)
	  	if !twt_user.bot 
	  	  twitter_update(@post.title, twt_user.handle, twt_user.username, @post.artist)
	  	end

	  	#create a vote 
	  	@vote = Vote.new()
	  	@vote.user_id = @post_user.id
	  	@vote.post_id = @post.id
	  	@vote.save

	  	#send notifications to all users who are following that user
	  	@user_followings = Follower.where(follow_id: @post_user.id)
	  	
	  	logger.info({v:@user_followings})
	  	@user_followings.each do |user|

			@notification = {
				:user_id => user.user_id,
				:n_type => 'POSTED_NEW_TRACK',
				:reference_id => @post.id,
				:data =>{
							:sender_id => @post_user.id.to_s,
							:screen_name => @post_user.username,
							:sender_img => @post_user.img,
							:sender_profile_url => "profile/#{@post_user.id}",
							:post_id => @post.id,
							:post_name => @post.title
						},
				:sender_id => @post.user_id
			}
			
			if Notification.sendNotification( @notification, {:consolidate => false} )
				logger.info("Notification sent successfully")
			end
		end


	    render json: @post, include: { user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :img_url_lg, :created_at, :duration, :genre, :vote_count], status: :created, location: post_url(@post, format: :json)
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

	def destroy
		@post = Post.find(params[:id])
		@error = {}
		if (@post != nil && @current_user.isAdmin == true )

			# Delete votes of the post
			@votes = Vote.where(post_id: @post.id)
			@votes.each do |vote|
				vote.destroy
			end

			# Delete comments of the post
			@comments = Comment.where(post_id: @post.id)
			@comments.each do |comment|
				comment.destroy
			end

			# Delete tags of the post
			@taggings = Tagging.where(post_id: @post.id)
			@taggings.each do |tagging|
				tagging.destroy # Delete tagging first, then delete from tag table
				
				# Find corresponding tags from tag table.
				# If same tag is used in another post, then
				# Dont delete it
				count = Tagging.where(tag_id: tagging.tag_id).count
				if(count == 0)
					tag = Tag.find(tagging.tag_id)				
					if(tag != nil)
						tag.destroy
					end		
				end		
			end

			@post.destroy
			@error['message'] = 'deleted successfully'
			@error['code'] = 0
			@error['post_id'] = @post.id
		end

		render json: @error
	end

	private

  	  def post_params
    	params.require(:post).permit(:url, :user_id, :img_url, :img_url_lg, :stream_url, :status, :waveform_url, :artist, :title, :duration, :genre, :votes, :vote_count, :all_tags, :action_type, :comment_count, :search_key)
  	  end

	  def twitter_update(post_title, post_author_handle, post_author_name, post_artist)

	    client = Twitter::REST::Client.new do |config|
	      config.consumer_key        = "48GBcAKIbwwiV1VQlH7YzzMGw"
	      config.consumer_secret     = "RNN6G9sFbGQZDiKAmJ1U4RB8ObDRiu5OUmtTTWelZGl39ryIp9"
	      config.access_token        = "3543691814-qNlftZxeBSGeZc1TmQ6HNG259R5hfS0Fz0d3FGc"
	      config.access_token_secret = "kxClgQI5TADYIrmehbFANER8yFf9CAsmLQkKNaB4LSFl1"
	    end
	    hash_tag_artist = '#'+post_artist.gsub(/\s+/, "")
	    message = "new heat on the site: #{post_title} by #{hash_tag_artist}\nfound by @#{post_author_handle} \ntune in @ trakfire.com"
	    client.update(message)
	  end 
end
