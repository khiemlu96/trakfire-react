class CreateWhitelists < ActiveRecord::Migration
  def change
    create_table :whitelists do |t|
      t.string :email
      t.timestamps null: false
    end
  end
end
