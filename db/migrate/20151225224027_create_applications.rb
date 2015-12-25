class CreateApplications < ActiveRecord::Migration
  def change
    create_table :applications do |t|
      t.string :name
      t.string :handle
      t.string :email
      t.string :artists
      t.string :statement
      t.timestamps null: false
    end
  end
end
