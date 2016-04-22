class ApplicationsController < ApplicationController
    before_action :authenticate_request, only: [:index, :destroy]

    def create
        @appl = Application.new(application_params)
        if @appl.save
            render json: @appl
        else
            render json: @appl.errors, status: :unprocessable_entity
        end
    end

    #Get all user Invites requests in admin console pages
    def index
        @offset = params[:offset] != nil ? params[:offset].to_i : 0
        @limit = params[:limit] != nil ? params[:limit].to_i: 100

        page = params[:page].to_i != nil ? params[:page].to_i : 1
        page_count = params[:limit] != nil ? params[:limit].to_i: 10

        @offset = params[:page] != nil ? (page - 1) * page_count : @offset;
        total_count = 0

        @user_request = Application.order(created_at: :desc).offset(@offset).limit(@limit)
        page_count = @user_request.size
        total_count = Application.distinct.count('id')
        no_of_page = (total_count.to_f / @limit.to_f).round(2).ceil
  
        @state = {
            total_count: total_count,
            page_count: page_count,
            current_page: page,
            no_of_page: no_of_page,
            limit: @limit,
            offset: @offset
        }

        @data = {
          requests: @user_request,
          state: @state
        }
      
        render json: @data
    end

    def destroy
        @user_request = Application.find(params[:id])
        @error = {}
        if (@user_request != nil)
            @user_request.destroy
            @error['message'] =  'delete successfully'
            @error['request_id'] = @user_request.id
        end
        render json: @error
    end

    private
    def application_params
        params.require(:application).permit(:name, :handle, :email, :sc1, :sc2, :sc3)
    end
end
