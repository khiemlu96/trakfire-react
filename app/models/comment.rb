class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :post
  has_many :notifications
  has_many :member_tags

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
      reply.user = user_id
      reply.tagged_members = reply.id
      replies.push(reply)
    end
    @replies = replies
 	end

 	def replies
    	@replies
 	end

  def tagged_members=(comment_id)
    @tagged_member_ids = MemberTag.select("user_id").where(comment_id: comment_id)
    users = []
    logger.info "-------------------"
    logger.info comment_id
    @tagged_member_ids = @tagged_member_ids.each do |user|
      user = User.find(user.user_id)
      users.push(user)
    end
    @tagged_members = users
  end

  def tagged_members
      @tagged_members
  end

 	def as_json(options={})
  	super({ methods: ['user', 'replies', 'tagged_members'] })
	end
end
