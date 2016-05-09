# rails api coms for auto tweet
 class TwitterAgent

	def update(post_title, post_author_handle, post_author_name, post_artist)

	  client = Twitter::REST::Client.new do |config|
	    config.consumer_key        = "48GBcAKIbwwiV1VQlH7YzzMGw"
	    config.consumer_secret     = "RNN6G9sFbGQZDiKAmJ1U4RB8ObDRiu5OUmtTTWelZGl39ryIp9"
	    config.access_token        = "3543691814-qNlftZxeBSGeZc1TmQ6HNG259R5hfS0Fz0d3FGc"
	    config.access_token_secret = "kxClgQI5TADYIrmehbFANER8yFf9CAsmLQkKNaB4LSFl1"
	  end

	  message = "new heat on the site: #{post_title} by #{post_artist} \n found by #{post_author_handle} \n tune in @ trakfire.com"
	  client.update(message)
	end 

end