class AddStatusToStagedPosts < ActiveRecord::Migration
  def change
  	add_column :staged_posts, :status, :string
  end
end
