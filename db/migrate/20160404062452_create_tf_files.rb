class CreateTfFiles < ActiveRecord::Migration
  def change
    create_table :tf_files do |t|
		t.string :name
	   	t.string :file_firebase_key
	   	t.string :preview_file_firebase_key
	   	t.integer :size
	   	t.integer :height
	   	t.integer :width
	   	t.string :file_type
	   	t.timestamps null: false
    end
  end
end
