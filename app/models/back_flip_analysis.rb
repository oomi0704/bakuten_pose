class BackFlipAnalysis < ApplicationRecord
    has_one_attached :takeoff_image
    has_one_attached :landing_image
  
    validates :status, presence: true
end
