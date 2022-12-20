import { GlueStackPlugin } from "src";
import { postgresConfig } from "./postgresConfig";
import { postgresList } from "./postgresList";

export function postgres(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("postgres")
    .description("Postgres instance commands");

  command
    .command("config")
    .description("Update config of a postgres instance")
    .action(async () => postgresConfig(glueStackPlugin));

  command
    .command("list")
    .description("List installed postgres instances")
    .action(async () => postgresList(glueStackPlugin));
}
