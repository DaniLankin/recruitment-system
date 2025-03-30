import Navbar from "../components/Navbar";

function MyJobs() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-700">📤 המשרות שפרסמת</h2>
        <p>כאן יוצגו כל המשרות שהמגייס פרסם.</p>
      </div>
    </>
  );
}

export default MyJobs;
