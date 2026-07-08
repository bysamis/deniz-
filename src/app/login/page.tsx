"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-teal-950 px-4">
      <div className="w-full max-w-sm fade-in">
        <div className="mb-8 text-center">
          <p className="text-sand-200/70 text-xs tracking-[0.3em] uppercase mb-2">
            Liman Koyu
          </p>
          <h1 className="font-display italic text-3xl text-sand-50">
            Rezervasyon Panosu
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-sand-50 rounded-lg p-7 shadow-xl border border-teal-800/20"
        >
          <div className="mb-4">
            <label className="block text-xs font-semibold text-ink/70 mb-1.5">
              Kullanıcı adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full rounded-md border border-teal-900/15 bg-white px-3 py-2.5 text-ink outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
              placeholder="yetkili"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-ink/70 mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-teal-900/15 bg-white px-3 py-2.5 text-ink outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-coral bg-coral-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-teal-900 py-2.5 text-sand-50 font-medium hover:bg-teal-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>

        <p className="text-center text-xs text-sand-200/60 mt-5">
          Siteye ilk kez mi giriyorsunuz?{" "}
          <a href="/setup" className="underline hover:text-sand-50">
            Yönetici hesabı oluştur
          </a>
        </p>
      </div>
    </main>
  );
}
