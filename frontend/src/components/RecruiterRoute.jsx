import { Navigate } from "react-router-dom";

function RecruiterRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || user.role !== "recruiter") {
    return <Navigate to="/" />;
  }

  return children;
}

export default RecruiterRoute;
