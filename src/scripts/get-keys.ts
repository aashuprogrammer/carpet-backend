import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function getKeys({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title"],
    filters: {
      type: "publishable",
    },
  });

  if (data && data.length > 0) {
    logger.info("Found Publishable API Keys:");
    data.forEach((key: any) => {
      logger.info(`- ${key.title}: ${key.token}`);
    });
  } else {
    logger.error("No Publishable API Keys found.");
  }
}
