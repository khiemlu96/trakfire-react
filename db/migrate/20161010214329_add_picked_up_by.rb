class AddPickedUpBy < ActiveRecord::Migration
  def change
    add_column :posts, :featured, :string
    add_column :posts, :feature_date, :string
    add_column :posts, :featured_by, :string
  end
end
