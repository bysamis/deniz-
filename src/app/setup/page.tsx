"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [alreadySetUp, setAlreadySetUp] = useState(false);
  const [dbError, setDbError] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/setup")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setDbError(data.error);
        } else {
          setAlreadySetUp(data.hasUsers);
        }
        setChecking(false);
      })
      .catch(() => {
        setDbError("Sunucuya ulaşılamadı.");
        setChecking(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Hesap oluşturulamadı.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-teal-950 px-4">
      <div className="w-full max-w-sm fade-in">
        <div className="mb-8 text-center">
          <p className="text-sand-200/70 text-xs tracking-[0.3em] uppercase mb-2">
            Liman Koyu
          </p>
          <h1 className="font-display italic text-3xl text-sand-50">
            İlk Kurulum
          </h1>
        </div>

        <div className="bg-sand-50 rounded-lg p-7 shadow-xl border border-teal-800/20">
          {checking ? (
            <p className="text-sm text-ink/60 text-center">Kontrol ediliyor...</p>
          ) : dbError ? (
            <div>
              <p className="text-sm text-coral bg-coral-100 rounded-md px-3 py-2 mb-3">
                {dbError}
              </p>
              <p className="text-xs text-ink/60">
                Vercel proje ayarlarınızda <strong>DATABASE_URL</strong> ortam
                değişkeninin doğru girildiğinden ve bir veritabanı
                bağladığınızdan emin olun, sonra sayfayı yenileyin.
              </p>
            </div>
          ) : alreadySetUp ? (
            <div className="text-center">
              <p className="text-sm text-ink/70 mb-4">
                Bu site için zaten bir yönetici hesabı oluşturulmuş.
              </p>
              <Link
                href="/login"
                className="inline-block rounded-md bg-teal-900 px-4 py-2 text-sm text-sand-50 hover:bg-teal-800 transition-colors"
              >
                Giriş sayfasına git
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-ink/60 -mt-1 mb-1">
                Siteye ilk kez giriyorsunuz. Kendinize bir yönetici hesabı
                oluşturun.
              </p>
              <label className="block">
                <span className="block text-xs font-semibold text-ink/70 mb-1.5">
                  Adınız
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn. Ahmet Yılmaz"
                  className="input"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-ink/70 mb-1.5">
                  Kullanıcı adı
                </span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  placeholder="admin"
                  className="input"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-ink/70 mb-1.5">
                  Şifre (en az 6 karakter)
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input"
                />
              </label>

              {error && (
                <p className="text-sm text-coral bg-coral-100 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-teal-900 py-2.5 text-sand-50 font-medium hover:bg-teal-800 transition-colors disabled:opacity-60"
              >
                {loading ? "Oluşturuluyor..." : "Hesabı oluştur ve giriş yap"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
