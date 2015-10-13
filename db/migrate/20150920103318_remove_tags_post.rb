class RemoveTagsPost < ActiveRecord::Migration
  def change
  	remove_column :posts, :tags
  end
end
