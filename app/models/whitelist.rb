class Whitelist < ActiveRecord::Base
	validates :email, uniqueness: false
end
