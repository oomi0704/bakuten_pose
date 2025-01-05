class User < ApplicationRecord
    mount_uploader :stand_image, StandImageUploader
end
