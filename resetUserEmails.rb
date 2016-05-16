u = User.all
u.each do |user| 
  if u.email == ""
    u.email = u.id + "@trakfire.com"
  end
end