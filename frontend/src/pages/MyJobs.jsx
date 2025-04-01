import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function MyJobs() {
  const [jobs, setJobs] = useState([]);           // מצב המשרות
  const [error, setError] = useState("");         // הודעת שגיאה (אם יש)
  const navigate = useNavigate();                 // לניווט בין דפים

  // 📌 שליפת כל המשרות של המגייס עם טעינת הקומפוננטה
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");  // טוקן למעבר אימות
        const res = await fetch("http://localhost:5000/api/jobs/my-jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "שגיאה בקבלת משרות");

        setJobs(data); // שמירה ב-state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobs();
  }, []);

  // 🧭 ניווט לדף הגשות למשרה מסוימת
  const handleViewApplications = (jobId) => {
    navigate(`/job-applications/${jobId}`);
  };

  // ❌ מחיקת משרה לאחר אישור
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את המשרה?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה במחיקת משרה");

      // הסרה מהטבלה בלי רענון
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">📄 המשרות שלי</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/add-job")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            ➕ הוסף משרה
          </button>
        </div>

        {/* הודעת שגיאה במידת הצורך */}
        {error && <p className="text-red-500">{error}</p>}

        {/* אם אין משרות */}
        {jobs.length === 0 ? (
          <p>לא פרסמת משרות עדיין.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded text-right">
              <thead>
                <tr className="bg-blue-100 text-blue-700">
                  <th className="py-2 px-4">כותרת</th>
                  <th className="py-2 px-4">חברה</th>
                  <th className="py-2 px-4">מיקום</th>
                  <th className="py-2 px-4">שכר</th>
                  <th className="py-2 px-4">הגשות</th>
                  <th className="py-2 px-4">פעולות</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{job.title}</td>
                    <td className="py-2 px-4">{job.company}</td>
                    <td className="py-2 px-4">{job.location}</td>
                    <td className="py-2 px-4">{job.salaryRange || "לא צוין"}</td>
                    <td className="py-2 px-4 text-center">{job._count.applications}</td>

                    {/* כפתורי פעולה */}
                    <td className="py-2 px-4 flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => handleViewApplications(job.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                      >
                        הגשות
                      </button>

                      <button
                        onClick={() => navigate(`/edit-job/${job.id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        עריכה
                      </button>

                      <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        מחיקה
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default MyJobs;
