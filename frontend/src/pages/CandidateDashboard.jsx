import LogoutButton from "../components/LogoutButton";

function CandidateDashboard() {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold text-green-600">שלום מועמד 👤</h1>
        <p>כאן תוכל לצפות במשרות ולהגיש מועמדות</p>
        <LogoutButton />
      </div>
    );
  }
  export default CandidateDashboard;
  