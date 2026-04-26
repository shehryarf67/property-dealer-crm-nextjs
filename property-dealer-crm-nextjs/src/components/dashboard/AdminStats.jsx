"use client";

import { useEffect, useState } from "react";

export default function AdminStats() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();

        if (response.ok) {
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-slate-600">Loading analytics...</p>
      </section>
    );
  }

  if (!analytics) {
    return (
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-slate-600">No analytics available.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-slate-500">Total Leads</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">
            {analytics.totalLeads}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-slate-500">Total Agents</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">
            {analytics.totalAgents}
          </h2>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Leads by Status
          </h2>

          <div className="space-y-3">
            {analytics.statusDistribution.length === 0 ? (
              <p className="text-slate-600">No status data found.</p>
            ) : (
              analytics.statusDistribution.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b border-slate-100 pb-2"
                >
                  <span className="text-slate-700">{item._id}</span>
                  <span className="font-semibold text-slate-900">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Leads by Priority
          </h2>

          <div className="space-y-3">
            {analytics.priorityDistribution.length === 0 ? (
              <p className="text-slate-600">No priority data found.</p>
            ) : (
              analytics.priorityDistribution.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b border-slate-100 pb-2"
                >
                  <span className="text-slate-700">{item._id}</span>
                  <span className="font-semibold text-slate-900">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Agent Performance
        </h2>

        {analytics.agentPerformance.length === 0 ? (
          <p className="text-slate-600">No assigned leads found yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 pr-4">Agent</th>
                <th className="py-3 pr-4">Assigned</th>
                <th className="py-3 pr-4">Contacted</th>
                <th className="py-3 pr-4">In Progress</th>
                <th className="py-3 pr-4">Closed</th>
              </tr>
            </thead>

            <tbody>
              {analytics.agentPerformance.map((agent) => (
                <tr key={agent._id} className="border-b border-slate-100">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900">
                      {agent.agentName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {agent.agentEmail}
                    </p>
                  </td>
                  <td className="py-3 pr-4">{agent.totalAssigned}</td>
                  <td className="py-3 pr-4">{agent.contacted}</td>
                  <td className="py-3 pr-4">{agent.inProgress}</td>
                  <td className="py-3 pr-4">{agent.closed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}