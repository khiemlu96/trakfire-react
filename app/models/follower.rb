class Follower < ActiveRecord::Base
	has_many :user
	
	validates :user_id, uniqueness: { scope: :follow_id }
end
