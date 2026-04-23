import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const orderModule = req.scope.resolve(Modules.ORDER);
    const productModule = req.scope.resolve(Modules.PRODUCT);
    const customerModule = req.scope.resolve(Modules.CUSTOMER);

    // Get products
    const products = await productModule.listProducts({}, { select: ["id", "title", "handle", "thumbnail", "status"] });

    // Get orders
    const orders = await orderModule.listOrders({}, { select: ["id", "status", "total", "currency_code", "created_at", "email"], take: 50, order: { created_at: "DESC" } });

    // Get customers
    const customers = await customerModule.listCustomers({}, { select: ["id"] });

    // Calculate stats
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = customers.length;

    // Order status distribution
    const statusDist: Record<string, number> = {};
    for (const o of orders) {
      const s = o.status || "unknown";
      statusDist[s] = (statusDist[s] || 0) + 1;
    }

    // Fetch tracking analytics from store/track endpoint (in-memory)
    let trackingData = { top_viewed: [], top_added_to_cart: [], total_events: 0 };
    try {
      const baseUrl = process.env.MEDUSA_BACKEND_URL || `http://localhost:${process.env.PORT || 9000}`;
      const trackRes = await fetch(`${baseUrl}/store/track`);
      if (trackRes.ok) trackingData = await trackRes.json();
    } catch {}

    // Enrich top_viewed with product titles
    const productMap: Record<string, any> = {};
    for (const p of products) productMap[p.id] = p;

    const topViewed = (trackingData.top_viewed as any[]).map((item: any) => ({
      ...item,
      product: productMap[item.product_id] || null,
    }));

    const topAddedToCart = (trackingData.top_added_to_cart as any[]).map((item: any) => ({
      ...item,
      product: productMap[item.product_id] || null,
    }));

    // Low stock products
    const lowStockProducts = products
      .filter((p: any) => p.status === "published")
      .slice(0, 5)
      .map((p: any) => ({ id: p.id, title: p.title, thumbnail: p.thumbnail }));

    return res.status(200).json({
      stats: {
        total_revenue: totalRevenue,
        total_orders: totalOrders,
        total_products: totalProducts,
        total_customers: totalCustomers,
      },
      order_status_distribution: statusDist,
      recent_orders: orders.slice(0, 10),
      top_viewed: topViewed,
      top_added_to_cart: topAddedToCart,
      total_tracking_events: trackingData.total_events,
      low_stock_alerts: lowStockProducts,
    });
  } catch (error: any) {
    console.error("Analytics error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch analytics" });
  }
};
