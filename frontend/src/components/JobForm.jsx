import { useState, useEffect } from "react";

function JobForm({ mode, initialValues = {}, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salaryRange: "",
  });

  const [error, setError] = useState("");

  // עדכון ערכים קיימים בעת עריכה
  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setForm(initialValues);
    }
  }, [mode, initialValues]);

  // שינוי ערכים בטופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // שליחת טופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || "שגיאה בטופס");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block mb-1">כותרת</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">תיאור</label>
        <textarea
          name="description"
          value={form.description}
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
          value={form.company}
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
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">טווח שכר</label>
        <input
          type="text"
          name="salaryRange"
          value={form.salaryRange}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className={`${
          mode === "edit" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
        } text-white px-6 py-2 rounded`}
      >
        {mode === "edit" ? "שמור שינויים" : "פרסם משרה"}
      </button>
    </form>
  );
}

export default JobForm;
