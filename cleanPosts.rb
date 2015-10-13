p = Post.all
p.each do |pp|
  #pp.date = Date.today.to_datetime.strftime("%m/%d/%Y")
  if pp.song_id
	  song = Song.find(pp.song_id)
	  pp.artist = song.artist
	  pp.waveform_url = song.waveform_url
	  pp.img_url = song.thumb_url
	  pp.title = song.title
	  pp.stream_url = song.stream_url
	  pp.save
  end
end