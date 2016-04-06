class UsersController < ApplicationController

  def index
    
    @offset = params[:offset].to_i
    @limit = params[:limit].to_i

    page = params[:page].to_i
    page_count = params[:limit].to_i

    logger.info "PAGE_COUNT"
    logger.info @offset

    @offset = params[:page] ? (page - 1) * page_count : @offset;

    logger.info "PAGE_COUNT"
    logger.info @offset

    if( params[:search_key] != nil )
      @search_key = params[:search_key]
      @users = User.where("lower(username) like ?", ('%'+@search_key.downcase+'%')).order(created_at: :desc).ranking.offset(@offset).limit(@limit)
      page_count = @users.size
      total_count = User.where("lower(username) like ?", ('%'+@search_key.downcase+'%')).distinct.count('id')
    else
      @users = User.all #User.order(created_at: :desc).ranking.offset(@offset).limit(@limit)
      page_count = @users.size
      total_count = User.distinct.count('id')
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
      users: @users,
      state: @state
    }
  
    render json: @data
  end  

  def posts
  	@user = User.find(params[:id])
    @votes = Vote.where(user_id: @user.id)
    @user_posts = []
    @votes.each do |v|
      post = Post.find(v.post_id)
      user = User.find(post.user_id)
      userPost = { post: post, author: user }
      #@user_posts.push(Post.find(v.post_id))
      @user_posts.push(userPost)
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
    @user = User.find(params[:id])

    if (defined? user_params[:isVerify])
      @user.update_attributes(
        :isVerified => user_params[:isVerify]
      ) 
    else
      @user.update_attributes(
        :email => user_params[:email], 
        :username => user_params[:username], 
        :tbio => user_params[:tbio]
      )
    end

    render json: @user
  end

  def show
    @user = User.find(params[:id])
    logger.info 'FOUND USER'
    logger.info @user
    @votes = Vote.where(user_id: @user.id)
    @uvotes = [];
    @votes.each do |v|
      post = Post.find(v.post_id)
      user = User.find(post.user_id)
      #if post.user_id != @user.id
        userPost = { post: post, author: user }
        @uvotes.push(userPost)
      #end

     #if post.user_id == @user.id 
     #   logger.info "KILL CONFIRMED"
     #  @votes.delete(v)
     # end

    end

    @user.upvotes = @uvotes #@votes
    logger.info "USER TO BE SERVED"
    logger.info @user.username
    
    @followers = Follower.where(follow_id: @user.id)
    @user.followers = @followers
    
    @followings = Follower.where(user_id: @user.id)
    @user.followings = @followings

    logger.info @user.as_json
    render json: @user
  end
  
  def destroy
   
    @user = User.find(params[:id])
    @error = {}
    logger.info @user.as_json

    if (@user != nil)

      @posts = Post.where(user_id: @user.id)
      @posts.each do |post| 
        post.destroy
      end

      @votes = Vote.where(user_id: @user.id)
      @votes.each do |vote|
        vote.destroy
      end

      @notifications = Notification.where(user_id: @user.id)
      @notifications.each do |notification|
        notification.destroy
      end

      @followers = Follower.where(user_id: @user.id, follow_id: @user.id)
      @followers.each do |follower|
        follower.destroy
      end
      
      @user.destroy
      @error['message'] =  'delete successfully'
      @error['user_id'] = @user.id
      
    end

    render json: @error
  end

  private 
  def user_params
    params.require(:user).permit(:email, :username, :upvotes, :tbio, :isVerify)   
  end
end
