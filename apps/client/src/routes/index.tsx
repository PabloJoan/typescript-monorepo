import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { trpc } from "../trpc";
import { Counter } from "../components/Counter";
import { useAuthStore } from "../store/useAuthStore";
import { CircularProgress, Typography, Box, Button } from "@mui/material";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});

function Index() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      navigate({ to: "/login" });
    },
  });
  const { isLoading, error, data } = trpc.hello.useQuery({
    name: "World",
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading || !data) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography>Error loading api data: {error.message}</Typography>;
  }

  return (
    <Box>
      <Typography>{data.greeting}</Typography>
      <Counter />
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
