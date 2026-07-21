import { appConfig } from "@/config";
import { CounterCard } from "@/features/counter";

export default function Home() {
  // return (
  //   <main className="min-h-screen bg-background text-foreground">
  //     <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-16 sm:px-10 lg:px-12">
  //       <div className="max-w-3xl space-y-5">
  //         <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
  //           {appConfig.name}
  //         </p>
  //         <h1 className="text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
  //           Production-ready Next.js foundation for Luuna.
  //         </h1>
  //         <p className="max-w-2xl text-lg leading-8 text-zinc-600">
  //           App Router, strict TypeScript, Tailwind CSS, Redux Toolkit,
  //           environment configuration, linting, formatting, and commit checks
  //           are already wired together.
  //         </p>
  //       </div>

  //       <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
  //         <div className="grid gap-4 sm:grid-cols-2">
  //           {[
  //             "Server-first App Router structure",
  //             "Typed Redux feature architecture",
  //             "Strict ESLint and Prettier workflow",
  //             "Environment separation for deployments",
  //           ].map((item) => (
  //             <div
  //               key={item}
  //               className="border border-zinc-200 bg-white p-5 shadow-sm"
  //             >
  //               <p className="text-sm font-medium text-zinc-900">{item}</p>
  //             </div>
  //           ))}
  //         </div>

  //         <CounterCard />
  //       </div>
  //     </section>
  //   </main>
  // );
}
