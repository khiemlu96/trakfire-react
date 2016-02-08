class Vote < ActiveRecord::Base
	belongs_to :user
	belongs_to :post
	validates :user_id, :uniqueness => { :scope => :post_id }

	def user=(voter_id)		
	    @voter = User.find(voter_id)
  	end

	def user
    	@voter
 	end

 	def as_json(options={})
  		super({ methods: ['user'] })
	end
end
