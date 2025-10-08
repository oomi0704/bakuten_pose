class PostsController < ApplicationController
  before_action :set_post, only: %i[ show edit update destroy ]
  before_action :check_owner, only: %i[ edit update destroy ]

  # GET /posts or /posts.json
  def index
    @posts = Post.all.order(created_at: :desc)
  end

  # GET /posts/1 or /posts/1.json
  def show
  end

  # GET /posts/new
  def new
    @post = Post.new
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts or /posts.json
  def create
    @post = current_user.posts.new(post_params)
    
    respond_to do |format|
      if @post.save
        format.html { redirect_to @post, notice: '投稿が正常に作成されました。' }
        format.json { render :show, status: :created, location: @post }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1 or /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post, notice: '投稿が正常に更新されました。' }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1 or /posts/1.json
  def destroy
    @post.destroy!

    respond_to do |format|
      format.html { redirect_to posts_path, status: :see_other, notice: '投稿が正常に削除されました。' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # 投稿者のみが編集・削除できるようにする
    def check_owner
      unless current_user && current_user.id == @post.user_id
        redirect_to posts_path, alert: '他のユーザーの投稿を編集・削除することはできません。'
      end
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.require(:post).permit(:name, :stand_image, :stand_image_cache, :fly_image, :fly_image_cache, :land_image, :land_image_cache)
    end
end
