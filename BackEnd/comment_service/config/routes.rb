Rails.application.routes.draw do
  resources :comments, only: [:create, :show]
end

