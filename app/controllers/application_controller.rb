class ApplicationController < ActionController::API
  before_action :allow_cross_origin_requests, if: proc { Rails.env.development? }
  before_action :authenticate_request, only: [:current_user, :admin_state]

  def preflight
    render nothing: true
  end

  def current_user
    logger.info "Current User Requested"
    logger.info @current_user.username
    logger.info @current_user.posts

    @followers = Follower.where(follow_id: @current_user.id)
    @current_user.followers = @followers

    @followings = Follower.where(user_id: @current_user.id)
    @current_user.followings = @followings
    
    @current_user.unread_notifications = @current_user.id
    
    render json: @current_user, include: { posts: { except: [] }}
  end

  def index
    render file: 'public/index.html'
  end
  
  # Method to define an admin statistics on Admin DashBoard Page
  def admin_state
    # Get the post count block on dashboard
    post_count = Post.count
    # Get the user count for block on dashboard
    user_count = User.count
    # Get the comment count for block on dashboard
    comment_count = Comment.count


    @chart_data = []
    post_counts = []
    posted_dates = []

    post_counts[0] = 0
    posted_dates[0] = 0

    #Get chart data accordinf to selected range time period

    # If range type i.e. selected time period is 'day'
    # get the count of posts for last 30 days    
    if( params[:range_type] == "1" )
        sql = "SELECT count(id) as post_count, to_char(created_at::date, 'DD-MM-YYYY') AS posted_date
                FROM posts 
                WHERE created_at > current_date - interval '40' day
                GROUP BY created_at::date
                ORDER BY created_at::date ASC;"        
        
        Post.find_by_sql(sql).each do |row|
            posted_dates.push(row.posted_date)
            post_counts.push(row.post_count)
        end

        @chart_data.push(posted_dates)
        @chart_data.push(post_counts)

    elsif( params[:range_type] == "2" )   
        # If range type i.e. selected time period is 'month'        
        # get the count of posts for last 12 months
        
        sql = "SELECT count(id) AS post_count, to_char(created_at, 'MON-YYYY') AS posted_month
                FROM posts
                WHERE created_at >  CURRENT_DATE - INTERVAL '12 months'
                GROUP BY to_char(created_at, 'MON-YYYY')
                ORDER BY to_date(to_char(created_at, 'MON-YYYY'), 'MON-YYYY') ASC;"

        Post.find_by_sql(sql).each do |row|
            posted_dates.push(row.posted_month)
            post_counts.push(row.post_count)
        end

        @chart_data.push(posted_dates)
        @chart_data.push(post_counts)

    elsif( params[:range_type] == "3" )   
      # If range type i.e. selected time period is 'year'        
      # get the count of posts for last 6 years

      sql = "SELECT count(id) AS post_count, EXTRACT(YEAR FROM created_at) AS posted_year
              FROM posts
              WHERE created_at >  CURRENT_DATE - INTERVAL '6 years'
              GROUP BY EXTRACT(YEAR FROM created_at)
              ORDER BY EXTRACT(YEAR FROM created_at) ASC;"

        Post.find_by_sql(sql).each do |row|
            posted_dates.push(row.posted_year)
            post_counts.push(row.post_count)
        end

        @chart_data.push(posted_dates)
        @chart_data.push(post_counts)
    end

    # Store stats data into an response object
    @admin_state = {
      "posts"=> post_count,
      "comments"=> comment_count,
      "users" => user_count,
      "chart_data" => @chart_data
    }

    render json: @admin_state
  end
  
private
  def allow_cross_origin_requests
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    headers['Access-Control-Max-Age'] = '1728000'
  end

  def authenticate_request
    begin
      uid = JWT.decode(request.headers['Authorization'], Rails.application.secrets.secret_key_base)[0]['uid']
      @current_user = User.find_by(uid: uid)
    rescue JWT::DecodeError
      render json: 'authentication failed', status: 401
    end
  end

end
