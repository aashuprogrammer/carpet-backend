import { Client } from "@elastic/elasticsearch";

export class SearchModuleService {
  private client: Client;
  private indexName: string = "products";

  constructor(container: any, options: { node: string }) {
    this.client = new Client({
      node: options.node || "http://localhost:9200",
    });
  }


  async search(query: string, options: any = {}) {
    try {
      const result = await this.client.search({
        index: this.indexName,
        query: {
          multi_match: {
            query,
            fields: ["title^3", "description", "metadata.material", "metadata.origin_country"],
            fuzziness: "AUTO",
          },
        },
      });
      return result;
    } catch (error) {
      console.error("Elasticsearch Search Error:", error);
      return { hits: { hits: [] } };
    }
  }

  async indexProducts(products: any[]) {
    try {
      const body = products.flatMap((doc) => [
        { index: { _index: this.indexName, _id: doc.id } },
        doc,
      ]);
      const result = await this.client.bulk({ refresh: true, body });
      return result;
    } catch (error) {
      console.error("Elasticsearch Indexing Error:", error);
    }
  }

  async deleteProduct(productId: string) {
    try {
      await this.client.delete({
        index: this.indexName,
        id: productId,
        refresh: true,
      });
    } catch (error) {
      console.error("Elasticsearch Delete Error:", error);
    }
  }
}
