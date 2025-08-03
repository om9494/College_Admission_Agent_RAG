import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      return setMessage("Email is required");
    }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_API + `auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
