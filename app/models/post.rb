class Post < ActiveRecord::Base
	belongs_to :user
	has_one :song, :dependent => :destroy
	has_many :votes, :dependent => :delete_all
	has_many :comments, :dependent => :delete_all
	has_many :taggings, :dependent => :delete_all
	has_many :tags, through: :taggings, :dependent => :delete_all
	validates :url, uniqueness: true
	validates_presence_of :url

	def all_tags=(names)
	  self.tags = names.split(",").map do |name|
	      Tag.where(name: name.strip).first_or_create!
	  end
	end

	def all_tags
	  self.tags.map(&:name).join(", ")
	end

	scope :ranking, -> { select("id, user_id, song_id, created_at, genre, date, genre, play_count, score, vote_count, img_url, title, artist, stream_url, duration,  hot_score(vote_count, created_at) as hot_score") }
end
