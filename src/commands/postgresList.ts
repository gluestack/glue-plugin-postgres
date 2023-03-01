import { GlueStackPlugin } from "..";
import { PluginInstance } from "../PluginInstance";

export function runner(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("postgres:list")
    .description("List installed postgres instances")
    .action(async () => postgresList(glueStackPlugin));
}

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
