import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import NavLinks from "@/components/NavLinks";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-teal-950 text-sand-50 px-5 py-6">
        <Link href="/" className="mb-10 block">
          <p className="text-[10px] tracking-[0.3em] uppercase text-sand-200/60">
            Liman Koyu
          </p>
          <p className="font-display italic text-xl">Rezervasyon Panosu</p>
        </Link>

        <NavLinks />

        <div className="mt-auto pt-6 border-t border-sand-50/10">
          <p className="text-xs text-sand-200/60 mb-2">
            {session?.name || session?.username}
          </p>
          <div className="flex items-center justify-between">
            <LogoutButton />
            <Link
              href="/privacy"
              target="_blank"
              className="text-xs text-sand-200/50 hover:text-sand-200 underline"
            >
              KVKK
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between bg-teal-950 text-sand-50 px-4 py-3">
          <span className="font-display italic text-lg">Liman Koyu</span>
          <LogoutButton compact />
        </header>
        <div className="tide-line" />
        <main className="flex-1 bg-sand p-5 md:p-8">{children}</main>
        <nav className="md:hidden flex justify-around bg-teal-950 text-sand-50/80 text-xs py-2 border-t border-sand-50/10">
          <NavLinks mobile />
        </nav>
      </div>
    </div>
  );
}
