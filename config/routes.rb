Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Mission Control Jobs dashboard for Solid Queue
  # mount MissionControl::Jobs::Engine, at: "/jobs"

  # Users API routes

  # Defines the root path route ("/")
  root "application#frontend"

  devise_for :users, only: []

  namespace :api, defaults: { format: :json } do
    devise_scope :user do
      post "/session/sign_in", to: "sessions#create"
      get "/session/current_user", to: "sessions#show"
      delete "/session/sign_out", to: "sessions#destroy"
    end

    namespace :v1 do


      resources :recipes, only: [:index] do
        collection do
          get :matching
        end
        member do
          get :dependencies
        end
      end

      resources :user_ingredients, only: [:index]
      resources :recipe_ingredients, only: [:show]
    end
  end
end

Rails.application.routes.append do
  get "*path", to: "application#frontend", constraints: ->(req) {
    !req.xhr? && req.format.html? && !req.path.start_with?("/api")
  }
end
