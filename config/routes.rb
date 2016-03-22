Rails.application.routes.draw do

  match '*all', to: 'application#preflight', via: [:options]
  
  get 'current_user', to: 'application#current_user'
  get 'request_token', to: 'tokens#request_token'
  get 'access_token', to: 'tokens#access_token'
  get 'post/:id' => 'posts#show'

  resources :posts, only: [:index, :create, :show, :destroy]
  resources :votes, only: [:create, :destroy]
  resources :comments, only: [:index, :create, :destroy]
  resources :follower, only: [:create, :destroy]
  resources :notifications, only: [:index, :destroy]
  resources :users, only: [:index, :update, :show] do
    member do
      get :posts
      get :votes
    end
  end
  resources :applications, only: [:create]
  
  match '*all', to: 'application#index', via: [:get]
end
