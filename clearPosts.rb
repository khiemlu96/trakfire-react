#delete posts indiv

p = Post.all
p.each do |pp|
  pp.destroy()
end