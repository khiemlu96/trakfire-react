class PostsController < ApplicationController
	before_action :authenticate_request, only: [:create]

	def index
	  @posts = Post.all.order(date: :desc).limit(50)
      render json: @posts, include: { user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :date, :created_at, :duration, :genre, :vote_count, :ranking] 
	end
	
	def create
	  @post = @current_user.posts.build(post_params)
	  @post.date = Date.today
	  if @post.save
	    render json: @post, include: { user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :created_at, :duration, :genre, :vote_count], status: :created, location: post_url(@post, format: :json)
	  else
	    render json: @post.errors, status: :unprocessable_entity
	  end
	end

	private
  	  def post_params
    	params.require(:post).permit(:url, :user_id, :img_url, :stream_url, :waveform_url, :artist, :title, :duration, :genre, :votes, :vote_count)
  	  end
end
