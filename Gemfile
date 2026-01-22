source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.1.2"
# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"
# Use postgresql as the database for Active Record
gem "pg", "~> 1.6.3"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", "~> 7.1"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"
# Authentication solution [https://github.com/heartcombo/devise]
gem "devise", github: "heartcombo/devise", branch: "main"

# Authorization solution [https://github.com/CanCanCommunity/cancancan]
gem "cancancan"

# Ancestry for nested sets [https://github.com/stefankroes/ancestry]
gem "ancestry"
# State machine for ActiveRecord [https://github.com/aasm/aasm]
gem "aasm"
gem "multi_json"
gem "oj"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Search and filter library [https://github.com/activerecord-hackery/ransack]
gem "ransack", "~> 4.4"

# Request store [https://github.com/steveklabnik/request_store]
gem 'request_store'
gem 'faraday' # HTTP client

# Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Vite Rails [https://github.com/ElMassimo/vite_rails]
gem "vite_rails"

# Deploy this application anywhere as a Docker container [https://kamal-deploy.org]
gem "kamal", require: false

# Add HTTP asset caching/compression and X-Sendfile acceleration to Puma [https://github.com/basecamp/thruster/]
gem "thruster", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
gem "image_processing", "~> 1.2"

# CORS for API requests [https://github.com/cyu/rack-cors]
# gem 'rack-cors'

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"

  # Audits gems for known security defects (use config/bundler-audit.yml to ignore issues)
  gem "bundler-audit", require: false

  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "brakeman", require: false

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false

  # Testing framework [https://rspec.info/]
  gem "rspec-rails", "~> 8.0"
  # Faker for generating fake data [https://github.com/faker-ruby/faker]
  gem 'faker'
  # Shoulda Matchers for testing Rails models [https://matchers.shoulda.io/]
  gem 'shoulda-matchers'
  # Factory Bot for Rails [https://github.com/thoughtbot/factory_bot_rails]
  gem 'factory_bot_rails'
  # Pry byebug for debugging [https://github.com/dejan/pry-byebug]
  gem 'pry-byebug'
  gem 'pry-rails'
  gem 'require_all'
  # Pry macro for debugging [https://github.com/nixme/pry-macro]
  gem 'pry-macro'
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
  # Open emails in the browser instead of sending them
  gem "letter_opener"
  # Mission Control Jobs dashboard for Solid Queue [https://github.com/rails/mission_control-jobs]
  gem "mission_control-jobs"
  # Annotate models, routes, etc. with schema information
  gem "annotaterb"
  # Better errors [https://github.com/charliesome/better_errors]
  gem 'better_errors'
  # Guard for Rails [https://github.com/guard/guard]
  gem 'guard', require: false
  # Guard for RSpec [https://github.com/guard/guard-rspec]
  gem 'guard-rspec', require: false
  # Rails ERD [https://github.com/voormedia/rails-erd]
  gem 'rails-erd', require: false
  # Process manager for development [https://github.com/ddollar/foreman]
  gem 'foreman'
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara"
  gem "selenium-webdriver"
end
