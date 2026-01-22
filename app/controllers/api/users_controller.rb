# frozen_string_literal: true

class API::UsersController < APIController
  load_and_authorize_resource

  # GET /api/users
  def index
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 25
    per_page = [per_page, 100].min # Cap at 100 per page

    offset = (page - 1) * per_page
    total_count = @users.count
    users = @users.limit(per_page).offset(offset).order("created_at desc")

    render json: {
      users: users,
      pagination: {
        page: page,
        per_page: per_page,
        total_pages: (total_count.to_f / per_page).ceil,
        total_count: total_count
      }
    }
  end

  # GET /api/users/:id
  def show
    render json: @user
  end
end
