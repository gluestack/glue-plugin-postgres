import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import { IPostgres } from "./interfaces/IPostgres";
export declare class PluginInstance implements IInstance, ILifeCycle, IHasContainerController, IPostgres {
    app: IApp;
    name: string;
    callerPlugin: IPlugin;
    containerController: IContainerController;
    isOfTypeInstance: boolean;
    gluePluginStore: IGlueStorePlugin;
    installationPath: string;
    constructor(app: IApp, callerPlugin: IPlugin, name: string, gluePluginStore: IGlueStorePlugin, installationPath: string);
    init(): void;
    destroy(): void;
    getName(): string;
    getCallerPlugin(): IPlugin;
    getInstallationPath(): string;
    getContainerController(): IContainerController;
    getConnectionString(): Promise<string>;
}
