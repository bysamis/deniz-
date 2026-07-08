"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Plus, Search, Trash2 } from "lucide-react";
import NewReservationModal from "@/components/NewReservationModal";
import AddRoomModal from "@/components/AddRoomModal";

type RoomData = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: "occupied" | "empty";
  currentGuest: {
    reservationId: string;
    name: string;
    phone: string | null;
    checkIn: string;
    checkOut: string;
    guestCount: number;
  } | null;
  nextReservation: {
    reservationId: string;
    name: string;
    checkIn: string;
    checkOut: string;
  } | null;
  totalStays: number;
};

export default function DashboardPage() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "occupied" | "empty">("all");
  const [search, setSearch] = useState("");
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [preselectedRoom, setPreselectedRoom] = useState<string | undefined>();

  async function loadRooms() {
    setLoading(true);
    const res = await fetch("/api/rooms");
    const data = await res.json();
    setRooms(data);
    setLoading(false);
  }

  useEffect(() => {
    loadRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((r) => (filter === "all" ? true : r.status === filter))
      .filter((r) =>
        search
          ? r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.currentGuest?.name.toLowerCase().includes(search.toLowerCase())
          : true
      );
  }, [rooms, filter, search]);

  const occupiedCount = rooms.filter((r) => r.status === "occupied").length;
  const emptyCount = rooms.length - occupiedCount;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-teal-800/60 mb-1">
            Bugün · {format(new Date(), "d MMMM yyyy, EEEE", { locale: tr })}
          </p>
          <h1 className="font-display text-3xl text-teal-950">Oda Durumu</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddRoom(true)}
            className="rounded-md border border-teal-900/20 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-900/5 transition-colors"
          >
            + Oda ekle
          </button>
          <button
            onClick={() => {
              setPreselectedRoom(undefined);
              setShowNewReservation(true);
            }}
            className="flex items-center gap-1.5 rounded-md bg-teal-900 px-4 py-2 text-sm font-medium text-sand-50 hover:bg-teal-800 transition-colors"
          >
            <Plus size={16} /> Yeni rezervasyon
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
        <StatCard label="Toplam oda" value={rooms.length} />
        <StatCard label="Dolu" value={occupiedCount} tone="coral" />
        <StatCard label="Boş" value={emptyCount} tone="sage" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex rounded-md border border-teal-900/15 overflow-hidden text-sm">
          {(["all", "occupied", "empty"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 transition-colors ${
                filter === f
                  ? "bg-teal-900 text-sand-50"
                  : "bg-white text-teal-900 hover:bg-teal-900/5"
              }`}
            >
              {f === "all" ? "Tümü" : f === "occupied" ? "Dolu" : "Boş"}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search
            size={15}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-900/40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Oda veya misafir ara..."
            className="w-full rounded-md border border-teal-900/15 bg-white pl-8 pr-3 py-1.5 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-teal-900/50 text-sm">Yükleniyor...</p>
      ) : filteredRooms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-teal-900/20 bg-white/50 p-10 text-center text-teal-900/50 text-sm">
          {rooms.length === 0
            ? "Henüz oda eklenmemiş. Başlamak için “Oda ekle” butonunu kullanın."
            : "Bu kritere uyan oda bulunamadı."}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBook={() => {
                setPreselectedRoom(room.id);
                setShowNewReservation(true);
              }}
              onDelete={async () => {
                const confirmText = room.status === "occupied"
                  ? `${room.name} şu anda dolu. Yine de silmek istediğinize emin misiniz? Tüm rezervasyon geçmişi de silinecek.`
                  : `${room.name} odasını silmek istediğinize emin misiniz? Tüm rezervasyon geçmişi de silinecek. Bu işlem geri alınamaz.`;
                if (!confirm(confirmText)) return;
                await fetch(`/api/rooms/${room.id}`, { method: "DELETE" });
                loadRooms();
              }}
            />
          ))}
        </div>
      )}

      {showNewReservation && (
        <NewReservationModal
          preselectedRoomId={preselectedRoom}
          rooms={rooms}
          onClose={() => setShowNewReservation(false)}
          onCreated={() => {
            setShowNewReservation(false);
            loadRooms();
          }}
        />
      )}

      {showAddRoom && (
        <AddRoomModal
          onClose={() => setShowAddRoom(false)}
          onCreated={() => {
            setShowAddRoom(false);
            loadRooms();
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "coral" | "sage";
}) {
  return (
    <div className="rounded-lg bg-white border border-teal-900/10 px-4 py-3">
      <p className="text-xs text-teal-900/50 mb-0.5">{label}</p>
      <p
        className={`font-display text-2xl ${
          tone === "coral"
            ? "text-coral"
            : tone === "sage"
            ? "text-sage"
            : "text-teal-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function RoomCard({
  room,
  onBook,
  onDelete,
}: {
  room: RoomData;
  onBook: () => void;
  onDelete: () => void;
}) {
  const isOccupied = room.status === "occupied";
  return (
    <div
      className={`rounded-lg bg-white border-l-4 border border-teal-900/10 p-4 flex flex-col gap-3 ${
        isOccupied ? "border-l-coral" : "border-l-sage"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/rooms/${room.id}`}
            className="font-display text-lg text-teal-950 hover:underline"
          >
            {room.name}
          </Link>
          <p className="text-xs text-teal-900/50">
            {room.type} · {room.capacity} kişilik
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[11px] font-medium rounded-full px-2.5 py-1 ${
              isOccupied ? "bg-coral-100 text-coral" : "bg-sage-100 text-sage"
            }`}
          >
            {isOccupied ? "Dolu" : "Boş"}
          </span>
          <button
            onClick={onDelete}
            aria-label="Odayı sil"
            className="text-teal-900/30 hover:text-coral transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {isOccupied && room.currentGuest ? (
        <div className="text-sm bg-sand-100/60 rounded-md p-2.5">
          <p className="font-medium text-teal-950">{room.currentGuest.name}</p>
          <p className="text-xs text-teal-900/60">
            {format(new Date(room.currentGuest.checkIn), "d MMM", { locale: tr })}
            {" – "}
            {format(new Date(room.currentGuest.checkOut), "d MMM", { locale: tr })}
            {" · "}
            {room.currentGuest.guestCount} kişi
          </p>
        </div>
      ) : room.nextReservation ? (
        <div className="text-xs text-amber bg-amber-100 rounded-md p-2.5">
          Sıradaki: {room.nextReservation.name} ·{" "}
          {format(new Date(room.nextReservation.checkIn), "d MMM", { locale: tr })}
        </div>
      ) : (
        <p className="text-xs text-teal-900/40">Yaklaşan rezervasyon yok</p>
      )}

      <div className="flex gap-2 mt-auto pt-1">
        <Link
          href={`/rooms/${room.id}`}
          className="flex-1 text-center text-xs rounded-md border border-teal-900/15 py-1.5 text-teal-900 hover:bg-teal-900/5 transition-colors"
        >
          Geçmiş
        </Link>
        {!isOccupied && (
          <button
            onClick={onBook}
            className="flex-1 text-xs rounded-md bg-teal-900 py-1.5 text-sand-50 hover:bg-teal-800 transition-colors"
          >
            Rezervasyon yap
          </button>
        )}
      </div>
    </div>
  );
}
