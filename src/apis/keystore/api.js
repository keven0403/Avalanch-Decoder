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
exports.KeystoreAPI = void 0;
var jrpcapi_1 = require("../../common/jrpcapi");
/**
 * Class for interacting with a node API that is using the node's KeystoreAPI.
 *
 * **WARNING**: The KeystoreAPI is to be used by the node-owner as the data is stored locally on the node. Do not trust the root user. If you are not the node-owner, do not use this as your wallet.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Avalanche.addAPI]] function to register this interface with Avalanche.
 */
var KeystoreAPI = /** @class */ (function (_super) {
    __extends(KeystoreAPI, _super);
    /**
     * This class should not be instantiated directly. Instead use the [[Avalanche.addAPI]] method.
     *
     * @param core A reference to the Avalanche class
     * @param baseURL Defaults to the string "/ext/keystore" as the path to rpc's baseURL
     */
    function KeystoreAPI(core, baseURL) {
        if (baseURL === void 0) { baseURL = "/ext/keystore"; }
        var _this = _super.call(this, core, baseURL) || this;
        /**
         * Creates a user in the node's database.
         *
         * @param username Name of the user to create
         * @param password Password for the user
         *
         * @returns Promise for a boolean with true on success
         */
        _this.createUser = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("keystore.createUser", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.success
                                ? response.data.result.success
                                : response.data.result];
                }
            });
        }); };
        /**
         * Exports a user. The user can be imported to another node with keystore.importUser .
         *
         * @param username The name of the user to export
         * @param password The password of the user to export
         *
         * @returns Promise with a string importable using importUser
         */
        _this.exportUser = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("keystore.exportUser", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.user
                                ? response.data.result.user
                                : response.data.result];
                }
            });
        }); };
        /**
         * Imports a user file into the node's user database and assigns it to a username.
         *
         * @param username The name the user file should be imported into
         * @param user cb58 serialized string represetning a user"s data
         * @param password The user"s password
         *
         * @returns A promise with a true-value on success.
         */
        _this.importUser = function (username, user, password) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            user: user,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("keystore.importUser", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.success
                                ? response.data.result.success
                                : response.data.result];
                }
            });
        }); };
        /**
         * Lists the names of all users on the node.
         *
         * @returns Promise of an array with all user names.
         */
        _this.listUsers = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("keystore.listUsers")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.users];
                }
            });
        }); };
        /**
         * Deletes a user in the node's database.
         *
         * @param username Name of the user to delete
         * @param password Password for the user
         *
         * @returns Promise for a boolean with true on success
         */
        _this.deleteUser = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("keystore.deleteUser", params)];
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
    return KeystoreAPI;
}(jrpcapi_1.JRPCAPI));
exports.KeystoreAPI = KeystoreAPI;
