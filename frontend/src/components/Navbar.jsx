import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center flex-wrap">
      <div className="text-xl font-bold mb-2 md:mb-0">מערכת השמה</div>

      <div className="flex gap-4 flex-wrap items-center">
        {user?.role === "recruiter" && (
          <>
            <Link to="/dashboard" className="hover:underline">דשבורד</Link>
            <Link to="/my-jobs" className="hover:underline">המשרות שלי</Link>
            <Link to="/add-job" className="hover:underline">הוסף משרה</Link>
            <Link to="/add-lead-candidate" className="hover:underline">➕ הוסף מועמד</Link>
            console.log("User from Navbar:", user);

          </>
        )}

        {user?.role === "candidate" && (
          <>
            <Link to="/jobs" className="hover:underline">משרות</Link>
            <Link to="/my-applications" className="hover:underline">הגשות שלי</Link>
          </>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" className="hover:underline">ניהול</Link>
        )}

        <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
          התנתק
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
