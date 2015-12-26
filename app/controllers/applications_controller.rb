class ApplicationsController < ApplicationController
  def create
  	@app = Application.new(application_params)
  	@app.save
  	#if !@app.save
  	 # render json: @app.errors, status: :unprocessable_entity
  	#end
  end

  private
  def application_params
  	params.require(:application).permit(:name, :handle, :email, :artists, :statement)
  end
end
