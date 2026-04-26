import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <section className="max-w-3xl w-full bg-white rounded-2xl shadow-sm p-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Property Dealer CRM System
        </h1>

        <p className="text-slate-600 mb-8">
          Manage property leads, assign agents, track follow-ups, score lead priority,
          and monitor performance through a complete CRM dashboard.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="border border-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-50"
          >
            Signup
          </Link>
        </div>
      </section>
    </main>
  );
}