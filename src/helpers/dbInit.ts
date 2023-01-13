import * as fs from "fs";
import { Client } from "pg";
import {
  PluginInstanceContainerController
} from "../PluginInstanceContainerController";

export const waitInSeconds = (seconds: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done');
    }, seconds * 1000);
  });
};

export const connectionCheck = async (connection: string, retry: number = 0): Promise<void> => {
  const dbName: string = connection.split('/').pop();
  console.log(`[postgres] trying to connect with the ${dbName} database...`);

  const client = new Client({
    connectionString: connection.replace('host.docker.internal', 'localhost')
  });

  try {
    await client.connect();

    await client
      .query(`SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('${dbName}');`);

    console.log(`[postgres] connected with the ${dbName} database...`);

    await client.end();
    await waitInSeconds(2);

  } catch (error) {
    console.log('> [postgres] still initialising...');

    retry += 1;
    if (retry > 4) {
      console.log('> [postgres] is not responding, please check your docker logs');
      process.exit(1);
    }

    await waitInSeconds(5);
    await connectionCheck(connection, retry);
  }
}

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
