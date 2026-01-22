# frozen_string_literal: true

class APIController < ActionController::API
  include CanCan::ControllerAdditions

  rescue_from CanCan::AccessDenied do |exception|
    render json: { error: "Access denied. #{exception.message}" }, status: :forbidden
  end

  def current_ability
    @current_ability ||= Ability.new(current_user, params[:event_id])
  end
end
