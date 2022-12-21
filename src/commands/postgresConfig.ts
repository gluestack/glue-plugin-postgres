const prompts = require("prompts");
import { GlueStackPlugin } from "src";
import { PluginInstance } from "src/PluginInstance";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";

interface IQuestion {
  type: string;
  name: string;
  message: string;
  initial: string;
}

export const defaultConfig = {
  db_name: "my_first_db",
  username: "postgres",
  password: "postgrespass",
};

const getNewInstanceQuestions = (oldConfig: any): IQuestion[] => {
  return [
    {
      type: "text",
      name: "db_name",
      message: "What would be your postgres database name?",
      initial: oldConfig?.db_name || defaultConfig.db_name,
    },
    {
      type: "text",
      name: "username",
      message: "What would be your postgres database username?",
      initial: oldConfig?.username || defaultConfig.username,
    },
    {
      type: "text",
      name: "password",
      message: "What would be your postgres database password?",
      initial: oldConfig?.password || defaultConfig.password,
    },
  ];
};

export const writeInstance = async (pluginInstance: PluginInstance) => {
  const response = await prompts(
    getNewInstanceQuestions(pluginInstance.gluePluginStore.get("db_config")),
  );
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
