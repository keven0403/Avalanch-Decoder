"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAPI = void 0;
var jrpcapi_1 = require("../../common/jrpcapi");
/**
 * Class for interacting with a node's AdminAPI.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called.
 * Instead, use the [[Avalanche.addAPI]] function to register this interface with Avalanche.
 */
var AdminAPI = /** @class */ (function (_super) {
    __extends(AdminAPI, _super);
    /**
     * This class should not be instantiated directly. Instead use the [[Avalanche.addAPI]]
     * method.
     *
     * @param core A reference to the Avalanche class
     * @param baseURL Defaults to the string "/ext/admin" as the path to rpc's baseURL
     */
    function AdminAPI(core, baseURL) {
        if (baseURL === void 0) { baseURL = "/ext/admin"; }
        var _this = _super.call(this, core, baseURL) || this;
        /**
         * Assign an API an alias, a different endpoint for the API. The original endpoint will still
         * work. This change only affects this node other nodes will not know about this alias.
         *
         * @param endpoint The original endpoint of the API. endpoint should only include the part of
         * the endpoint after /ext/
         * @param alias The API being aliased can now be called at ext/alias
         *
         * @returns Returns a Promise boolean containing success, true for success, false for failure.
         */
        _this.alias = function (endpoint, alias) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            endpoint: endpoint,
                            alias: alias
                        };
                        return [4 /*yield*/, this.callMethod("admin.alias", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.success
                                ? response.data.result.success
                                : response.data.result];
                }
            });
        }); };
        /**
         * Give a blockchain an alias, a different name that can be used any place the blockchain’s
         * ID is used.
         *
         * @param chain The blockchain’s ID
         * @param alias Can now be used in place of the blockchain’s ID (in API endpoints, for example)
         *
         * @returns Returns a Promise boolean containing success, true for success, false for failure.
         */
        _this.aliasChain = function (chain, alias) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            chain: chain,
                            alias: alias
                        };
                        return [4 /*yield*/, this.callMethod("admin.aliasChain", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.success
                                ? response.data.result.success
                                : response.data.result];
                }
            });
        }); };
        /**
         * Get all aliases for given blockchain
         *
         * @param chain The blockchain’s ID
         *
         * @returns Returns a Promise string[] containing aliases of the blockchain.
         */
        _this.getChainAliases = function (chain) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            chain: chain
                        };
                        return [4 /*yield*/, this.callMethod("admin.getChainAliases", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.aliases
                                ? response.data.result.aliases
                                : response.data.result];
                }
            });
        }); };
        /**
         * Returns log and display levels of loggers
         *
         * @param loggerName the name of the logger to be returned. This is an optional argument. If not specified, it returns all possible loggers.
         *
         * @returns Returns a Promise containing logger levels
         */
        _this.getLoggerLevel = function (loggerName) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {};
                        if (typeof loggerName !== "undefined") {
                            params.loggerName = loggerName;
                        }
                        return [4 /*yield*/, this.callMethod("admin.getLoggerLevel", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        /**
         * Dynamically loads any virtual machines installed on the node as plugins
         *
         * @returns Returns a Promise containing new VMs and failed VMs
         */
        _this.loadVMs = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("admin.loadVMs")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.aliases
                                ? response.data.result.aliases
                                : response.data.result];
                }
            });
        }); };
        /**
         * Dump the mutex statistics of the node to the specified file.
         *
         * @returns Promise for a boolean that is true on success.
         */
        _this.lockProfile = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("admin.lockProfile")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.success
                                ? response.data.result.success
                                : response.data.result];
                }
            });
        }); };
        /**
         * Dump the current memory footprint of the node to the specified file.
         *
         * @returns Promise for a boolean that is true on success.
         */
        _this.memoryProfile = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("admin.memoryProfile")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.success
                                ? response.data.result.success
                                : response.data.result];
                }
            });
        }); };
        /**
         * Sets log and display levels of loggers.
         *
         * @param loggerName the name of the logger to be changed. This is an optional parameter.
         * @param logLevel the log level of written logs, can be omitted.
         * @param displayLevel the log level of displayed logs, can be omitted.
         *
         * @returns Returns a Promise containing logger levels
         */
        _this.setLoggerLevel = function (loggerName, logLevel, displayLevel) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {};
                        if (typeof loggerName !== "undefined") {
                            params.loggerName = loggerName;
                        }
                        if (typeof logLevel !== "undefined") {
                            params.logLevel = logLevel;
                        }
                        if (typeof displayLevel !== "undefined") {
                            params.displayLevel = displayLevel;
                        }
                        return [4 /*yield*/, this.callMethod("admin.setLoggerLevel", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        /**
         * Start profiling the cpu utilization of the node. Will dump the profile information into
         * the specified file on stop.
         *
         * @returns Promise for a boolean that is true on success.
         */
        _this.startCPUProfiler = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("admin.startCPUProfiler")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.success
                                ? response.data.result.success
                                : response.data.result];
                }
            });
        }); };
        /**
         * Stop the CPU profile that was previously started.
         *
         * @returns Promise for a boolean that is true on success.
         */
        _this.stopCPUProfiler = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("admin.stopCPUProfiler")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.success
                                ? response.data.result.success
                                : response.data.result];
                }
            });
        }); };
        return _this;
    }
    return AdminAPI;
}(jrpcapi_1.JRPCAPI));
exports.AdminAPI = AdminAPI;
