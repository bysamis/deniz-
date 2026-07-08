"use client";

import { useEffect, useMemo, useState } from "react";
import { format, addDays, isWithinInterval, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";
import { Plus, X } from "lucide-react";
import NewReservationModal from "@/components/NewReservationModal";

type Reservation = {
  id: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: string;
  room: { id: string; name: string };
  guest: { fullName: string; phone: string | null };
};

type Room = { id: string; name: string; status: string };

const DAYS_AHEAD = 14;

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"calendar" | "list">("calendar");
  const [showNew, setShowNew] = useState(false);

  async function load() {
    setLoading(true);
    const [resR, roomR] = await Promise.all([
      fetch("/api/reservations"),
      fetch("/api/rooms"),
    ]);
    setReservations(await resR.json());
    setRooms(await roomR.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const today = startOfDay(new Date());
  const days = useMemo(
    () => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i)),
    [today]
  );

  const upcoming = reservations
    .filter((r) => r.status !== "cancelled" && new Date(r.checkOut) >= today)
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  const past = reservations
    .filter((r) => r.status !== "cancelled" && new Date(r.checkOut) < today)
    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

  async function cancelReservation(id: string) {
    if (!confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    load();
  }

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <h1 className="font-display text-3xl text-teal-950">Rezervasyonlar</h1>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-teal-900/15 overflow-hidden text-sm">
            <button
              onClick={() => setTab("calendar")}
              className={`px-3 py-1.5 ${
                tab === "calendar"
                  ? "bg-teal-900 text-sand-50"
                  : "bg-white text-teal-900"
              }`}
            >
              Takvim
            </button>
            <button
              onClick={() => setTab("list")}
              className={`px-3 py-1.5 ${
                tab === "list" ? "bg-teal-900 text-sand-50" : "bg-white text-teal-900"
              }`}
            >
              Liste
            </button>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 rounded-md bg-teal-900 px-4 py-2 text-sm font-medium text-sand-50 hover:bg-teal-800 transition-colors"
          >
            <Plus size={16} /> Yeni rezervasyon
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-teal-900/50 text-sm">Yükleniyor...</p>
      ) : tab === "calendar" ? (
        <CalendarGrid rooms={rooms} reservations={reservations} days={days} />
      ) : (
        <div className="flex flex-col gap-8">
          <ListSection
            title={`Güncel / yaklaşan (${upcoming.length})`}
            items={upcoming}
            onCancel={cancelReservation}
          />
          <ListSection title={`Geçmiş (${past.length})`} items={past} muted />
        </div>
      )}

      {showNew && (
        <NewReservationModal
          rooms={rooms}
          onClose={() => setShowNew(false)}
          onCreated={() => {
            setShowNew(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function CalendarGrid({
  rooms,
  reservations,
  days,
}: {
  rooms: Room[];
  reservations: Reservation[];
  days: Date[];
}) {
  if (rooms.length === 0) {
    return <p className="text-sm text-teal-900/50">Önce oda ekleyin.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-teal-900/10 bg-white">
      <table className="min-w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white text-left px-3 py-2 border-b border-teal-900/10 font-semibold text-teal-900/70 min-w-[120px]">
              Oda
            </th>
            {days.map((d) => (
              <th
                key={d.toISOString()}
                className="px-2 py-2 border-b border-l border-teal-900/10 font-medium text-teal-900/60 whitespace-nowrap"
              >
                {format(d, "d MMM", { locale: tr })}
                <div className="text-[10px] text-teal-900/40 capitalize">
                  {format(d, "EEE", { locale: tr })}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="sticky left-0 bg-white px-3 py-2 border-b border-teal-900/10 font-medium text-teal-950 whitespace-nowrap">
                {room.name}
              </td>
              {days.map((d) => {
                const match = reservations.find(
                  (r) =>
                    r.room.id === room.id &&
                    r.status !== "cancelled" &&
                    isWithinInterval(d, {
                      start: startOfDay(new Date(r.checkIn)),
                      end: addDays(startOfDay(new Date(r.checkOut)), -1),
                    })
                );
                return (
                  <td
                    key={d.toISOString()}
                    title={match ? match.guest.fullName : "Boş"}
                    className={`px-2 py-2 border-b border-l border-teal-900/10 text-center ${
                      match ? "bg-coral-100" : "bg-sage-100/50"
                    }`}
                  >
                    {match ? (
                      <span className="text-coral font-medium block truncate max-w-[80px]">
                        {match.guest.fullName.split(" ")[0]}
                      </span>
                    ) : (
                      <span className="text-sage/60">·</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListSection({
  title,
  items,
  muted,
  onCancel,
}: {
  title: string;
  items: Reservation[];
  muted?: boolean;
  onCancel?: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-900/50 mb-2.5">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-teal-900/40 bg-white/50 border border-dashed border-teal-900/15 rounded-md px-3 py-4 text-center">
          Kayıt yok.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((r) => (
            <div
              key={r.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-md border border-teal-900/10 bg-white px-4 py-3 ${
                muted ? "opacity-70" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-teal-950">
                  {r.guest.fullName} · {r.room.name}
                </p>
                <p className="text-xs text-teal-900/50">
                  {format(new Date(r.checkIn), "d MMM yyyy", { locale: tr })}
                  {" – "}
                  {format(new Date(r.checkOut), "d MMM yyyy", { locale: tr })}
                  {" · "}
                  {r.guestCount} kişi
                </p>
              </div>
              {onCancel && (
                <button
                  onClick={() => onCancel(r.id)}
                  className="flex items-center gap-1 text-xs text-coral/70 hover:text-coral shrink-0"
                >
                  <X size={13} /> İptal et
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
