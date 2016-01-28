class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :post

	def user=(commenter)		
	    @commenter = User.find(commenter)
  	end

  	def user
    	@commenter
 	end

 	def as_json(options={})
    	super({ methods: ['user'] })
  	end
end
