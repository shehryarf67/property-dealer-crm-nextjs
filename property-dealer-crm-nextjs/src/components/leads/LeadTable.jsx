"use client";

import { useState } from "react";

export default function LeadTable({ leads, onLeadUpdated, onLeadDeleted }) {
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  if (!leads || leads.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-slate-600">No leads found.</p>
      </section>
    );
  }

  function getScoreBadge(score) {
    if (score === "High") return "bg-red-100 text-red-700";
    if (score === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  }

  function startEditing(lead) {
    setEditingLead(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      propertyInterest: lead.propertyInterest,
      budget: lead.budget,
      status: lead.status,
      notes: lead.notes || "",
      followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : "",
    });
    setMessage("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function saveLead(id) {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
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
        setMessage(data.message || "Failed to update lead");
        return;
      }

      onLeadUpdated(data.lead);
      setEditingLead(null);
      setMessage("Lead updated successfully");
    } catch (error) {
      setMessage("Something went wrong while updating lead.");
    }
  }

  async function deleteLead(id) {
    const confirmDelete = confirm("Are you sure you want to delete this lead?");

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete lead");
        return;
      }

      onLeadDeleted(id);
      setMessage("Lead deleted successfully");
    } catch (error) {
      setMessage("Something went wrong while deleting lead.");
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Leads</h2>

      {message && (
        <p className="text-sm bg-slate-100 rounded-lg p-3 mb-4">{message}</p>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Contact</th>
            <th className="py-3 pr-4">Interest</th>
            <th className="py-3 pr-4">Budget</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Priority</th>
            <th className="py-3 pr-4">WhatsApp</th>
            <th className="py-3 pr-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => {
            const isEditing = editingLead === lead._id;

            return (
              <tr key={lead._id} className="border-b border-slate-100 align-top">
                <td className="py-3 pr-4">
                  {isEditing ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-slate-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <>
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.email}</p>
                    </>
                  )}
                </td>

                <td className="py-3 pr-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  ) : (
                    lead.phone
                  )}
                </td>

                <td className="py-3 pr-4">
                  {isEditing ? (
                    <input
                      name="propertyInterest"
                      value={formData.propertyInterest}
                      onChange={handleChange}
                      className="border border-slate-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    lead.propertyInterest
                  )}
                </td>

                <td className="py-3 pr-4">
                  {isEditing ? (
                    <input
                      name="budget"
                      type="number"
                      value={formData.budget}
                      onChange={handleChange}
                      className="border border-slate-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    `PKR ${Number(lead.budget).toLocaleString()}`
                  )}
                </td>

                <td className="py-3 pr-4">
                  {isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option value="New">New</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                      <option value="Lost">Lost</option>
                    </select>
                  ) : (
                    lead.status
                  )}
                </td>

                <td className="py-3 pr-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getScoreBadge(
                      lead.score
                    )}`}
                  >
                    {lead.score}
                  </span>
                </td>

                <td className="py-3 pr-4">
                  <a
                    href={`https://wa.me/${lead.phone}`}
                    target="_blank"
                    className="text-slate-900 font-medium underline"
                  >
                    Chat
                  </a>
                </td>

                <td className="py-3 pr-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveLead(lead._id)}
                        className="bg-slate-900 text-white px-3 py-2 rounded-lg"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingLead(null)}
                        className="border border-slate-300 px-3 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(lead)}
                        className="border border-slate-300 px-3 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteLead(lead._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}