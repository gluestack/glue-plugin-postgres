import { PluginInstanceContainerController } from "../PluginInstanceContainerController";
export declare function getSqlFilePath(containerController: PluginInstanceContainerController): string;
export declare function sqlFileExists(containerController: PluginInstanceContainerController): Promise<boolean>;
export declare function writeDbCreateSql(containerController: PluginInstanceContainerController): Promise<void>;
