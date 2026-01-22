# frozen_string_literal: true

# == Schema Information
#
# Table name: locations
# Database name: primary
#
#  id             :uuid             not null, primary key
#  address        :string
#  latitude       :string
#  longitude      :string
#  name           :string
#  location_types :string           default([]), is an Array
#  time_zone      :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  event_id       :uuid             not null
#
# Indexes
#
#  index_locations_on_event_id  (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#

FactoryBot.define do
  factory :location do
    association :event
    name { Faker::Company.name }
    address { Faker::Address.full_address }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    time_zone { "Europe/Warsaw" }
    location_types { ["office"] }
  end
end
