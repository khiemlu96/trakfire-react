class Notification < ActiveRecord::Base
	belongs_to :user
	belongs_to :notification

	def json_data=(data)
		@data = JSON.parse(data)
	end

	def json_data
		@data
	end

	def as_json(options={})
  		super({ methods: ['json_data'] })
	end
end