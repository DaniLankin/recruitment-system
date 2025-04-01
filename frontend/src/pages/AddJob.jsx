import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import { useNavigate } from "react-router-dom";

function AddJob() {
  const navigate = useNavigate();

  // פונקציה שתופעל כשהטופס נשלח
  const handleCreate = async (form) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "שגיאה בהוספת משרה");

    navigate("/my-jobs");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-4">➕ הוספת משרה חדשה</h2>
        <JobForm mode="add" onSubmit={handleCreate} />
      </div>
    </>
  );
}

export default AddJob;
