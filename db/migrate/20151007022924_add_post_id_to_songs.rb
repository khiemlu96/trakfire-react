class AddPostIdToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :post_id, :integer, index: true
  end
end
