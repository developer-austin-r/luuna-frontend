import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="max-w-md border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          The page you requested does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Go home
        </Link>
      </section>
    </main>
  );
}
