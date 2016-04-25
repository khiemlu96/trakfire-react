class AddColHandleToWhitelistsTable < ActiveRecord::Migration
  def change
  	add_column :whitelists, :handle, :string
  end
end
