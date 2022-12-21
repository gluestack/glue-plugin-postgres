const { DockerodeHelper } = require("@gluestack/helpers");
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import { IPostgres } from "./interfaces/IPostgres";
import { sqlFileExists, writeDbCreateSql } from "./helpers/dbInit";
import { defaultConfig } from "./commands/postgresConfig";

export class PluginInstanceContainerController implements IContainerController {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  dockerfile: string;
  callerInstance: IInstance & IPostgres;

  constructor(app: IApp, callerInstance: IInstance & IPostgres) {
    this.app = app;
    this.callerInstance = callerInstance;
    this.setStatus(this.callerInstance.gluePluginStore.get("status"));
    this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
    this.setContainerId(
      this.callerInstance.gluePluginStore.get("container_id"),
    );
  }

  getCallerInstance(): IInstance {
    return this.callerInstance;
  }

  getEnv() {
    let db_config = defaultConfig;

    if (
      !this.callerInstance.gluePluginStore.get("db_config") ||
      !this.callerInstance.gluePluginStore.get("db_config").db_name
    )
      this.callerInstance.gluePluginStore.set("db_config", db_config);

    db_config = this.callerInstance.gluePluginStore.get("db_config");

    return {
      POSTGRES_USER: db_config.username,
      POSTGRES_PASSWORD: db_config.password,
      POSTGRES_DB: db_config.db_name,
    };
  }

  async getDockerJson() {
    return {
      Image: "postgres:12",
      WorkingDir: "/app",
      HostConfig: {
        PortBindings: {
          "5432/tcp": [
            {
              HostPort: this.getPortNumber(true).toString(),
            },
          ],
        },
      },
      ExposedPorts: {
        "5432/tcp": {},
      },
      RestartPolicy: {
        Name: "always",
      },
      Healthcheck: {
        Test: ["CMD-SHELL", `pg_isready -U ${this.getEnv().POSTGRES_USER}`],
        Interval: this.toNano(10),
        Timeout: this.toNano(10),
        Retries: 50,
        StartPeriod: this.toNano(30),
      },
      Binds: [
        `${this.getDbPath()}:/var/lib/postgresql/data/`,
        `${this.getInitDbPath()}/init.db`,
      ],
    };
  }

  getDbPath() {
    return (
      process.cwd() +
      `${this.callerInstance.getInstallationPath().substring(1)}/db`
    );
  }

  getInitDbPath() {
    return (
      process.cwd() +
      `${this.callerInstance.getInstallationPath().substring(1)}/init.db`
    );
  }

  toNano(time: number): number {
    return time * Math.pow(10, 9);
  }

  getStatus(): "up" | "down" {
    return this.status;
  }

  getPortNumber(returnDefault?: boolean): number {
    if (this.portNumber) {
      return this.portNumber;
    }
    if (returnDefault) {
      return 5432;
    }
  }

  getContainerId(): string {
    return this.containerId;
  }

  setStatus(status: "up" | "down") {
    this.callerInstance.gluePluginStore.set("status", status || "down");
    return (this.status = status || "down");
  }

  setPortNumber(portNumber: number) {
    this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
    return (this.portNumber = portNumber || null);
  }

  setContainerId(containerId: string) {
    this.callerInstance.gluePluginStore.set(
      "container_id",
      containerId || null,
    );
    return (this.containerId = containerId || null);
  }

  setDockerfile(dockerfile: string) {
    this.callerInstance.gluePluginStore.set("dockerfile", dockerfile || null);
    return (this.dockerfile = dockerfile || null);
  }

  getConfig(): any {}

  async up() {
    let ports =
      this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];

    await new Promise(async (resolve, reject) => {
      await writeDbCreateSql(this);
      DockerodeHelper.getPort(this.getPortNumber(true), ports)
        .then(async (port: number) => {
          this.portNumber = port;
          DockerodeHelper.up(
            await this.getDockerJson(),
            this.getEnv(),
            this.portNumber,
            this.callerInstance.getName(),
          )
            .then(
              ({
                status,
                portNumber,
                containerId,
              }: {
                status: "up" | "down";
                portNumber: number;
                containerId: string;
                dockerfile: string;
              }) => {
                DockerodeHelper.generateDockerFile(
                  this.getDockerJson(),
                  this.getEnv(),
                  this.callerInstance.getName(),
                );
                this.setStatus(status);
                this.setPortNumber(portNumber);
                this.setContainerId(containerId);
                ports.push(portNumber);
                this.callerInstance.callerPlugin.gluePluginStore.set(
                  "ports",
                  ports,
                );
                return resolve(true);
              },
            )
            .catch((e: any) => {
              return reject(e);
            });
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async down() {
    let ports =
      this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
    await new Promise(async (resolve, reject) => {
      DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
        .then(() => {
          this.setStatus("down");
          var index = ports.indexOf(this.getPortNumber());
          if (index !== -1) {
            ports.splice(index, 1);
          }
          this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);

          this.setPortNumber(null);
          this.setContainerId(null);
          return resolve(true);
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async build() {}
}
