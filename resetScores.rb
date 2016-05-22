# reset the weekly scores 

users = User.all

user.each do |u|
  u.score_weekly = 0
  u.save
end

puts 'All weekly scores reset to 0'