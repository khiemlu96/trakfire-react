# fetch all tf soundcloud links and populate the db with them 

client = SoundCloud.new({
  :client_id     => '13d8a46f81fcd0ee4764f6d6bdaa58a8',
  :client_secret => '0de3b5885aa2b5fe4c13de99977b9f35',
  :username      => 'grant@trakfire.com',
  :password      => 'TheNextEpisode15'
})

favs = []

favs = client.get('/me/favorites')

favs.each do |track|
  t = StagedPost.new()
  t.title = track.title
  t.duration = track.duration
  t.artist = track.user.username
  t.genre = 'HIPHOP'
  t.stream_url = track.stream_url
  t.img_url = track.artwork_url
  img_url_sm = t.img_url 
  t.img_url_lg = img_url_sm.gsub(/large/, "crop")
  puts t.img_url_lg
  t.url = track.permalink_url
  t.save
end

