# frozen_string_literal: true

# == Schema Information
#
# Table name: vehicle_models
# Database name: primary
#
#  id               :uuid             not null, primary key
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  event_id         :uuid             not null
#  vehicle_brand_id :uuid             not null
#
# Indexes
#
#  index_vehicle_models_on_event_id          (event_id)
#  index_vehicle_models_on_vehicle_brand_id  (vehicle_brand_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (vehicle_brand_id => vehicle_brands.id)
#
FactoryBot.define do
  factory :vehicle_model do
    association :event
    association :vehicle_brand
    name { "#{vehicle_brand.name} #{Faker::Vehicle.model}" }
  end
end


