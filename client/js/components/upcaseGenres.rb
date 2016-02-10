p = Post.all
p.each do |pp|
  puts pp.genre
  pp.genre.upcase
  pp.save
end