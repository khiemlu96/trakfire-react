class Post < ActiveRecord::Base
	include AlgoliaSearch
	belongs_to :user
	has_one :song, :dependent => :destroy
	has_many :votes, :dependent => :delete_all
	has_many :comments, :dependent => :delete_all
	has_many :taggings, :dependent => :delete_all
	has_many :tags, through: :taggings, :dependent => :delete_all
	validates :url, uniqueness: true
	validates_uniqueness_of :title, :scope => :artist
	validates_presence_of :title
	validates_presence_of :url

	algoliasearch do
    	#all attr
  	end

	def all_tags=(names)
	  self.tags = names.split(",").map do |name|
	      Tag.where(name: name.strip).first_or_create!
	  end
	end

	def all_tags
	  self.tags.map(&:name).join(", ")
	end

	def post_comments=(comments)
	    post_comments = []
	    @comments = comments.each do |comment|
	    	commenter_id = comment.user_id
	    	comment.user = commenter_id
	    	comment.replies = comment.id
	    	comment.tagged_members = comment.id
	      	post_comments.push(comment)
    	end
	    @comments = post_comments
  	end

  	def post_comments
    	@comments
  	end

  	def post_votes=(votes)
  		post_votes = []

  		@votes = votes.each do |vote|
  			voter_id = vote.user_id
  			vote.user = User.find(voter_id)
  			post_votes.push(vote)
  		end

  		@votes = post_votes
  	end

  	def post_votes
  		@votes
  	end

  	def as_json(options={})
      super( include: { tags:{}, votes:{}, comments:{}, user: { only: [:handle, :id, :username, :tbio, :img, :isAdmin, :canPost] } }, only: [:id, :title, :stream_url, :duration, :artist, :img_url, :img_url_lg, :date, :created_at, :duration, :genre, :vote_count, :comment_count, :hot_score, :status], methods: ['post_votes'])
    end

	scope :ranking, -> { select("id, user_id, song_id, created_at, genre, date, genre, play_count, score, vote_count, img_url, img_url_lg, title, artist, stream_url, duration, comment_count, hot_score(vote_count, created_at) as hot_score") }
end
