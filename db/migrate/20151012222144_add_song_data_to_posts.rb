class AddSongDataToPosts < ActiveRecord::Migration
  def change
  	add_column :posts, :stream_url, :string
  	add_column :posts, :waveform_url, :string
  	add_column :posts, :duration, :string
  	add_column :posts, :artist, :string
  	add_column :posts, :title, :string
  	add_column :posts, :img_url, :string
  end
end
