class DropStagedPosts < ActiveRecord::Migration
  def change
  	drop_table :staged_posts
  end
end
