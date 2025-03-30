import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function EditJob() {
  const { id } = useParams(); // מזהה המשרה מה-URL
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 📌 שליפה ראשונית של המשרה
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jobs = await res.json();

        const found = jobs.find((j) => j.id === parseInt(id));
        if (!found) throw new Error("משרה לא נמצאה");

        setJob(found);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJob();
  }, [id]);

  // ✏️ שינוי ערך בטופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ שליחה לשרת
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה בעדכון משרה");

      navigate("/my-jobs"); // חזרה לרשימת משרות
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">✏️ עריכת משרה</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!job ? (
          <p>טוען נתוני משרה...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">כותרת</label>
              <input
                type="text"
                name="title"
                value={job.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">תיאור</label>
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">חברה</label>
              <input
                type="text"
                name="company"
                value={job.company}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">מיקום</label>
              <input
                type="text"
                name="location"
                value={job.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">טווח שכר</label>
              <input
                type="text"
                name="salaryRange"
                value={job.salaryRange || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              שמור שינויים
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default EditJob;
