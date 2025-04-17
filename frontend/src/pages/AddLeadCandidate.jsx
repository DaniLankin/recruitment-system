import { useState } from "react";
import Navbar from "../components/Navbar";

function AddLeadCandidate() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    desiredRole: "",
    date: "",
    age: "",
    gender: "",
    experience: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lead-candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה בשליחה");

      setSuccess("✅ המועמד נוסף בהצלחה");
      setForm({
        firstName: "",
        lastName: "",
        desiredRole: "",
        date: "",
        age: "",
        gender: "",
        experience: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">➕ הוספת מועמד לפנייה חוזרת</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-4 rounded">
          <input name="firstName" placeholder="שם פרטי" value={form.firstName} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="lastName" placeholder="שם משפחה" value={form.lastName} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="desiredRole" placeholder="תפקיד מבוקש" value={form.desiredRole} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="age" type="number" placeholder="גיל" value={form.age} onChange={handleChange} className="w-full p-2 border rounded" />
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">בחר מגדר</option>
            <option value="זכר">זכר</option>
            <option value="נקבה">נקבה</option>
            <option value="אחר">אחר</option>
          </select>
          <input name="experience" type="number" placeholder="שנות ניסיון" value={form.experience} onChange={handleChange} className="w-full p-2 border rounded" />

          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">שמור מועמד</button>
        </form>
      </div>
    </>
  );
}

export default AddLeadCandidate;
