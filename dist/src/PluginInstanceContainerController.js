"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
            POSTGRES_DB: db_config.db_name
        };
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = [{ Image: "postgres:12", WorkingDir: "/app", HostConfig: {
                                    PortBindings: {
                                        "5432/tcp": [
                                            {
                                                HostPort: this.getPortNumber(true).toString()
                                            },
                                        ]
                                    }
                                }, ExposedPorts: {
                                    "5432/tcp": {}
                                }, RestartPolicy: {
                                    Name: "always"
                                }, Healthcheck: {
                                    Test: ["CMD-SHELL", "pg_isready -U ".concat(this.getEnv().POSTGRES_USER)],
                                    Interval: this.toNano(10),
                                    Timeout: this.toNano(10),
                                    Retries: 50,
                                    StartPeriod: this.toNano(30)
                                } }];
                        return [4, this.getVolumes()];
                    case 1: return [2, __assign.apply(void 0, _a.concat([(_b.sent())]))];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getVolumes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, (0, dbInit_1.sqlFileExists)(this)];
                    case 1:
                        if (!(_b.sent())) {
                            return [2, {
                                    Volumes: (_a = {},
                                        _a[this.getDbPath()] = "/var/lib/postgresql/data/",
                                        _a[this.getInitDbPath()] = "/docker-entrypoint-initdb.d/",
                                        _a)
                                }];
                        }
                        return [2, {}];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getDbPath = function () {
        return "".concat(this.callerInstance.getInstallationPath(), "/db");
    };
    PluginInstanceContainerController.prototype.getInitDbPath = function () {
        return "".concat(this.callerInstance.getInstallationPath(), "/init.db");
    };
    PluginInstanceContainerController.prototype.toNano = function (time) {
        return time * Math.pow(10, 9);
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function (returnDefault) {
        if (this.portNumber) {
            return this.portNumber;
        }
        if (returnDefault) {
            return 5432;
        }
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
            var ports;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ports = this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                        return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, (0, dbInit_1.writeDbCreateSql)(this)];
                                        case 1:
                                            _a.sent();
                                            DockerodeHelper.getPort(this.getPortNumber(true), ports)
                                                .then(function (port) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, _b;
                                                var _this = this;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            this.portNumber = port;
                                                            _b = (_a = DockerodeHelper).up;
                                                            return [4, this.getDockerJson()];
                                                        case 1:
                                                            _b.apply(_a, [_c.sent(), this.getEnv(),
                                                                this.portNumber,
                                                                this.callerInstance.getName()])
                                                                .then(function (_a) {
                                                                var status = _a.status, portNumber = _a.portNumber, containerId = _a.containerId;
                                                                DockerodeHelper.generateDockerFile(_this.getDockerJson(), _this.getEnv(), _this.callerInstance.getName());
                                                                _this.setStatus(status);
                                                                _this.setPortNumber(portNumber);
                                                                _this.setContainerId(containerId);
                                                                ports.push(portNumber);
                                                                _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                                                                return resolve(true);
                                                            })["catch"](function (e) {
                                                                return reject(e);
                                                            });
                                                            return [2];
                                                    }
                                                });
                                            }); })["catch"](function (e) {
                                                return reject(e);
                                            });
                                            return [2];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ports;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ports = this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                        return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
                                        .then(function () {
                                        _this.setStatus("down");
                                        var index = ports.indexOf(_this.getPortNumber());
                                        if (index !== -1) {
                                            ports.splice(index, 1);
                                        }
                                        _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                                        _this.setPortNumber(null);
                                        _this.setContainerId(null);
                                        return resolve(true);
                                    })["catch"](function (e) {
                                        return reject(e);
                                    });
                                    return [2];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
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