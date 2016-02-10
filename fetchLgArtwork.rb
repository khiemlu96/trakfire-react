#add large sc img

p = Post.all
p.each do |pp|
  if pp.img_url_lg == nil && pp.img_url != nil
	  img_url_sm = pp.img_url 
	  pp.img_url_lg = img_url_sm.gsub(/large/, "crop")
	  pp.save
  end
end
