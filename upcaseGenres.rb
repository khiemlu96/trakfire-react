p = Post.all
p.each do |pp|
  puts "PRE" 
  puts pp.genre
  pp.genre = pp.genre.upcase
  pp.save
  puts "POST"
  puts pp.genre
end