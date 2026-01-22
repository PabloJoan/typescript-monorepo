import { useCounterStore } from "../store/counter";

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="mt-6 p-4 border rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Local State (Zustand)</h2>
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold">{count}</span>
        <button
          onClick={increment}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
        <button
          onClick={decrement}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        <button
          onClick={reset}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
