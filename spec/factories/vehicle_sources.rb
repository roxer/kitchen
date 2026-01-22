# frozen_string_literal: true

# == Schema Information
#
# Table name: vehicle_sources
# Database name: primary
#
#  id           :uuid             not null, primary key
#  billable     :boolean          default(FALSE)
#  maintainable :boolean          default(FALSE)
#  name         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  event_id     :uuid             not null
#
# Indexes
#
#  index_vehicle_sources_on_event_id  (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#
FactoryBot.define do
  factory :vehicle_source do
    association :event
    sequence(:eid) { |n| n }
    name { Faker::Company.name }
    billable { true }
    maintainable { true }
  end
end
