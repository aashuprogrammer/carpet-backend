import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  createApiKeysWorkflow,
} from "@medusajs/medusa/core-flows";

// Helper for generating 50+ products
const CARPET_STYLES = ["Isfahan", "Tabriz", "Kashan", "Heriz", "Sarouk", "Kerman", "Qum", "Nain", "Shiraz", "Hamadan", "Kilim", "Gabbeh", "Ziegler", "Kazak", "Bokhara"];
const CARPET_TYPES = ["Heritage Rug", "Silk Carpet", "Minimalist Rug", "Geometric Rug", "Floral Rug", "Classic Carpet", "Vintage Rug", "Modern Area Rug"];
const MATERIALS = ["100% Organic Wool", "Pure Mulberry Silk", "Wool & Silk Blend", "Natural Jute", "Premium Polypropylene", "Organic Cotton"];
const ORIGINS = ["Iran", "Turkey", "India", "Pakistan", "Afghanistan", "Morocco"];

const SIZES = [
  { title: "3×5 ft", sku_suffix: "3X5" },
  { title: "5×8 ft", sku_suffix: "5X8" },
  { title: "8×10 ft", sku_suffix: "8X10" },
  { title: "10×14 ft", sku_suffix: "10X14" },
  { title: "Runners 2.5×10 ft", sku_suffix: "RUN" }
];

const CATEGORIES = [
  { name: "Persian Heritage", handle: "persian-heritage", description: "Authentic hand-knotted Persian carpets with centuries of history." },
  { name: "Modern Minimalist", handle: "modern-minimalist", description: "Clean lines and subtle textures for contemporary spaces." },
  { name: "Outdoor Durable", handle: "outdoor-durable", description: "Weather-resistant luxury for your patio or deck." },
  { name: "Bohemian Chic", handle: "bohemian-chic", description: "Vibrant colors and eclectic patterns for a relaxed home." },
  { name: "Luxury Silk", handle: "luxury-silk", description: "The finest silk carpets with incredible detail and shimmer." }
];

const UNIQUE_CARPET_IMAGES = [
  "https://images.unsplash.com/photo-1588421874990-1fe162747f9b",
  "https://images.unsplash.com/photo-1594040226829-7f251ab46d80",
  "https://images.unsplash.com/photo-1660394585016-508f949df960",
  "https://images.unsplash.com/photo-1534889156217-d643df14f14a",
  "https://images.unsplash.com/photo-1671576563965-23993d69eb17",
  "https://images.unsplash.com/photo-1600166898405-da9535204843",
  "https://images.unsplash.com/photo-1714926618653-39de3cf5b691",
  "https://images.unsplash.com/photo-1608724553456-89e963624dbb",
  "https://images.unsplash.com/photo-1599503815079-dfb7085fc667",
  "https://images.unsplash.com/photo-1594847915592-2a7ef568e2b6",
  "https://images.unsplash.com/photo-1652634213812-f0deeb1de78e",
  "https://images.unsplash.com/photo-1572123979839-3749e9973aba",
  "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20",
  "https://images.unsplash.com/photo-1575414003591-ece8d0416c7a",
  "https://images.unsplash.com/photo-1695632953654-78815eee7296",
  "https://images.unsplash.com/photo-1520699514109-b478c7b48d3b",
  "https://images.unsplash.com/photo-1597665863042-47e00964d899",
  "https://images.unsplash.com/photo-1606121156579-da13cfab2731",
  "https://images.unsplash.com/photo-1558944351-3f79926e74ef",
  "https://images.unsplash.com/photo-1594922234647-4ade6282c369",
  "https://images.unsplash.com/photo-1545078194-2ec3c4e53ed1",
  "https://images.unsplash.com/photo-1546550879-3b71f2427ae0",
  "https://images.unsplash.com/photo-1621700052663-f1170e9b26ec",
  "https://images.unsplash.com/photo-1776231972021-49d6b6152156",
  "https://images.unsplash.com/photo-1635800063077-ca924ec7fe58",
  "https://images.unsplash.com/photo-1531162805941-58330188d75c",
  "https://images.unsplash.com/photo-1685006172337-9ef5c250da0b",
  "https://images.unsplash.com/photo-1582022685142-8c667072c4d9",
  "https://images.unsplash.com/photo-1579005162638-11c872e1586e",
  "https://images.unsplash.com/photo-1602795493253-c1da1fed546a",
  "https://images.unsplash.com/photo-1558114965-eeb97aa84c3b",
  "https://images.unsplash.com/photo-1577084381419-8141b7840a08",
  "https://images.unsplash.com/photo-1581345331960-d1b0a223ef96",
  "https://images.unsplash.com/photo-1606885118474-c8baf907e998",
  "https://images.unsplash.com/photo-1624873584368-0dece53e6ed3",
  "https://images.unsplash.com/photo-1565930421205-ffa06d785b44",
  "https://images.unsplash.com/photo-1557502236-b389b3a38a7d",
  "https://images.unsplash.com/photo-1720458606063-a1b944884641",
  "https://images.unsplash.com/photo-1717744258101-783e84e9f7ce",
  "https://images.unsplash.com/photo-1718002877969-0cb8496ea194",
  "https://images.unsplash.com/photo-1718002877981-3c2bafe53cb0",
  "https://images.unsplash.com/photo-1720458606131-e99549a74baa",
  "https://images.unsplash.com/photo-1718002877129-3c4184e31b9a",
  "https://images.unsplash.com/photo-1717744258123-c3aceddf74d1",
  "https://images.unsplash.com/photo-1717744256898-365aa8b8454c",
  "https://images.unsplash.com/photo-1717744257374-80e4b6430830",
  "https://images.unsplash.com/photo-1767709114023-02f6398ac7a5",
  "https://images.unsplash.com/photo-1776111463661-70ba4bb6d246",
  "https://images.unsplash.com/photo-1601082096597-81455f512d14",
  "https://images.unsplash.com/photo-1765802536365-e2267a489a2c"
];

