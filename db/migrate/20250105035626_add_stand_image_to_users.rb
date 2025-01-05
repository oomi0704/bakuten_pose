class AddStandImageToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :stand_image, :string
  end
end
