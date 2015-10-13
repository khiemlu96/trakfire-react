class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.integer :user_id, index: true
      t.integer :song_id
      t.string :url
      t.timestamps null: false
    end
  end
end
