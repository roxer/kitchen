# Devise test helpers for RSpec
# See: https://github.com/heartcombo/devise#test-helpers
#
# For Rails >= 5, controller tests use ActionDispatch::IntegrationTest as superclass,
# so we use IntegrationHelpers. For Rails < 5, use ControllerHelpers instead.

RSpec.configure do |config|
  # Use IntegrationHelpers for Rails >= 5 (Rails 8.1 in this case)
  config.include Devise::Test::IntegrationHelpers, type: :controller
  config.include Devise::Test::IntegrationHelpers, type: :request
  config.include Devise::Test::IntegrationHelpers, type: :feature
  config.include Devise::Test::IntegrationHelpers, type: :view
end
