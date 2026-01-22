# frozen_string_literal: true

class UnicodeTool
  def self.char_code(char)
    (0..109_976).each do |pos|
      chr = ''
      chr << pos

      return pos.to_s(16) if chr == char
    end
  rescue StandardError
    nil
  end
end
