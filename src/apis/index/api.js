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
exports.IndexAPI = void 0;
var jrpcapi_1 = require("../../common/jrpcapi");
/**
 * Class for interacting with a node's IndexAPI.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Avalanche.addAPI]] function to register this interface with Avalanche.
 */
var IndexAPI = /** @class */ (function (_super) {
    __extends(IndexAPI, _super);
    /**
     * This class should not be instantiated directly. Instead use the [[Avalanche.addAPI]] method.
     *
     * @param core A reference to the Avalanche class
     * @param baseURL Defaults to the string "/ext/index/X/tx" as the path to rpc's baseURL
     */
    function IndexAPI(core, baseURL) {
        if (baseURL === void 0) { baseURL = "/ext/index/X/tx"; }
        var _this = _super.call(this, core, baseURL) || this;
        /**
         * Get last accepted tx, vtx or block
         *
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetLastAcceptedResponse.
         */
        _this.getLastAccepted = function (encoding, baseURL) {
            if (encoding === void 0) { encoding = "hex"; }
            if (baseURL === void 0) { baseURL = _this.getBaseURL(); }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setBaseURL(baseURL);
                            params = {
                                encoding: encoding
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.callMethod("index.getLastAccepted", params)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                        case 3:
                            error_1 = _a.sent();
                            console.log(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get container by index
         *
         * @param index
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetContainerByIndexResponse.
         */
        _this.getContainerByIndex = function (index, encoding, baseURL) {
            if (index === void 0) { index = "0"; }
            if (encoding === void 0) { encoding = "hex"; }
            if (baseURL === void 0) { baseURL = _this.getBaseURL(); }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setBaseURL(baseURL);
                            params = {
                                index: index,
                                encoding: encoding
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.callMethod("index.getContainerByIndex", params)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                        case 3:
                            error_2 = _a.sent();
                            console.log(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get contrainer by ID
         *
         * @param id
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetContainerByIDResponse.
         */
        _this.getContainerByID = function (id, encoding, baseURL) {
            if (id === void 0) { id = "0"; }
            if (encoding === void 0) { encoding = "hex"; }
            if (baseURL === void 0) { baseURL = _this.getBaseURL(); }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setBaseURL(baseURL);
                            params = {
                                id: id,
                                encoding: encoding
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.callMethod("index.getContainerByID", params)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                        case 3:
                            error_3 = _a.sent();
                            console.log(error_3);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get container range
         *
         * @param startIndex
         * @param numToFetch
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetContainerRangeResponse.
         */
        _this.getContainerRange = function (startIndex, numToFetch, encoding, baseURL) {
            if (startIndex === void 0) { startIndex = 0; }
            if (numToFetch === void 0) { numToFetch = 100; }
            if (encoding === void 0) { encoding = "hex"; }
            if (baseURL === void 0) { baseURL = _this.getBaseURL(); }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setBaseURL(baseURL);
                            params = {
                                startIndex: startIndex,
                                numToFetch: numToFetch,
                                encoding: encoding
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.callMethod("index.getContainerRange", params)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                        case 3:
                            error_4 = _a.sent();
                            console.log(error_4);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get index by containerID
         *
         * @param id
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetIndexResponse.
         */
        _this.getIndex = function (id, encoding, baseURL) {
            if (id === void 0) { id = ""; }
            if (encoding === void 0) { encoding = "hex"; }
            if (baseURL === void 0) { baseURL = _this.getBaseURL(); }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setBaseURL(baseURL);
                            params = {
                                id: id,
                                encoding: encoding
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.callMethod("index.getIndex", params)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.index];
                        case 3:
                            error_5 = _a.sent();
                            console.log(error_5);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Check if container is accepted
         *
         * @param id
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetIsAcceptedResponse.
         */
        _this.isAccepted = function (id, encoding, baseURL) {
            if (id === void 0) { id = ""; }
            if (encoding === void 0) { encoding = "hex"; }
            if (baseURL === void 0) { baseURL = _this.getBaseURL(); }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setBaseURL(baseURL);
                            params = {
                                id: id,
                                encoding: encoding
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.callMethod("index.isAccepted", params)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                        case 3:
                            error_6 = _a.sent();
                            console.log(error_6);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return _this;
    }
    return IndexAPI;
}(jrpcapi_1.JRPCAPI));
exports.IndexAPI = IndexAPI;
