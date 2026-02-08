import { Button, Typography, Box } from "@mui/material";
import { useCounterStore } from "../store/counter";

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <Box>
      <Typography>Local State (Zustand)</Typography>
      <Typography>{count}</Typography>
      <Button onClick={increment}>+</Button>
      <Button onClick={decrement}>-</Button>
      <Button onClick={reset}>Reset</Button>
    </Box>
  );
}
