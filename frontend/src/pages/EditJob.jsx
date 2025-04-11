import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";

function EditJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // שליפת נתוני המשרה הקיימת
  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/my-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const jobs = await res.json();
      const found = jobs.find((j) => j.id === parseInt(id));
      if (!found) {
        setError("משרה לא נמצאה");
      } else {
        setJob(found);
      }
    };

    fetchJob();
  }, [id]);

  // עדכון משרה
  const handleUpdate = async (form) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "שגיאה בעדכון משרה");

    navigate("/my-jobs");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">✏️ עריכת משרה</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!job ? (
          <p>טוען נתוני משרה...</p>
        ) : (
          <JobForm mode="edit" initialValues={job} onSubmit={handleUpdate} />
        )}
      </div>
    </>
  );
}

export default EditJob;
