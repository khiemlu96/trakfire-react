class AddTagsToPostType < ActiveRecord::Migration
  def change
  	add_column :posts, :tags, :integer
  end
end
