class AddBotFlagToUser < ActiveRecord::Migration
  def change
  	add_column :users, :bot, :boolean, default: false
  end
end
