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
require "rails_helper"

RSpec.describe Vehicle, type: :model, j1_challenge: true, j1_challenge_part_2: true do
  describe "J1 Challenge - PART 2" do
    describe "fleet_number uniqueness" do
      let(:event) { create(:event) }
      let(:vehicle_category) { create(:vehicle_category, event: event) }
      let(:vehicle_brand) { create(:vehicle_brand, event: event) }
      let(:vehicle_model) { create(:vehicle_model, event: event, vehicle_brand: vehicle_brand) }
      let(:vehicle_source) { create(:vehicle_source, event: event) }

      context "with same event" do
        it "prevents duplicate fleet_numbers (case-insensitive)" do
          create(:vehicle,
                  event: event,
                  vehicle_category: vehicle_category,
                  vehicle_model: vehicle_model,
                  vehicle_source: vehicle_source,
                  fleet_number: "VEH_123")

          duplicate_vehicle = build(:vehicle,
                                      event: event,
                                      vehicle_category: vehicle_category,
                                      vehicle_model: vehicle_model,
                                      vehicle_source: vehicle_source,
                                      fleet_number: "veh_123")

          expect(duplicate_vehicle).not_to be_valid
          expect(duplicate_vehicle.errors[:fleet_number]).to be_present
        end

        it "allows same fleet_number with different case in different events" do
          event1 = create(:event)
          event2 = create(:event)
          vehicle_category1 = create(:vehicle_category, event: event1)
          vehicle_category2 = create(:vehicle_category, event: event2)
          vehicle_brand1 = create(:vehicle_brand, event: event1)
          vehicle_brand2 = create(:vehicle_brand, event: event2)
          vehicle_model1 = create(:vehicle_model, event: event1, vehicle_brand: vehicle_brand1)
          vehicle_model2 = create(:vehicle_model, event: event2, vehicle_brand: vehicle_brand2)
          vehicle_source1 = create(:vehicle_source, event: event1)
          vehicle_source2 = create(:vehicle_source, event: event2)

          vehicle1 = create(:vehicle,
                            event: event1,
                            vehicle_category: vehicle_category1,
                            vehicle_model: vehicle_model1,
                            vehicle_source: vehicle_source1,
                            fleet_number: "VEH_123")

          vehicle2 = build(:vehicle,
                            event: event2,
                            vehicle_category: vehicle_category2,
                            vehicle_model: vehicle_model2,
                            vehicle_source: vehicle_source2,
                            fleet_number: "VEH_123")

          expect(vehicle1).to be_persisted
          expect(vehicle2).to be_valid
        end

        it "allows nil fleet_number" do
          vehicle = build(:vehicle,
                          event: event,
                          vehicle_category: vehicle_category,
                          vehicle_model: vehicle_model,
                          vehicle_source: vehicle_source,
                          fleet_number: nil)

          expect(vehicle).to be_valid
        end
      end

      context "race condition with concurrent transactions" do
        # Disable transactional fixtures for race condition tests to allow actual database commits
        around do |example|
          self.use_transactional_tests = false
          example.run
          # Clean up after test
          Vehicle.where(event: event).destroy_all
          self.use_transactional_tests = true
        end

        xit "prevents duplicate fleet_numbers when two transactions try to create vehicles simultaneously" do
          # This test simulates a race condition where two threads try to create
          # vehicles with the same fleet_number at the same time
          fleet_number = "RACE_TEST_#{SecureRandom.hex(4)}"
          results = []
          errors = []
          mutex = Mutex.new
          ready_count = 0
          ready_mutex = Mutex.new
          condition = ConditionVariable.new

          # Create two threads that will try to create vehicles simultaneously
          threads = 2.times.map do
            Thread.new do
              # Signal that this thread is ready
              ready_mutex.synchronize do
                ready_count += 1
                condition.broadcast if ready_count >= 2
              end

              # Wait for both threads to be ready
              ready_mutex.synchronize do
                condition.wait(ready_mutex) while ready_count < 2
              end

              # Each thread tries to create a vehicle in its own transaction
              # Use a separate database connection to simulate true concurrency
              ActiveRecord::Base.connection_pool.with_connection do
                begin
                  vehicle = Vehicle.create!(
                    event: event,
                    vehicle_category: vehicle_category,
                    vehicle_model: vehicle_model,
                    vehicle_source: vehicle_source,
                    fleet_number: fleet_number
                  )
                  mutex.synchronize do
                    results << vehicle.id
                  end
                rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotUnique, PG::UniqueViolation => e
                  mutex.synchronize do
                    errors << e.class.name
                  end
                end
              end
            end
          end

          # Wait for all threads to complete
          threads.each(&:join)

          # Only one vehicle should have been created successfully
          expect(results.length).to eq(1), "Expected exactly one successful creation, got #{results.length}. Errors: #{errors}"

          # Verify only one vehicle exists in the database
          vehicles_count = Vehicle.where(event: event, fleet_number: fleet_number).count
          expect(vehicles_count).to eq(1), "Expected exactly one vehicle in database, found #{vehicles_count}"

          # Verify the other attempt resulted in an error
          expect(errors.length).to eq(1), "Expected exactly one error, got #{errors.length}"
        end

        xit "handles case-insensitive race condition with different case fleet_numbers" do
          # Test that even with different case, the race condition is handled
          base_fleet_number = "CASE_RACE_#{SecureRandom.hex(4)}"
          fleet_number1 = base_fleet_number.upcase
          fleet_number2 = base_fleet_number.downcase
          results = []
          errors = []
          mutex = Mutex.new
          ready_count = 0
          ready_mutex = Mutex.new
          condition = ConditionVariable.new

          threads = 2.times.map do |i|
            Thread.new do
              ready_mutex.synchronize do
                ready_count += 1
                condition.broadcast if ready_count >= 2
              end

              ready_mutex.synchronize do
                condition.wait(ready_mutex) while ready_count < 2
              end

              ActiveRecord::Base.connection_pool.with_connection do
                begin
                  vehicle = Vehicle.create!(
                    event: event,
                    vehicle_category: vehicle_category,
                    vehicle_model: vehicle_model,
                    vehicle_source: vehicle_source,
                    fleet_number: i == 0 ? fleet_number1 : fleet_number2
                  )
                  mutex.synchronize do
                    results << vehicle.id
                  end
                rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotUnique, PG::UniqueViolation => e
                  mutex.synchronize do
                    errors << e.class.name
                  end
                end
              end
            end
          end

          threads.each(&:join)

          # Only one should succeed (case-insensitive uniqueness)
          expect(results.length).to eq(1), "Expected exactly one successful creation, got #{results.length}. Errors: #{errors}"

          vehicles_count = Vehicle.where(event: event)
                                  .where("LOWER(fleet_number) = ?", base_fleet_number.downcase)
                                  .count
          expect(vehicles_count).to eq(1), "Expected exactly one vehicle in database, found #{vehicles_count}"
        end
      end
    end
  end
end
