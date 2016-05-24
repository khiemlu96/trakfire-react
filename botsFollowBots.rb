# bots follow bots

bots = User.where(bot: true)

bots.each do |bot|
  unfollows = Follower.where(user_id: bot.id)
  unfollows.delete_all
end

bots.each do |bot|
  bots.each do |bot_to_follow|
  	if bot_to_follow.id != bot.id 
      f = Follower.new(user_id: bot.id, follow_id: bot_to_follow.id)
      if f.save
        puts "#{bot.username} followed #{bot_to_follow.username}!"
      end
    end
  end
end

whitelist = Whitelist.all

bots.each do |bot|
  whitelist.each do |wlu|
    user_to_follow = User.where(handle: wlu.handle).first
    if user_to_follow 
	  f = Follower.new(user_id: bot.id, follow_id: user_to_follow.id)
      if f.save
        puts "#{bot.username} followed #{user_to_follow.username}!"
      end
    end
  end
end