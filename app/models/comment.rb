class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :post

	def user=(commenter)		
	    @commenter = User.find(commenter)
  	end

  	def user
    	@commenter
 	end

 	def replies=(parent_id)
 		@replies = Comment.where(parent_id: parent_id)
    replies = []
    @replies = @replies.each do |reply|
      user_id = reply.user_id
      reply.user = user_id
      replies.push(reply)
    end
    @replies = replies
 	end

 	def replies
    	@replies
 	end

 	def as_json(options={})
    	super({ methods: ['user', 'replies'] })
  	end
end
