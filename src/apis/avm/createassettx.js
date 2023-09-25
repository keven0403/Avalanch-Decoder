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
exports.CreateAssetTx = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-CreateAssetTx
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var initialstates_1 = require("./initialstates");
var basetx_1 = require("./basetx");
var constants_2 = require("../../utils/constants");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
var utf8 = "utf8";
var decimalString = "decimalString";
var buffer = "Buffer";
var CreateAssetTx = /** @class */ (function (_super) {
    __extends(CreateAssetTx, _super);
    /**
     * Class representing an unsigned Create Asset transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param name String for the descriptive name of the asset
     * @param symbol String for the ticker symbol of the asset
     * @param denomination Optional number for the denomination which is 10^D. D must be >= 0 and <= 32. Ex: $1 AVAX = 10^9 $nAVAX
     * @param initialState Optional [[InitialStates]] that represent the intial state of a created asset
     */
    function CreateAssetTx(networkID, blockchainID, outs, ins, memo, name, symbol, denomination, initialState) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (name === void 0) { name = undefined; }
        if (symbol === void 0) { symbol = undefined; }
        if (denomination === void 0) { denomination = undefined; }
        if (initialState === void 0) { initialState = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "CreateAssetTx";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.CREATEASSETTX
            : constants_1.AVMConstants.CREATEASSETTX_CODECONE;
        _this.name = "";
        _this.symbol = "";
        _this.denomination = buffer_1.Buffer.alloc(1);
        _this.initialState = new initialstates_1.InitialStates();
        if (typeof name === "string" &&
            typeof symbol === "string" &&
            typeof denomination === "number" &&
            denomination >= 0 &&
            denomination <= 32 &&
            typeof initialState !== "undefined") {
            _this.initialState = initialState;
            _this.name = name;
            _this.symbol = symbol;
            _this.denomination.writeUInt8(denomination, 0);
        }
        return _this;
    }
    CreateAssetTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { name: serialization.encoder(this.name, encoding, utf8, utf8), symbol: serialization.encoder(this.symbol, encoding, utf8, utf8), denomination: serialization.encoder(this.denomination, encoding, buffer, decimalString, 1), initialState: this.initialState.serialize(encoding) });
    };
    CreateAssetTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.name = serialization.decoder(fields["name"], encoding, utf8, utf8);
        this.symbol = serialization.decoder(fields["symbol"], encoding, utf8, utf8);
        this.denomination = serialization.decoder(fields["denomination"], encoding, decimalString, buffer, 1);
        this.initialState = new initialstates_1.InitialStates();
        this.initialState.deserialize(fields["initialState"], encoding);
    };
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    CreateAssetTx.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - CreateAssetTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.CREATEASSETTX
                : constants_1.AVMConstants.CREATEASSETTX_CODECONE;
    };
    /**
     * Returns the id of the [[CreateAssetTx]]
     */
    CreateAssetTx.prototype.getTxType = function () {
        return this._typeID;
    };
    /**
     * Returns the array of array of [[Output]]s for the initial state
     */
    CreateAssetTx.prototype.getInitialStates = function () {
        return this.initialState;
    };
    /**
     * Returns the string representation of the name
     */
    CreateAssetTx.prototype.getName = function () {
        return this.name;
    };
    /**
     * Returns the string representation of the symbol
     */
    CreateAssetTx.prototype.getSymbol = function () {
        return this.symbol;
    };
    /**
     * Returns the numeric representation of the denomination
     */
    CreateAssetTx.prototype.getDenomination = function () {
        return this.denomination.readUInt8(0);
    };
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the denomination
     */
    CreateAssetTx.prototype.getDenominationBuffer = function () {
        return this.denomination;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[CreateAssetTx]], parses it, populates the class, and returns the length of the [[CreateAssetTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[CreateAssetTx]]
     *
     * @returns The length of the raw [[CreateAssetTx]]
     *
     * @remarks assume not-checksummed
     */
    CreateAssetTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        var namesize = bintools
            .copyFrom(bytes, offset, offset + 2)
            .readUInt16BE(0);
        offset += 2;
        this.name = bintools
            .copyFrom(bytes, offset, offset + namesize)
            .toString("utf8");
        offset += namesize;
        var symsize = bintools
            .copyFrom(bytes, offset, offset + 2)
            .readUInt16BE(0);
        offset += 2;
        this.symbol = bintools
            .copyFrom(bytes, offset, offset + symsize)
            .toString("utf8");
        offset += symsize;
        this.denomination = bintools.copyFrom(bytes, offset, offset + 1);
        offset += 1;
        var inits = new initialstates_1.InitialStates();
        offset = inits.fromBuffer(bytes, offset);
        this.initialState = inits;
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[CreateAssetTx]].
     */
    CreateAssetTx.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var initstatebuff = this.initialState.toBuffer();
        var namebuff = buffer_1.Buffer.alloc(this.name.length);
        namebuff.write(this.name, 0, this.name.length, utf8);
        var namesize = buffer_1.Buffer.alloc(2);
        namesize.writeUInt16BE(this.name.length, 0);
        var symbuff = buffer_1.Buffer.alloc(this.symbol.length);
        symbuff.write(this.symbol, 0, this.symbol.length, utf8);
        var symsize = buffer_1.Buffer.alloc(2);
        symsize.writeUInt16BE(this.symbol.length, 0);
        var bsize = superbuff.length +
            namesize.length +
            namebuff.length +
            symsize.length +
            symbuff.length +
            this.denomination.length +
            initstatebuff.length;
        var barr = [
            superbuff,
            namesize,
            namebuff,
            symsize,
            symbuff,
            this.denomination,
            initstatebuff
        ];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    CreateAssetTx.prototype.clone = function () {
        var newbase = new CreateAssetTx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    CreateAssetTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (CreateAssetTx.bind.apply(CreateAssetTx, __spreadArray([void 0], args, false)))();
    };
    return CreateAssetTx;
}(basetx_1.BaseTx));
exports.CreateAssetTx = CreateAssetTx;
