import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { router } from "./router";

function App() {
  return (
    <div id="app" style={{ fontFamily: 'Avenir, Helvetica, Arial, sans-serif', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
}

export default App;
