import { Module } from "@medusajs/framework/utils";
import { SearchModuleService } from "./service";

export const SEARCH_MODULE = "searchService";

export default Module(SEARCH_MODULE, {
  service: SearchModuleService,
});
