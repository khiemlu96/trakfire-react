u = User.all
u.each do |user| 
  if user.email == ""
    user.email = user.id + "@trakfire.com"
  end
end