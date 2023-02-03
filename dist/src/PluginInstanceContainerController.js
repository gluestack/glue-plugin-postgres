"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PluginInstanceContainerController = void 0;
var DockerodeHelper = require("@gluestack/helpers").DockerodeHelper;
var dbInit_1 = require("./helpers/dbInit");
var postgresConfig_1 = require("./commands/postgresConfig");
var create_folder_1 = require("./helpers/create-folder");
var PluginInstanceContainerController = (function () {
    function PluginInstanceContainerController(app, callerInstance) {
        this.status = "down";
        this.app = app;
        this.callerInstance = callerInstance;
        this.setStatus(this.callerInstance.gluePluginStore.get("status"));
        this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
        this.setContainerId(this.callerInstance.gluePluginStore.get("container_id"));
    }
    PluginInstanceContainerController.prototype.getCallerInstance = function () {
        return this.callerInstance;
    };
    PluginInstanceContainerController.prototype.getEnv = function () {
        var db_config = postgresConfig_1.defaultConfig;
        if (!this.callerInstance.gluePluginStore.get("db_config") ||
            !this.callerInstance.gluePluginStore.get("db_config").db_name)
            this.callerInstance.gluePluginStore.set("db_config", db_config);
        db_config = this.callerInstance.gluePluginStore.get("db_config");
        return {
            POSTGRES_USER: db_config.username,
            POSTGRES_PASSWORD: db_config.password,
            POSTGRES_DB: db_config.db_name,
            POSTGRES_HOST: db_config.db_host,
            POSTGRES_PORT: parseInt(db_config.db_port)
        };
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _b = {
                            Image: "postgres:12",
                            WorkingDir: "/app"
                        };
                        _c = {};
                        _d = {};
                        _a = "5432/tcp";
                        _e = {};
                        return [4, this.getPortNumber()];
                    case 1: return [2, (_b.HostConfig = (_c.PortBindings = (_d[_a] = [
                            (_e.HostPort = (_f.sent()).toString(),
                                _e)
                        ],
                            _d),
                            _c),
                            _b.ExposedPorts = {
                                "5432/tcp": {}
                            },
                            _b.RestartPolicy = {
                                Name: "always"
                            },
                            _b.Healthcheck = {
                                Test: ["CMD-SHELL", "pg_isready -U ".concat(this.getEnv().POSTGRES_USER)],
                                Interval: this.toNano(10),
                                Timeout: this.toNano(10),
                                Retries: 50,
                                StartPeriod: this.toNano(30)
                            },
                            _b.Binds = [
                                "".concat(this.getDbPath(), ":/var/lib/postgresql/data/"),
                                "".concat(this.getInitDbPath(), "/init.db"),
                            ],
                            _b)];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getDbPath = function () {
        return (process.cwd() +
            "".concat(this.callerInstance.getInstallationPath().substring(1), "/db"));
    };
    PluginInstanceContainerController.prototype.getInitDbPath = function () {
        return (process.cwd() +
            "".concat(this.callerInstance.getInstallationPath().substring(1), "/init.db"));
    };
    PluginInstanceContainerController.prototype.toNano = function (time) {
        return time * Math.pow(10, 9);
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function (returnDefault) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        if (_this.portNumber) {
                            return resolve(_this.portNumber);
                        }
                        var ports = _this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                        DockerodeHelper.getPort(5432, ports)
                            .then(function (port) {
                            _this.setPortNumber(port);
                            ports.push(port);
                            _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                            return resolve(_this.portNumber);
                        })["catch"](function (e) {
                            reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstanceContainerController.prototype.getContainerId = function () {
        return this.containerId;
    };
    PluginInstanceContainerController.prototype.setStatus = function (status) {
        this.callerInstance.gluePluginStore.set("status", status || "down");
        return (this.status = status || "down");
    };
    PluginInstanceContainerController.prototype.setPortNumber = function (portNumber) {
        this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
        return (this.portNumber = portNumber || null);
    };
    PluginInstanceContainerController.prototype.setContainerId = function (containerId) {
        this.callerInstance.gluePluginStore.set("container_id", containerId || null);
        return (this.containerId = containerId || null);
    };
    PluginInstanceContainerController.prototype.setDockerfile = function (dockerfile) {
        this.callerInstance.gluePluginStore.set("dockerfile", dockerfile || null);
        return (this.dockerfile = dockerfile || null);
    };
    PluginInstanceContainerController.prototype.getConfig = function () { };
    PluginInstanceContainerController.prototype.up = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getPortNumber()];
                    case 1:
                        _a.sent();
                        return [4, (0, create_folder_1.createFolder)("".concat(this.callerInstance.getInstallationPath(), "/db"))];
                    case 2:
                        _a.sent();
                        return [4, (0, create_folder_1.createFolder)("".concat(this.callerInstance.getInstallationPath(), "/init.db"))];
                    case 3:
                        _a.sent();
                        return [4, (0, dbInit_1.writeDbCreateSql)(this)];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    PluginInstanceContainerController.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    return PluginInstanceContainerController;
}());
exports.PluginInstanceContainerController = PluginInstanceContainerController;
//# sourceMappingURL=PluginInstanceContainerController.js.map