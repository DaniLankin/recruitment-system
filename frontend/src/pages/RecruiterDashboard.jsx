import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/recruiter/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "שגיאה בדשבורד");

        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">📊 דשבורד מגייס</h2>

        {error && <p className="text-red-500">{error}</p>}

        {!data ? (
          <p>טוען נתונים...</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="bg-white p-4 shadow rounded">
              <h3 className="font-bold text-lg text-blue-600">סה"כ משרות</h3>
              <p className="text-3xl">{data.totalJobs}</p>
            </div>

            <div className="bg-white p-4 shadow rounded">
              <h3 className="font-bold text-lg text-green-600">סה"כ הגשות</h3>
              <p className="text-3xl">{data.totalApplications}</p>
            </div>

            <div className="bg-white p-4 shadow rounded">
              <h3 className="font-bold text-lg text-gray-700 mb-2">פילוח סטטוסים</h3>
              <ul className="space-y-1">
                <li>🕓 ממתינים: {data.statusCount.pending || 0}</li>
                <li>✅ התקבלו: {data.statusCount.accepted || 0}</li>
                <li>❌ נדחו: {data.statusCount.rejected || 0}</li>
              </ul>
            </div>

            <div className="bg-white p-4 shadow rounded">
              <h3 className="font-bold text-lg text-indigo-600">📝 משרה אחרונה</h3>
              {data.lastJob ? (
                <>
                  <p>{data.lastJob.title}</p>
                  <p className="text-sm text-gray-500">
                    פורסם ב־{new Date(data.lastJob.createdAt).toLocaleString("he-IL")}
                  </p>
                </>
              ) : (
                <p>לא פורסמו משרות</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RecruiterDashboard;
