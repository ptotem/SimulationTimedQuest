Rails.application.routes.draw do
  get 'home/index'
  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'
  mount RailsAdminImport::Engine => '/rails_admin_import', :as => 'rails_admin_import'
  
  devise_for :users
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'home#game_complete'
  match '/update_time', :to => "home#update_time", via: [:get, :post], :as=> "update_time"
  match '/save_result', to: 'home#save_result', via: [:get, :post]
  match '/finish_game', to: 'home#finish_game', via: [:get, :post]
  match '/user_selected', to: 'home#user_selected', via: [:get, :post]
  match '/simulation', to: 'home#simulation', via: [:get, :post]
  match '/mcq', to: 'home#mcq', via: [:get, :post]
  match '/msq', to: 'home#msq', via: [:get, :post]
  match '/quinterrogation1', to: 'home#quinterrogation1', via: [:get, :post]
  match '/quinterrogation2', to: 'home#quinterrogation2', via: [:get, :post]
  match '/game_end', to: 'home#game_end', via: [:get, :post]
  match '/game_complete', to: 'home#game_complete', via: [:get, :post]
  match '/unauthorized', to: 'home#unauthorized', via: [:get, :post]

  match '/import_users', to: 'home#import_users', via: [:get, :post]
  match '/importing_users', to: 'home#importing_users', via: [:get, :post]
  match '/getReport', to: 'home#getReport', via: [:get, :post]
end
