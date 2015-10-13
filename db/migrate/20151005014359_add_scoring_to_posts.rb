class AddScoringToPosts < ActiveRecord::Migration
  def up
    execute <<-SQL
      create or replace function
        hot_score(ups integer, date timestamp with time zone)
        returns numeric as $$
        select round(cast(log(greatest(abs($1 - 0), 1)) * sign($1 - 0) +
          (date_part('epoch', $2) - 1134028003) / 45000.0 as numeric), 7)
      $$ language sql immutable;
    SQL
  end

  def down
    execute "DROP FUNCTION IF EXISTS hot_score(integer, integer, timestamp);"
  end
end
