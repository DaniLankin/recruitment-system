import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";


function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("לא מחובר");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/by-candidate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "שגיאה בקבלת נתונים");
        }

        setApplications(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-700">📥 ההגשות שלי</h2>
  
        {error && <p className="text-red-500 mb-4">{error}</p>}
  
        {applications.length === 0 ? (
          <p>לא נמצאו הגשות.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-4 shadow rounded">
                <p className="text-lg font-semibold">{app.job?.title || "משרה לא ידועה"}</p>
                <p className="text-gray-600">סטטוס: {app.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
  
}

export default MyApplications;
