import { GlueStackPlugin } from "../";
import { PluginInstance } from "../PluginInstance";
export declare function runner(program: any, glueStackPlugin: GlueStackPlugin): void;
export declare const defaultConfig: {
    external: boolean;
    db_name: string;
    username: string;
    password: string;
    db_host: string;
    db_port: string;
};
export declare const writeInstance: (pluginInstance: PluginInstance) => Promise<void>;
export declare function postgresConfig(glueStackPlugin: GlueStackPlugin): Promise<void>;
