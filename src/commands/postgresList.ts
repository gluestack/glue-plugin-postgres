import { GlueStackPlugin } from "src";
import { PluginInstance } from "src/PluginInstance";

export async function postgresList(glueStackPlugin: GlueStackPlugin) {
  const arr = glueStackPlugin.getInstances().map((instance: PluginInstance) => {
    const db = instance.gluePluginStore.get("db_config") || {};
    return {
      instance: instance.getName(),
      ...db,
    };
  });
  console.table(arr);
}
