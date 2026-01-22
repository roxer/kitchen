# frozen_string_literal: true

class UserIngredient < ApplicationRecord
  belongs_to :user
  belongs_to :ingredient

  scope :by_user, ->(user_id) {
    where(:user_id => user_id)
  }
end
