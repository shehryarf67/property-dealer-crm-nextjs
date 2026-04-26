"use client";

import { useState } from "react";

export default function LeadForm({ onLeadCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterest: "",
    budget: "",
    status: "New",
    notes: "",
    followUpDate: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          budget: Number(formData.budget),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create lead");
        return;
      }

      setMessage("Lead created successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        propertyInterest: "",
        budget: "",
        status: "New",
        notes: "",
        followUpDate: "",
      });

      if (onLeadCreated) {
        onLeadCreated(data.lead);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Lead</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Client name"
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="923001234567"
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

        <input
          name="propertyInterest"
          value={formData.propertyInterest}
          onChange={handleChange}
          placeholder="Property interest"
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

        <input
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Budget"
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border border-slate-300 rounded-lg px-4 py-2"
        >
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Contacted">Contacted</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
          <option value="Lost">Lost</option>
        </select>

        <input
          name="followUpDate"
          type="date"
          value={formData.followUpDate}
          onChange={handleChange}
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="border border-slate-300 rounded-lg px-4 py-2 md:col-span-2"
        />

        {message && (
          <p className="text-sm bg-slate-100 rounded-lg p-3 md:col-span-2">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white rounded-lg px-6 py-2 font-medium md:col-span-2 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Lead"}
        </button>
      </form>
    </section>
  );
}