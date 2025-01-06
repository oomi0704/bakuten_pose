class User < ApplicationRecord
    mount_uploader :stand_image, StandImageUploader
    mount_uploader :fly_image, FlyImageUploader
    mount_uploader :land_image, LandImageUploader
end
