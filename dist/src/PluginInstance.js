"use strict";
exports.__esModule = true;
exports.PluginInstance = void 0;
var PluginInstanceContainerController_1 = require("./PluginInstanceContainerController");
var PluginInstance = (function () {
    function PluginInstance(app, callerPlugin, name, gluePluginStore, installationPath) {
        this.isOfTypeInstance = false;
        this.app = app;
        this.name = name;
        this.callerPlugin = callerPlugin;
        this.gluePluginStore = gluePluginStore;
        this.installationPath = installationPath;
        this.containerController = new PluginInstanceContainerController_1.PluginInstanceContainerController(app, this);
    }
    PluginInstance.prototype.init = function () {
    };
    PluginInstance.prototype.destroy = function () {
    };
    PluginInstance.prototype.getName = function () {
        return this.name;
    };
    PluginInstance.prototype.getCallerPlugin = function () {
        return this.callerPlugin;
    };
    PluginInstance.prototype.getInstallationPath = function () {
        return this.installationPath;
    };
    PluginInstance.prototype.getContainerController = function () {
        return this.containerController;
    };
    PluginInstance.prototype.getConnectionString = function () {
        var db_config = this.gluePluginStore.get("db_config");
        if (db_config) {
            return "postgresql://".concat(db_config.username, ":").concat(db_config.password, "@").concat(this.getName(), ":").concat(this.getContainerController().getPortNumber(), "/").concat(db_config.db_name);
        }
        return "";
    };
    return PluginInstance;
}());
exports.PluginInstance = PluginInstance;
//# sourceMappingURL=PluginInstance.js.map