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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module AvalancheCore
 */
var axios_1 = require("axios");
var apibase_1 = require("./common/apibase");
var errors_1 = require("./utils/errors");
var fetchadapter_1 = require("./utils/fetchadapter");
var helperfunctions_1 = require("./utils/helperfunctions");
/**
 * AvalancheCore is middleware for interacting with Avalanche node RPC APIs.
 *
 * Example usage:
 * ```js
 * let avalanche = new AvalancheCore("127.0.0.1", 9650, "https")
 * ```
 *
 *
 */
var AvalancheCore = /** @class */ (function () {
    /**
     * Creates a new Avalanche instance. Sets the address and port of the main Avalanche Client.
     *
     * @param host The hostname to resolve to reach the Avalanche Client APIs
     * @param port The port to resolve to reach the Avalanche Client APIs
     * @param protocol The protocol string to use before a "://" in a request, ex: "http", "https", "git", "ws", etc ...
     */
    function AvalancheCore(host, port, protocol) {
        var _this = this;
        if (protocol === void 0) { protocol = "http"; }
        this.networkID = 0;
        this.hrp = "";
        this.auth = undefined;
        this.headers = {};
        this.requestConfig = {};
        this.apis = {};
        /**
         * Sets the address and port of the main Avalanche Client.
         *
         * @param host The hostname to resolve to reach the Avalanche Client RPC APIs.
         * @param port The port to resolve to reach the Avalanche Client RPC APIs.
         * @param protocol The protocol string to use before a "://" in a request,
         * ex: "http", "https", etc. Defaults to http
         * @param baseEndpoint the base endpoint to reach the Avalanche Client RPC APIs,
         * ex: "/rpc". Defaults to "/"
         * The following special characters are removed from host and protocol
         * &#,@+()$~%'":*?{} also less than and greater than signs
         */
        this.setAddress = function (host, port, protocol, baseEndpoint) {
            if (protocol === void 0) { protocol = "http"; }
            if (baseEndpoint === void 0) { baseEndpoint = ""; }
            host = host.replace(/[&#,@+()$~%'":*?<>{}]/g, "");
            protocol = protocol.replace(/[&#,@+()$~%'":*?<>{}]/g, "");
            var protocols = ["http", "https"];
            if (!protocols.includes(protocol)) {
                /* istanbul ignore next */
                throw new errors_1.ProtocolError("Error - AvalancheCore.setAddress: Invalid protocol");
            }
            _this.host = host;
            _this.port = port;
            _this.protocol = protocol;
            _this.baseEndpoint = baseEndpoint;
            var url = "".concat(protocol, "://").concat(host);
            if (port != undefined && typeof port === "number" && port >= 0) {
                url = "".concat(url, ":").concat(port);
            }
            if (baseEndpoint != undefined &&
                typeof baseEndpoint == "string" &&
                baseEndpoint.length > 0) {
                if (baseEndpoint[0] != "/") {
                    baseEndpoint = "/".concat(baseEndpoint);
                }
                url = "".concat(url).concat(baseEndpoint);
            }
            _this.url = url;
        };
        /**
         * Returns the protocol such as "http", "https", "git", "ws", etc.
         */
        this.getProtocol = function () { return _this.protocol; };
        /**
         * Returns the host for the Avalanche node.
         */
        this.getHost = function () { return _this.host; };
        /**
         * Returns the IP for the Avalanche node.
         */
        this.getIP = function () { return _this.host; };
        /**
         * Returns the port for the Avalanche node.
         */
        this.getPort = function () { return _this.port; };
        /**
         * Returns the base endpoint for the Avalanche node.
         */
        this.getBaseEndpoint = function () { return _this.baseEndpoint; };
        /**
         * Returns the URL of the Avalanche node (ip + port)
         */
        this.getURL = function () { return _this.url; };
        /**
         * Returns the custom headers
         */
        this.getHeaders = function () { return _this.headers; };
        /**
         * Returns the custom request config
         */
        this.getRequestConfig = function () { return _this.requestConfig; };
        /**
         * Returns the networkID
         */
        this.getNetworkID = function () { return _this.networkID; };
        /**
         * Sets the networkID
         */
        this.setNetworkID = function (netID) {
            _this.networkID = netID;
            _this.hrp = (0, helperfunctions_1.getPreferredHRP)(_this.networkID);
        };
        /**
         * Returns the Human-Readable-Part of the network associated with this key.
         *
         * @returns The [[KeyPair]]'s Human-Readable-Part of the network's Bech32 addressing scheme
         */
        this.getHRP = function () { return _this.hrp; };
        /**
         * Sets the the Human-Readable-Part of the network associated with this key.
         *
         * @param hrp String for the Human-Readable-Part of Bech32 addresses
         */
        this.setHRP = function (hrp) {
            _this.hrp = hrp;
        };
        /**
         * Adds a new custom header to be included with all requests.
         *
         * @param key Header name
         * @param value Header value
         */
        this.setHeader = function (key, value) {
            _this.headers["".concat(key)] = value;
        };
        /**
         * Removes a previously added custom header.
         *
         * @param key Header name
         */
        this.removeHeader = function (key) {
            delete _this.headers["".concat(key)];
        };
        /**
         * Removes all headers.
         */
        this.removeAllHeaders = function () {
            for (var prop in _this.headers) {
                if (Object.prototype.hasOwnProperty.call(_this.headers, prop)) {
                    delete _this.headers["".concat(prop)];
                }
            }
        };
        /**
         * Adds a new custom config value to be included with all requests.
         *
         * @param key Config name
         * @param value Config value
         */
        this.setRequestConfig = function (key, value) {
            _this.requestConfig["".concat(key)] = value;
        };
        /**
         * Removes a previously added request config.
         *
         * @param key Header name
         */
        this.removeRequestConfig = function (key) {
            delete _this.requestConfig["".concat(key)];
        };
        /**
         * Removes all request configs.
         */
        this.removeAllRequestConfigs = function () {
            for (var prop in _this.requestConfig) {
                if (Object.prototype.hasOwnProperty.call(_this.requestConfig, prop)) {
                    delete _this.requestConfig["".concat(prop)];
                }
            }
        };
        /**
         * Sets the temporary auth token used for communicating with the node.
         *
         * @param auth A temporary token provided by the node enabling access to the endpoints on the node.
         */
        this.setAuthToken = function (auth) {
            _this.auth = auth;
        };
        this._setHeaders = function (headers) {
            if (typeof _this.headers === "object") {
                for (var _i = 0, _a = Object.entries(_this.headers); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    headers["".concat(key)] = value;
                }
            }
            if (typeof _this.auth === "string") {
                headers.Authorization = "Bearer ".concat(_this.auth);
            }
            return headers;
        };
        /**
         * Adds an API to the middleware. The API resolves to a registered blockchain's RPC.
         *
         * In TypeScript:
         * ```js
         * avalanche.addAPI<MyVMClass>("mychain", MyVMClass, "/ext/bc/mychain")
         * ```
         *
         * In Javascript:
         * ```js
         * avalanche.addAPI("mychain", MyVMClass, "/ext/bc/mychain")
         * ```
         *
         * @typeparam GA Class of the API being added
         * @param apiName A label for referencing the API in the future
         * @param ConstructorFN A reference to the class which instantiates the API
         * @param baseurl Path to resolve to reach the API
         *
         */
        this.addAPI = function (apiName, ConstructorFN, baseurl) {
            if (baseurl === void 0) { baseurl = undefined; }
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            if (typeof baseurl === "undefined") {
                _this.apis["".concat(apiName)] = new (ConstructorFN.bind.apply(ConstructorFN, __spreadArray([void 0, _this, undefined], args, false)))();
            }
            else {
                _this.apis["".concat(apiName)] = new (ConstructorFN.bind.apply(ConstructorFN, __spreadArray([void 0, _this, baseurl], args, false)))();
            }
        };
        /**
         * Retrieves a reference to an API by its apiName label.
         *
         * @param apiName Name of the API to return
         */
        this.api = function (apiName) {
            return _this.apis["".concat(apiName)];
        };
        /**
         * @ignore
         */
        this._request = function (xhrmethod, baseurl, getdata, postdata, headers, axiosConfig) {
            if (headers === void 0) { headers = {}; }
            if (axiosConfig === void 0) { axiosConfig = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var config, resp, xhrdata;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (axiosConfig) {
                                config = __assign(__assign({}, axiosConfig), this.requestConfig);
                            }
                            else {
                                config = __assign({ baseURL: this.url, responseType: "text" }, this.requestConfig);
                            }
                            config.url = baseurl;
                            config.method = xhrmethod;
                            config.headers = headers;
                            config.data = postdata;
                            config.params = getdata;
                            // use the fetch adapter if fetch is available e.g. non Node<17 env
                            if (typeof fetch !== "undefined") {
                                config.adapter = fetchadapter_1.fetchAdapter;
                            }
                            return [4 /*yield*/, axios_1.default.request(config)
                                // purging all that is axios
                            ];
                        case 1:
                            resp = _a.sent();
                            xhrdata = new apibase_1.RequestResponseData(resp.data, resp.headers, resp.status, resp.statusText, resp.request);
                            return [2 /*return*/, xhrdata];
                    }
                });
            });
        };
        /**
         * Makes a GET call to an API.
         *
         * @param baseurl Path to the api
         * @param getdata Object containing the key value pairs sent in GET
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.get = function (baseurl, getdata, headers, axiosConfig) {
            if (headers === void 0) { headers = {}; }
            if (axiosConfig === void 0) { axiosConfig = undefined; }
            return _this._request("GET", baseurl, getdata, {}, _this._setHeaders(headers), axiosConfig);
        };
        /**
         * Makes a DELETE call to an API.
         *
         * @param baseurl Path to the API
         * @param getdata Object containing the key value pairs sent in DELETE
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.delete = function (baseurl, getdata, headers, axiosConfig) {
            if (headers === void 0) { headers = {}; }
            if (axiosConfig === void 0) { axiosConfig = undefined; }
            return _this._request("DELETE", baseurl, getdata, {}, _this._setHeaders(headers), axiosConfig);
        };
        /**
         * Makes a POST call to an API.
         *
         * @param baseurl Path to the API
         * @param getdata Object containing the key value pairs sent in POST
         * @param postdata Object containing the key value pairs sent in POST
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.post = function (baseurl, getdata, postdata, headers, axiosConfig) {
            if (headers === void 0) { headers = {}; }
            if (axiosConfig === void 0) { axiosConfig = undefined; }
            return _this._request("POST", baseurl, getdata, postdata, _this._setHeaders(headers), axiosConfig);
        };
        /**
         * Makes a PUT call to an API.
         *
         * @param baseurl Path to the baseurl
         * @param getdata Object containing the key value pairs sent in PUT
         * @param postdata Object containing the key value pairs sent in PUT
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.put = function (baseurl, getdata, postdata, headers, axiosConfig) {
            if (headers === void 0) { headers = {}; }
            if (axiosConfig === void 0) { axiosConfig = undefined; }
            return _this._request("PUT", baseurl, getdata, postdata, _this._setHeaders(headers), axiosConfig);
        };
        /**
         * Makes a PATCH call to an API.
         *
         * @param baseurl Path to the baseurl
         * @param getdata Object containing the key value pairs sent in PATCH
         * @param postdata Object containing the key value pairs sent in PATCH
         * @param parameters Object containing the parameters of the API call
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.patch = function (baseurl, getdata, postdata, headers, axiosConfig) {
            if (headers === void 0) { headers = {}; }
            if (axiosConfig === void 0) { axiosConfig = undefined; }
            return _this._request("PATCH", baseurl, getdata, postdata, _this._setHeaders(headers), axiosConfig);
        };
        if (host != undefined) {
            this.setAddress(host, port, protocol);
        }
    }
    return AvalancheCore;
}());
exports.default = AvalancheCore;
