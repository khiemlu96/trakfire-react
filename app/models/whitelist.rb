class Whitelist < ActiveRecord::Base
	validates :email, uniqueness: true
end
