export default function LeadTable({ leads }) {
  if (!leads || leads.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-slate-600">No leads found.</p>
      </section>
    );
  }

  function getScoreBadge(score) {
    if (score === "High") {
      return "bg-red-100 text-red-700";
    }

    if (score === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Leads</h2>

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
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b border-slate-100">
              <td className="py-3 pr-4">
                <p className="font-medium text-slate-900">{lead.name}</p>
                <p className="text-sm text-slate-500">{lead.email}</p>
              </td>

              <td className="py-3 pr-4">{lead.phone}</td>
              <td className="py-3 pr-4">{lead.propertyInterest}</td>
              <td className="py-3 pr-4">
                PKR {Number(lead.budget).toLocaleString()}
              </td>
              <td className="py-3 pr-4">{lead.status}</td>

              <td className="py-3 pr-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getScoreBadge(lead.score)}`}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}