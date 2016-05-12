class CreateStagedPosts < ActiveRecord::Migration
  def change
    create_table :staged_posts do |t|
      t.string   :stream_url
      t.string   :waveform_url
      t.string   :duration
      t.string   :artist
      t.string   :title
      t.string   :img_url
      t.float    :dateinmill
      t.timestamps null: false
    end
  end
end
