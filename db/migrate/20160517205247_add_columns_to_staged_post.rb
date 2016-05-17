class AddColumnsToStagedPost < ActiveRecord::Migration
  def change
  	add_column :staged_posts, :img_url_lg, :string
  	add_column :staged_posts, :url, :string
  end
end
