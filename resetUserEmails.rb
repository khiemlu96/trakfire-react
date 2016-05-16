u = User.all
u.each do |user| 
  if user.email == ""
    user.email = user.handle + "@trakfire.com"
  end
end