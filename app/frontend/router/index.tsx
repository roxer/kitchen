import {
  createHashRouter,
  Navigate,
  redirect,
  type RouteObject,
} from "react-router-dom";
import { lazy } from "react";
import { useSessionStore } from "../stores/sessionStore";
import AuthenticatedLayout from "../components/layouts/AuthenticatedLayout";
import LoginPage from "../domain/auth/LoginPage";
import AbstractRoute from "../components/layouts/AbstractRoute";

// Lazy load components
const UsersTable = lazy(() => import("../domain/users/UsersTable"));
const HomePage = lazy(() => import("../domain/common/HomePage"));
const RecipesTable = lazy(() => import("../domain/recipes/RecipesTable"));
const KitchenTable = lazy(() => import("../domain/kitchen/KitchenTable"));

// Auth loader function
async function authLoader(requiresAuth: boolean) {
  const sessionStore = useSessionStore.getState();

  if (
    !sessionStore.currentUser &&
    !sessionStore.isAuthenticating &&
    !sessionStore.hasAttemptedAuthentication
  ) {
    try {
      // FIXME: await sessionStore.fetchCurrentUser();
    } catch (error) {
      console.error("Error fetching current user:", error);
      if (requiresAuth) {
        return redirect("/login");
      }
    }
  }

  if (requiresAuth && !sessionStore.currentUser) {
    return redirect("/login");
  }

  if (!requiresAuth && sessionStore.currentUser) {
    return redirect("/recipes");
  }

  return null;
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthenticatedLayout />,
    loader: () => authLoader(true),
    children: [
      {
        index: true,
        element: <Navigate to="/events" replace />,
      },
      {
        path: "users",
        element: <UsersTable />,
      },
      {
        path: "recipes",
        element: <RecipesTable />,
      },
      {
        path: "kitchen",
        element: <KitchenTable />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => authLoader(false),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export const router = createHashRouter(routes);
