# frozen_string_literal: true

class API::V1::UserIngredientsController < APIController
  load_and_authorize_resource :user_ingredient
  authorize_resource

  # GET /api/v1/user_ingredients
  def index
    current_user = 1

    ingredients = UserIngredient.by_user(current_user).all
                                .joins(:ingredient)
                                .select(:id, :quantity, "ingredients.name")
                                .order("user_ingredients.created_at DESC")

    render json: { ingredients: ingredients }
  end
end
