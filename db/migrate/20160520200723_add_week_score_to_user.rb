class AddWeekScoreToUser < ActiveRecord::Migration
  def change
  	add_column :users, :score_weekly, :float, default: 0.0
  end
end
