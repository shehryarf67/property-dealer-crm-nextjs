"use client";

import { useState } from "react";
import ActivityTimeline from "@/components/leads/ActivityTimeline";

export default function LeadTable({
    leads,
    agents,
    currentUser,
    onLeadUpdated,
    onLeadDeleted,
}) {
    const [editingLead, setEditingLead] = useState(null);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState("");
    const [selectedLeadForActivity, setSelectedLeadForActivity] = useState(null);

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

    async function assignLead(leadId, agentId) {
        if (!agentId) {
            return;
        }

        try {
            const response = await fetch(`/api/leads/${leadId}/assign`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ assignedTo: agentId }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to assign lead");
                return;
            }

            onLeadUpdated(data.lead);
            setMessage(data.message);
        } catch (error) {
            setMessage("Something went wrong while assigning lead.");
        }
    }

    function isOverdue(followUpDate) {
        if (!followUpDate) {
            return false;
        }

        const today = new Date();
        const followUp = new Date(followUpDate);

        today.setHours(0, 0, 0, 0);
        followUp.setHours(0, 0, 0, 0);

        return followUp < today;
    }

    function isStale(lastActivityAt) {
        if (!lastActivityAt) {
            return false;
        }

        const today = new Date();
        const lastActivity = new Date(lastActivityAt);
        const differenceInDays = Math.floor(
            (today - lastActivity) / (1000 * 60 * 60 * 24)
        );

        return differenceInDays >= 7;
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
                        <th className="py-3 pr-4">Follow-up</th>
                        <th className="py-3 pr-4">WhatsApp</th>
                        {currentUser?.role === "admin" && (
                            <th className="py-3 pr-4">Assigned To</th>
                        )}
                        <th className="py-3 pr-4">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {leads.map((lead) => {
                        const isEditing = editingLead === lead._id;

                        return (
                            <tr
                                key={lead._id}
                                className={`border-b border-slate-100 align-top ${
                                    isOverdue(lead.followUpDate)
                                        ? "bg-red-50"
                                        : isStale(lead.lastActivityAt)
                                            ? "bg-orange-50"
                                            : ""
                                }`}
                            >
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
                                    {isEditing ? (
                                        <input
                                            name="followUpDate"
                                            type="date"
                                            value={formData.followUpDate}
                                            onChange={handleChange}
                                            className="border border-slate-300 rounded-lg px-3 py-2"
                                        />
                                    ) : (
                                        <div className="space-y-1">
                                            <p>
                                                {lead.followUpDate
                                                    ? new Date(lead.followUpDate).toLocaleDateString()
                                                    : "Not set"}
                                            </p>

                                            {isOverdue(lead.followUpDate) && (
                                                <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                                    Overdue
                                                </span>
                                            )}

                                            {isStale(lead.lastActivityAt) && (
                                                <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                                                    Stale
                                                </span>
                                            )}
                                        </div>
                                    )}
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

                                {currentUser?.role === "admin" && (
                                    <td className="py-3 pr-4">
                                        <select
                                            value={lead.assignedTo?._id || ""}
                                            onChange={(event) =>
                                                assignLead(lead._id, event.target.value)
                                            }
                                            className="border border-slate-300 rounded-lg px-3 py-2"
                                        >
                                            <option value="">Unassigned</option>
                                            {agents?.map((agent) => (
                                                <option key={agent._id} value={agent._id}>
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                )}

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
                                                onClick={() => setSelectedLeadForActivity(lead._id)}
                                                className="border border-slate-300 px-3 py-2 rounded-lg"
                                            >
                                                Timeline
                                            </button>

                                            <button
                                                onClick={() => startEditing(lead)}
                                                className="border border-slate-300 px-3 py-2 rounded-lg"
                                            >
                                                Edit
                                            </button>

                                            {currentUser?.role === "admin" && (
                                                <button
                                                    onClick={() => deleteLead(lead._id)}
                                                    className="bg-red-600 text-white px-3 py-2 rounded-lg"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {selectedLeadForActivity && (
                <ActivityTimeline
                    leadId={selectedLeadForActivity}
                    onClose={() => setSelectedLeadForActivity(null)}
                />
            )}
        </section>
    );
}
