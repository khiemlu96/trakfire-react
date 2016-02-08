class Altercolumninfollower < ActiveRecord::Migration
  def change
  	change_column :followers, :user_id, :integer, :null => false
  	change_column :followers, :follow_id, :integer, :null => false
  end
end
