# frozen_string_literal: true

class RecipesService::RecipesMatching < ServiceBase
  attr_reader :user_id, :cook_time_from, :cook_time_to,
    :prep_time_from, :prep_time_to,
    :rating_from, :rating_to, :name_match

  def initialize(params, user_id:)
    @user_id        = user_id
    @cook_time_from = params["cook_time_start"]
    @cook_time_to   = params["cook_time_end"]
    @prep_time_from = params["prep_time_start"]
    @prep_time_to   = params["prep_time_end"]
    @rating_from    = params["rating_start"]
    @rating_to      = params["rating_end"]
    @name_match     = params["name_match"]
  end

  def self.skip_set_service_object_in_request_store
    true
  end

  def perform
    query = { user_id: user_id }
    where = []
    where_sql = ""

    if cook_time_to.present? && cook_time_from.present?
      query[:cook_time_to] = cook_time_to.to_i
      query[:cook_time_from] = cook_time_from.to_i
      where << " rs.cook_time BETWEEN :cook_time_from AND :cook_time_to "
    end

    if prep_time_to.present? && prep_time_from.present?
      query[:prep_time_to] = prep_time_to.to_i
      query[:prep_time_from] = prep_time_from.to_i
      where << " rs.prep_time BETWEEN :prep_time_from AND :prep_time_to "
    end

    if rating_to.present? && rating_from.present?
      query[:rating_to] = rating_to.to_f
      query[:rating_from] = rating_from.to_f
      where << " rs.rating BETWEEN :rating_from AND :rating_to "
    end

    if name_match.present?
      query[:name_match] = "%" + name_match + "%"
      where << " rs.title ILIKE :name_match "
    end

    if where.present?
      where_sql = " where " + where.join(" AND ")
    end

    sql = <<~SQL
      SELECT
        rs.*, a.name AS author_name
      FROM
          public.recipe_ingredients ri
      LEFT JOIN
          public.user_ingredients ui
          ON ri.ingredient_id = ui.ingredient_id
          AND ui.user_id = :user_id
      INNER JOIN
	recipes rs
        ON rs.id = ri.recipe_id
      LEFT JOIN
	authors a
	ON rs.author_id = a.id
      #{where_sql}
      GROUP BY
        rs.id, a.id
      HAVING
          -- Total ingredients required by the recipe
          COUNT(ri.id) =
          -- Total ingredients the user actually has enough of
          COUNT(
            CASE WHEN ui.quantity >= ri.quantity THEN 1
            ELSE NULL
            END
          );
    SQL

    # TODO: alternatibe query using NOT EXISTS
    # It is sometimes faster depending on table indexes.
    _sql2 = <<~SQL
      SELECT DISTINCT r.recipe_id
      FROM public.recipe_ingredients r
      WHERE NOT EXISTS (
          SELECT 1
          FROM public.recipe_ingredients ri
          LEFT JOIN public.user_ingredients ui
              ON ri.ingredient_id = ui.ingredient_id
              AND ui.user_id = :user_id
          WHERE
              ri.recipe_id = r.recipe_id
              AND (ui.id IS NULL OR ui.quantity < ri.quantity)
      );
    SQL

    result = Recipe.find_by_sql([sql, query])
    success(result: result)
  rescue ActiveRecord::RecordNotFound => e
    fail(error: e.message)
  end
end

__END__
