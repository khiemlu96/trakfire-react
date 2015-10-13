class AddDateMToPosts < ActiveRecord::Migration
  def change
  	add_column :posts, :dateinmill, :float
  end
end
