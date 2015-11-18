class User < ActiveRecord::Base
  has_many :posts
  has_many :votes
  validates_presence_of :uid, :handle

  def upvotes=(votes)
    voted_tracks = []
    @upvotes = votes.each do |vote|
      voted_tracks.push(Post.find(vote.post_id))
    end
    @upvotes = voted_tracks
    logger.info "UPVOTES"
    logger.info @upvotes
  end

  def upvotes
    @upvotes
  end

  def as_json(options={})
    super( include: { posts: { except: [] }, votes: { except: [] } }, methods: ['upvotes'] )
  end

end
