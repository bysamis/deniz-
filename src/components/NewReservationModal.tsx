"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import Modal from "./Modal";

type Room = { id: string; name: string; status: string };
type Guest = { id: string; fullName: string; phone: string | null };
type CompanionInput = { fullName: string; idNumber: string };

export default function NewReservationModal({
  preselectedRoomId,
  rooms,
  onClose,
  onCreated,
}: {
  preselectedRoomId?: string;
  rooms: Room[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [roomId, setRoomId] = useState(preselectedRoomId || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [notes, setNotes] = useState("");

  const [guestQuery, setGuestQuery] = useState("");
  const [guestResults, setGuestResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestIdNumber, setNewGuestIdNumber] = useState("");

  const [companions, setCompanions] = useState<CompanionInput[]>([]);
  const [kvkkConsent, setKvkkConsent] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGuest || guestQuery.trim().length < 2) {
      setGuestResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/guests?q=${encodeURIComponent(guestQuery)}`);
      setGuestResults(await res.json());
    }, 250);
    return () => clearTimeout(t);
  }, [guestQuery, selectedGuest]);

  function addCompanion() {
    setCompanions((prev) => [...prev, { fullName: "", idNumber: "" }]);
  }

  function updateCompanion(index: number, field: keyof CompanionInput, value: string) {
    setCompanions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function removeCompanion(index: number) {
    setCompanions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!roomId || !checkIn || !checkOut) {
      setError("Oda ve tarihleri seçin.");
      return;
    }
    if (!selectedGuest && !guestQuery.trim()) {
      setError("Misafir adı gerekli.");
      return;
    }
    if (!kvkkConsent) {
      setError("Devam etmek için KVKK Aydınlatma Metni onayı gerekli.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        checkIn,
        checkOut,
        guestCount,
        notes,
        guestId: selectedGuest?.id,
        guestFullName: selectedGuest ? undefined : guestQuery.trim(),
        guestPhone: selectedGuest ? undefined : newGuestPhone || undefined,
        guestIdNumber: selectedGuest ? undefined : newGuestIdNumber || undefined,
        companions: companions.filter((c) => c.fullName.trim()),
        kvkkConsent,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Rezervasyon oluşturulamadı.");
      return;
    }
    onCreated();
  }

  return (
    <Modal title="Yeni rezervasyon" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Oda">
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            className="input"
          >
            <option value="">Oda seçin</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} {r.status === "occupied" ? "(şu an dolu)" : ""}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Giriş tarihi">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="input"
            />
          </Field>
          <Field label="Çıkış tarihi">
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="input"
            />
          </Field>
        </div>

        <Field label="Rezervasyon sahibi (aile temsilcisi)">
          {selectedGuest ? (
            <div className="flex items-center justify-between rounded-md border border-teal-700/30 bg-teal-700/5 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-teal-950">
                  {selectedGuest.fullName}
                </p>
                {selectedGuest.phone && (
                  <p className="text-xs text-teal-900/50">{selectedGuest.phone}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuest(null)}
                className="text-xs text-teal-900/60 hover:text-teal-900"
              >
                Değiştir
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                value={guestQuery}
                onChange={(e) => setGuestQuery(e.target.value)}
                placeholder="İsim yazın veya kayıtlı misafir arayın"
                className="input"
              />
              {guestResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-teal-900/15 bg-white shadow-lg max-h-40 overflow-y-auto">
                  {guestResults.map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => {
                        setSelectedGuest(g);
                        setGuestResults([]);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-sand-100"
                    >
                      {g.fullName}
                      {g.phone ? ` · ${g.phone}` : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Field>

        {!selectedGuest && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Telefon (opsiyonel)">
              <input
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
                placeholder="05xx xxx xx xx"
                className="input"
              />
            </Field>
            <Field label="TC kimlik no (opsiyonel)">
              <input
                value={newGuestIdNumber}
                onChange={(e) => setNewGuestIdNumber(e.target.value)}
                placeholder="11 haneli"
                maxLength={11}
                className="input"
              />
            </Field>
          </div>
        )}

        <Field label="Kişi sayısı (toplam)">
          <input
            type="number"
            min={1}
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="input"
          />
        </Field>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="block text-xs font-semibold text-ink/70">
              Birlikte kalanlar (aile üyeleri)
            </span>
            <button
              type="button"
              onClick={addCompanion}
              className="flex items-center gap-1 text-xs text-teal-800 hover:text-teal-900"
            >
              <Plus size={13} /> Kişi ekle
            </button>
          </div>

          {companions.length === 0 ? (
            <p className="text-xs text-teal-900/40">
              Rezervasyon sahibi dışında kalan aile üyelerini buradan
              ekleyebilirsiniz.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {companions.map((c, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-start">
                  <input
                    value={c.fullName}
                    onChange={(e) => updateCompanion(i, "fullName", e.target.value)}
                    placeholder="Ad Soyad"
                    className="input flex-1"
                  />
                  <div className="flex gap-2">
                    <input
                      value={c.idNumber}
                      onChange={(e) => updateCompanion(i, "idNumber", e.target.value)}
                      placeholder="TC kimlik no"
                      maxLength={11}
                      className="input flex-1 sm:w-32 sm:flex-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompanion(i)}
                      aria-label="Kaldır"
                      className="text-teal-900/40 hover:text-coral p-2 shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Field label="Not (opsiyonel)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="input"
          />
        </Field>

        <label className="flex items-start gap-2.5 text-xs text-ink/70 bg-sand-100/60 rounded-md p-3">
          <input
            type="checkbox"
            checked={kvkkConsent}
            onChange={(e) => setKvkkConsent(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span>
            Misafirin{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-800 underline hover:text-teal-900"
            >
              KVKK Aydınlatma Metni
            </a>
            {" "}kapsamında bilgilendirildiğini ve kişisel verilerinin bu
            amaçla işlenmesini kabul ettiğini onaylıyorum.
          </span>
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
          {loading ? "Kaydediliyor..." : "Rezervasyonu oluştur"}
        </button>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-ink/70 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
