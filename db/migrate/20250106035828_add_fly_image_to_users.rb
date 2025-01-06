class AddFlyImageToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :fly_image, :string
  end
end
