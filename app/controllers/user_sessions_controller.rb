class UserSessionsController < ApplicationController
  skip_before_action :require_login, only: [:new, :create]
  before_action :require_login, only: [:destroy]
  
  # Turboを無効化
  skip_before_action :verify_authenticity_token, only: [:create]

  def new
    @user = User.new
  end

  def create
    email = params[:email]
    password = params[:password]
    
    # バリデーション
    if email.blank? && password.blank?
      flash[:alert] = 'メールアドレスとパスワードを入力してください。'
    elsif email.blank?
      flash[:alert] = 'メールアドレスを入力してください。'
    elsif password.blank?
      flash[:alert] = 'パスワードを入力してください。'
    elsif @user = login(email, password)
      redirect_to root_path, notice: 'ログインしました。'
      return
    else
      flash[:alert] = 'メールアドレスまたはパスワードが正しくありません。'
    end
    
    redirect_to login_path
  end

  def destroy
    logout
    redirect_to(root_path, notice: 'ログアウトしました。')
  end
end
