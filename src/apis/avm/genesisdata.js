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
exports.GenesisData = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-GenesisData
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var serialization_1 = require("../../utils/serialization");
var constants_1 = require("./constants");
var _1 = require(".");
var utils_1 = require("../../utils");
/**
 * @ignore
 */
var serialization = serialization_1.Serialization.getInstance();
var bintools = bintools_1.default.getInstance();
var decimalString = "decimalString";
var buffer = "Buffer";
var GenesisData = /** @class */ (function (_super) {
    __extends(GenesisData, _super);
    /**
     * Class representing AVM GenesisData
     *
     * @param genesisAssets Optional GenesisAsset[]
     * @param networkID Optional DefaultNetworkID
     */
    function GenesisData(genesisAssets, networkID) {
        if (genesisAssets === void 0) { genesisAssets = []; }
        if (networkID === void 0) { networkID = utils_1.DefaultNetworkID; }
        var _this = _super.call(this) || this;
        _this._typeName = "GenesisData";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this.networkID = buffer_1.Buffer.alloc(4);
        /**
         * Returns the GenesisAssets[]
         */
        _this.getGenesisAssets = function () { return _this.genesisAssets; };
        /**
         * Returns the NetworkID as a number
         */
        _this.getNetworkID = function () { return _this.networkID.readUInt32BE(0); };
        _this.genesisAssets = genesisAssets;
        _this.networkID.writeUInt32BE(networkID, 0);
        return _this;
    }
    // TODO - setCodecID?
    GenesisData.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { genesisAssets: this.genesisAssets.map(function (genesisAsset) {
                return genesisAsset.serialize(encoding);
            }), networkID: serialization.encoder(this.networkID, encoding, buffer, decimalString) });
    };
    GenesisData.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.genesisAssets = fields["genesisAssets"].map(function (genesisAsset) {
            var g = new _1.GenesisAsset();
            g.deserialize(genesisAsset, encoding);
            return g;
        });
        this.networkID = serialization.decoder(fields["networkID"], encoding, decimalString, buffer, 4);
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[GenesisAsset]], parses it, populates the class, and returns the length of the [[GenesisAsset]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[GenesisAsset]]
     *
     * @returns The length of the raw [[GenesisAsset]]
     *
     * @remarks assume not-checksummed
     */
    GenesisData.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this._codecID = bintools.copyFrom(bytes, offset, offset + 2).readUInt16BE(0);
        offset += 2;
        var numGenesisAssets = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var assetCount = numGenesisAssets.readUInt32BE(0);
        this.genesisAssets = [];
        for (var i = 0; i < assetCount; i++) {
            var genesisAsset = new _1.GenesisAsset();
            offset = genesisAsset.fromBuffer(bytes, offset);
            this.genesisAssets.push(genesisAsset);
            if (i === 0) {
                this.networkID.writeUInt32BE(genesisAsset.getNetworkID(), 0);
            }
        }
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[GenesisData]].
     */
    GenesisData.prototype.toBuffer = function () {
        var _this = this;
        // codec id
        var codecbuffSize = buffer_1.Buffer.alloc(2);
        codecbuffSize.writeUInt16BE(this._codecID, 0);
        // num assets
        var numAssetsbuffSize = buffer_1.Buffer.alloc(4);
        numAssetsbuffSize.writeUInt32BE(this.genesisAssets.length, 0);
        var bsize = codecbuffSize.length + numAssetsbuffSize.length;
        var barr = [codecbuffSize, numAssetsbuffSize];
        this.genesisAssets.forEach(function (genesisAsset) {
            var b = genesisAsset.toBuffer(_this.getNetworkID());
            bsize += b.length;
            barr.push(b);
        });
        return buffer_1.Buffer.concat(barr, bsize);
    };
    return GenesisData;
}(serialization_1.Serializable));
exports.GenesisData = GenesisData;
