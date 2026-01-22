# frozen_string_literal: true

class API::SessionsController < Devise::SessionsController
  respond_to :json

  # POST /api/session/sign_in
  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    set_flash_message!(:notice, :signed_in)

    yield resource if block_given?

    render json: {
      message: 'Logged in successfully',
      user: {
        id: resource.id,
        email: resource.email
      }
    }, status: :ok
  end

  # GET /api/session/current_user
  def show
    if user_signed_in?
      render json: {
        user: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name,
          surname: current_user.surname
        }
      }, status: :ok
    else
      render json: {
        error: 'Not authenticated'
      }, status: :unauthorized
    end
  end

  # DELETE /api/session/sign_out
  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))

    if signed_out
      render json: {
        message: 'Logged out successfully'
      }, status: :ok
    else
      render json: {
        error: 'Failed to log out'
      }, status: :unprocessable_content
    end
  end
end
