"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="max-w-md border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-rose-700">
          Application error
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
          Something went wrong.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
