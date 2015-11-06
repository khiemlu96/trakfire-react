class UsersController < ApplicationController
  def posts
  	@user = User.find(params[:id])
  	render json: @user, include: { posts: { except: [] }}
  end

  def update
    logger.info "THE USERS EMAIL"
    logger.info params['user']['email']
    @user = User.find(params[:id])
  	@user.update_attributes(email: params['user']['email'])
    render json: @user
  end

  def show
    @user = User.find(params[:id])
    logger.info 'FOUND USER'
    logger.info @user
    render json: @user, include: { posts: {except: [] } }
  end

  private 
  def user_params
    params.require(:user).permit(:email, :username)   
  end
end
