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
    logger.info params['user']['email']
    @user = User.find(params[:id])
  	@user.update_attributes(email: params['user']['email'])
    render json: @user
  end

  def show
    @user = User.find(params[:id])
    logger.info 'FOUND USER'
    logger.info @user
    @votes = Vote.where(user_id: @user.id)
    @user.upvotes = @votes
    logger.info "USER TO BE SERVED"
    logger.info @user.username
    logger.info @user.as_json
    render json: @user
  end

  private 
  def user_params
    params.require(:user).permit(:email, :username, :upvotes)   
  end
end
