# == Schema Informaowtion
#
# Table name: events
# Database name: primary
#
#  id         :uuid             not null, primary key
#  name       :string
#  time_zone  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :event do
    name { Faker::Company.name }
    time_zone { "Europe/Warsaw" }
  end
end
