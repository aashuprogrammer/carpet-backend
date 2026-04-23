import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { SEARCH_MODULE } from "../../../modules/search";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const searchService = req.scope.resolve(SEARCH_MODULE) as any;
  const { q } = req.query as { q: string };

  if (!q) {
    res.json({ products: [] });
    return;
  }

  const results = await searchService.search(q);
  
  // Transform ES hits back to simple product list
  const products = results.hits.hits.map((hit: any) => hit._source);

  res.json({ products });
}
