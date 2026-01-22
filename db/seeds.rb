# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# require 'dag_generator'

FRACTIONS = {
  'bd'   => Rational(1, 2), # 1/2
  'bc'   => Rational(1, 4), # 1/4
  'be'   => Rational(3, 4), # 3/4
  '2153' => Rational(1, 3), # 1/3
  '2154' => Rational(2, 3), # 2/3
}.freeze

def get_unicode(char)
  (0..109_976).each do |pos|
    chr = ''
    chr << pos
    return pos.to_s(16) if chr == char
  end
rescue StandardError
  nil
end

def process_author(author)
  Author.find_or_create_by(name: author)
end

def process_category(category)
  Category.find_or_create_by(name: category)
end

def process_ingredients(recipe, ingredients)
  db_ingredients = []

  ingredients.each do |ing|
    desc = ing.split
    dose1, dose2 = desc.take(2)

    result = catch(:res) do
      if dose1.size == 1
        char = get_unicode(dose1)
        if (dose = FRACTIONS[char])
          desc.shift
          throw :res, [desc.join(' '), dose.to_f]
        end
      end

      if (dose = dose1.to_i).positive?
        if dose2.size == 1
          char = get_unicode(dose2)

          if (dose_f = FRACTIONS[char])
            desc.shift(2)
            throw :res, [desc.join(' '), dose + dose_f.to_f]
          end
        end

        desc.shift
        throw :res, [desc.join(' '), dose.to_f]
      end

      throw :res, [desc.join(' '), 1]
    end

    ingredient = Ingredient.find_or_create_by(name: result[0])
    rec_ing = RecipeIngredient.create(quantity: result[1],
                                      recipe: recipe,
                                      ingredient: ingredient)

    db_ingredients << rec_ing
  end

  db_ingredients
end

def process_recipe(rec, author, category)
   Recipe.create(
    title:     rec['title'],
    cook_time: rec['cook_time'],
    prep_time: rec['prep_time'],
    image:     rec['image'],
    rating:    rec['ratings'],
    author:    author,
    category:  category,
  )
end

def process_dependencies(ingredients)
  size = ingredients.size
  dag = DAGGenerator.new(size, 0.6)
  result = dag.generate

  result.each do |key, val|
    ingredients[key].dependencies = val.map { |x| ingredients[x].id }
    ingredients[key].save
  end
end

puts "seeeeeding"

json_file = File.open("#{Rails.root}/db/seed/recipes-en.json")
file_content = json_file.read
recipes = JSON.parse(file_content)

pp recipes.size

recipes.each_with_index do |item, idx|
  next if idx <= 600
  pp idx if (idx % 200).zero?
  begin
    author   = process_author(item['author'])
    category = process_category(item['category'])
    recipe   = process_recipe(item, author, category)
    ing      = process_ingredients(recipe, item['ingredients'])
    process_dependencies(ing)
  rescue StandardError, ActiveRecord::RangeError
    pp item.inspect
  end
end



code = get_unicode("⅔")
puts code
puts "ddddddseeeeeding"
dag = DAGGenerator.new(6, 0.7)
dag.generate
# dag.display
