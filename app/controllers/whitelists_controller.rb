class WhitelistsController < ApplicationController
	before_action :authenticate_request, only: [:index, :create, :destroy]

	def index
		@offset = params[:offset] != nil ? params[:offset].to_i : 0
    	@limit = params[:limit] != nil ? params[:limit].to_i: 100

    	page = params[:page].to_i != nil ? params[:page].to_i : 1
    	page_count = params[:limit] != nil ? params[:limit].to_i: 10

    	@offset = params[:page] != nil ? (page - 1) * page_count : @offset;
    	total_count = 0

    	#@whitelist_users = Whitelist.joins('LEFT OUTER JOIN users ON whitelists.email = users.email').order(created_at: :desc).offset(@offset).limit(@limit)
      	sql = "	SELECT users.id as user_id, users.username, users.handle, whitelists.* FROM whitelists
	     		LEFT OUTER JOIN users
	     		ON whitelists.handle = users.handle
				ORDER BY created_at DESC
				OFFSET " + @offset.to_s + " LIMIT " + @limit.to_s

		@whitelist_users = Whitelist.find_by_sql(sql)

      	page_count = @whitelist_users.size
      	total_count = Whitelist.distinct.count('id')

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
	      whitelist_users: @whitelist_users,
	      state: @state
	    }

	    render json: @data
	end

	def create
		existing_user = Whitelist.where(handle: user_params['handle'])

		if existing_user.size == 0
			@new_user = Whitelist.new(user_params)
			if @new_user.save
				sql = "	SELECT users.id as user_id, users.username, users.handle, whitelists.* FROM whitelists
	     				LEFT OUTER JOIN users
	     				ON whitelists.handle = users.handle
	     				WHERE whitelists.handle = '" + user_params['handle'].to_s + "'"

				@whitelist_user = Whitelist.find_by_sql(sql)
				render json: @whitelist_user
			else
				render json: @new_user.errors, status: :unprocessable_entity
		  	end
		else
			error = {}			
			error['message'] = "duplicate_entry"
			render json: error, status: 500
	  	end
	end

	def destroy
		@whitelist_user = Whitelist.find(params[:id])
        @error = {}
        if (@whitelist_user != nil)
            @whitelist_user.destroy
            @error['message'] =  'delete successfully'
            @error['user_id'] = @whitelist_user.id
        end
        render json: @error
	end

	def user_params
		params.require(:user).permit(:email, :handle)
	end
end
