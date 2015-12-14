#add status to all posts

p = Post.all
p.each do |pp|
  pp.status = "approved"
  pp.save
end