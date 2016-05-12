class Bot < User

  def post
  	@staged_post = StagedPost.last
  	puts @staged_post.title
  	
  	if @staged_post 
  	  post = Post.new()
  	  post.title = @staged_post.title
  	  post.artist = @staged_post.artist
  	  post.img_url = @staged_post.img_url
  	  post.stream_url = @staged_post.stream_url
  	  post.user_id = self.id
  	  post.duration = @staged_post.duration
  	  post.genre = @staged_post.genre
  	  if post.save
  	  	@staged_post.destroy()	
  	  end
  	end
  end

  def vote
  	@bot = Bot.all
  	@votes = self.upvotes
  	@new_posts = Post.where(created_at: @votes.last.created_at..Time.now())
  	@new_posts.each do |post|
  	  vote = Vote.new(user_id: self.id, post_id: post.id)
  	  if vote.save
		#update the post and user associated
	    post = Post.find(vote.post_id)
	    author = User.find(post.user_id)
	  
	  	if post.vote_count.nil?
	  		post.vote_count = 0
	  	end
	  	vc = post.vote_count += 1

	  	logger.info vc
	  	logger.info post.vote_count
		post.update( { 'vote_count' =>  vc } )
		post.save

		if author.score == nil
			author.score = 0
		end

	    newScore = author.score += 10
		author.update( { 'score' => newScore } )
		author.save 

		logger.info post.vote_count
		logger.info author.score 

		#send notifications to user who have posted a track
		if post.user_id != vote.user_id

			@notification = {
				:user_id => post.user_id,
				:n_type => 'VOTED_YOUR_TRAK',
				:reference_id => post.id,
				:data =>{
							:sender_id => self.id.to_s,
							:screen_name => self.username,
							:sender_img => self.img,
							:sender_profile_url => "profile/#{self.id}",
							:post_id => post.id,
							:post_name => post.title
						},
				:sender_id => self.id
			}
		
			if Notification.sendNotification( @notification, {:consolidate => true} )
				logger.info("Notification sent successfully")
			end
		end
  	  end
  	end
  end

end
