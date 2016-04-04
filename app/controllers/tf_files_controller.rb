class TfFilesController < ApplicationController
	before_action :authenticate_request, only: [:create, :destroy]

	def create
		@file = TfFile.new(file_params)
		if @file.save
			render json: @file
		else
			render json: @file.errors, status: :unprocessable_entity
		end
	end

	def index

		@offset = params[:offset].to_i
		@limit = params[:limit].to_i

		page = params[:page].to_i
		page_count = params[:limit].to_i
		@offset = (page - 1) * page_count;

		@files = TfFile.order(created_at: :desc).offset(@offset).limit(@limit)
		page_count = @files.size
		total_count = TfFile.distinct.count('id').to_i

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
			files: @files,
			state: @state
		}

		render json: @data		
	end

	def destroy 
		@file_to_destory = TfFile.find(params[:id])
		if @file_to_destory.destroy
			render json: @file_to_destory.id
		else 
			@file_to_destory.errors
		end
	end

	private
	def file_params
		params.require(:file).permit(:name, :size, :height, :width, :file_type, :file_firebase_key, :preview_file_firebase_key)
	end
end
