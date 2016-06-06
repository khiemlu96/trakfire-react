p = Post.order(date: :desc, vote_count: :desc).limit(10)
pp = p.group_by { |pp| pp.date }

pp.keys.each do |day|
  puts day
  pp[day].each do |post|
    puts "#{post.title} #{post.vote_count}"
  end
  puts " "
end