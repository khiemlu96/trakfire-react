class PostsController < ApplicationController
	before_action :authenticate_request, only: [:create]

	def index
	  @posts = Post.all.order(date: :desc).limit(50)
      render json: @posts, include: { user: { only: [:handle] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :date, :created_at, :duration, :genre] 
	end

	def create
	  puts 'RECIEVED A POST FROM CLIENT'
	  @post = @current_user.posts.build(post_params)
	  @post.date = Date.today
	  if @post.save
	  	puts 'RETURNING'
	    render json: @post, include: { user: { only: [:handle, :username] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :created_at, :duration, :genre], status: :created, location: post_url(@post, format: :json)
	  else
	  	outs 'FAILURE'
	    render json: @post.errors, status: :unprocessable_entity
	  end
	end

	private
  	  def post_params
    	params.require(:post).permit(:url, :user_id, :img_url, :stream_url, :waveform_url, :artist, :title, :duration, :genre)
  	  end
end
