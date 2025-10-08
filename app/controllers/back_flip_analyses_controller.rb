class BackFlipAnalysesController < ApplicationController
  def new
    @back_flip_analysis = BackFlipAnalysis.new
  end

  def create
    @back_flip_analysis = BackFlipAnalysis.new(post_params)
    
    if @back_flip_analysis.save
      redirect_to root_path, notice: 'バク転診断が開始されました。分析結果をお待ちください。'
    else
      flash.now[:alert] = '画像のアップロードに失敗しました。もう一度お試しください。'
      render :new, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:back_flip_analysis).permit(:takeoff_image, :landing_image)
  end
end
