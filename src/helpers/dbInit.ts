import * as fs from "fs";
import { Client } from "pg";
import {
  PluginInstanceContainerController
} from "../PluginInstanceContainerController";

export function getSqlFilePath(
  containerController: PluginInstanceContainerController,
): string {
  const fileName = "create_db.sql";
  return `${containerController.getInitDbPath()}/${fileName}`;
}

export async function sqlFileExists(
  containerController: PluginInstanceContainerController,
) {
  return fs.existsSync(getSqlFilePath(containerController));
}

export async function writeDbCreateSql(
  containerController: PluginInstanceContainerController,
) {
  const filePath = getSqlFilePath(containerController);
  const fileContent = `
CREATE DATABASE IF NOT EXISTS \`${containerController.getEnv().POSTGRES_DB}\`;
GRANT ALL PRIVILEGES ON DATABASE \`${
    containerController.getEnv().POSTGRES_DB
  }\` TO \`${containerController.getEnv().POSTGRES_USER}\`;
`;

  await new Promise(async (resolve, reject) => {
    if (!(await sqlFileExists(containerController))) {
      fs.writeFileSync(filePath, fileContent);
    }
    resolve(true);
  });
}
