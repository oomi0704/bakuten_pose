class Admin::PostsController < ApplicationController
  before_action :require_admin

  def index
    @posts = Post.includes(:user).all.order(created_at: :desc)
  end

  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    redirect_to admin_posts_path, notice: '投稿を削除しました。'
  end

  private

  def require_admin
    unless current_user && current_user.admin?
      redirect_to root_path, alert: '管理者権限が必要です。'
    end
  end
end
