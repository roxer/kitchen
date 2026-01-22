# frozen_string_literal: true

require 'uri'

class Recipe < ApplicationRecord
  has_many :recipe_ingredients
  belongs_to :author
  belongs_to :category

  def image_url
    uri = URI(image)
    _, target = uri.query.split('=')
    URI::Parser.new.unescape(target)
  rescue StandardError
    nil
  end
end
