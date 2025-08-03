import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!password) {
      return setMessage("Password is required");
    }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_API + `auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
