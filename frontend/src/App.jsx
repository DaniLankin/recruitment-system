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
import EditJob from "./pages/EditJob";
import AddJob from "./pages/AddJob";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import AddLeadCandidate from "./pages/AddLeadCandidate";
import RecruiterRoute from "./components/RecruiterRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 דף התחברות */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
/>
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
          path="/add-lead-candidate"
          element={
            <RecruiterRoute>
              <AddLeadCandidate />
            </RecruiterRoute>
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
        <Route path="/add-job" 
        element={
          <PrivateRoute allowedRoles={["recruiter"]}>
            <AddJob />
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
        <Route
          path="/edit-job/:id"
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <EditJob />
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