interface ProductSeed {
  title: string;
  handle: string;
  description: string;
  images: { url: string }[];
  thumbnail: string;
  metadata: Record<string, string>;
  category: string;
  variants: {
    title: string;
    sku: string;
    prices: { amount: number; currency_code: string }[];
  }[];
}

function generateProducts(count: number): ProductSeed[] {
  const products: ProductSeed[] = [];
  for (let i = 0; i < count; i++) {
    const style = CARPET_STYLES[i % CARPET_STYLES.length];
    const type = CARPET_TYPES[i % CARPET_TYPES.length];
    const material = MATERIALS[i % MATERIALS.length];
    const origin = ORIGINS[i % ORIGINS.length];
    const category = CATEGORIES[i % CATEGORIES.length].handle;
    const imgUrl = `${UNIQUE_CARPET_IMAGES[i % UNIQUE_CARPET_IMAGES.length]}?w=800&q=80`;
    
    const title = `${style} ${type}`;
    const handle = `${style.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, "-")}-${i}`;
    
    products.push({
      title,
      handle,
      description: `Exquisite ${style} style ${type.toLowerCase()}. Hand-crafted in ${origin} using ${material.toLowerCase()}. This piece represents the pinnacle of artisanal weaving, perfect for adding luxury and warmth to your home.`,
      images: [{ url: imgUrl }],
      thumbnail: imgUrl,
      metadata: { 
        material, 
        origin_country: origin, 
        style,
        kpsi: (200 + (i * 5)).toString(), 
        pile_height: `${8 + (i % 8)}mm`,
        care_instructions: "Professional dry cleaning recommended. Vacuum without beater bar."
      },
      category,
      variants: SIZES.map((size, sIdx) => {
        const basePrice = 29900 + (i * 2000) + (sIdx * 15000);
        return {
          title: size.title,
          sku: `${style.slice(0,3)}-${size.sku_suffix}-${i}`.toUpperCase().replace(/\s+/g, ""),
          prices: [
            { amount: basePrice, currency_code: "usd" },
            { amount: Math.floor(basePrice * 0.92), currency_code: "eur" }
          ]
        };
      })
    });
  }
  return products;
}

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION);
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION);

  logger.info("Starting Carpet E-Commerce PURGE & SEED...");

  // --- 1. PURGE EXISTING DATA ---
  try {
    const existingProducts = await productModuleService.listProducts({}, { select: ["id"] });
    if (existingProducts.length > 0) {
      logger.info(`Purging ${existingProducts.length} existing products...`);
      await productModuleService.deleteProducts(existingProducts.map(p => p.id));
    }

    const existingCategories = await productModuleService.listProductCategories({}, { select: ["id"] });
    if (existingCategories.length > 0) {
      logger.info(`Purging ${existingCategories.length} categories...`);
      await productModuleService.deleteProductCategories(existingCategories.map(c => c.id));
    }

    const existingCollections = await productModuleService.listProductCollections({}, { select: ["id"] });
    if (existingCollections.length > 0) {
      logger.info(`Purging ${existingCollections.length} collections...`);
      await productModuleService.deleteProductCollections(existingCollections.map(c => c.id));
    }
  } catch (e: any) {
    logger.warn(`Purge partially failed: ${e.message}`);
  }

  // --- 2. BASE CONFIG ---
  const [store] = await storeModuleService.listStores();
  if (store) {
    await storeModuleService.updateStores(store.id, {
      supported_currencies: [{ currency_code: "usd", is_default: true }, { currency_code: "eur" }],
    });
  }

  let [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({ name: "Default Sales Channel" });
  if (!defaultSalesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    });
    defaultSalesChannel = result[0];
  }

  let regions = await regionModuleService.listRegions();
  if (regions.length === 0) {
    try {
      const { result } = await createRegionsWorkflow(container).run({
        input: {
          regions: [
            { name: "North America", currency_code: "usd", countries: ["us", "ca"] },
            { name: "Europe", currency_code: "eur", countries: ["gb", "de", "fr"] },
          ],
        },
      });
      regions = result;
    } catch (e: any) {
      logger.error(`Failed to create regions: ${e.message}`);
      regions = await regionModuleService.listRegions();
    }
  }

  // Stock Location
  let [stockLocation] = await stockLocationService.listStockLocations({ name: "Main Carpet Warehouse" });
  if (!stockLocation) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: { locations: [{ name: "Main Carpet Warehouse", address: { city: "Los Angeles", country_code: "US", address_1: "1234 Carpet Boulevard" } }] },
    });
    stockLocation = result[0];
  }

  // Link Stock & Sales Channel
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.SALES_CHANNEL]: { sales_channel_id: defaultSalesChannel.id },
    });
  } catch {}

  // --- 3. CATEGORIES ---
  const { result: createdCategories } = await createProductCategoriesWorkflow(container).run({
    input: { product_categories: CATEGORIES.map(c => ({ ...c, is_active: true, is_internal: false })) },
  });
  const categoryMap: Record<string, string> = {};
  createdCategories.forEach(cat => categoryMap[cat.handle] = cat.id);
  logger.info(`Created ${createdCategories.length} product categories`);

  // --- 4. PRODUCTS (55 count to be safe) ---
  const productsToCreate = generateProducts(55);
  logger.info(`Seeding ${productsToCreate.length} carpets...`);

  const productInputs = productsToCreate.map(p => ({
    title: p.title,
    handle: p.handle,
    description: p.description,
    status: ProductStatus.PUBLISHED,
    images: p.images,
    thumbnail: p.thumbnail,
    metadata: p.metadata,
    categories: categoryMap[p.category] ? [{ id: categoryMap[p.category] }] : [],
    options: [{ title: "Size", values: p.variants.map(v => v.title) }],
    variants: p.variants.map(v => ({
      title: v.title,
      sku: v.sku,
      manage_inventory: false,
      options: { "Size": v.title },
      prices: v.prices,
    })),
    sales_channels: [{ id: defaultSalesChannel.id }],
  }));

  // Chunk production creation (10 at a time) to avoid memory issues or timeouts
  for (let i = 0; i < productInputs.length; i += 10) {
    const chunk = productInputs.slice(i, i + 10);
    try {
      logger.info(`Seeding chunk ${Math.floor(i/10) + 1}/${Math.ceil(productInputs.length/10)}...`);
      await createProductsWorkflow(container).run({
        input: { products: chunk },
      });
    } catch (e: any) {
      logger.error(`Failed to seed chunk: ${JSON.stringify(e)}`);
      // Log one product from chunk to see details
      logger.info(`Sample product input: ${JSON.stringify(chunk[0], null, 2)}`);
      throw e;
    }
  }

  // --- 5. SHIPPING ---
  let [shippingProfile] = await fulfillmentModuleService.listShippingProfiles({ type: "default" });
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Carpet Shipping Profile", type: "default" }] },
    });
    shippingProfile = result[0];
  }

  let [fulfillmentSet] = await fulfillmentModuleService.listFulfillmentSets({ type: "shipping" });
  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Carpet Delivery",
      type: "shipping",
      service_zones: [
        { name: "Global Zone", geo_zones: [{ type: "country", country_code: "us" }, { type: "country", country_code: "ca" }, { type: "country", country_code: "gb" }] },
      ],
    });
    
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    });

    const zone = fulfillmentSet.service_zones[0];
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Carpet Delivery",
          price_type: "flat",
          service_zone_id: zone.id,
          shipping_profile_id: shippingProfile.id,
          provider_id: "sp_system-default",
          type: { label: "Standard", description: "5-7 business days", code: "standard" },
          prices: [{ currency_code: "usd", amount: 2500 }, { currency_code: "eur", amount: 2300 }],
          rules: [{ attribute: "enabled_in_store", value: "true", operator: "eq" }],
        }
      ],
    });
  }

  logger.info("✅ 50+ Carpets Seeded & Purge Complete!");
}
