import Link from "next/link";
import AdminStats from "@/components/dashboard/AdminStats";
import LogoutButton from "@/components/auth/LogoutButton";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 mt-2">
                Monitor leads, agents, priority levels, and CRM performance.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/leads"
                className="bg-slate-900 text-white px-5 py-2 rounded-lg"
              >
                Manage Leads
              </Link>

              <LogoutButton />
            </div>
          </div>
        </section>

        <AdminStats />
      </div>
    </main>
  );
}
