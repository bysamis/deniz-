"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isPast, isFuture } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, Phone, Trash2 } from "lucide-react";

type Companion = {
  id: string;
  fullName: string;
  idNumber: string | null;
};

type Reservation = {
  id: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: string;
  notes: string | null;
  guest: { id: string; fullName: string; phone: string | null; idNumber: string | null };
  companions: Companion[];
};

type RoomDetail = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  notes: string | null;
  reservations: Reservation[];
};

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const router = useRouter();
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetch(`/api/rooms/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setRoom(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-teal-900/50 text-sm">Yükleniyor...</p>;
  }

  if (!room) {
    return <p className="text-teal-900/50 text-sm">Oda bulunamadı.</p>;
  }

  const now = new Date();
  const current = room.reservations.find(
    (r) =>
      r.status !== "cancelled" &&
      new Date(r.checkIn) <= now &&
      new Date(r.checkOut) > now
  );
  const upcoming = room.reservations
    .filter((r) => r.status !== "cancelled" && isFuture(new Date(r.checkIn)))
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  const past = room.reservations
    .filter(
      (r) =>
        r.status === "cancelled" ||
        (isPast(new Date(r.checkOut)) && r.id !== current?.id)
    )
    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

  async function handleDelete() {
    if (!room) return;
    setDeleteError("");

    const confirmText = current
      ? `${room.name} şu anda dolu. Yine de silmek istediğinize emin misiniz? Odaya ait tüm rezervasyon geçmişi de silinecek.`
      : `${room.name} odasını silmek istediğinize emin misiniz? Odaya ait tüm rezervasyon geçmişi de silinecek. Bu işlem geri alınamaz.`;

    if (!confirm(confirmText)) return;

    setDeleting(true);
    const res = await fetch(`/api/rooms/${room.id}`, { method: "DELETE" });
    if (!res.ok) {
      setDeleting(false);
      setDeleteError("Oda silinemedi. Lütfen tekrar deneyin.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-teal-900/60 hover:text-teal-900 mb-5"
      >
        <ArrowLeft size={15} /> Panele dön
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-2 mb-6">
        <div>
          <h1 className="font-display text-3xl text-teal-950">{room.name}</h1>
          <p className="text-sm text-teal-900/50">
            {room.type} · {room.capacity} kişilik
          </p>
        </div>
        <span
          className={`text-xs font-medium rounded-full px-3 py-1.5 ${
            current ? "bg-coral-100 text-coral" : "bg-sage-100 text-sage"
          }`}
        >
          {current ? "Şu an dolu" : "Şu an boş"}
        </span>
      </div>

      {current && (
        <Section title="Şu anki misafir">
          <ReservationRow r={current} highlight="coral" />
        </Section>
      )}

      <Section title={`Yaklaşan rezervasyonlar (${upcoming.length})`}>
        {upcoming.length === 0 ? (
          <EmptyNote text="Yaklaşan rezervasyon yok." />
        ) : (
          upcoming.map((r) => <ReservationRow key={r.id} r={r} highlight="amber" />)
        )}
      </Section>

      <Section title={`Geçmiş (${past.length})`}>
        {past.length === 0 ? (
          <EmptyNote text="Henüz geçmiş kayıt yok." />
        ) : (
          past.map((r) => <ReservationRow key={r.id} r={r} />)
        )}
      </Section>

      <div className="mt-10 pt-6 border-t border-teal-900/10">
        {deleteError && (
          <p className="text-sm text-coral bg-coral-100 rounded-md px-3 py-2 mb-3">
            {deleteError}
          </p>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-sm text-coral/70 hover:text-coral disabled:opacity-50 transition-colors"
        >
          <Trash2 size={15} />
          {deleting ? "Siliniyor..." : "Bu odayı sil"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-900/50 mb-2.5">
        {title}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="text-sm text-teal-900/40 bg-white/50 border border-dashed border-teal-900/15 rounded-md px-3 py-4 text-center">
      {text}
    </p>
  );
}

function ReservationRow({
  r,
  highlight,
}: {
  r: Reservation;
  highlight?: "coral" | "amber";
}) {
  const borderColor =
    highlight === "coral"
      ? "border-l-coral"
      : highlight === "amber"
      ? "border-l-amber"
      : "border-l-teal-900/20";

  return (
    <div
      className={`bg-white border border-teal-900/10 border-l-4 ${borderColor} rounded-md px-4 py-3 flex flex-wrap items-center justify-between gap-3`}
    >
      <div>
        <p className="font-medium text-teal-950 text-sm">
          {r.guest.fullName}
          {r.status === "cancelled" && (
            <span className="ml-2 text-xs text-coral">(iptal)</span>
          )}
        </p>
        <p className="text-xs text-teal-900/50">
          {format(new Date(r.checkIn), "d MMM yyyy", { locale: tr })}
          {" – "}
          {format(new Date(r.checkOut), "d MMM yyyy", { locale: tr })}
          {" · "}
          {r.guestCount} kişi
          {r.guest.idNumber && ` · TC: ${r.guest.idNumber}`}
        </p>
        {r.companions.length > 0 && (
          <div className="mt-1.5 flex flex-col gap-0.5">
            {r.companions.map((c) => (
              <p key={c.id} className="text-xs text-teal-900/50">
                <span className="text-teal-900/35">+ </span>
                {c.fullName}
                {c.idNumber && ` · TC: ${c.idNumber}`}
              </p>
            ))}
          </div>
        )}
        {r.notes && <p className="text-xs text-teal-900/40 mt-0.5">{r.notes}</p>}
      </div>
      {r.guest.phone && (
        <a
          href={`tel:${r.guest.phone}`}
          className="flex items-center gap-1 text-xs text-teal-900/60 hover:text-teal-900 shrink-0"
        >
          <Phone size={13} /> {r.guest.phone}
        </a>
      )}
    </div>
  );
}
