# verify scores

users = User.all

users.each do |u|
  if u.score == nil
    u.score = 0
    u.save
  end
end