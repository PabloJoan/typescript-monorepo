import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

type RouterContext = {
  auth: {
    isAuthenticated: boolean;
  };
};
export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});
