# Research: Personal Expense Tracker

**Branch**: `001-expense-tracker-app` | **Date**: 2026-05-11

## R-001: Server Actions as Validation Layer with localStorage Persistence

**Decision**: Use Server Actions exclusively for input validation, UUID generation, and
timestamp generation. The Server Action returns a validated `Expense` object (or an error
map) to the calling Client Component, which then writes to localStorage.

**Rationale**: Server Actions run on the server (Node.js), making them the correct boundary
for validation logic that must not be bypassable from the browser. They also have access to
`crypto.randomUUID()` (Node.js 18+ built-in, no import required), ensuring IDs are
generated server-side. The client receives only validated, complete `Expense` objects before
writing to localStorage.

**Alternatives considered**:
- *Client-only validation*: Rejected — validation logic would be in the browser bundle and
  bypassable by the user.
- *Route Handler + `fetch`*: Rejected — Server Actions are more ergonomic for form
  submissions in App Router and avoid manual `fetch` wiring and CSRF considerations.
- *External validation library (Zod)*: Rejected — YAGNI; the Expense entity has simple
  validation rules (positive number, non-empty string, enum membership) that native
  TypeScript guards handle without an external dependency.

---

## R-002: localStorage as Primary Persistence

**Decision**: Use `localStorage` with key `expense-tracker:expenses`, storing a
JSON-serialized `Expense[]`. All reads and writes go through `src/lib/storage.ts` utilities.

**Rationale**: FR-008 explicitly requires no backend server. localStorage is synchronous,
effectively zero-latency for up to 10,000 records (SC-002 target), and survives browser
close/reopen cycles (SC-003). At ~200 bytes per record, 10,000 expenses totals ~2 MB —
well within the 5–10 MB localStorage limit in modern browsers.

**Alternatives considered**:
- *IndexedDB*: Supports larger datasets and offers an async API, but adds significant
  complexity (request-based API, versioned schema migrations) for no benefit at this scale.
  Rejected per YAGNI.
- *sessionStorage*: Does not survive browser close — violates SC-003.
- *Cookies*: Size-limited to ~4 KB — insufficient for 10,000 records.

---

## R-003: Route Handler for Category List

**Decision**: `GET /api/categories` returns `{ categories: Array<{ value, label }> }` as
JSON. The `app/page.tsx` Server Component fetches this endpoint during SSR and passes the
result as a prop to the `Dashboard` Client Component.

**Rationale**: Keeps the canonical category list server-side, satisfies the Route Handler
requirement, and means categories arrive with the initial HTML — no client-side loading
state or flicker. The Server Component calls the Route Handler during SSR via relative URL.

**Alternatives considered**:
- *Import categories constant directly in Server Component*: Simpler; avoids a round-trip.
  Rejected to satisfy the explicit Route Handler requirement.
- *Fetch categories client-side on mount*: Creates a loading flicker for a static list.
  Rejected.

---

## R-004: UUID Generation Strategy

**Decision**: Use `crypto.randomUUID()` — available natively in Node.js 18+ and modern
browsers (Web Crypto API) with no import required.

**Rationale**: Next.js 16 requires Node.js 18+, so `crypto.randomUUID()` is always
available in Server Actions. No external dependency needed (`uuid`, `nanoid`, etc.). IDs
are generated server-side (in the Server Action), preventing client-side ID manipulation.

**Alternatives considered**:
- *`uuid` npm package*: Unnecessary external dependency when the built-in is sufficient.
- *Client-side UUID generation*: Would require a client bundle addition and allows ID
  manipulation from the browser console.
- *Sequential numeric IDs*: Collide if localStorage is cleared and re-populated; not safe
  for future export/import scenarios.

---

## R-005: State Management Approach

**Decision**: Custom `useExpenses` hook in `src/hooks/useExpenses.ts` manages localStorage
reads/writes, filter state (active category, date range), and sort state (column and
direction). No external state management library.

**Rationale**: The expense list is a single flat array. All derived state (filtered list,
sorted list, summary statistics) is computed inline using `useMemo`. React's built-in
`useState`/`useEffect`/`useMemo` are sufficient. Adding Redux, Zustand, or Context would
be over-engineering for a single-user, single-screen app.

**Alternatives considered**:
- *React Context + Reducer*: Useful for cross-tree sharing, but expense state is only
  consumed in one component subtree (Dashboard). Rejected as premature abstraction.
- *Zustand / Jotai*: External dependencies. Rejected per YAGNI.
- *SWR / React Query*: Designed for server-side data fetching, not localStorage. Rejected.

---

## Constitution Check — Post-Design Confirmation

All five principles remain satisfied after Phase 1 design. The single noted exception
(Gate III: `'use client'` at Dashboard level) is justified by the localStorage persistence
model and documented in plan.md Complexity Tracking. No new violations introduced.
