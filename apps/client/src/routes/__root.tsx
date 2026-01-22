import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="p-4">
      <h1 className="text-3xl font-bold underline mb-4">Feedback Board</h1>
      <hr className="mb-4" />
      <Outlet />
    </div>
  ),
});
