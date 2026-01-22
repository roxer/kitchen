# frozen_string_literal: true

# == Schema Information
#
# Table name: vehicle_brands
# Database name: primary
#
#  id         :uuid             not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  event_id   :uuid             not null
#
# Indexes
#
#  index_vehicle_brands_on_event_id  (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#
FactoryBot.define do
  factory :vehicle_brand do
    association :event
    name { Faker::Vehicle.make }
  end
end


