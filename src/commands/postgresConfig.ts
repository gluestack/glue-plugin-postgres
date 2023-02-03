const prompts = require("prompts");
import { GlueStackPlugin } from "../";
import { PluginInstance } from "..//PluginInstance";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";

interface IQuestion {
  type: any;
  name: string;
  message: string;
  initial: string | boolean;
}

export const defaultConfig = {
  db_name: "my_first_db",
  username: "postgres",
  password: "postgrespass",
  db_host: "host.docker.internal",
  db_port: "5432"
};

const getNewInstanceQuestions = (oldConfig: any): IQuestion[] => {
  return [
    {
      type: 'confirm',
      name: "choice",
      message: "Do you want to use external minio?",
      initial: false
    },
    {
      type: (prev: any) => (prev === true ? 'text' : null),
      name: "db_name",
      message: "What would be your postgres database name?",
      initial: oldConfig?.db_name || defaultConfig.db_name,
    },
    {
      type: (prev: any) => (prev ? 'text' : null),
      name: "username",
      message: "What would be your postgres database username?",
      initial: oldConfig?.username || defaultConfig.username,
    },
    {
      type: (prev: any) => (prev ? 'text' : null),
      name: "password",
      message: "What would be your postgres database password?",
      initial: oldConfig?.password || defaultConfig.password,
    },
    {
      type: (prev: any) => (prev ? 'text' : null),
      name: "password",
      message: "What would be your postgres database host?",
      initial: oldConfig?.host || defaultConfig.db_host,
    },
    {
      type: (prev: any) => (prev ? 'text' : null),
      name: "password",
      message: "What would be your postgres database port?",
      initial: oldConfig?.port || defaultConfig.db_port,
    },
  ];
};

export const writeInstance = async (pluginInstance: PluginInstance) => {
  let response = await prompts(
    getNewInstanceQuestions(pluginInstance.gluePluginStore.get("db_config")),
  );

  if (!response.choice) {
    response = defaultConfig;
    response.db_port = `${await pluginInstance.containerController.getPortNumber()}`;
  } else {
    delete response.choice;
  }

  // trim the values in an object
  Object.keys(response).forEach(key => response[key] = response[key].trim());

  pluginInstance.gluePluginStore.set("db_config", response);
  console.log();
  console.log(`Saved ${pluginInstance.getName()} config`);
  console.table(response);
  console.log();
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
