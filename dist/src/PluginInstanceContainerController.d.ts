import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import { IPostgres } from "./interfaces/IPostgres";
export declare class PluginInstanceContainerController implements IContainerController {
    app: IApp;
    status: "up" | "down";
    portNumber: number;
    containerId: string;
    dockerfile: string;
    callerInstance: IInstance & IPostgres;
    constructor(app: IApp, callerInstance: IInstance & IPostgres);
    getCallerInstance(): IInstance;
    getEnv(): {
        POSTGRES_USER: string;
        POSTGRES_PASSWORD: string;
        POSTGRES_DB: string;
        POSTGRES_HOST: string;
        POSTGRES_PORT: number;
        POSTGRES_STRING: any;
    };
    getDockerJson(): Promise<{
        Image: string;
        WorkingDir: string;
        HostConfig: {
            PortBindings: {
                "5432/tcp": {
                    HostPort: string;
                }[];
            };
        };
        ExposedPorts: {
            "5432/tcp": {};
        };
        RestartPolicy: {
            Name: string;
        };
        Healthcheck: {
            Test: string[];
            Interval: number;
            Timeout: number;
            Retries: number;
            StartPeriod: number;
        };
        Binds: string[];
    }>;
    getDbPath(): string;
    getInitDbPath(): string;
    toNano(time: number): number;
    getStatus(): "up" | "down";
    getPortNumber(returnDefault?: boolean): Promise<unknown>;
    getContainerId(): string;
    setStatus(status: "up" | "down"): "up" | "down";
    setPortNumber(portNumber: number): number;
    setContainerId(containerId: string): string;
    setDockerfile(dockerfile: string): string;
    getConfig(): any;
    up(): Promise<void>;
    down(): Promise<void>;
    build(): Promise<void>;
}
