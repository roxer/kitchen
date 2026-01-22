import { Outlet } from "react-router-dom";
import BaseLayout from "./BaseLayout";

function AuthenticatedLayout() {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
}

export default AuthenticatedLayout;
