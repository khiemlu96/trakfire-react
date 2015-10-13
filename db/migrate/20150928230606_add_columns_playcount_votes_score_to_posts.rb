class AddColumnsPlaycountVotesScoreToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :play_count, :integer
    add_column :posts, :votes, :integer
    add_column :posts, :score, :float
  end
end
