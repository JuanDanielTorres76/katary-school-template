import { useState, type FormEvent } from "react";
import { api } from "../api";
import type { NewItem } from "../types";

const empty: NewItem = { name: "", description: "", category: "", price: 0, rating: 0 };

export function ItemForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<NewItem>(empty);
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createItem(form);
      setForm(empty);
      onCreated();
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h3>Agregar libro</h3>
      <input placeholder="Título" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Género" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input
        type="number"
        placeholder="Precio"
        value={form.price || ""}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Rating (1 a 5)"
        min={1}
        max={5}
        step={0.1}
        value={form.rating || ""}
        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        required
      />
      <button className="primary" disabled={saving}>
        {saving ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
