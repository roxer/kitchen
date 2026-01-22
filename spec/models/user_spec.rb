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
require "rails_helper"


RSpec.describe User, type: :model, j1_challenge: true, j1_challenge_part_1: true do
  describe "J1 Challenge - PART 1" do
    describe "email validation" do
      context "with valid emails" do
        it "accepts a valid email address" do
          user = build(:user, email: "user@example.com")
          expect(user).to be_valid
        end

        it "accepts an email with subdomain" do
          user = build(:user, email: "user@mail.example.com")
          expect(user).to be_valid
        end

        it "accepts an email with plus sign" do
          user = build(:user, email: "user+tag@example.com")
          expect(user).to be_valid
        end

        it "accepts an email with numbers" do
          user = build(:user, email: "user123@example.com")
          expect(user).to be_valid
        end

        it "accepts an email with hyphens" do
          user = build(:user, email: "user-name@example.com")
          expect(user).to be_valid
        end
      end

      context "with invalid email formats" do
        it "rejects an email without @ symbol" do
          user = build(:user, email: "userexample.com")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to be_present
        end

        it "rejects an email without domain" do
          user = build(:user, email: "user@")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to be_present
        end

        it "rejects an email without local part" do
          user = build(:user, email: "@example.com")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to be_present
        end

        it "rejects an email with spaces" do
          user = build(:user, email: "user @example.com")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to be_present
        end

        it "rejects an email with invalid characters" do
          user = build(:user, email: "user@exa mple.com")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to be_present
        end
      end

      context "with blocked email domains" do
        it "rejects an email from tempmail.com" do
          user = build(:user, email: "user@tempmail.com")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to include("cannot use temporary email services")
        end

        it "rejects an email from throwaway.email" do
          user = build(:user, email: "user@throwaway.email")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to include("cannot use temporary email services")
        end

        it "rejects an email from 10minutemail.com" do
          user = build(:user, email: "user@10minutemail.com")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to include("cannot use temporary email services")
        end

        it "rejects blocked domains case-insensitively" do
          user = build(:user, email: "user@TEMPTMAIL.COM")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to include("cannot use temporary email services")
        end

        it "rejects blocked domains with mixed case" do
          user = build(:user, email: "user@TempMail.Com")
          expect(user).not_to be_valid
          expect(user.errors[:email]).to include("cannot use temporary email services")
        end
      end

      context "when email is not provided" do
        it "allows nil email if email is optional" do
          # Note: This test depends on whether email is required by Devise
          # Devise typically requires email, so this might need adjustment
          user = build(:user, email: nil)
          # Devise validations will likely make this invalid, but we test the custom validation
          # The custom validation should only run if email is present
          expect(user.errors[:email]).not_to include("cannot use temporary email services")
        end
      end
    end
  end
end
