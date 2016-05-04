class AddOriginalProfileImgColInUsers < ActiveRecord::Migration
  def change
  	add_column :users, :original_profile_img, :string
  end
end
