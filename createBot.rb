# create a single bot 

bot = Bot.new()
user = User.new()

puts "Handle: "
entry = gets 
entry = entry.chomp
bot.handle = entry
user.handle = entry

puts "Name: "
entry = gets 
entry = entry.chomp
user.username = entry
bot.username = entry

puts "Image Url: "
entry = gets 
entry = entry.chomp
user.img = entry

puts "Bio: "
entry = gets 
entry = entry.chomp
user.tbio = entry

user.bot = true
user.canPost = true
user.score = 0.0
uid = rand 0..1000
user.uid = "b" + uid.to_s

if user.save && bot.save
  puts "Bot created sucessfully"
  puts "Name: #{user.username}"
  puts "Handle: #{user.handle}"
  puts "Bio: #{user.tbio}"
  puts "Img Url: #{user.img}"
end



