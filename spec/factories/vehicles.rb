# frozen_string_literal: true

# == Schema Information
#
# Table name: vehicles
# Database name: primary
#
#  id                   :uuid             not null, primary key
#  doors_number         :integer
#  fleet_number         :string
#  fuel                 :string
#  luggage_size         :string
#  phone                :string
#  production_year      :integer
#  registration_country :string
#  registration_plate   :string
#  seat_capacity        :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  event_id             :uuid             not null
#  remote_id            :string
#  vehicle_category_id  :uuid             not null
#  vehicle_model_id     :uuid             not null
#  vehicle_source_id    :uuid             not null
#
# Indexes
#
#  index_vehicles_on_event_id             (event_id)
#  index_vehicles_on_vehicle_category_id  (vehicle_category_id)
#  index_vehicles_on_vehicle_model_id     (vehicle_model_id)
#  index_vehicles_on_vehicle_source_id    (vehicle_source_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (vehicle_category_id => vehicle_categories.id)
#  fk_rails_...  (vehicle_model_id => vehicle_models.id)
#  fk_rails_...  (vehicle_source_id => vehicle_sources.id)
#
FactoryBot.define do
  factory :vehicle do
    association :event
    association :vehicle_category
    association :vehicle_model
    association :vehicle_source
    fleet_number { "FLT-#{rand(1000..9999)}" }
    registration_plate { "#{('A'..'Z').to_a.sample(2).join} #{rand(1000..9999)}#{('A'..'Z').to_a.sample}" }
    fuel { %w[Petrol Diesel Electric Hybrid LPG CNG].sample }
    luggage_size { %w[Small Medium Large Extra\ Large].sample }
    phone { "+48#{rand(500000000..999999999)}" }
    production_year { rand(2010..Time.current.year) }
    seat_capacity { rand(2..50) }
    doors_number { rand(2..5) }
    remote_id { "REM-#{Faker::Alphanumeric.alphanumeric(number: 10).upcase}" }
  end
end


