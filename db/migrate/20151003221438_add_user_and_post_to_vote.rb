class AddUserAndPostToVote < ActiveRecord::Migration
  def change
    add_column :votes, :user, :integer
    add_column :votes, :post, :integer
  end
end
