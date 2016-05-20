class UsersController < ApplicationController

  def index
    
    @offset = params[:offset] != nil ? params[:offset].to_i : 0
    @limit = params[:limit] != nil ? params[:limit].to_i: 100

    page = params[:page].to_i != nil ? params[:page].to_i : 1
    page_count = params[:limit] != nil ? params[:limit].to_i: 10

    @offset = params[:page] != nil ? (page - 1) * page_count : @offset;
    total_count = 0
    
    @users = []
    if( params[:search_key] != nil )
      @search_key = params[:search_key]
      
      @search_by = 'username';
      if params[:search_by] != nil
        @search_by = params[:search_by];
      end
      
      @users = User.where("lower(" + @search_by + ") like ?", ('%'+@search_key.downcase+'%')).order(score: :desc).offset(@offset).limit(@limit)
      page_count = @users.size
      total_count = User.where("lower(username) like ?", ('%'+@search_key.downcase+'%')).distinct.count('id')
    else
      @users = User.order(score: :desc).offset(@offset).limit(@limit)
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
    #check that which posts are demanded
    if params[:action_type] == 'posted_trak'
        @limit = params[:limit].to_i
        page = params[:page].to_i
        page_count = params[:limit].to_i
        @offset = (page - 1) * page_count;

        #if posted_traks are demanded, then take only those posts which are posted by that User
        @user = User.find(params[:id])

        if @user != nil            
            @posts = Post.includes(:user).where(user_id: @user.id).order(created_at: :desc).offset(@offset).limit(@limit)           

            # Get total count and page count and total number of pages for the data
            total_posted_posts_count = Post.where(user_id: @user.id).count('id')

            page_count = @posts.size
            total_count = total_posted_posts_count
            no_of_page = (total_count.to_f / @limit.to_f).round(2).ceil     
        end

        @stats = {
            total_count: total_count,
            page_count: page_count,
            current_page: page,
            no_of_page: no_of_page,
            limit: @limit,
            offset: @offset
        }

        @data = {
            posts: @posts,
            stats: @stats
        }
        render json: @data, include: {user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }

    elsif params[:action_type] == 'upvoted_trak'
        @limit = params[:limit].to_i
        page = params[:page].to_i
        page_count = params[:limit].to_i
        @offset = (page - 1) * page_count;

        #if upvoted_trak are demanded, then take only those posts which are upvoted by that User
        @user = User.find( params[:id] )

        if @user != nil
            sql = "SELECT p.* FROM posts p
                    LEFT JOIN votes v ON p.id = v.post_id                    
                    WHERE v.user_id = " + @user.id.to_s + "
                    AND p.user_id <> v.user_id
                    ORDER BY v.created_at DESC
                    LIMIT " + @limit.to_s + "
                    OFFSET " + @offset.to_s

            @posts = Post.includes(:user).find_by_sql(sql)

            #get the total count of traks that are upvoted by that user
            count_sql = "SELECT p.id FROM posts p
                    LEFT JOIN votes v ON p.id = v.post_id                    
                    WHERE v.user_id = " + @user.id.to_s + "
                    AND p.user_id <> v.user_id"

            total_upvoted_posts_count = Post.find_by_sql(count_sql).size

            # Get total count and page count and total number of pages for the data
            page_count = @posts.size
            total_count = total_upvoted_posts_count
            no_of_page = (total_count.to_f / @limit.to_f).round(2).ceil   
        end

        @stats = {
            total_count: total_count,
            page_count: page_count,
            current_page: page,
            no_of_page: no_of_page,
            limit: @limit,
            offset: @offset
        }

        @data = {
            posts: @posts,
            stats: @stats
        }
        render json: @data, include: {user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost, :bot] } }

    else

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
        upvotes = {upvoted_posts: @user_posts}
        logger.info @user.merge(upvotes)
        render json: @user.merge(upvotes), include: { posts: { except: [] }}
    end
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

    if (user_params[:isVerify] != nil && user_params[:isVerify] == true)
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
    logger.info "THE USER"
    logger.info @user
    # if the users original profile image path is null
    # then set it explicitly by the value of profile img column
    if( @user.img != nil && @user.original_profile_img == nil )       
        if @user.img.include?('_normal')
            normal_img_url = @user.img.clone

            # remove just string "_normal" to get user's profile image in original size.
            # and set that image as a original_profile_img for user
            normal_img_url.slice! '_normal'

            @user.original_profile_img = normal_img_url
            @user.save
        end
    end

    @votes = Vote.where(user_id: @user.id)
    @uvotes = [];
    
    @votes.each do |v|
      post = Post.find(v.post_id)
      user = User.find(post.user_id)
      #if post.user_id != @user.id
        userPost = { post: post, author: user }
        @uvotes.push(userPost)
      #end
    end

    #@user.posts = @user.id
    #@user.upvotes = @uvotes #@votes
    
    @followers = Follower.where(follow_id: @user.id)
    @user.followers = @followers
    
    @followings = Follower.where(user_id: @user.id)
    @user.followings = @followings

    render json: @user
  end
  
  def destroy
   
    @user = User.find(params[:id])
    @error = {}

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
