class User < ActiveRecord::Base
  has_many :posts
  has_many :votes
  validates_presence_of :uid, :handle
end
