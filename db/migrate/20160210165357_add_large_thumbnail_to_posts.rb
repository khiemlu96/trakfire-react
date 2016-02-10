class AddLargeThumbnailToPosts < ActiveRecord::Migration
  def change
  	add_column :posts, :img_url_lg, :string
  end
end
