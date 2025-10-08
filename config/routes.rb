Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # 認証関連のルート
  get 'login', to: 'user_sessions#new', as: :login
  post 'login', to: 'user_sessions#create'
  delete 'logout', to: 'user_sessions#destroy', as: :logout
  
  get 'signup', to: 'user_registrations#new', as: :signup
  post 'signup', to: 'user_registrations#create'

  # 管理画面
  namespace :admin do
    resources :posts, only: [:index, :destroy]
  end

  # 投稿関連のルート
  resources :posts
  root 'posts#index'
end
