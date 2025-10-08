class Post < ApplicationRecord
  belongs_to :user
  
  mount_uploader :stand_image, StandImageUploader
  mount_uploader :fly_image, FlyImageUploader
  mount_uploader :land_image, LandImageUploader
  
  validates :name, presence: true
  
  # デフォルト名を設定
  before_validation :set_default_name
  
  private
  
  def set_default_name
    self.name = "投稿 ##{Time.current.to_i}" if name.blank?
  end
end
