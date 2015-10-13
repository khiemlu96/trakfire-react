class AddTagsPost < ActiveRecord::Migration
  def change
  	add_column :posts , :tags , :integer , array: true , default: '{}'
  end
end
