class AddPostIndexToSongs < ActiveRecord::Migration
  def change
  	add_index :songs, :post_id
  end
end
