module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      # self.uuid = SecureRandom.urlsafe_base64
      logger.add_tags "ActionCable", "#{current_user.try(:class)} email:#{current_user.try(:email)}#{current_user.try(:respond_to?, :qr_content) ? ' code:' + (current_user.try(:qr_content) || 'empty') : ''}"
    end

    private
      def find_verified_user
        if verified_user = env["warden"].user(:user)
          verified_user
        elsif verified_user = env["warden"].user(:driver)
          verified_user
        else
          nil
          # reject_unauthorized_connection
        end
      end
  end
end
