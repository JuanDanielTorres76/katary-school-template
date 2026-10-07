import { useState, type FormEvent } from "react";
import { api } from "../api";
import { config } from "../config";
import type { ChatMessage } from "../types";

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: `¡Hola! Soy ${config.agentName}, el asistente de ${config.brandName}. ¿En qué te ayudo?` },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setThinking(true);
    setError(null);
    try {
      // El primer mensaje es el saludo local: no lo enviamos al modelo.
      const { reply } = await api.askAgent(next.slice(1));
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setThinking(false);
    }
  };

  return (
    <aside className="card chat">
      <h2>{config.agentName}</h2>
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i} className={`bubble ${m.role}`}>
            {m.content}
          </p>
        ))}
        {thinking && <p className="bubble assistant muted">Pensando…</p>}
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={send} className="chat-form">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu pregunta…" />
        <button className="primary" disabled={thinking}>
          Enviar
        </button>
      </form>
    </aside>
  );
}
