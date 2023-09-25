"use strict";
/**
 * @packageDocumentation
 * @module Common-APIBase
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIBase = exports.RequestResponseData = void 0;
var db_1 = require("../utils/db");
/**
 * Response data for HTTP requests.
 */
var RequestResponseData = /** @class */ (function () {
    function RequestResponseData(data, headers, status, statusText, request) {
        this.data = data;
        this.headers = headers;
        this.status = status;
        this.statusText = statusText;
        this.request = request;
    }
    return RequestResponseData;
}());
exports.RequestResponseData = RequestResponseData;
/**
 * Abstract class defining a generic endpoint that all endpoints must implement (extend).
 */
var APIBase = /** @class */ (function () {
    /**
     *
     * @param core Reference to the Avalanche instance using this baseURL
     * @param baseURL Path to the baseURL
     */
    function APIBase(core, baseURL) {
        var _this = this;
        /**
         * Sets the path of the APIs baseURL.
         *
         * @param baseURL Path of the APIs baseURL - ex: "/ext/bc/X"
         */
        this.setBaseURL = function (baseURL) {
            if (_this.db && _this.baseURL !== baseURL) {
                var backup = _this.db.getAll();
                _this.db.clearAll();
                _this.baseURL = baseURL;
                _this.db = db_1.default.getNamespace(baseURL);
                _this.db.setAll(backup, true);
            }
            else {
                _this.baseURL = baseURL;
                _this.db = db_1.default.getNamespace(baseURL);
            }
        };
        /**
         * Returns the baseURL's path.
         */
        this.getBaseURL = function () { return _this.baseURL; };
        /**
         * Returns the baseURL's database.
         */
        this.getDB = function () { return _this.db; };
        this.core = core;
        this.setBaseURL(baseURL);
    }
    return APIBase;
}());
exports.APIBase = APIBase;
