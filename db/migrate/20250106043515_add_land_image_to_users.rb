class AddLandImageToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :land_image, :string
  end
end
