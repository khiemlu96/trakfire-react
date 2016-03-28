class AlterUserTable < ActiveRecord::Migration
  def change
  	add_column :users, :isVerified, :boolean
  end
end
