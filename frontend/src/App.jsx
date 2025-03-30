import './App.css'
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
  <Route path="/" element={<Login />} />
  <Route
    path="/candidate"
    element={
      <PrivateRoute>
        <CandidateDashboard />
      </PrivateRoute>
    }
  />
  <Route
  path="/job-applications/:jobId"
  element={
    <PrivateRoute>
      <JobApplications />
    </PrivateRoute>
  }
/>
  <Route
  path="/my-jobs"
  element={
    <PrivateRoute>
      <MyJobs />
    </PrivateRoute>
  }
/>

  <Route
  path="/jobs"
  element={
    <PrivateRoute>
      <JobList />
    </PrivateRoute>
  }
  />
  <Route
  path="/my-applications"
  element={
    <PrivateRoute>
      <MyApplications />
    </PrivateRoute>
  }
  />

  <Route
    path="/recruiter"
    element={
      <PrivateRoute>
        <RecruiterDashboard />
      </PrivateRoute>
    }
  />
</Routes>
    </Router>
  );
}

export default App;


//recruiter@example.com	recruiter123
//candidate@example.com	candidate123