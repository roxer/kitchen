require "rails_helper"

RSpec.describe 'API::TransfersController'.safe_constantize || 'API::TransfersController', type: :controller do
  let(:user) { create(:user) }
  let(:event) { create(:event) }
  let(:start_location) { create(:location, event: event) }
  let(:end_location) { create(:location, event: event) }

  before do
    # Sign in the user for authentication
    sign_in user

    # Allow reading transfers for testing
    # Note: The Ability model should be updated to include:
    # can :read, Transfer
    # This is expected as part of the challenge implementation
    allow_any_instance_of(Ability).to receive(:can?).and_call_original
    allow_any_instance_of(Ability).to receive(:can?).with(any_args).and_call_original
    allow_any_instance_of(Ability).to receive(:can?).with(:read, Transfer).and_return(true)
  end

  describe "GET #index" do
    context "with valid event" do
      let!(:transfer1) { create(:transfer, event: event, start_location: start_location, end_location: end_location) }
      let!(:transfer2) { create(:transfer, event: event, start_location: start_location, end_location: end_location) }
      let!(:transfer3) { create(:transfer, event: event, start_location: start_location, end_location: end_location) }

      context "with default pagination" do
        it "returns paginated transfers" do
          get :index, params: { event_id: event.id }

          expect(response).to have_http_status(:ok)
          json_response = JSON.parse(response.body)

          expect(json_response).to have_key("transfers")
          expect(json_response).to have_key("pagination")
          expect(json_response["transfers"]).to be_an(Array)
          expect(json_response["pagination"]["page"]).to eq(1)
          expect(json_response["pagination"]["per_page"]).to eq(25)
          expect(json_response["pagination"]["total_count"]).to eq(3)
        end

        it "returns transfers scoped to the event" do
          other_event = create(:event)
          other_start_location = create(:location, event: other_event)
          other_end_location = create(:location, event: other_event)
          other_transfer = create(:transfer, event: other_event, start_location: other_start_location, end_location: other_end_location)

          get :index, params: { event_id: event.id }

          json_response = JSON.parse(response.body)
          transfer_ids = json_response["transfers"].map { |t| t["id"] }

          expect(transfer_ids).to include(transfer1.id.to_s)
          expect(transfer_ids).to include(transfer2.id.to_s)
          expect(transfer_ids).to include(transfer3.id.to_s)
          expect(transfer_ids).not_to include(other_transfer.id.to_s)
        end
      end

      context "with custom pagination" do
        it "respects page parameter" do
          # Create more transfers to test pagination
          5.times { create(:transfer, event: event, start_location: start_location, end_location: end_location) }

          get :index, params: { event_id: event.id, page: 2, per_page: 3 }

          json_response = JSON.parse(response.body)
          expect(json_response["pagination"]["page"]).to eq(2)
          expect(json_response["pagination"]["per_page"]).to eq(3)
          expect(json_response["transfers"].length).to eq(3)
        end

        it "respects per_page parameter" do
          get :index, params: { event_id: event.id, per_page: 2 }

          json_response = JSON.parse(response.body)
          expect(json_response["pagination"]["per_page"]).to eq(2)
          expect(json_response["transfers"].length).to eq(2)
        end

        it "caps per_page at 100" do
          get :index, params: { event_id: event.id, per_page: 200 }

          json_response = JSON.parse(response.body)
          expect(json_response["pagination"]["per_page"]).to eq(100)
        end
      end

      context "with ransack filtering" do
        let!(:transfer_with_comment) do
          create(:transfer,
                 event: event,
                 start_location: start_location,
                 end_location: end_location,
                 comment: "Special transfer")
        end

        it "filters transfers using ransack when q parameter is provided" do
          get :index, params: { event_id: event.id, q: { comment_cont: "Special" } }

          json_response = JSON.parse(response.body)
          transfer_ids = json_response["transfers"].map { |t| t["id"] }

          expect(transfer_ids).to include(transfer_with_comment.id.to_s)
          expect(json_response["pagination"]["total_count"]).to eq(1)
        end

        it "returns all transfers when no ransack filter is provided" do
          get :index, params: { event_id: event.id }

          json_response = JSON.parse(response.body)
          expect(json_response["pagination"]["total_count"]).to eq(4)
        end
      end

      context "with archived transfers" do
        let!(:archived_transfer) do
          create(:transfer,
                 event: event,
                 start_location: start_location,
                 end_location: end_location,
                 archived_at: Time.current)
        end

        it "includes archived transfers in index" do
          get :index, params: { event_id: event.id }

          json_response = JSON.parse(response.body)
          transfer_ids = json_response["transfers"].map { |t| t["id"] }

          # Index should include all transfers (archived and non-archived)
          expect(transfer_ids).to include(archived_transfer.id.to_s)
        end
      end
    end

    context "with invalid event" do
      it "returns 404 when event does not exist" do
        get :index, params: { event_id: "non-existent-id" }

        expect(response).to have_http_status(:not_found)
      end
    end

    context "authorization" do
      it "allows access for authenticated users" do
        get :index, params: { event_id: event.id }

        expect(response).to have_http_status(:ok)
      end

      it "denies access for unauthenticated users" do
        sign_out user

        get :index, params: { event_id: event.id }

        # Without authentication, Devise will redirect or return unauthorized
        expect(response).not_to have_http_status(:ok)
      end
    end
  end

  describe "GET #count" do
    context "with valid event" do
      let!(:non_archived_transfer1) do
        create(:transfer,
               event: event,
               start_location: start_location,
               end_location: end_location,
               archived_at: nil)
      end
      let!(:non_archived_transfer2) do
        create(:transfer,
               event: event,
               start_location: start_location,
               end_location: end_location,
               archived_at: nil)
      end
      let!(:archived_transfer) do
        create(:transfer,
               event: event,
               start_location: start_location,
               end_location: end_location,
               archived_at: Time.current)
      end

      it "returns count of non-archived transfers only" do
        get :count, params: { event_id: event.id }

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response).to have_key("count")
        expect(json_response["count"]).to eq(2)
      end

      it "returns correct JSON structure" do
        get :count, params: { event_id: event.id }

        json_response = JSON.parse(response.body)
        expect(json_response).to eq({ "count" => 2 })
      end

      it "only counts transfers for the specified event" do
        other_event = create(:event)
        other_start_location = create(:location, event: other_event)
        other_end_location = create(:location, event: other_event)
        create(:transfer,
               event: other_event,
               start_location: other_start_location,
               end_location: other_end_location,
               archived_at: nil)

        get :count, params: { event_id: event.id }

        json_response = JSON.parse(response.body)
        expect(json_response["count"]).to eq(2)
      end

      it "returns 0 when all transfers are archived" do
        Transfer.where(event: event).update_all(archived_at: Time.current)

        get :count, params: { event_id: event.id }

        json_response = JSON.parse(response.body)
        expect(json_response["count"]).to eq(0)
      end

      it "returns 0 when there are no transfers" do
        Transfer.where(event: event).destroy_all

        get :count, params: { event_id: event.id }

        json_response = JSON.parse(response.body)
        expect(json_response["count"]).to eq(0)
      end
    end

    context "with invalid event" do
      it "returns 404 when event does not exist" do
        get :count, params: { event_id: "non-existent-id" }

        expect(response).to have_http_status(:not_found)
      end
    end

    context "authorization" do
      it "respects the same authorization as index action" do
        get :count, params: { event_id: event.id }

        expect(response).to have_http_status(:ok)
      end

      it "denies access for unauthenticated users" do
        sign_out user

        get :count, params: { event_id: event.id }

        # Without authentication, Devise will redirect or return unauthorized
        expect(response).not_to have_http_status(:ok)
      end
    end
  end
end
