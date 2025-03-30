import { useState } from "react";
import { useNavigate } from "react-router-dom";


console.log("Login component loaded");

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // שמירת הטוקן והנתונים
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ניווט (לפי תפקיד)
      alert("Login successful!");
      if (data.user.role === "candidate") {
        navigate("/candidate");
      } else if (data.user.role === "recruiter") {
        navigate("/recruiter");
      }

    } catch (err) {
      setError("Network error");
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">התחברות</h2>
        <input
          type="email"
          placeholder="אימייל"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="סיסמה"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          התחבר
        </button>
      </form>
    </div>
  );
}

export default Login;
