class CreateMemberTags < ActiveRecord::Migration
	def change
		create_table :member_tags do |t|
			t.integer  :user_id
	   		t.integer :comment_id
	   		t.timestamps null: false
		end
	end
end
