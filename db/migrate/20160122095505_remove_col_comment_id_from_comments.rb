class RemoveColCommentIdFromComments < ActiveRecord::Migration
  def change
  	remove_column :comments, :comment_id, :integer
  end
end
