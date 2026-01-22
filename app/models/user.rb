# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable

  # Prevent archived users from signing in
  def active_for_authentication?
    super && archived_at.nil?
  end

  # Custom message for archived users
  def inactive_message
    archived_at.present? ? :archived : super
  end
end
