class UsersController < ApplicationController
  def posts
  	@user = User.find(params[:id])
    @votes = Vote.where(user_id: @user.id)
    @user_posts = []
    @votes.each do |v|
      @user_posts.push(Post.find(v.post_id))
    end
    logger.info "USER POSTS"
    upvotes = {upvoted_posts: @user_posts}
    logger.info @user.merge(upvotes)
  	render json: @user.merge(upvotes), include: { posts: { except: [] }}
  end

  def votes
    @user = User.find(params[:id])
    @votes = Vote.where(user_id: @user.id)
    @user_posts = []
    @votes.each do |v|
      @user_posts.push(Post.find(v.post_id))
    end
    render json: @user_posts   
  end

  def update
    logger.info "THE USERS EMAIL"
    @user = User.find(params[:id])
  	@user.update_attributes(
      :email => user_params[:email], 
      :username => user_params[:username], 
      :tbio => user_params[:tbio]
    )
    render json: @user
  end

  def show
    @user = User.find(params[:id])
    logger.info 'FOUND USER'
    logger.info @user
    @votes = Vote.where(user_id: @user.id)
    @votes.each do |v|
      post = Post.find(v.post_id)
      if post.user_id == @user.id 
        logger.info "KILL CONFIRMED"
        @votes.delete(v)
      end
    end
    @user.upvotes = @votes
    logger.info "USER TO BE SERVED"
    logger.info @user.username
    
    @followers = Follower.where(follow_id: @user.id)
    @user.followers = @followers
    
    @followings = Follower.where(user_id: @user.id)
    @user.followings = @followings

    logger.info @user.as_json
    render json: @user
  end

  private 
  def user_params
    params.require(:user).permit(:email, :username, :upvotes, :tbio)   
  end
end
