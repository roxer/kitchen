# frozen_string_literal: true

class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  skip_before_action :verify_authenticity_token
  include CanCan::ControllerAdditions

  def frontend; end

  rescue_from CanCan::AccessDenied do |exception|
    render json: { error: "Access denied. #{exception.message}" }, status: :forbidden
  end
end
