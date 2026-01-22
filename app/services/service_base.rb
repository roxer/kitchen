# frozen_string_literal: true

class ServiceBase
  include ServiceResult
  extend ServiceCaller


  def self.inherited(klass)
    class << klass
      alias_method :__new, :new

      def new(...)
        instance = super(...)
        unless self.skip_set_service_object_in_request_store
          instance.set_service_object_in_request_store()
        end
        instance
      end
    end
  end
end
