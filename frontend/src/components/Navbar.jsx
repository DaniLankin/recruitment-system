import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const dashboardPath =
    role === "candidate" ? "/candidate" :
    role === "recruiter" ? "/recruiter" :
    "/";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center flex-wrap gap-x-3 rtl:space-x-reverse">
          {[
            { to: dashboardPath, label: "🏠 מסך ראשי" },
            ...(role === "candidate"
              ? [
                  { to: "/jobs", label: "משרות" },
                  { to: "/my-applications", label: "ההגשות שלי" },
                ]
              : role === "recruiter"
              ? [{ to: "/my-jobs", label: "המשרות שלי" }]
              : []),
          ].map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-blue-100 transition whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm mt-2 sm:mt-0"
        >
          התנתק
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
