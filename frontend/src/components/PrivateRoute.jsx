import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // אם אין טוקן או משתמש בכלל – שולח לדף התחברות
  if (!token || !user) {
    return <Navigate to="/" />;
  }

  // אם יש roles מוגדרים, אבל המשתמש לא מתאים – שולח הביתה
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // הכל תקין – מחזיר את ה־children (כלומר את הרכיב המוגן)
  return children;
}

export default PrivateRoute;
