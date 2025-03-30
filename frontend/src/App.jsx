import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PrivateRoute from "./components/PrivateRoute";
import JobList from "./pages/JobList";
import MyApplications from "./pages/MyApplications";
import MyJobs from "./pages/MyJobs";
import JobApplications from "./pages/JobApplications";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 דף התחברות */}
        <Route path="/" element={<Login />} />

        {/* 🧑‍💼 מגייסים */}
        <Route
          path="/recruiter"
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-jobs"
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <MyJobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-applications/:jobId"
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <JobApplications />
            </PrivateRoute>
          }
        />

        {/* 👨‍💻 מועמדים */}
        <Route
          path="/candidate"
          element={
            <PrivateRoute allowedRoles={["candidate"]}>
              <CandidateDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <PrivateRoute allowedRoles={["candidate"]}>
              <JobList />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <PrivateRoute allowedRoles={["candidate"]}>
              <MyApplications />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
