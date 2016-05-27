class LoginsController < ApplicationController

  def auth
  	handle = params[:handle]
  	password = params[:password]

  	user_to_auth = User.where(handle: handle).first

  	if user_to_auth.password == password
  	  logger.info "USER AUTHENTICATED"
  	  auth_object = { 'status' => '200' }
  	  render json:  auth_object
  	elsif user_to_auth.password == nil
  	  user_to_auth.password = password
	  auth_object = { 'status' => '200' }
  	  render json:  auth_object
  	else
  	  auth_object = { 'status' => '403'}
  	end

  end
  
end
