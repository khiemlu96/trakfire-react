class LoginsController < ApplicationController

  def auth
  	handle = params[:handle]
  	password = params[:password]

  	user_to_auth = User.where(handle: handle).first

  	if user_to_auth.password == password
  	  logger.info "USER AUTHENTICATED"
      jwt = JWT.encode( {uid: user_to_auth.uid, exp: 1.day.from_now.to_i}, Rails.application.secrets.secret_key_base )
  	  auth_object = { 'status' => '200', 'user' => user_to_auth, 'jwt' => jwt }
  	  render json:  auth_object
  	elsif user_to_auth.password == nil
      jwt = JWT.encode( {uid: user_to_auth.uid, exp: 1.day.from_now.to_i}, Rails.application.secrets.secret_key_base )
  	  user_to_auth.password = password
      user_to_auth.save
	    auth_object = { 'status' => '200', 'user' => user_to_auth, 'jwt' => jwt }
  	  render json:  auth_object
  	else
  	  auth_object = { 'status' => '403'}
      render json:  auth_object
  	end

  end
  
end
