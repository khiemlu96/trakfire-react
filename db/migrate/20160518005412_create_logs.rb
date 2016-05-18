class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.string :handle
      t.string :uid
      t.string :username
      t.timestamps null: false
    end
  end
end
