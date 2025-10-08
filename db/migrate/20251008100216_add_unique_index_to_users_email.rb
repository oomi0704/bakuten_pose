class AddUniqueIndexToUsersEmail < ActiveRecord::Migration[7.1]
  def change
    # 重複したemailのレコードを削除してから、ユニーク制約を追加
    remove_index :users, :email
    
    # 管理者以外の重複レコードを削除
    execute <<-SQL
      DELETE FROM users
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM users
        GROUP BY email
      )
      AND admin = false
    SQL
    
    add_index :users, :email, unique: true
  end
end