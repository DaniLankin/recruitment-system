import { useEffect, useState } from "react";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
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
  

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "שגיאה בטעינת משרות");
        }

        setJobs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📄 רשימת משרות</h2>

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

    <button
      onClick={() => applyToJob(job.id)}
      className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      הגש מועמדות
    </button>
  </div>
))}

        </div>
      )}
    </div>
  );
}

export default JobList;
