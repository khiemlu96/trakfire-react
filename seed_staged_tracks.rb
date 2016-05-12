staged_urls = [
"https://soundcloud.com/mixmag-1/premiere-damian-lazarus-the-ancient-moons-trouble-at-the-seance-kolsch-remix",  
"https://soundcloud.com/adaofficial/dj-koze-homesick-feat-ada"]

client = SoundCloud.new(:client_id => '9999309763ba9d5f60b28660a5813440')
puts "STAGED URLS #{staged_urls}"
staged_urls.each do |url|
  puts url
  if track = client.get('/resolve', :url => url)

  puts track
  p = StagedPost.new
  p.title = track.title
  p.artist = track.artist
  p.img_url = track.artwork_url
  p.duration = track.duration
  p.stream_url = track.stream_url
  p.genre = "HIPHOP"
  p.save
  end
end