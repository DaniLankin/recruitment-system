import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";


function CandidateDashboard() {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold text-green-600">שלום מועמד 👤</h1>
        <p>כאן תוכל לצפות במשרות ולהגיש מועמדות</p>
        <Link to="/my-applications" className="text-blue-600 underline">
            לצפייה בהגשות שלי
        </Link>

        <LogoutButton />
      </div>
    );
  }
  export default CandidateDashboard;
  