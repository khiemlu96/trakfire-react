class UsersController < ApplicationController
  def posts
  	@user = User.find(params[:id])
  	logger.info 'FOUND A USER'
  	logger.info @user.posts
  	render json: @user, include: { posts: { except: [] } }
  end
end
