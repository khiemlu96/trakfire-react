class CreateTagsTable < ActiveRecord::Migration
  def change
    create_table :tags do |t|
    	t.string :name
    	t.integer :t_count
    	t.timestamps null: false
    end
  end
end
