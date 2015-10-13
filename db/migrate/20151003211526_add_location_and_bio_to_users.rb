class AddLocationAndBioToUsers < ActiveRecord::Migration
  def change
    add_column :users, :location, :string
    add_column :users, :tbio, :string
  end
end
