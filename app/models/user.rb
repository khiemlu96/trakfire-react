class User < ActiveRecord::Base
  has_many :posts
  has_many :votes
  has_many :notifications
  has_many :followers
  validates_presence_of :uid, :handle

  def upvotes=(votes)
    logger.info "VOTES"
    logger.info votes[0][:post].id

    voted_tracks = []
    @upvotes = votes.each do |vote|
      voted_tracks.push(Post.find(vote[:post].id))
    end

    @upvotes = voted_tracks
    logger.info "UPVOTES"
    logger.info @upvotes
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

  def as_json(options={})
    super( include: { posts: { except: [] }, votes: { except: [] } }, methods: ['upvotes', 'followers', 'followings'] )
  end

  scope :ranking, -> { select("id, email, username, provider, uid, img, location, tbio, 'isAdmin', handle") }

end
