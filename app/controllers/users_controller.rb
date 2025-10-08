class UsersController < ApplicationController
  before_action :set_user, only: %i[ show edit update destroy ]
  before_action :check_owner, only: %i[ edit update destroy ]

  # GET /users or /users.json
  def index
    @users = User.all
  end

  # GET /users/1 or /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    if current_user
      # ログイン済みの場合は既存のユーザー情報を更新（写真のみ）
      @user = current_user
      
      respond_to do |format|
        if @user.update_images_only(user_params)
          format.html { redirect_to @user, notice: '写真が正常に更新されました。' }
          format.json { render :show, status: :ok, location: @user }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    else
      # 新規ユーザー登録の場合
      @user = User.new(user_params)
      
      respond_to do |format|
        if @user.save
          format.html { redirect_to @user, notice: t('flash.notice.create') }
          format.json { render :show, status: :created, location: @user }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: t('flash.notice.update') }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    @user.destroy!

    respond_to do |format|
      format.html { redirect_to users_path, status: :see_other, notice: t('flash.notice.destroy') }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # 投稿者のみが編集・削除できるようにする
    def check_owner
      unless current_user == @user
        redirect_to users_path, alert: '他のユーザーの投稿を編集・削除することはできません。'
      end
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:name, :stand_image, :stand_image_cache, :fly_image, :fly_image_cache, :land_image, :land_image_cache)
    end
end
