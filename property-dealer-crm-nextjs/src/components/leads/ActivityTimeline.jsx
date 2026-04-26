"use client";

import { useEffect, useState } from "react";

export default function ActivityTimeline({ leadId, onClose }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch(`/api/leads/${leadId}/activity`);
        const data = await response.json();

        if (response.ok) {
          setActivities(data.activities);
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [leadId]);

  return (
    <section className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Lead Activity Timeline
          </h2>

          <button
            onClick={onClose}
            className="border border-slate-300 rounded-lg px-4 py-2"
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading activity...</p>
        ) : activities.length === 0 ? (
          <p className="text-slate-600">No activity found.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="border-l-4 border-slate-900 pl-4 py-2"
              >
                <h3 className="font-semibold text-slate-900">
                  {activity.action}
                </h3>

                <p className="text-slate-600 mt-1">
                  {activity.description}
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  By {activity.userId?.name || "System"} •{" "}
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}