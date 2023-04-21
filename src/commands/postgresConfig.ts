const prompts = require("prompts");
import { GlueStackPlugin } from "../";
import { PluginInstance } from "../PluginInstance";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import { writeEnv } from "../helpers/write-env";

export function runner(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("postgres:config")
    .description("Update config of a postgres instance")
    .action(async () => postgresConfig(glueStackPlugin));
}

interface IQuestion {
  type: any;
  name: string;
  message: string;
  initial: string | boolean;
}

export const defaultConfig = {
  external: false,
  db_name: "my_first_db",
  username: "postgres",
  password: "postgrespass",
  db_host: "postgres",
  db_port: "5432"
};

const getNewInstanceQuestions = (oldConfig: any): IQuestion[] => {
  return [
    {
      type: 'confirm',
      name: "external",
      message: "Do you want to use external postgres?",
      initial: false
    },
    {
      type: 'text',
      name: "db_name",
      message: "What would be your postgres database name?",
      initial: oldConfig?.db_name || defaultConfig.db_name,
    },
    {
      type: 'text',
      name: "username",
      message: "What would be your postgres database username?",
      initial: oldConfig?.username || defaultConfig.username,
    },
    {
      type: 'text',
      name: "password",
      message: "What would be your postgres database password?",
      initial: oldConfig?.password || defaultConfig.password,
    }
  ];
};

const getExternalInstanceQuestions = (oldConfig: any): IQuestion[] => {
  return [
    {
      type: 'text',
      name: "db_host",
      message: "What would be your postgres database host?",
      initial: oldConfig?.host || defaultConfig.db_host,
    },
    {
      type: 'text',
      name: "db_port",
      message: "What would be your postgres database port?",
      initial: oldConfig?.port || defaultConfig.db_port,
    },
  ];
};

export const writeInstance = async (pluginInstance: PluginInstance) => {
  let externalConfig;
  let response = await prompts(
    getNewInstanceQuestions(pluginInstance.gluePluginStore.get("db_config")),
  );

  if (response.external) {
    externalConfig = await prompts(
      getExternalInstanceQuestions(pluginInstance.gluePluginStore.get("db_config")),
    );
  }

  if (!response.external) {
    response.db_host = defaultConfig.db_host;
    response.db_port = `${await pluginInstance.containerController.getPortNumber()}`;
  } else {
    response = { ...response, ...externalConfig };
  }

  // trim the values in an object
  Object.keys(response).forEach(key =>
    key !== 'external' ? response[key] = response[key].trim() : response[key]
  );

  pluginInstance.gluePluginStore.set("db_config", response);

  console.log();
  console.log(`Saved ${pluginInstance.getName()} config`);
  console.table(response);
  console.log();
  await writeEnv(pluginInstance);
};

async function selectInstance(pluginInstances: IInstance[]) {
  const choices = pluginInstances.map((instance: PluginInstance) => {
    return {
      title: instance.getName(),
      description: `Select ${instance.getName()} instance`,
      value: instance,
    };
  });
  const { value } = await prompts({
    type: "select",
    name: "value",
    message: "Select an instance",
    choices: choices,
  });

  return value;
}

export async function postgresConfig(glueStackPlugin: GlueStackPlugin) {
  if (glueStackPlugin.getInstances().length) {
    const instance = await selectInstance(glueStackPlugin.getInstances());
    if (instance) {
      await writeInstance(instance);
    }
  } else {
    console.error("No postgres instances found");
  }
}
