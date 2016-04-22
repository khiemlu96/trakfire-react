class AddColumnsInApplicationsTable < ActiveRecord::Migration
  def change
  	add_column :applications, :sc1, :string
  	add_column :applications, :sc2, :string
  	add_column :applications, :sc3, :string
  end
end
