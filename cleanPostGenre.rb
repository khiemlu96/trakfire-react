p = Post.all
p.each do |pp|
  if !pp.genre 
	  pp.genre = "Vocals HipHop"
	  pp.save
  end
  if pp.genre == "Hip Hop / R&B"
  	pp.genre = "HipHop"
  	pp.save
  end
end