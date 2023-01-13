"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.writeDbCreateSql = exports.sqlFileExists = exports.getSqlFilePath = exports.connectionCheck = exports.waitInSeconds = void 0;
var fs = __importStar(require("fs"));
var pg_1 = require("pg");
var waitInSeconds = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve('done');
        }, seconds * 1000);
    });
};
exports.waitInSeconds = waitInSeconds;
var connectionCheck = function (connection, retry) {
    if (retry === void 0) { retry = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dbName, client, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbName = connection.split('/').pop();
                    console.log("[postgres] trying to connect with the ".concat(dbName, " database..."));
                    client = new pg_1.Client({
                        connectionString: connection.replace('host.docker.internal', 'localhost')
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 9]);
                    return [4, client.connect()];
                case 2:
                    _a.sent();
                    return [4, client
                            .query("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('".concat(dbName, "');"))];
                case 3:
                    _a.sent();
                    console.log("[postgres] connected with the ".concat(dbName, " database..."));
                    return [4, client.end()];
                case 4:
                    _a.sent();
                    return [4, (0, exports.waitInSeconds)(2)];
                case 5:
                    _a.sent();
                    return [3, 9];
                case 6:
                    error_1 = _a.sent();
                    console.log('> [postgres] still initialising...');
                    retry += 1;
                    if (retry > 4) {
                        console.log('> [postgres] is not responding, please check your docker logs');
                        process.exit(1);
                    }
                    return [4, (0, exports.waitInSeconds)(5)];
                case 7:
                    _a.sent();
                    return [4, (0, exports.connectionCheck)(connection, retry)];
                case 8:
                    _a.sent();
                    return [3, 9];
                case 9: return [2];
            }
        });
    });
};
exports.connectionCheck = connectionCheck;
function getSqlFilePath(containerController) {
    var fileName = "create_db.sql";
    return "".concat(containerController.getInitDbPath(), "/").concat(fileName);
}
exports.getSqlFilePath = getSqlFilePath;
function sqlFileExists(containerController) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, fs.existsSync(getSqlFilePath(containerController))];
        });
    });
}
exports.sqlFileExists = sqlFileExists;
function writeDbCreateSql(containerController) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, fileContent;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = getSqlFilePath(containerController);
                    fileContent = "\nCREATE DATABASE IF NOT EXISTS `".concat(containerController.getEnv().POSTGRES_DB, "`;\nGRANT ALL PRIVILEGES ON DATABASE `").concat(containerController.getEnv().POSTGRES_DB, "` TO `").concat(containerController.getEnv().POSTGRES_USER, "`;\n");
                    return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, sqlFileExists(containerController)];
                                    case 1:
                                        if (!(_a.sent())) {
                                            fs.writeFileSync(filePath, fileContent);
                                        }
                                        resolve(true);
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
}
exports.writeDbCreateSql = writeDbCreateSql;
//# sourceMappingURL=dbInit.js.map