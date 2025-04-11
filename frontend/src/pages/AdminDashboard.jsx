import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const statsData = await statsRes.json();
      if (!statsRes.ok) throw new Error(statsData.error || "שגיאה בסטטיסטיקות");

      const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      if (!usersRes.ok) throw new Error(usersData.error || "שגיאה ברשימת משתמשים");

      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את המשתמש?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה במחיקת המשתמש");

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert("המשתמש נמחק בהצלחה ✅");
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה בעדכון תפקיד");
  
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
  
      alert("התפקיד עודכן בהצלחה ✅");
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">📊 Admin Dashboard</h2>

        {error && <p className="text-red-500">{error}</p>}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 shadow rounded text-center">
              <p className="text-sm text-gray-500">סה"כ משתמשים</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-4 shadow rounded text-center">
              <p className="text-sm text-gray-500">מגייסים</p>
              <p className="text-3xl font-bold">{stats.recruiters}</p>
            </div>
            <div className="bg-white p-4 shadow rounded text-center">
              <p className="text-sm text-gray-500">מועמדים</p>
              <p className="text-3xl font-bold">{stats.candidates}</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold mb-3">📋 רשימת משתמשים</h3>
          <table className="w-full text-right bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">שם</th>
                <th className="p-2">אימייל</th>
                <th className="p-2">תפקיד</th>
                <th className="p-2">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">{user.name || "—"}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    {user.role === "admin" ? (
                      "admin"
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="candidate">מועמד</option>
                        <option value="recruiter">מגייס</option>
                      </select>
                    )}
                  </td>
                  <td className="p-2">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        מחק
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
