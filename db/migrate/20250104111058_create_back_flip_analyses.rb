class CreateBackFlipAnalyses < ActiveRecord::Migration[7.1]
  def change
    create_table :back_flip_analyses do |t|
      t.string :status

      t.timestamps
    end
  end
end
