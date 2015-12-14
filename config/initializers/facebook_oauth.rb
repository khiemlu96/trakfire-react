FACEBOOK = OAuth::Consumer.new(
  Rails.application.secrets.facebook_consumer_key,
  Rails.application.secrets.facebook_consumer_secret,
  authorize_path: '/oauth/access_token?',
  site: 'https://graph.facebook.com'
)