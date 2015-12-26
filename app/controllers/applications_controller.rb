class ApplicationsController < ApplicationController
  def create
  	@appl = Application.new(application_params)
  	@appl.save
  	if @appl.save
  	  render json: @appl
  	else
  	  render json: @appl.errors, status: :unprocessable_entity
  	end

  end

  private
  def application_params
  	params.require(:application).permit(:name, :handle, :email, :artists, :statement)
  end
end
