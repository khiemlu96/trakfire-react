p = Post.all
p.each do |pp|
  if !pp.stream_url
  	puts 'DELETING'
    pp.destroy
  end
  pp.date = Date.today.to_datetime.strftime("%m/%d/%Y")
  pp.save
end