class AddColumnIsAdminToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :isAdmin, :boolean
  end
end
