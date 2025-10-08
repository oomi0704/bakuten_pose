class User < ApplicationRecord
  authenticates_with_sorcery!
  
  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }
  
  validates :email, uniqueness: true, presence: true
  
  mount_uploader :stand_image, StandImageUploader
  mount_uploader :fly_image, FlyImageUploader
  mount_uploader :land_image, LandImageUploader
end
