"use strict";
/**
 * @packageDocumentation
 * @module API-AVM-MinterSet
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinterSet = void 0;
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var serialization_1 = require("../../utils/serialization");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
var decimalString = "decimalString";
var cb58 = "cb58";
var num = "number";
var buffer = "Buffer";
/**
 * Class for representing a threshold and set of minting addresses in Avalanche.
 *
 * @typeparam MinterSet including a threshold and array of addresses
 */
var MinterSet = /** @class */ (function (_super) {
    __extends(MinterSet, _super);
    /**
     *
     * @param threshold The number of signatures required to mint more of an asset by signing a minting transaction
     * @param minters Array of addresss which are authorized to sign a minting transaction
     */
    function MinterSet(threshold, minters) {
        if (threshold === void 0) { threshold = 1; }
        if (minters === void 0) { minters = []; }
        var _this = _super.call(this) || this;
        _this._typeName = "MinterSet";
        _this._typeID = undefined;
        _this.minters = [];
        /**
         * Returns the threshold.
         */
        _this.getThreshold = function () {
            return _this.threshold;
        };
        /**
         * Returns the minters.
         */
        _this.getMinters = function () {
            return _this.minters;
        };
        _this._cleanAddresses = function (addresses) {
            var addrs = [];
            for (var i = 0; i < addresses.length; i++) {
                if (typeof addresses["".concat(i)] === "string") {
                    addrs.push(bintools.stringToAddress(addresses["".concat(i)]));
                }
                else if (addresses["".concat(i)] instanceof buffer_1.Buffer) {
                    addrs.push(addresses["".concat(i)]);
                }
            }
            return addrs;
        };
        _this.threshold = threshold;
        _this.minters = _this._cleanAddresses(minters);
        return _this;
    }
    MinterSet.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { threshold: serialization.encoder(this.threshold, encoding, num, decimalString, 4), minters: this.minters.map(function (m) {
                return serialization.encoder(m, encoding, buffer, cb58, 20);
            }) });
    };
    MinterSet.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.threshold = serialization.decoder(fields["threshold"], encoding, decimalString, num, 4);
        this.minters = fields["minters"].map(function (m) {
            return serialization.decoder(m, encoding, cb58, buffer, 20);
        });
    };
    return MinterSet;
}(serialization_1.Serializable));
exports.MinterSet = MinterSet;
