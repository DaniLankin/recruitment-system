import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/jobs/my-jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "שגיאה בשליפת משרות");

        setJobs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">📤 המשרות שפרסמת</h2>

        {error && <p className="text-red-500">{error}</p>}

        {jobs.length === 0 ? (
          <p>אין משרות להצגה כרגע.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.description}</p>
                <p className="text-sm text-gray-500">מספר הגשות: {job._count?.applications || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyJobs;
