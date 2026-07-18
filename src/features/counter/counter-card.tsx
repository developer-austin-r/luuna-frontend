"use client";

import { useAppDispatch, useAppSelector } from "@/redux";
import {
  decrement,
  increment,
  incrementByAmount,
  reset,
} from "@/redux/slices/counter-slice";

export function CounterCard() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <section className="border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
            Redux demo
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            Counter state
          </h2>
        </div>
        <span className="min-w-16 text-right text-4xl font-semibold text-zinc-950">
          {count}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => dispatch(decrement())}
          className="border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          Decrement
        </button>
        <button
          type="button"
          onClick={() => dispatch(increment())}
          className="bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Increment
        </button>
        <button
          type="button"
          onClick={() => dispatch(incrementByAmount(5))}
          className="border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          Add 5
        </button>
        <button
          type="button"
          onClick={() => dispatch(reset())}
          className="border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
