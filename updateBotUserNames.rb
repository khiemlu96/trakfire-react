# update bots with usernames

bots = Bot.all

bots.each do |b|
  u = User.where(handle: b.handle).first
  if u
    b.username = u.username
    b.save
  else
  	b.destroy
  end
end