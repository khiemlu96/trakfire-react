#addVotes

p = Post.all
p.each do |pp|
  if pp.vote_count == nil
	  pp.vote_count = 1
	  pp.save
  end
end