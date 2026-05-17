import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const API_V1 = `${API_URL}/api/v1`;
const TOKEN_KEY = "poe_auth_token";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_V1}${path}`, options);

  if (!response.ok) {
    let detail = "Ha ocurrido un error";

    try {
      const body = await response.json();
      if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
        detail = body.detail[0].msg;
      }
    } catch {
      detail = `Error ${response.status}`;
    }

    throw new Error(detail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function AuthCard() {
  const [activeTab, setActiveTab] = useState("login");
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  const authHeaders = useMemo(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const currentUser = await apiRequest("/users/me", {
          headers: {
            ...authHeaders,
            Accept: "application/json",
          },
        });
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setUser(null);
        setStatus({ type: "error", message: "Tu sesión ha expirado. Inicia sesión de nuevo." });
      }
    }

    loadCurrentUser();
  }, [token, authHeaders]);

  async function onLogin(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const form = new FormData(event.currentTarget);

    try {
      const payload = new URLSearchParams();
      payload.append("username", String(form.get("email") || ""));
      payload.append("password", String(form.get("password") || ""));

      const data = await apiRequest("/auth/jwt/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: payload,
      });

      localStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
      setStatus({ type: "success", message: "Sesión iniciada correctamente." });
      event.currentTarget.reset();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      setStatus({ type: "success", message: "Usuario creado. Ya puedes iniciar sesión." });
      setActiveTab("login");
      event.currentTarget.reset();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function onForgotPassword(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setStatus({
        type: "success",
        message: "Solicitud enviada. Revisa tu correo o el log del backend para el token.",
      });
      event.currentTarget.reset();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function onLogout() {
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      await apiRequest("/auth/jwt/logout", {
        method: "POST",
        headers: {
          ...authHeaders,
          Accept: "application/json",
        },
      });
    } catch {
      // For JWT strategy there is no server-side token invalidation, local cleanup is enough.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setUser(null);
      setStatus({ type: "success", message: "Sesión cerrada." });
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="backdrop" />
      <section className="auth-card">
        <header className="auth-header">
          <p className="kicker">PathOfException</p>
          <h1>Autenticación</h1>
          <p className="subtitle">Frontend React conectado a FastAPI Users</p>
        </header>

        {user ? (
          <div className="session-box">
            <h2>Sesión activa</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Usuario ID:</strong> {user.id}</p>
            <p><strong>Verificado:</strong> {user.is_verified ? "Sí" : "No"}</p>
            <button className="primary" onClick={onLogout} disabled={loading} type="button">
              {loading ? "Cerrando..." : "Cerrar sesión"}
            </button>
          </div>
        ) : (
          <>
            <nav className="tabs" aria-label="Auth tabs">
              <button className={activeTab === "login" ? "tab active" : "tab"} onClick={() => setActiveTab("login")} type="button">Login</button>
              <button className={activeTab === "register" ? "tab active" : "tab"} onClick={() => setActiveTab("register")} type="button">Registro</button>
              <button className={activeTab === "forgot" ? "tab active" : "tab"} onClick={() => setActiveTab("forgot")} type="button">Recuperar</button>
            </nav>

            {activeTab === "login" && (
              <form className="form" onSubmit={onLogin}>
                <label>Email</label>
                <input name="email" type="email" required placeholder="tu@email.com" />
                <label>Password</label>
                <input name="password" type="password" required placeholder="••••••••" />
                <button className="primary" type="submit" disabled={loading}>
                  {loading ? "Accediendo..." : "Entrar"}
                </button>
              </form>
            )}

            {activeTab === "register" && (
              <form className="form" onSubmit={onRegister}>
                <label>Email</label>
                <input name="email" type="email" required placeholder="tu@email.com" />
                <label>Password</label>
                <input name="password" type="password" minLength={8} required placeholder="Mínimo 8 caracteres" />
                <button className="primary" type="submit" disabled={loading}>
                  {loading ? "Creando..." : "Crear cuenta"}
                </button>
              </form>
            )}

            {activeTab === "forgot" && (
              <form className="form" onSubmit={onForgotPassword}>
                <label>Email</label>
                <input name="email" type="email" required placeholder="tu@email.com" />
                <button className="primary" type="submit" disabled={loading}>
                  {loading ? "Enviando..." : "Solicitar recuperación"}
                </button>
              </form>
            )}
          </>
        )}

        {status.message && (
          <p className={status.type === "error" ? "message error" : "message success"}>{status.message}</p>
        )}
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthCard />
  </React.StrictMode>,
);
