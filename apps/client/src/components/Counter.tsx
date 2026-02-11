import { Button, Typography, Box } from "@mui/material";
import { useCounterStore } from "../store/counter";

export function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

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
