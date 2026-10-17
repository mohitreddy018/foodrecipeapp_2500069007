
import { useState } from "react";

const API_URL = "http://localhost:5000/api/auth";

export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (mode === "signup") {
        setMessage("Account created! Please log in.");
        setMode("login");
        setPassword("");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      onLogin(data.user);
      onClose();
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button type="button" onClick={onClose} style={styles.close}>
          ×
        </button>

        <h2>{mode === "login" ? "Welcome Back!" : "Create Account"}</h2>
        <p>
          {mode === "login"
            ? "Log in to your Food Recipe account."
            : "Join us and share your favourite recipes."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              style={styles.input}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {message && <p role="status">{message}</p>}

          <button style={styles.submit} type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log In"
              : "Sign Up"}
          </button>
        </form>

        <p>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            style={styles.link}
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {mode === "login" ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  modal: {
    position: "relative",
    background: "#fff",
    color: "#222",
    padding: 30,
    borderRadius: 16,
    width: "100%",
    maxWidth: 420,
    boxSizing: "border-box"
  },
  close: {
    position: "absolute",
    right: 15,
    top: 10,
    border: 0,
    background: "transparent",
    fontSize: 28,
    cursor: "pointer"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 15
  },
  submit: {
    width: "100%",
    padding: 12,
    marginTop: 12,
    border: 0,
    borderRadius: 8,
    background: "#e85d2a",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },
  link: {
    border: 0,
    background: "transparent",
    color: "#d94e1f",
    cursor: "pointer",
    fontWeight: "bold"
  }
};
