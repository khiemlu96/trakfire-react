class AddSongRefToPosts < ActiveRecord::Migration
  def change
    #add_reference :posts, :song, index: true, foreign_key: true
  end
end
