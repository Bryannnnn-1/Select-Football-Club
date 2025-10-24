import { useState } from "react";
import "./AdminLoginModal.css";

export default function AdminLoginModal({ onLogin, onCancel }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ADMIN_PASSWORD = "Haaland@125546";

    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <div className="buttons">
            <button type="submit">Login</button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
