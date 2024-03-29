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
exports.postgresConfig = exports.writeInstance = exports.defaultConfig = exports.runner = void 0;
var prompts = require("prompts");
var write_env_1 = require("../helpers/write-env");
function runner(program, glueStackPlugin) {
    var _this = this;
    var command = program
        .command("postgres:config")
        .description("Update config of a postgres instance")
        .action(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, postgresConfig(glueStackPlugin)];
    }); }); });
}
exports.runner = runner;
exports.defaultConfig = {
    external: false,
    db_name: "my_first_db",
    username: "postgres",
    password: "postgrespass",
    db_host: "host.docker.internal",
    db_port: "5432"
};
var getNewInstanceQuestions = function (oldConfig) {
    return [
        {
            type: 'confirm',
            name: "external",
            message: "Do you want to use external postgres?",
            initial: false
        },
        {
            type: 'text',
            name: "db_name",
            message: "What would be your postgres database name?",
            initial: (oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.db_name) || exports.defaultConfig.db_name
        },
        {
            type: 'text',
            name: "username",
            message: "What would be your postgres database username?",
            initial: (oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.username) || exports.defaultConfig.username
        },
        {
            type: 'text',
            name: "password",
            message: "What would be your postgres database password?",
            initial: (oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.password) || exports.defaultConfig.password
        }
    ];
};
var getExternalInstanceQuestions = function (oldConfig) {
    return [
        {
            type: 'text',
            name: "db_host",
            message: "What would be your postgres database host?",
            initial: (oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.host) || exports.defaultConfig.db_host
        },
        {
            type: 'text',
            name: "db_port",
            message: "What would be your postgres database port?",
            initial: (oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.port) || exports.defaultConfig.db_port
        },
    ];
};
var writeInstance = function (pluginInstance) { return __awaiter(void 0, void 0, void 0, function () {
    var externalConfig, response, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4, prompts(getNewInstanceQuestions(pluginInstance.gluePluginStore.get("db_config")))];
            case 1:
                response = _c.sent();
                if (!response.external) return [3, 3];
                return [4, prompts(getExternalInstanceQuestions(pluginInstance.gluePluginStore.get("db_config")))];
            case 2:
                externalConfig = _c.sent();
                _c.label = 3;
            case 3:
                if (!!response.external) return [3, 5];
                response.db_host = exports.defaultConfig.db_host;
                _a = response;
                _b = "".concat;
                return [4, pluginInstance.containerController.getPortNumber()];
            case 4:
                _a.db_port = _b.apply("", [_c.sent()]);
                return [3, 6];
            case 5:
                response = __assign(__assign({}, response), externalConfig);
                _c.label = 6;
            case 6:
                Object.keys(response).forEach(function (key) {
                    return key !== 'external' ? response[key] = response[key].trim() : response[key];
                });
                pluginInstance.gluePluginStore.set("db_config", response);
                console.log();
                console.log("Saved ".concat(pluginInstance.getName(), " config"));
                console.table(response);
                console.log();
                return [4, (0, write_env_1.writeEnv)(pluginInstance)];
            case 7:
                _c.sent();
                return [2];
        }
    });
}); };
exports.writeInstance = writeInstance;
function selectInstance(pluginInstances) {
    return __awaiter(this, void 0, void 0, function () {
        var choices, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    choices = pluginInstances.map(function (instance) {
                        return {
                            title: instance.getName(),
                            description: "Select ".concat(instance.getName(), " instance"),
                            value: instance
                        };
                    });
                    return [4, prompts({
                            type: "select",
                            name: "value",
                            message: "Select an instance",
                            choices: choices
                        })];
                case 1:
                    value = (_a.sent()).value;
                    return [2, value];
            }
        });
    });
}
function postgresConfig(glueStackPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!glueStackPlugin.getInstances().length) return [3, 4];
                    return [4, selectInstance(glueStackPlugin.getInstances())];
                case 1:
                    instance = _a.sent();
                    if (!instance) return [3, 3];
                    return [4, (0, exports.writeInstance)(instance)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3, 5];
                case 4:
                    console.error("No postgres instances found");
                    _a.label = 5;
                case 5: return [2];
            }
        });
    });
}
exports.postgresConfig = postgresConfig;
//# sourceMappingURL=postgresConfig.js.map