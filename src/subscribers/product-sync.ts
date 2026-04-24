import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/framework/subscribers";
import { SEARCH_MODULE } from "../modules/search";
import { Modules } from "@medusajs/framework/utils";

export default async function productSyncHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  let searchService;
  try {
    searchService = container.resolve(SEARCH_MODULE) as any;
  } catch (e) {
    console.warn("Search module not found, skipping sync.");
    return;
  }
  const productModuleService = container.resolve(Modules.PRODUCT);

  const productId = event.data.id;

  if (event.name === "product.deleted") {
    await searchService.deleteProduct(productId);
    return;
  }

  // Fetch full product details
  const [product] = await productModuleService.listProducts(
    { id: [productId] },
    { relations: ["variants", "categories"] }
  );

  if (product) {
    // Transform product for Elasticsearch
    const doc = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      thumbnail: product.thumbnail,
      metadata: product.metadata,
      categories: product.categories?.map((c: any) => c.name),
      variants: product.variants?.map((v: any) => ({
        id: v.id,
        title: v.title,
        sku: v.sku,
      })),
    };

    await searchService.indexProducts([doc]);
    console.log(`Product ${productId} synced to Elasticsearch.`);
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "product.deleted"],
};
