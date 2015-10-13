class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :stream_url
      t.string :title
      t.string :thumb_url
      t.string :wav_url
      t.string :artist
      t.string :f_id
      t.string :genre
      t.integer :duration
      t.timestamps null: false
    end
  end
end
