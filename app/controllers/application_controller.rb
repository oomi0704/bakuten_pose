class ApplicationController < ActionController::Base
  include Sorcery::Controller
  
  before_action :require_login

  private

  def not_authenticated
    redirect_to login_path, alert: 'ログインが必要です。'
  end

  def require_no_user
    if current_user
      redirect_to root_path, alert: 'すでにログインしています。'
    end
  end
end
