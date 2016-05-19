class AddHandleToBot < ActiveRecord::Migration
  def change
  	add_column :bots, :handle, :string
  end
end
