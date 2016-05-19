# add in the permitted bots 

# u1 = User.new(username:"Andy Thai", handle:"andymthai", uid: "111111", canPost: true, img: "https://pbs.twimg.com/profile_images/659635680838967296/u0TFZbvv.jpg")

# u2 = User.new(username:"Spencer Price", handle:"pricesh74", uid: "111112", canPost: true, img: "https://www.facebook.com/photo.php?fbid=1192121487466605&set=a.156742477671183.33290.100000062950972&type=3&source=11")

# u3 = User.new(username:"John Fiorentino", handle:"johnnyfio", uid: "111113", canPost: true, img: "https://pbs.twimg.com/profile_images/684209980120027137/tvzBUvaI.png")

# u4 = User.new(username:"Helena Yohannes", handle:"TheReal_Helena", uid: "111114", canPost: true, img: "https://pbs.twimg.com/profile_images/662108755731963904/Rqb7h7fI.jpg")

bot_names = ["andymthai", "pricesh74", "johnnyfio", "TheReal_Helena"]

bot_names.each do |name|
  bot = Bot.new(handle: name)
  if bot.save
    puts "#{bot.handle} is now in the system with id #{bot.id}"
  end
end

