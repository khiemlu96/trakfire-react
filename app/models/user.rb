class User < ActiveRecord::Base
  has_many :posts
  has_many :votes
  has_many :notifications
  has_many :followers
  validates_presence_of :uid, :handle

  def posts=(user_id)
    posted_tracks = []
    @posts = Post.where(user_id: user_id)
  end

  def posts
    @posts
  end

  def upvotes=(votes)
    voted_tracks = []
    @upvotes = votes.each do |vote|
      voted_tracks.push(Post.find(vote[:post].id))
    end
    @upvotes = votes
  end

  def upvotes
    @upvotes
  end

  def followers=(followers)
    user_followers = []
    @followers = followers.each do |follower|
      user_followers.push(User.find(follower.user_id))
    end
    @followers = user_followers
  end

  def followers
    @followers
  end

  def followings=(followings)
    user_followings = []
    @followings = followings.each do |f|
      user_followings.push(User.find(f.follow_id))
    end
    @followings = user_followings
  end

  def followings
    @followings
  end

  def unread_notifications=(user_id)
    @unread_notifications = Notification.where(user_id: user_id).count
  end

  def unread_notifications
    @unread_notifications
  end

  def as_json(options={})
    super( include: { votes: { except: [] } }, methods: ['upvotes', 'followers', 'followings', 'unread_notifications'] )
  end

  scope :ranking, -> { select('id, email, username, provider, uid, img, location, tbio, "isAdmin", handle, "isVerified"') }

end
