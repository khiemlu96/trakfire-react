class AlterCommentTable < ActiveRecord::Migration
  def change
  	add_column :comments, :parent_id, :integer
  	add_column :comments, :post_id, :integer
  	add_column :comments, :user_id, :integer
  	add_column :comments, :comment_detail, :string
  end
end
