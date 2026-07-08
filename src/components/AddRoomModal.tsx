"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function AddRoomModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Standart");
  const [capacity, setCapacity] = useState("2");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, capacity, notes }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Oda eklenemedi.");
      return;
    }
    onCreated();
  }

  return (
    <Modal title="Oda ekle" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Oda adı">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            placeholder="Villa 4"
            className="input"
          />
        </Field>
        <Field label="Tür">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input"
          >
            <option>Standart</option>
            <option>Deluxe</option>
            <option>Suit</option>
            <option>Villa</option>
            <option>Aile Odası</option>
          </select>
        </Field>
        <Field label="Kapasite">
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Not (opsiyonel)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="input"
          />
        </Field>

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
          {loading ? "Ekleniyor..." : "Odayı ekle"}
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
