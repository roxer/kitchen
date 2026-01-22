# == Schema Information
#
# Table name: users
# Database name: primary
#
#  id                     :bigint           not null, primary key
#  archived_at            :datetime
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  name                   :string(100)
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  surname                :string(100)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#

FactoryBot.define do
  factory :user do
    email { Faker::Internet.unique.email }
    password { "password123" }
    password_confirmation { "password123" }
    name { Faker::Name.first_name }
    surname { Faker::Name.last_name }
    archived_at { nil }

    trait :archived do
      archived_at { Time.current }
    end
  end
end
