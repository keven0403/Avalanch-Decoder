"use strict";
/**
 * @packageDocumentation
 * @module Common-RESTAPI
 */
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
exports.RESTAPI = void 0;
var apibase_1 = require("./apibase");
var RESTAPI = /** @class */ (function (_super) {
    __extends(RESTAPI, _super);
    /**
     *
     * @param core Reference to the Avalanche instance using this endpoint
     * @param baseURL Path of the APIs baseURL - ex: "/ext/bc/avm"
     * @param contentType Optional Determines the type of the entity attached to the
     * incoming request
     * @param acceptType Optional Determines the type of representation which is
     * desired on the client side
     */
    function RESTAPI(core, baseURL, contentType, acceptType) {
        if (contentType === void 0) { contentType = "application/json;charset=UTF-8"; }
        if (acceptType === void 0) { acceptType = undefined; }
        var _this = _super.call(this, core, baseURL) || this;
        _this.prepHeaders = function (contentType, acceptType) {
            var headers = {};
            if (contentType !== undefined) {
                headers["Content-Type"] = contentType;
            }
            else {
                headers["Content-Type"] = _this.contentType;
            }
            if (acceptType !== undefined) {
                headers["Accept"] = acceptType;
            }
            else if (_this.acceptType !== undefined) {
                headers["Accept"] = _this.acceptType;
            }
            return headers;
        };
        _this.axConf = function () {
            return {
                baseURL: _this.core.getURL(),
                responseType: "json"
            };
        };
        _this.get = function (baseURL, contentType, acceptType) { return __awaiter(_this, void 0, void 0, function () {
            var ep, headers, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ep = baseURL || this.baseURL;
                        headers = this.prepHeaders(contentType, acceptType);
                        return [4 /*yield*/, this.core.get(ep, {}, headers, this.axConf())];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp];
                }
            });
        }); };
        _this.post = function (method, params, baseURL, contentType, acceptType) { return __awaiter(_this, void 0, void 0, function () {
            var ep, rpc, headers, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ep = baseURL || this.baseURL;
                        rpc = {};
                        rpc.method = method;
                        // Set parameters if exists
                        if (params) {
                            rpc.params = params;
                        }
                        headers = this.prepHeaders(contentType, acceptType);
                        return [4 /*yield*/, this.core.post(ep, {}, JSON.stringify(rpc), headers, this.axConf())];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp];
                }
            });
        }); };
        _this.put = function (method, params, baseURL, contentType, acceptType) { return __awaiter(_this, void 0, void 0, function () {
            var ep, rpc, headers, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ep = baseURL || this.baseURL;
                        rpc = {};
                        rpc.method = method;
                        // Set parameters if exists
                        if (params) {
                            rpc.params = params;
                        }
                        headers = this.prepHeaders(contentType, acceptType);
                        return [4 /*yield*/, this.core.put(ep, {}, JSON.stringify(rpc), headers, this.axConf())];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp];
                }
            });
        }); };
        _this.delete = function (method, params, baseURL, contentType, acceptType) { return __awaiter(_this, void 0, void 0, function () {
            var ep, rpc, headers, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ep = baseURL || this.baseURL;
                        rpc = {};
                        rpc.method = method;
                        // Set parameters if exists
                        if (params) {
                            rpc.params = params;
                        }
                        headers = this.prepHeaders(contentType, acceptType);
                        return [4 /*yield*/, this.core.delete(ep, {}, headers, this.axConf())];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp];
                }
            });
        }); };
        _this.patch = function (method, params, baseURL, contentType, acceptType) { return __awaiter(_this, void 0, void 0, function () {
            var ep, rpc, headers, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ep = baseURL || this.baseURL;
                        rpc = {};
                        rpc.method = method;
                        // Set parameters if exists
                        if (params) {
                            rpc.params = params;
                        }
                        headers = this.prepHeaders(contentType, acceptType);
                        return [4 /*yield*/, this.core.patch(ep, {}, JSON.stringify(rpc), headers, this.axConf())];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp];
                }
            });
        }); };
        /**
         * Returns the type of the entity attached to the incoming request
         */
        _this.getContentType = function () { return _this.contentType; };
        /**
         * Returns what type of representation is desired at the client side
         */
        _this.getAcceptType = function () { return _this.acceptType; };
        _this.contentType = contentType;
        _this.acceptType = acceptType;
        return _this;
    }
    return RESTAPI;
}(apibase_1.APIBase));
exports.RESTAPI = RESTAPI;
