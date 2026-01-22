# frozen_string_literal: true

# == Schema Information
#
# Table name: vehicle_categories
# Database name: primary
#
#  id               :uuid             not null, primary key
#  background_color :string           default("#eeeeee")
#  border_color     :string           default("#dddddd")
#  font_color       :string           default("#990000")
#  name             :string
#  position         :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  event_id         :uuid             not null
#
# Indexes
#
#  index_vehicle_categories_on_event_id  (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#
FactoryBot.define do
  factory :vehicle_category do
    association :event
    name { Faker::Vehicle.standard_specs.sample || "Sedan" }
    position { rand(1..10) }
    background_color { "#E5F3FF" }
    border_color { "#99CCFF" }
    font_color { "#006699" }
  end
end


