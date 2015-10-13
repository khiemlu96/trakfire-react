class ChangeTagsToArray < ActiveRecord::Migration
  def change
  	#change_column :posts , :tags , :integer , array: true , default: []
  end
end
