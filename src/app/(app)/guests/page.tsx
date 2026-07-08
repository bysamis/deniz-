"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Search, ChevronDown, Phone } from "lucide-react";

type Guest = {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  _count: { reservations: number };
  reservations: {
    id: string;
    checkIn: string;
    checkOut: string;
    status: string;
    room: { name: string };
  }[];
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/guests")
      .then((r) => r.json())
      .then((data) => {
        setGuests(data);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () =>
      guests.filter(
        (g) =>
          g.fullName.toLowerCase().includes(search.toLowerCase()) ||
          g.phone?.includes(search)
      ),
    [guests, search]
  );

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-teal-950 mb-6">Misafirler</h1>

      <div className="relative max-w-xs mb-5">
        <Search
          size={15}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-900/40"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsim veya telefon ara..."
          className="input pl-8"
        />
      </div>

      {loading ? (
        <p className="text-teal-900/50 text-sm">Yükleniyor...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-teal-900/40 bg-white/50 border border-dashed border-teal-900/15 rounded-md px-3 py-6 text-center">
          Misafir bulunamadı.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((g) => {
            const isOpen = expanded === g.id;
            return (
              <div
                key={g.id}
                className="rounded-md border border-teal-900/10 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : g.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-teal-950">
                      {g.fullName}
                    </p>
                    <p className="text-xs text-teal-900/50 flex items-center gap-1">
                      {g.phone && (
                        <>
                          <Phone size={11} /> {g.phone} ·{" "}
                        </>
                      )}
                      {g._count.reservations} konaklama
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-teal-900/40 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-teal-900/10 bg-sand-100/50 px-4 py-3 flex flex-col gap-1.5">
                    {g.reservations.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-teal-950">{r.room.name}</span>
                        <span className="text-teal-900/50">
                          {format(new Date(r.checkIn), "d MMM yyyy", { locale: tr })}
                          {" – "}
                          {format(new Date(r.checkOut), "d MMM yyyy", { locale: tr })}
                          {r.status === "cancelled" && (
                            <span className="ml-1.5 text-coral">(iptal)</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
