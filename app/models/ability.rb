# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user, event_id = nil)
    # Define abilities for the user here
    # If no user is provided, assume guest user
    user ||= User.new

    can [:read, :create, :matching, :dependencies], Recipe
    can [:read, :create], RecipeIngredient
    can [:read, :create], UserIngredient

    can :read, User
  end
end
