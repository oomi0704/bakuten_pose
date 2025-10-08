class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.string :name
      t.string :stand_image
      t.string :fly_image
      t.string :land_image
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
