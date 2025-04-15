import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/by-job/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "שגיאה בשליפת הגשות");

        setApplications(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchApplications();
  }, [jobId]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "שגיאה בעדכון סטטוס");

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      alert("הסטטוס עודכן בהצלחה ✅");
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

  const handleDelete = async (applicationId) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך להסיר את ההגשה?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/${applicationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "שגיאה במחיקה");

      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      alert("ההגשה הוסרה בהצלחה ✅");
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

  const filteredApps = filter === "all"
    ? applications
    : applications.filter((app) => app.status === filter);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          📋 הגשות למשרה #{jobId}
        </h2>

        <div className="flex gap-3 mb-4 flex-wrap">
          {[
            { label: "הכל", value: "all", color: "bg-blue-600" },
            { label: "התקבלו", value: "accepted", color: "bg-green-600" },
            { label: "נדחו", value: "rejected", color: "bg-red-600" },
            { label: "ממתינים", value: "pending", color: "bg-yellow-500" },
          ].map(({ label, value, color }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1 rounded ${
                filter === value ? `${color} text-white` : "bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {filteredApps.length === 0 ? (
          <p>לא נמצאו הגשות לסטטוס זה.</p>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white p-4 shadow rounded">
                <p><strong>מועמד:</strong> {app.candidate?.name || "לא ידוע"}</p>
                <p><strong>אימייל:</strong> {app.candidate?.email}</p>
                {app.resume && (
                  <p>
                    <strong>קורות חיים:</strong>{" "}
                    <a
                      href={app.resume.replace("/upload/", "/upload/fl_attachment/")}
                      className="text-blue-600 underline"
                    >
                      download
                    </a>
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <p><strong>סטטוס:</strong> {app.status}</p>
                  <button
                    onClick={() => updateStatus(app.id, "accepted")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    קבל
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    דחה
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, "pending")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    המתן
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    הסר הגשה
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default JobApplications;
