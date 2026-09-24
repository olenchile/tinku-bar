/**
 * AWS Lambda Handler — Tinku Restobar Recommendation Engine v2
 * Runtime: Node.js 20.x · Function URL (sin API Gateway)
 * Reglas de negocio basadas en hora, grupo y carrito actual.
 */

/* ── Tipos standalone (no depende de src/) ───────────────────── */
interface CartEntry {
  id: string;
  sectionId: string;
  name: string;
  price: number | null;
  group: "food" | "drinks";
}

interface LambdaRecommendation {
  sectionId:  string;
  itemName:   string;
  reason:     string;
  badge:      string;
  badgeColor: string;
  confidence: number;
}

interface LambdaRequest {
  occasion:  string;
  partySize: number;
  cart:      CartEntry[];
}

interface LambdaResponse {
  recommendations: LambdaRecommendation[];
  estimatedTotal:  number;
}

/* ── Hora local Chile continental (UTC-4) ────────────────────── */
function getChileHour(): number {
  const now   = new Date();
  const chile = new Date(now.toLocaleString("en-US", { timeZone: "America/Santiago" }));
  return chile.getHours();
}

/* ── Handler ─────────────────────────────────────────────────── */
export const handler = async (
  event: { body?: string }
): Promise<{ statusCode: number; headers: Record<string, string>; body: string }> => {
  const headers = {
    "Content-Type":                "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const payload = JSON.parse(event.body ?? "{}") as LambdaRequest;
    const { occasion, partySize, cart } = payload;

    const hour         = getChileHour();
    const cartSections = new Set(cart.map((c: CartEntry) => c.sectionId));
    const cartNames    = new Set(cart.map((c: CartEntry) => c.name));
    const recs: LambdaRecommendation[] = [];

    /* Regla 1: Hora noche → promo 2×1 */
    if ((hour >= 20 || hour < 1) && !cartSections.has("tragos_promo")) {
      recs.push({
        sectionId:  "tragos_promo",
        itemName:   "2X CORTO DE PISCO MISTRAL 40°",
        reason:     "Promo noche activa — 2×1 hasta el cierre",
        badge:      "🌙 Promo Noche",
        badgeColor: "#c87830",
        confidence: 0.97,
      });
    }

    /* Regla 2: Grupo ≥ 3 → trago grupal */
    if (partySize >= 3 && !cartSections.has("tragos")) {
      const rec = partySize >= 4
        ? { itemName: "SANGRIA DE 1 LITRO", reason: "Para toda la mesa" }
        : { itemName: "CATEDRAL",           reason: "El trago icónico de Tinku" };
      if (!cartNames.has(rec.itemName)) {
        recs.push({
          sectionId:  "tragos",
          itemName:   rec.itemName,
          reason:     rec.reason,
          badge:      "Para el grupo",
          badgeColor: "#b85c38",
          confidence: 0.91,
        });
      }
    }

    /* Regla 3: Almuerzo mediodía → colación */
    if (occasion === "almuerzo" && hour >= 12 && hour < 16 && !cartSections.has("colacion")) {
      recs.push({
        sectionId:  "colacion",
        itemName:   "PLATO DEL DÍA + BEBIDA",
        reason:     "El más pedido al mediodía",
        badge:      "⚡ Colación",
        badgeColor: "#4a6e3a",
        confidence: 0.96,
      });
    }

    /* Regla 4: Plato fuerte → vino */
    if (cartSections.has("platos_carta") && !cartSections.has("vinos")) {
      if (!cartNames.has("CASILLERO DEL DIABLO (RESERVA) CARMENERE")) {
        recs.push({
          sectionId:  "vinos",
          itemName:   "CASILLERO DEL DIABLO (RESERVA) CARMENERE",
          reason:     "Maridaje ideal para tu plato",
          badge:      "🍷 Sommelier",
          badgeColor: "#5a1a38",
          confidence: 0.90,
        });
      }
    }

    /* Regla 5: Noche + ≥2 ítems sin postre */
    if ((occasion === "noche" || hour >= 19) && !cartSections.has("postres") && cart.length > 1) {
      recs.push({
        sectionId:  "postres",
        itemName:   "VOLCAN CON HELADO",
        reason:     "El favorito de la noche",
        badge:      "🔥 Imperdible",
        badgeColor: "#b05048",
        confidence: 0.82,
      });
    }

    const estimatedTotal = cart.reduce(
      (acc: number, item: CartEntry) => acc + (item.price ?? 0),
      0
    );

    const response: LambdaResponse = {
      recommendations: recs
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 4),
      estimatedTotal,
    };

    return { statusCode: 200, headers, body: JSON.stringify(response) };
  } catch (err) {
    console.error("Lambda error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Internal error" }) };
  }
};
