class AddCanPostToUsers < ActiveRecord::Migration
  def change
    add_column :users, :canPost, :boolean
  end
end
