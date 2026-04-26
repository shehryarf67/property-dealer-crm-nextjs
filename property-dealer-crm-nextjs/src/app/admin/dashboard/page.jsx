import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Full CRM access for managing leads, agents, analytics, and activity.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/leads"
              className="bg-slate-900 text-white px-5 py-2 rounded-lg"
            >
              Manage Leads
            </Link>

            <Link
              href="/login"
              className="border border-slate-300 px-5 py-2 rounded-lg"
            >
              Logout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}