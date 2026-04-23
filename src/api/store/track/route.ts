import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// Simple in-memory analytics store (persisted in module for production)
const analyticsStore: Array<{ product_id: string; event_type: string; timestamp: string; session_id?: string }> = [];

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { product_id, event_type } = req.body as any;

    if (!product_id || !event_type) {
      return res.status(400).json({ error: "product_id and event_type are required" });
    }

    if (!["view", "add_to_cart", "purchase"].includes(event_type)) {
      return res.status(400).json({ error: "Invalid event_type" });
    }

    analyticsStore.push({
      product_id,
      event_type,
      timestamp: new Date().toISOString(),
      session_id: req.headers["x-session-id"] as string || undefined,
    });

    // Keep max 10000 events in memory
    if (analyticsStore.length > 10000) {
      analyticsStore.splice(0, analyticsStore.length - 10000);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to track event" });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Aggregate analytics
    const viewCounts: Record<string, number> = {};
    const cartCounts: Record<string, number> = {};

    for (const event of analyticsStore) {
      if (event.event_type === "view") {
        viewCounts[event.product_id] = (viewCounts[event.product_id] || 0) + 1;
      } else if (event.event_type === "add_to_cart") {
        cartCounts[event.product_id] = (cartCounts[event.product_id] || 0) + 1;
      }
    }

    const topViewed = Object.entries(viewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([product_id, count]) => ({ product_id, count }));

    const topAddedToCart = Object.entries(cartCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([product_id, count]) => ({ product_id, count }));

    return res.status(200).json({
      top_viewed: topViewed,
      top_added_to_cart: topAddedToCart,
      total_events: analyticsStore.length,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get analytics" });
  }
};
