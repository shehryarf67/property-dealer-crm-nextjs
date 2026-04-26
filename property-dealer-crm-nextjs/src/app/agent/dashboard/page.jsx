import Link from "next/link";
import AgentStats from "@/components/dashboard/AgentStats";

export default function AgentDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Agent Dashboard
              </h1>
              <p className="text-slate-600 mt-2">
                Track your assigned leads, high-priority clients, and follow-ups.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/leads"
                className="bg-slate-900 text-white px-5 py-2 rounded-lg"
              >
                My Leads
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

        <AgentStats />
      </div>
    </main>
  );
}