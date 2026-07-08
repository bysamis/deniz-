"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarRange, Users } from "lucide-react";

const links = [
  { href: "/", label: "Panel", icon: LayoutGrid },
  { href: "/reservations", label: "Rezervasyonlar", icon: CalendarRange },
  { href: "/guests", label: "Misafirler", icon: Users },
];

export default function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                active ? "text-sand-50" : "text-sand-50/60"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-sand-50/10 text-sand-50 font-medium"
                : "text-sand-200/70 hover:bg-sand-50/5 hover:text-sand-50"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
