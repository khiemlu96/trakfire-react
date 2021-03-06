class VotesController < ApplicationController
	before_action :authenticate_request, only: [:create, :destroy]
	def create
	  logger.info "PARAMS VOTE "
	  logger.info params
	  @vote = Vote.new(vote_params)
	  @vote.user_id = @current_user.id
	  
	  #update the post and user associated
	  post = Post.find(@vote.post_id)
	  author = User.find(post.user_id)
	  
	  if @vote.save
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

	    new_score = author.score += 70.0
	    new_week_score = author.score_weekly += 70.0
	    
		author.update( { 'score' => new_score } )
		author.update( { 'score_weekly' => new_week_score } )
		author.save 

		logger.info post.vote_count
		logger.info author.score 

		#send notifications to user who have posted a track
		if post.user_id != @vote.user_id

			@notification = {
				:user_id => post.user_id,
				:n_type => 'VOTED_YOUR_TRAK',
				:reference_id => post.id,
				:data =>{
							:sender_id => @current_user.id.to_s,
							:screen_name => @current_user.username,
							:sender_img => @current_user.img,
							:sender_profile_url => "profile/#{@current_user.id}",
							:post_id => post.id,
							:post_name => post.title
						},
				:sender_id => @current_user.id
			}
		
			if Notification.sendNotification( @notification, {:consolidate => true} )
				logger.info("Notification sent successfully")
			end
		end

		@vote.user = @current_user.id
		render json: @vote
	  else
		render json: @vote.errors, status: :unprocessable_entity
	  end
	end

	def destroy
		post_id = vote_params[:post_id]
		@vote_to_destory = Vote.where(post_id: post_id, user_id: @current_user.id)
		if @vote_to_destory.destroy
			render json: "Destroy complete"
		else 
			@vote_to_destory.errors
		end
	end

	def batch_create
	  logger.info "PARAMS"
	  logger.info params
	  post_to_vote = params[:post]
	  bots_to_vote = params[:voters]
	  data = {}
	  data['post_id'] = post_to_vote
	  votes = []
	  bots_to_vote.each do |bot|
	  	if bot == "me"
	  	  user = @current_user
	  	else
	  	  user = User.where(handle: bot).first
	  	end
	  	 votes.push(create_vote(user.id, post_to_vote))
	  end
	  data['votes'] = votes
	  render json: data
	end

private
	def vote_params
		params.require(:vote).permit(:post_id, :user_id)
	end

	def create_vote(user_id, post_id)
	  logger.info "PARAMS VOTE "
	  logger.info params
	  #user_id = params[:user_id]
	  #post_id = params[:post_id]
	  vote = Vote.new(user_id: user_id, post_id: post_id)
	  user = User.find(user_id)
	  #update the post and user associated
	  post = Post.find(vote.post_id)
	  author = User.find(post.user_id)
	  
	  if vote.save
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

	    new_score = author.score += 70.0
	    new_week_score = author.score_weekly += 70.0
	    
		author.update( { 'score' => new_score } )
		author.update( { 'score_weekly' => new_week_score } )
		author.save 

		logger.info post.vote_count
		logger.info author.score 

		#send notifications to user who have posted a track
		if post.user_id != vote.user_id
			notification = {
				:user_id => post.user_id,
				:n_type => 'VOTED_YOUR_TRAK',
				:reference_id => post.id,
				:data =>{
							:sender_id => user_id.to_s,
							:screen_name => user.username,
							:sender_img => user.img,
							:sender_profile_url => "profile/#{user.id}",
							:post_id => post.id,
							:post_name => post.title
						},
				:sender_id => user_id
			}
		
			if Notification.sendNotification( notification, {:consolidate => true} )
				logger.info("Notification sent successfully")
			end
		end
	end
	return vote
  end
end
