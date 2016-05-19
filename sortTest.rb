# score sort testing 

users = User.order(score: :asc)
puts 'ASC'
users.each_with_index do |u, idx|
  if u.score == nil 
  	u.score = 0 
  	u.save
  end

  puts "#{idx}: #{u.score}"
end


users = User.order(score: :desc)
puts 'DESC'
users.each_with_index do |u, idx|
  puts "#{idx}: #{u.score}"
end