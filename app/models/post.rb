class Post < ApplicationRecord
  belongs_to :user
  
  mount_uploader :stand_image, StandImageUploader
  mount_uploader :fly_image, FlyImageUploader
  mount_uploader :land_image, LandImageUploader
  
  validates :name, presence: true, length: { maximum: 255 }
end
