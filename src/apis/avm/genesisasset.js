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
exports.GenesisAsset = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-GenesisAsset
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var initialstates_1 = require("./initialstates");
var constants_1 = require("../../utils/constants");
var serialization_1 = require("../../utils/serialization");
var createassettx_1 = require("./createassettx");
var bn_js_1 = require("bn.js");
/**
 * @ignore
 */
var serialization = serialization_1.Serialization.getInstance();
var bintools = bintools_1.default.getInstance();
var utf8 = "utf8";
var buffer = "Buffer";
var decimalString = "decimalString";
var GenesisAsset = /** @class */ (function (_super) {
    __extends(GenesisAsset, _super);
    /**
     * Class representing a GenesisAsset
     *
     * @param assetAlias Optional String for the asset alias
     * @param name Optional String for the descriptive name of the asset
     * @param symbol Optional String for the ticker symbol of the asset
     * @param denomination Optional number for the denomination which is 10^D. D must be >= 0 and <= 32. Ex: $1 AVAX = 10^9 $nAVAX
     * @param initialState Optional [[InitialStates]] that represent the intial state of a created asset
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     */
    function GenesisAsset(assetAlias, name, symbol, denomination, initialState, memo) {
        if (assetAlias === void 0) { assetAlias = undefined; }
        if (name === void 0) { name = undefined; }
        if (symbol === void 0) { symbol = undefined; }
        if (denomination === void 0) { denomination = undefined; }
        if (initialState === void 0) { initialState = undefined; }
        if (memo === void 0) { memo = undefined; }
        var _this = _super.call(this, constants_1.DefaultNetworkID, buffer_1.Buffer.alloc(32), [], [], memo) || this;
        _this._typeName = "GenesisAsset";
        _this._codecID = undefined;
        _this._typeID = undefined;
        _this.assetAlias = "";
        /**
         * Returns the string representation of the assetAlias
         */
        _this.getAssetAlias = function () { return _this.assetAlias; };
        if (typeof assetAlias === "string" &&
            typeof name === "string" &&
            typeof symbol === "string" &&
            typeof denomination === "number" &&
            denomination >= 0 &&
            denomination <= 32 &&
            typeof initialState !== "undefined") {
            _this.assetAlias = assetAlias;
            _this.name = name;
            _this.symbol = symbol;
            _this.denomination.writeUInt8(denomination, 0);
            _this.initialState = initialState;
        }
        return _this;
    }
    GenesisAsset.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        delete fields["blockchainID"];
        delete fields["outs"];
        delete fields["ins"];
        return __assign(__assign({}, fields), { assetAlias: serialization.encoder(this.assetAlias, encoding, utf8, utf8), name: serialization.encoder(this.name, encoding, utf8, utf8), symbol: serialization.encoder(this.symbol, encoding, utf8, utf8), denomination: serialization.encoder(this.denomination, encoding, buffer, decimalString, 1), initialState: this.initialState.serialize(encoding) });
    };
    GenesisAsset.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        fields["blockchainID"] = buffer_1.Buffer.alloc(32, 16).toString("hex");
        fields["outs"] = [];
        fields["ins"] = [];
        _super.prototype.deserialize.call(this, fields, encoding);
        this.assetAlias = serialization.decoder(fields["assetAlias"], encoding, utf8, utf8);
        this.name = serialization.decoder(fields["name"], encoding, utf8, utf8);
        this.symbol = serialization.decoder(fields["symbol"], encoding, utf8, utf8);
        this.denomination = serialization.decoder(fields["denomination"], encoding, decimalString, buffer, 1);
        this.initialState = new initialstates_1.InitialStates();
        this.initialState.deserialize(fields["initialState"], encoding);
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
    GenesisAsset.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        var assetAliasSize = bintools
            .copyFrom(bytes, offset, offset + 2)
            .readUInt16BE(0);
        offset += 2;
        this.assetAlias = bintools
            .copyFrom(bytes, offset, offset + assetAliasSize)
            .toString("utf8");
        offset += assetAliasSize;
        offset += _super.prototype.fromBuffer.call(this, bytes, offset);
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[GenesisAsset]].
     */
    GenesisAsset.prototype.toBuffer = function (networkID) {
        if (networkID === void 0) { networkID = constants_1.DefaultNetworkID; }
        // asset alias
        var assetAlias = this.getAssetAlias();
        var assetAliasbuffSize = buffer_1.Buffer.alloc(2);
        assetAliasbuffSize.writeUInt16BE(assetAlias.length, 0);
        var bsize = assetAliasbuffSize.length;
        var barr = [assetAliasbuffSize];
        var assetAliasbuff = buffer_1.Buffer.alloc(assetAlias.length);
        assetAliasbuff.write(assetAlias, 0, assetAlias.length, utf8);
        bsize += assetAliasbuff.length;
        barr.push(assetAliasbuff);
        var networkIDBuff = buffer_1.Buffer.alloc(4);
        networkIDBuff.writeUInt32BE(new bn_js_1.default(networkID).toNumber(), 0);
        bsize += networkIDBuff.length;
        barr.push(networkIDBuff);
        // Blockchain ID
        bsize += 32;
        barr.push(buffer_1.Buffer.alloc(32));
        // num Outputs
        bsize += 4;
        barr.push(buffer_1.Buffer.alloc(4));
        // num Inputs
        bsize += 4;
        barr.push(buffer_1.Buffer.alloc(4));
        // memo
        var memo = this.getMemo();
        var memobuffSize = buffer_1.Buffer.alloc(4);
        memobuffSize.writeUInt32BE(memo.length, 0);
        bsize += memobuffSize.length;
        barr.push(memobuffSize);
        bsize += memo.length;
        barr.push(memo);
        // asset name
        var name = this.getName();
        var namebuffSize = buffer_1.Buffer.alloc(2);
        namebuffSize.writeUInt16BE(name.length, 0);
        bsize += namebuffSize.length;
        barr.push(namebuffSize);
        var namebuff = buffer_1.Buffer.alloc(name.length);
        namebuff.write(name, 0, name.length, utf8);
        bsize += namebuff.length;
        barr.push(namebuff);
        // symbol
        var symbol = this.getSymbol();
        var symbolbuffSize = buffer_1.Buffer.alloc(2);
        symbolbuffSize.writeUInt16BE(symbol.length, 0);
        bsize += symbolbuffSize.length;
        barr.push(symbolbuffSize);
        var symbolbuff = buffer_1.Buffer.alloc(symbol.length);
        symbolbuff.write(symbol, 0, symbol.length, utf8);
        bsize += symbolbuff.length;
        barr.push(symbolbuff);
        // denomination
        var denomination = this.getDenomination();
        var denominationbuffSize = buffer_1.Buffer.alloc(1);
        denominationbuffSize.writeUInt8(denomination, 0);
        bsize += denominationbuffSize.length;
        barr.push(denominationbuffSize);
        bsize += this.initialState.toBuffer().length;
        barr.push(this.initialState.toBuffer());
        return buffer_1.Buffer.concat(barr, bsize);
    };
    return GenesisAsset;
}(createassettx_1.CreateAssetTx));
exports.GenesisAsset = GenesisAsset;
