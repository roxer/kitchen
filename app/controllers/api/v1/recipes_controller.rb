# frozen_string_literal: true

class API::V1::RecipesController < APIController
  load_and_authorize_resource :recipe
  authorize_resource

  # GET /api/v1/recipes
  def index
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 25
    per_page = [per_page, 100].min # Cap at 100 per page

    offset = (page - 1) * per_page
    total_count = Recipe.count
    recipes = Recipe.all
                    .select("recipes.*, authors.name AS author_name")
                    .joins(:author)
                    .limit(per_page)
                    .offset(offset)
                    .order("created_at desc")

    render json: {
      recipes: recipes,
      pagination: {
        page: page,
        per_page: per_page,
        total_pages: (total_count.to_f / per_page).ceil,
        total_count: total_count
      }
    }, methods: [:image_url]
  end

  # GET /api/v1/recipe/:id/dependencies
  def dependencies
    ingredients = @recipe.recipe_ingredients
                                  .joins(:ingredient)
                                  .select(:id, :quantity,
                                          :dependencies, :name)

    sorted = RecipeIngredient.sort_by_dependencies(ingredients)

    render json: { ingredients: sorted, title: @recipe.title }
  end

  # POST /api/v1/recipe
  def create
    # TODO:
  end

  def matching
    current_user_id = 1
    match =RecipesService::RecipesMatching.call(matching_params,
                                                user_id: current_user_id)

    if match.success?
      render json: { recipes: match.result }
    else
      render json: { error: match.error }, status: :conflict
    end
  end

  private

  def matching_params
    params.permit(
      :page,
      :per_page,
      :format,
      :cook_time_start,
      :cook_time_end,
      :prep_time_start,
      :prep_time_end,
      :rating_start,
      :rating_end,
      :name_match,
    )
  end
end
