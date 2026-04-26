"use client";

import { useEffect, useState } from "react";
import LeadForm from "@/components/leads/LeadForm";
import LeadTable from "@/components/leads/LeadTable";

export default function LeadsPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [leads, setLeads] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    async function fetchCurrentUser() {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (response.ok) {
            setCurrentUser(data.user);
            return data.user;
        }

        return null;
    }

    async function fetchLeads() {
        const response = await fetch("/api/leads");
        const data = await response.json();

        if (response.ok) {
            setLeads(data.leads);
            setLastUpdated(new Date());
        }
    }

    async function fetchAgents(user) {
        if (user?.role !== "admin") {
            return;
        }

        const response = await fetch("/api/agents");
        const data = await response.json();

        if (response.ok) {
            setAgents(data.agents);
        }
    }

    useEffect(() => {
        let intervalId;

        async function loadPageData() {
            try {
                const user = await fetchCurrentUser();
                await fetchLeads();
                await fetchAgents(user);
            } catch (error) {
                console.error("Failed to load leads page:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPageData();

        intervalId = setInterval(() => {
            fetchLeads();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    function handleLeadCreated(newLead) {
        setLeads((previousLeads) => [newLead, ...previousLeads]);
    }

    function handleLeadUpdated(updatedLead) {
        setLeads((previousLeads) =>
            previousLeads.map((lead) =>
                lead._id === updatedLead._id ? updatedLead : lead
            )
        );
    }

    function handleLeadDeleted(deletedLeadId) {
        setLeads((previousLeads) =>
            previousLeads.filter((lead) => lead._id !== deletedLeadId)
        );
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="bg-white rounded-2xl shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        {currentUser?.role === "admin"
                            ? "Lead Management"
                            : "Assigned Leads"}
                    </h1>

                    <p className="text-slate-600 mt-2">
                        {currentUser?.role === "admin"
                            ? "Create, view, assign, score, and contact property leads."
                            : "View and update leads assigned to you."}
                    </p>
                    {lastUpdated && (
                        <p className="text-sm text-slate-400 mt-2">
                            Auto-updated at {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </header>

                {currentUser?.role === "admin" && (
                    <LeadForm onLeadCreated={handleLeadCreated} />
                )}

                {loading ? (
                    <section className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-slate-600">Loading leads...</p>
                    </section>
                ) : (
                    <LeadTable
                        leads={leads}
                        agents={agents}
                        currentUser={currentUser}
                        onLeadUpdated={handleLeadUpdated}
                        onLeadDeleted={handleLeadDeleted}
                    />
                )}
            </div>
        </main>
    );
}