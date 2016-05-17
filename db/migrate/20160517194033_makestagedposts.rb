class Makestagedposts < ActiveRecord::Migration
  def change
    create_table :staged_posts do |t|
      t.string :title
      t.string :artist
      t.string :genre
      t.string :stream_url
      t.string :img_url
      t.string :duration
      t.timestamps null: false
    end
  end
end
