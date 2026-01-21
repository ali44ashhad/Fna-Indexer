import { useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "submittor_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setToken(token) {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

function Login({ apiBaseUrl, onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      if (!data?.token) {
        throw new Error("Login response missing token");
      }

      onLoggedIn(data.token);
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Login</h1>
        <p className="text-sm text-gray-500 mb-4">
          Please login to submit URLs.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error ? (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

function BulkSubmitUrls({ onLogout }) {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY =
    "c7ec6db6f4fe8596931578d61d0374118e21f26889590f6835c0d3b61474affd"; // ❌ move to backend in production

  const submitUrls = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    for (const url of urlList) {
      try {
        const res = await fetch(
          `https://rocketindexer.com/api/index.php?token=${API_KEY}&endpoint=submit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          }
        );

        const data = await res.json();

        setResults((prev) => [
          ...prev,
          {
            url,
            success: data.success,
            message: data.message,
            trackingIds: data?.data?.tracking_ids || [],
          },
        ]);
      } catch (error) {
        setResults((prev) => [
          ...prev,
          {
            url,
            success: false,
            message: error.message,
          },
        ]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-xl font-semibold text-gray-800">
            Bulk URL Submission
          </h1>
          <button
            type="button"
            onClick={onLogout}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Logout
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">Enter one URL per line</p>

        <form onSubmit={submitUrls} className="space-y-4">
          <textarea
            rows={6}
            placeholder={`https://example.com/page-1\nhttps://example.com/page-2`}
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Submitting URLs..." : "Submit URLs"}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">
              Submission Results
            </h2>

            <ul className="max-h-64 overflow-y-auto text-sm space-y-2">
              {results.map((r, i) => (
                <li
                  key={i}
                  className={`border rounded-lg p-2 ${
                    r.success
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <p className="font-medium break-all">{r.url}</p>
                  <p>{r.message}</p>
                  {r.trackingIds?.length > 0 && (
                    <p className="text-xs">
                      Tracking ID: {r.trackingIds.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:5005",
    []
  );

  const [token, setTokenState] = useState("");

  useEffect(() => {
    setTokenState(getToken());
  }, []);

  const handleLoggedIn = (newToken) => {
    setToken(newToken);
    setTokenState(newToken);
  };

  const handleLogout = () => {
    setToken("");
    setTokenState("");
  };

  if (!token) {
    return <Login apiBaseUrl={apiBaseUrl} onLoggedIn={handleLoggedIn} />;
  }

  return <BulkSubmitUrls onLogout={handleLogout} />;
}
