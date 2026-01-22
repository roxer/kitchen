import { useState, useMemo, type ReactNode } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import authService, { type AuthError } from "@domain/auth/authService";
import IconLoader2 from "~icons/lucide/loader-2";
import { useSessionStore } from "../../stores/sessionStore";
import sygnet from "@assets/images/Pennylane_logo1.svg";

interface BaseLayoutProps {
  children: ReactNode;
}

function BaseLayout({ children }: BaseLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionStore = useSessionStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isWithinEvent = useMemo(() => {
    return (
      location.pathname.startsWith("/events/") &&
      location.pathname.split("/").length > 2
    );
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await authService.signOut();
      sessionStore.clearSession();
      navigate("/login");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Logout error:", authError.message);
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <header className="z-10 flex-shrink-0 bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={sygnet} alt="EngineArch Logo" className="h-8" />
              <span className="text-xl font-semibold text-gray-900">
                Dinner Time!
              </span>
              <nav className="flex space-x-4">
                <Link
                  to="/kitchen"
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                    location.pathname === "/kitchen"
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-600"
                    }`}
                >
                  My Kitchen
                </Link>
                <Link
                  to="/recipes"
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                    location.pathname === "/recipes"
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-600"
                    }`}
                >
                  Recipes
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!isLoggingOut ? (
                  "Logout"
                ) : (
                  <span className="flex items-center">
                    <IconLoader2 className="mr-2 -ml-1 h-4 w-4 animate-spin text-white" />
                    Logging out...
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default BaseLayout;
