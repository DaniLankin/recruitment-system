import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";



function CandidateDashboard() {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold text-green-600">שלום מועמד 👤</h1>
        <p>כאן תוכל לצפות במשרות ולהגיש מועמדות</p>
      </div>
    </>
  );
  }
  export default CandidateDashboard;
  