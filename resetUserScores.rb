# reset all user weekly scores
users = User.all
users.each do |u|
  u.score_weekly = 0
  u.save
end

puts "#{users.count} scores reset to 0"