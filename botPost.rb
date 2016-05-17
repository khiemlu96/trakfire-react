# post as a bot 

users = [User.find(10), User.find(9), User.find(8), User.find(7)]
puts "Select a user to post as: "
users.each_with_index do |user, idx|
  puts "#{idx}. #{user.username}"
end

u_choice = gets
u_choice = u_choice.chomp

posts = StagedPost.where(status: nil).limit(3)

puts "Select a song to post:"
posts.each_with_index do |post, idx|
  puts "#{idx}. #{post.title} by #{post.artist}"
end

p_choice = gets
p_choice = p_choice.chomp

user = users[u_choice.to_i]
post = posts[p_choice.to_i]

new_post = Post.new()

new_post.title = post.title
new_post.artist = post.artist
new_post.duration = post.duration
new_post.img_url = post.img_url
new_post.img_url_lg = post.img_url_lg
new_post.stream_url = post.stream_url
new_post.user_id = user.id
new_post.genre = post.genre
new_post.url = post.stream_url

new_post.date = Date.today
new_post.vote_count = 1

if new_post.save
	puts "Posted #{new_post.title} by #{new_post.artist} as #{user.username}"
	post.status = "used"
	post.save
end

vote = Vote.new()
vote.user_id = user.id
vote.post_id = new_post.id
vote.save

#send notifications to all users who are following that user
user_followings = Follower.where(follow_id: user.id)

user_followings.each do |u|

	notification = {
		:user_id => u.user_id,
		:n_type => 'POSTED_NEW_TRACK',
		:reference_id => new_post.id,
		:data =>{
					:sender_id => user.id.to_s,
					:screen_name => user.username,
					:sender_img => user.img,
					:sender_profile_url => "profile/#{user.id}",
					:post_id => new_post.id,
					:post_name => new_post.title
				},
		:sender_id => new_post.user_id
	}

	if Notification.sendNotification( notification, {:consolidate => false} )
		puts "Notification sent successfully"
	end
end
