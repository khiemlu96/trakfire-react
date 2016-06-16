Rails.application.routes.draw do

  match '*all', to: 'application#preflight', via: [:options]
  
  get 'current_user', to: 'application#current_user'
  get 'request_token', to: 'tokens#request_token'
  get 'access_token', to: 'tokens#access_token'
  get 'admin_state', to: 'application#admin_state'
  get 'top', to: 'users#top'
  #get 'post/:id' => 'posts#show'
  post '/logins/auth' => 'logins#auth', :as => :authenticate
  post 'votes/batch_create' => 'votes#batch_create', :as => :batch_create

  resources :posts, only: [:index, :create, :show, :destroy]
  resources :votes, only: [:create, :destroy]
  resources :comments, only: [:index, :create, :destroy]
  resources :follower, only: [:create, :destroy]
  resources :notifications, only: [:index, :destroy, :update, :pending_notifications]
  resources :tf_files, only: [:create, :index, :destroy]
  resources :whitelists, only: [:create, :index, :destroy]
  resources :bots, only: [:index]
  
  resources :users, only: [:index, :update, :show, :destroy] do
    member do
      get :posts
      get :votes
    end
  end

  resources :applications, only: [:create, :index, :destroy] 
  match '*all', to: 'application#index', via: [:get]

end
