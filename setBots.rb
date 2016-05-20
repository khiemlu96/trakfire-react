# add bot flag to users

bots = Bot.all

bots.each do |bot| 
  user = User.where(handle: bot.handle).first
  user.bot = true
  user.save
end