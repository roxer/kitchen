# Auto-annotate models after migrations
namespace :db do
  desc "Annotate models after migrations"
  task :annotate_models do
    puts "Annotating models..."
    system("bundle exec annotaterb models")
  end
end

# Hook into db:migrate to auto-annotate models
Rake::Task["db:migrate"].enhance do
  Rake::Task["db:annotate_models"].invoke
end

# Also hook into db:migrate:up and db:migrate:down
Rake::Task["db:migrate:up"].enhance do
  Rake::Task["db:annotate_models"].invoke
end

Rake::Task["db:migrate:down"].enhance do
  Rake::Task["db:annotate_models"].invoke
end
