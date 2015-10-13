class RenameColumnsInVote < ActiveRecord::Migration
  def change
  	rename_column :votes, :user, :user_id
  	rename_column :votes, :post, :post_id
  end
end
