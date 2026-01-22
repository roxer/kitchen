# frozen_string_literal: true

module ServiceCaller

  def call(*args, **kwargs, &block)
    new(*args, **kwargs).perform(&block)
  end

  def call!(*args, **kwargs, &block)
    new(*args, **kwargs).perform!(&block)
  end

end
