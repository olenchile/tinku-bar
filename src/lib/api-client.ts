// ─── URL BASE DE LA API LAMBDA ────────────────────────────────────────────────
export const API_BASE = "https://aew1hdrora.execute-api.us-east-1.amazonaws.com";

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface MenuDia {
  fecha: string;
  platos: string[];
  veganos: string[];
  hipocaloricos: string[];
  agregados: string[];
  ensaladas: string[];
  postres: string[];
}

export interface Pedido {
  id?: string;
  fecha: string;
  trabajadorNombre: string;
  trabajadorId: string; // RUT o nombre único
  empresaId: string;
  plato: string;
  vegano?: boolean;
  agregado?: string;
  ensalada?: string;
  postre?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Empresa {
  id: string;
  nombre: string;
  rut?: string;
  contacto?: string;
  createdAt?: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function todayChile(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Santiago",
  });
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

// ─── MENÚS ────────────────────────────────────────────────────────────────────

export const menuApi = {
  get: (fecha?: string) =>
    apiFetch<MenuDia>(`/api/menus${fecha ? `?fecha=${fecha}` : ""}`),
  save: (menu: MenuDia) =>
    apiFetch<{ ok: boolean }>("/api/menus", {
      method: "POST",
      body: JSON.stringify(menu),
    }),
};

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────

export const pedidosApi = {
  getByFecha: (fecha?: string) =>
    apiFetch<Pedido[]>(`/api/pedidos${fecha ? `?fecha=${fecha}` : ""}`),
  create: (pedido: Omit<Pedido, "id" | "createdAt">) =>
    apiFetch<{ ok: boolean; id: string; updated?: boolean }>("/api/pedidos", {
      method: "POST",
      body: JSON.stringify(pedido),
    }),
  delete: (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/pedidos/${id}`, { method: "DELETE" }),
};

// ─── EMPRESAS ─────────────────────────────────────────────────────────────────

export const empresasApi = {
  getAll: () => apiFetch<Empresa[]>("/api/empresas"),
  getById: (id: string) => apiFetch<Empresa>(`/api/empresas/${id}`),
  create: (empresa: Omit<Empresa, "id" | "createdAt">) =>
    apiFetch<{ ok: boolean; id: string }>("/api/empresas", {
      method: "POST",
      body: JSON.stringify(empresa),
    }),
  update: (id: string, empresa: Partial<Empresa>) =>
    apiFetch<{ ok: boolean }>(`/api/empresas/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...empresa, id }),
    }),
  delete: (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/empresas/${id}`, { method: "DELETE" }),
};
