Rails.application.routes.draw do

  match '*all', to: 'application#preflight', via: [:options]
  
  get 'current_user', to: 'application#current_user'
  get 'request_token', to: 'tokens#request_token'
  get 'access_token', to: 'tokens#access_token'

  resources :posts, only: [:index, :create, :show]
  resources :votes, only: [:create, :destroy]
  resources :users, only: [:update, :show] do
    member do
      get :posts
    end
  end
  
  match '*all', to: 'application#index', via: [:get]
end
