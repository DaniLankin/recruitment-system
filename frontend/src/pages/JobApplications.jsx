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
                <p><strong>סטטוס:</strong> {app.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default JobApplications;
