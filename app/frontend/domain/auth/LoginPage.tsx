import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import authService, { type AuthError } from "./authService";
import { useSessionStore } from "../../stores/sessionStore";
import IconXCircle from "~icons/lucide/x-circle";
import IconLoader2 from "~icons/lucide/loader-2";
import WelcomeInfo from "@components/WelcomeInfo";
import type { User } from "../users/User";

function LoginPage() {
  const navigate = useNavigate();
  const sessionStore = useSessionStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]> | undefined
  >();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors(undefined);
    setIsLoading(true);

    try {
      // const response = await authService.signIn({
      //   email,
      //   password,
      // });

      // Update store with user data
      if (true) {
        const user: User = {
          email: "foo@example.com",
          id: 1,
          name: "John",
        }
        sessionStore.setUser(user);
      }

      // Success - redirect to home or dashboard
      navigate("/recipes");
    } catch (error) {
      const user: User = {
        email: "foo@example.com",
        id: 1,
        name: "John",
      }
      sessionStore.setUser(user);
      const authError = error as AuthError;
      setErrorMessage(authError.message);
      setFieldErrors(authError.errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center border">
        <div className="border-r border-gray-200">
          <WelcomeInfo />
        </div>
        <div className="mx-auto h-full max-w-md p-4">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
              <div className="mt-2 text-sm text-gray-500">
                (semo session: foo@bar.io - pass)
              </div>
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <IconXCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {errorMessage}
                    </h3>
                    {fieldErrors && (
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc space-y-1 pl-5">
                          {Object.entries(fieldErrors).map(([field, errors]) => (
                            <li key={field}>
                              <strong>{field}:</strong> {errors.join(", ")}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!isLoading ? (
                  "Sign in"
                ) : (
                  <span className="flex items-center">
                    <IconLoader2 className="mr-3 -ml-1 h-5 w-5 animate-spin text-white" />
                    Signing in...
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
