# frozen_string_literal: true

# == Schema Information
#
# Table name: transfers
# Database name: primary
#
#  id                   :uuid             not null, primary key
#  archived_at          :datetime
#  comment              :text
#  driver_comment       :text
#  end_at               :timestamptz
#  execution_state      :string           default("pending")
#  flight_class         :string
#  flight_number        :string
#  has_police_escort    :boolean          default(FALSE)
#  is_flight_private    :boolean          default(FALSE)
#  kind                 :string
#  lead_load_time       :integer
#  number_of_clients    :integer
#  provided_stamp       :string
#  provided_stamp_fixed :boolean          default(FALSE)
#  requested_time       :timestamptz
#  route_distance       :integer
#  route_geometry       :jsonb
#  start_at             :timestamptz
#  travel_times         :jsonb
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  client_id            :uuid
#  end_location_id      :uuid             not null
#  event_id             :uuid             not null
#  shift_id             :uuid
#  start_location_id    :uuid             not null
#  vehicle_category_id  :uuid
#
# Indexes
#
#  index_transfers_on_client_id            (client_id)
#  index_transfers_on_end_location_id      (end_location_id)
#  index_transfers_on_event_id             (event_id)
#  index_transfers_on_shift_id             (shift_id)
#  index_transfers_on_start_location_id    (start_location_id)
#  index_transfers_on_vehicle_category_id  (vehicle_category_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (end_location_id => locations.id)
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (shift_id => shifts.id)
#  fk_rails_...  (start_location_id => locations.id)
#  fk_rails_...  (vehicle_category_id => vehicle_categories.id)
#

FactoryBot.define do
  factory :transfer do
    association :event
    start_location { association(:location, event: event) }
    end_location { association(:location, event: event) }
    comment { Faker::Lorem.sentence }
    execution_state { "pending" }
    kind { %w[arrival departure].sample }
    number_of_clients { rand(1..10) }
    start_at { Faker::Time.forward(days: 1) }
    end_at { Faker::Time.forward(days: 1, period: :evening) }
    archived_at { nil }

    trait :archived do
      archived_at { Time.current }
    end
  end
end
