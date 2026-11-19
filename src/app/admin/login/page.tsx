import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";
import LoginBackGuard from "@/components/admin/LoginBackGuard";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50">
      <LoginBackGuard />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(8,145,178,0.12), transparent), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(5,150,105,0.08), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.22) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 25%, black, transparent)",
        }}
      />

      <header className="relative z-10 flex items-center justify-end px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-cyan-700"
        >
          ← Rudi dukani
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-4 sm:px-6">
        <div className="w-full max-w-[420px] animate-fade-in">
          <div className="mb-8 flex flex-col items-center text-center">
            <Link href="/" aria-label="Ubepari PC Home" className="mb-5">
              <Logo variant="nav" priority className="h-20 w-auto sm:h-24" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Ubepari Staffs
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              Ingia ili kusimamia inventory, mauzo, na orodha ya laptops.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 sm:p-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Ufikiaji kwa wafanyakazi walioidhinishwa tu · Ubepari PC
          </p>
        </div>
      </main>
    </div>
  );
}
