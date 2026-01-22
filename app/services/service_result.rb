# frozen_string_literal: true

require "ostruct"

module ServiceResult
  private

  def success result: nil, **args
    OpenStruct.new(success?: true, fail?: false, result: result, **args)
  end

  def fail **args
    raise ArgumentError.new("fail method must include :error key") unless args.keys.include? :error
    OpenStruct.new(fail?: true, success?: false, **args)
  end


  # Wraps fail object keeping its data and merging it with new parameters while keeping error codes in subcodes array
  #
  # @return [fail] new fail OpenStruct enriched by new parameters and subcodes
  #
  def wrap_fail failure, code: nil, **kwargs
    if code
      subcodes = [*failure.subcodes, *failure.code]
    end

    OpenStruct.new(
      **failure.to_h,
      **kwargs,
      subcodes: subcodes,
      code: code || failure.code
    )
  end
end
