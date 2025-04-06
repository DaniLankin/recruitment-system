import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const applyToJob = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("עליך להתחבר כדי להגיש מועמדות");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "שגיאה בהגשה");
      }

      alert("ההגשה בוצעה בהצלחה ✅");
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/api/jobs");
    const data = await res.json();
    setJobs(data);
  };

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/applications/by-candidate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setApplications(data);
  };

  useEffect(() => {
    fetchJobs();
    const token = localStorage.getItem("token");
    if (token) fetchApplications();
  }, []);

  // חיפוש אוטומטי בזמן הקלדה (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      const searchJobs = async () => {
        try {
          if (!searchTerm.trim()) {
            fetchJobs();
            return;
          }

          const res = await fetch(
            `http://localhost:5000/api/jobs/search?query=${encodeURIComponent(searchTerm)}`
          );
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "שגיאה בחיפוש");

          setJobs(data);
        } catch (err) {
          setError(err.message);
        }
      };

      searchJobs();
    }, 400); // ממתין 400ms

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">📄 רשימת משרות</h2>

        {/* 🔍 שורת חיפוש */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="חפש לפי תיאור, חברה, מיקום..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {jobs.length === 0 && !error ? (
          <p>אין משרות להצגה כרגע.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-4 shadow rounded">
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
                <p className="mt-2 text-sm text-gray-700">{job.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  שכר: {job.salaryRange || "לא צוין"}
                </p>

                {applications.some((app) => app.jobId === job.id) ? (
                  <button
                    disabled
                    className="mt-3 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                  >
                    כבר הגשת
                  </button>
                ) : (
                  <button
                    onClick={() => applyToJob(job.id)}
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    הגש מועמדות
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default JobList;
