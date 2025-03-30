import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/applications/by-job/${jobId}`, {
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
      const res = await fetch(`http://localhost:5000/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "שגיאה בעדכון סטטוס");

      // עדכון סטטוס ברשימה בלי ריפרוש
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">📋 הגשות למשרה #{jobId}</h2>

        {error && <p className="text-red-500">{error}</p>}

        {applications.length === 0 ? (
          <p>אין הגשות עדיין למשרה זו.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-4 shadow rounded">
                <p><strong>מועמד:</strong> {app.candidate?.name || "לא ידוע"}</p>
                <p><strong>אימייל:</strong> {app.candidate?.email}</p>
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
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                >
                  המתן
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
