class AddUsernameToBot < ActiveRecord::Migration
  def change
  	add_column :bots, :username, :string
  end
end
