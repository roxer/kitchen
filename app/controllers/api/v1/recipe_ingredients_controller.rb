# frozen_string_literal: true

class API::V1::RecipeIngredientsController < APIController
  load_and_authorize_resource :recipe_ingredient
  authorize_resource

  # GET /api/v1/recipe_ingredients/:id
  def show
    ingredients = RecipeIngredient.find_by_recipe_id(params[:id])
                                  .joins(:ingredient)
                                  .select(:id, :quantity,
                                          :dependencies,"ingredients.name")

    sorted = RecipeIngredient.sort_by_dependencies(ingredients)

    render json: { ingredients: sorted }
  end
end
