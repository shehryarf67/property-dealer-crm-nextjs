"use client";

import { useEffect, useState } from "react";
import LeadForm from "@/components/leads/LeadForm";
import LeadTable from "@/components/leads/LeadTable";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();

      if (response.ok) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Fetch leads failed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  function handleLeadCreated(newLead) {
    setLeads((previousLeads) => [newLead, ...previousLeads]);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-slate-600 mt-2">
            Create, view, score, and contact property leads.
          </p>
        </header>

        <LeadForm onLeadCreated={handleLeadCreated} />

        {loading ? (
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-slate-600">Loading leads...</p>
          </section>
        ) : (
          <LeadTable leads={leads} />
        )}
      </div>
    </main>
  );
}