class BackFlipAnalysesController < ApplicationController
  def new
    @back_flip_analysis = BackFlipAnalysis.new
  end

  def create
    @back_flip_analysis = BackFlipAnalysis.new()
    @back_flip_analysis.save
    redirect_to root_path
  end

  private

  def post_params
    params.require(:back_flip_analysis).permit(:takeoff_image,:landing_image)
  end

end
