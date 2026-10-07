# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Comandos

```bash
# Backend (.NET 9) — desde backend/
dotnet build                     # verificación obligatoria tras cambios en backend
dotnet user-secrets set "Agent:ApiKey" "..."   # lo corre el estudiante, nunca escribir la key

# Frontend (React 19 + Vite 7) — desde frontend/
npm install
npm run build                    # tsc -b && vite build: es el chequeo de tipos
```

No hay tests ni linter configurados. La verificación es `dotnet build` + `npm run build`. Para probar endpoints sin frontend: `backend/KataryApi.http`.

## Arquitectura (lo que cruza archivos)

**Contrato Item backend ↔ frontend.** `backend/Models/Item.cs` (record posicional) se serializa en camelCase y debe reflejarse a mano en `frontend/src/types.ts`. Agregar el "dato extra" de IDEA.md toca, en orden:
1. `Item.cs`: nuevo parámetro del record.
2. `Data/ItemStore.cs`: los `Seed(new Item(...))` usan constructor posicional, así que todos deben actualizarse o no compila.
3. `types.ts`: `NewItem = Omit<Item, "id">` hereda el campo solo.
4. `components/ItemForm.tsx`: el objeto `empty` es `NewItem`, así que `npm run build` falla hasta agregarle el campo y su input.
5. `components/ItemList.tsx`: mostrarlo en la tarjeta.

El agente no necesita cambios: `AgentService` serializa `store.GetAll()` completo en el system prompt en cada llamada (grounding), así que ve campos nuevos automáticamente.

**Agente (`POST /api/agent`).** `AgentService` llama `{BaseUrl}/chat/completions` (formato OpenAI) con `HttpClient` tipado. Config en sección `Agent` de `appsettings.json` (`BaseUrl`, `Model`, `SystemPrompt`) + `ApiKey` desde user-secrets (`UserSecretsId` = `katary-dev-school-api`). Gemini por defecto; Groq cambiando `BaseUrl`/`Model`. Solo envía los últimos 10 mensajes. Errores → `AgentException` → `Results.Problem(..., 502)`; `frontend/src/api.ts` extrae `.detail` del ProblemDetails para mostrar el mensaje. El frontend no envía el saludo inicial (`next.slice(1)` en `AgentChat.tsx`).

**Datos.** `ItemStore` es singleton en memoria (`ConcurrentDictionary`); se reinicia con la API. No hay endpoint de update (solo GET, POST, DELETE).

**Conexión.** CORS en `Program.cs` permite solo `http://localhost:5173` (Vite usa `strictPort`). El frontend lee `VITE_API_URL` (`.env`, copiado de `.env.example`) con fallback a `http://localhost:5080`.

**Marca.** `frontend/src/config.ts` (`brandName`, `tagline`, `accentColor`, `itemsTitle`, `agentName`); `App.tsx` inyecta `accentColor` como variable CSS `--accent` que usa `index.css`. La personalidad del chat va en `Agent:SystemPrompt` de `appsettings.json`.

Los comentarios `👉 PASO .NET` / `👉 PASO React` marcan los puntos que el estudiante debe personalizar en clase.
