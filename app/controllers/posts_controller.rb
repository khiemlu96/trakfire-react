class PostsController < ApplicationController
	before_action :authenticate_request, only: [:create]

	def index
	  #@posts = Post.all.order(date: :desc).ranking.limit(50)
	  @posts = Post.where(status: "approved").order(date: :desc).ranking.limit(50)
      render json: @posts, include: { tags:{}, votes:{}, comments:{}, user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :date, :created_at, :duration, :genre, :vote_count, :hot_score, :status] 
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

	  	render json: @post, include: { tags:{}, user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, methods: ['post_comments', 'post_votes'], only: [:id, :title, :stream_url, :duration, :artist, :img_url, :date, :created_at, :duration, :genre, :vote_count, :hot_score, :status] 
	end

	private
  	  def post_params
    	params.require(:post).permit(:url, :user_id, :img_url, :stream_url, :waveform_url, :artist, :title, :duration, :genre, :votes, :vote_count, :all_tags)
  	  end
end
