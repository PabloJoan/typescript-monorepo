import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/useAuthStore";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [uuid, setUUID] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      if (data.token) {
        login(data.token);
        await utils.auth.checkSession.invalidate();
      }
      navigate({ to: "/" });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!uuid) {
      setError("UUID is required");
      return;
    }
    setError("");
    loginMutation.mutate({ uuid });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
          align="center"
        >
          Please enter your UUID.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Personal Access Token"
              type="password"
              fullWidth
              value={uuid}
              onChange={(e) => setUUID(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
