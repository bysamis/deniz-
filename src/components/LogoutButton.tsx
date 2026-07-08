"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (compact) {
    return (
      <button onClick={handleLogout} aria-label="Çıkış yap">
        <LogOut size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-xs text-sand-200/70 hover:text-sand-50 transition-colors"
    >
      <LogOut size={14} />
      Çıkış yap
    </button>
  );
}
