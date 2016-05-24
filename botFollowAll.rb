# bots follow everyone on the site 

bots = User.where(bot: true)

users_to_follow = User.where(bot: false)

bots.each do |bot|
  users_to_follow.each do |user|
    f = Follower.new(user_id: bot.id, follow_id: user.id)
    if f.save
      puts "#{bot.username} followed #{user.username}!"
    end
  end
end