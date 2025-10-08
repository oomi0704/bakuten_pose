class User < ApplicationRecord
  authenticates_with_sorcery!
  
  has_many :posts, dependent: :destroy
  
  validates :password, length: { minimum: 3 }, if: :password_required?
  validates :password, confirmation: true, if: :password_required?
  validates :password_confirmation, presence: true, if: :password_required?
  
  validates :email, presence: true, uniqueness: true
  
  # 管理者判定
  def admin?
    admin == true
  end

  # 写真のみの更新用メソッド
  def update_images_only(image_params)
    self.stand_image = image_params[:stand_image] if image_params[:stand_image].present?
    self.fly_image = image_params[:fly_image] if image_params[:fly_image].present?
    self.land_image = image_params[:land_image] if image_params[:land_image].present?
    self.name = image_params[:name] if image_params[:name].present?
    
    # 認証関連のバリデーションをスキップして保存
    save(validate: false)
  end

  private

  def password_required?
    # 新規作成時のみ、またはパスワードが実際に変更された場合のみ
    (new_record? && password.present?) || (persisted? && password.present?)
  end

  def email_required?
    # 新規作成時のみ、またはemailが実際に変更された場合のみ
    new_record?
  end
end
