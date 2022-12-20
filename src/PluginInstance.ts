import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import { PluginInstanceContainerController } from "./PluginInstanceContainerController";
import { IPostgres } from "./interfaces/IPostgres";

export class PluginInstance
  implements IInstance, ILifeCycle, IHasContainerController, IPostgres
{
  app: IApp;
  name: string;
  callerPlugin: IPlugin;
  containerController: IContainerController;
  isOfTypeInstance: boolean = false;
  gluePluginStore: IGlueStorePlugin;

  constructor(
    app: IApp,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
  ) {
    this.app = app;
    this.name = name;
    this.callerPlugin = callerPlugin;
    this.gluePluginStore = gluePluginStore;
    this.containerController = new PluginInstanceContainerController(app, this);
  }

  init() {
    //
  }

  destroy() {
    //
  }

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getContainerController(): IContainerController {
    return this.containerController;
  }

  getConnectionString(): string {
    let db_config = this.gluePluginStore.get("db_config");
    if (db_config) {
      return `postgresql://${db_config.username}:${
        db_config.password
      }@${this.getName()}:${this.getContainerController().getPortNumber()}/${
        db_config.db_name
      }`;
    }
    return "";
  }
}
