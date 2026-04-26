"use client";

import { useEffect, useState } from "react";

export default function AgentStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId;

        async function fetchStats() {
            try {
                const response = await fetch("/api/agent-stats");
                const data = await response.json();

                if (response.ok) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch agent stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();

        intervalId = setInterval(() => {
            fetchStats();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return (
            <section className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-slate-600">Loading dashboard...</p>
            </section>
        );
    }

    if (!stats) {
        return (
            <section className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-slate-600">No dashboard data available.</p>
            </section>
        );
    }

    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-slate-500">Assigned Leads</p>
                <h2 className="text-4xl font-bold text-slate-900 mt-2">
                    {stats.totalAssigned}
                </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-slate-500">High Priority</p>
                <h2 className="text-4xl font-bold text-slate-900 mt-2">
                    {stats.highPriority}
                </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-slate-500">Overdue Follow-ups</p>
                <h2 className="text-4xl font-bold text-slate-900 mt-2">
                    {stats.overdueFollowUps}
                </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-slate-500">Closed Leads</p>
                <h2 className="text-4xl font-bold text-slate-900 mt-2">
                    {stats.closedLeads}
                </h2>
            </div>
        </section>
    );
}