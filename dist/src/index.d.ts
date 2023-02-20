import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IManagesInstances from "@gluestack/framework/types/plugin/interface/IManagesInstances";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
export declare class GlueStackPlugin implements IPlugin, IManagesInstances, ILifeCycle {
    app: IApp;
    instances: IInstance[];
    type: "stateless" | "stateful" | "devonly";
    gluePluginStore: IGlueStorePlugin;
    constructor(app: IApp, gluePluginStore: IGlueStorePlugin);
    init(): void;
    destroy(): void;
    getName(): string;
    getVersion(): string;
    getType(): "stateless" | "stateful" | "devonly";
    getTemplateFolderPath(): string;
    getInstallationPath(target: string): string;
    runPostInstall(instanceName: string, target: string): Promise<void>;
    createInstance(key: string, gluePluginStore: IGlueStorePlugin, installationPath: string): IInstance;
    getInstances(): IInstance[];
}
