class TokensController < ApplicationController

  def request_token
    request_token = TWITTER.get_request_token(oauth_callback: ENV['OAUTH_CALLBACK'])
    Oauth.create(token: request_token.token, secret: request_token.secret)
    redirect_to request_token.authorize_url(oauth_callback: ENV['OAUTH_CALLBACK'])
  end

  def access_token
    oauth = Oauth.find_by(token: params[:oauth_token])
    new_user = false
    if oauth.present?
      request_token = OAuth::RequestToken.new(TWITTER, oauth.token, oauth.secret)
      access_token = request_token.get_access_token(oauth_verifier: params[:oauth_verifier])
      user_data = access_token.request(:get, "https://api.twitter.com/1.1/account/verify_credentials.json")#access_token.request(:get, "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true")
      j_user = JSON.parse(user_data.body)

      user = User.find_or_create_by(uid: access_token.params[:user_id]) do |u| 
        u.handle = access_token.params[:screen_name] 
        u.username = j_user['name']
        u.img = j_user['profile_image_url_https']
        u.tbio = j_user['description']
        u.location = j_user['location']
        #u.email = j_user['email']
        new_user = true
      end

      if j_user['profile_image_url_https']
        user.img = j_user['profile_image_url_https']
        user.save
      end

      if new_user != true       
        # Check that whether EXISTING user is allowed to login from twitter or not
        # i.e. his email is present in white list user list or not 
        white_list_user = Whitelist.where(handle: user.handle).first
        if white_list_user.present?
            # If the user email is present in white list users list,
            # then redirect user to Home Page         
            jwt = JWT.encode({uid: user.uid, exp: 1.day.from_now.to_i}, Rails.application.secrets.secret_key_base)
            redirect_to ENV['ORIGIN'] + "?jwt=#{jwt}"
        else
            # If the user email is not present in white list users list,
            # then redirect user to Home Page 
            # pass an extra query parameter into url of an application 'attempt_failed'
            # to show an request Invite popup
            redirect_to ENV['ORIGIN'] + "?attempt_failed=true"
        end
      else
          jwt = JWT.encode({uid: user.uid, exp: 1.day.from_now.to_i}, Rails.application.secrets.secret_key_base)
          redirect_to ENV['ORIGIN'] + "?jwt=#{jwt}"
      end

      #if new_user
       # redirect_to ENV['ORIGIN'] + "/email?jwt=#{jwt}&id=#{user.id}&uname=#{user.username}"
      #else 
      
      #end
    else
      redirect_to ENV['ORIGIN']
    end
  end
  
end
