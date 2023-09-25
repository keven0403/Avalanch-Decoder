"use strict";
/**
 * @packageDocumentation
 * @module Common-Transactions
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
exports.EVMStandardTx = exports.EVMStandardUnsignedTx = exports.EVMStandardBaseTx = void 0;
var buffer_1 = require("buffer/");
var bintools_1 = require("../utils/bintools");
var bn_js_1 = require("bn.js");
var input_1 = require("./input");
var output_1 = require("./output");
var constants_1 = require("../utils/constants");
var serialization_1 = require("../utils/serialization");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serializer = serialization_1.Serialization.getInstance();
/**
 * Class representing a base for all transactions.
 */
var EVMStandardBaseTx = /** @class */ (function (_super) {
    __extends(EVMStandardBaseTx, _super);
    /**
     * Class representing a StandardBaseTx which is the foundation for all transactions.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     */
    function EVMStandardBaseTx(networkID, blockchainID) {
        if (networkID === void 0) { networkID = constants_1.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        var _this = _super.call(this) || this;
        _this._typeName = "EVMStandardBaseTx";
        _this._typeID = undefined;
        _this.networkID = buffer_1.Buffer.alloc(4);
        _this.blockchainID = buffer_1.Buffer.alloc(32);
        _this.networkID.writeUInt32BE(networkID, 0);
        _this.blockchainID = blockchainID;
        return _this;
    }
    EVMStandardBaseTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { networkID: serializer.encoder(this.networkID, encoding, "Buffer", "decimalString"), blockchainID: serializer.encoder(this.blockchainID, encoding, "Buffer", "cb58") });
    };
    EVMStandardBaseTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.networkID = serializer.decoder(fields["networkID"], encoding, "decimalString", "Buffer", 4);
        this.blockchainID = serializer.decoder(fields["blockchainID"], encoding, "cb58", "Buffer", 32);
    };
    /**
     * Returns the NetworkID as a number
     */
    EVMStandardBaseTx.prototype.getNetworkID = function () {
        return this.networkID.readUInt32BE(0);
    };
    /**
     * Returns the Buffer representation of the BlockchainID
     */
    EVMStandardBaseTx.prototype.getBlockchainID = function () {
        return this.blockchainID;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardBaseTx]].
     */
    EVMStandardBaseTx.prototype.toBuffer = function () {
        var bsize = this.networkID.length + this.blockchainID.length;
        var barr = [this.networkID, this.blockchainID];
        var buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    };
    /**
     * Returns a base-58 representation of the [[StandardBaseTx]].
     */
    EVMStandardBaseTx.prototype.toString = function () {
        return bintools.bufferToB58(this.toBuffer());
    };
    return EVMStandardBaseTx;
}(serialization_1.Serializable));
exports.EVMStandardBaseTx = EVMStandardBaseTx;
/**
 * Class representing an unsigned transaction.
 */
var EVMStandardUnsignedTx = /** @class */ (function (_super) {
    __extends(EVMStandardUnsignedTx, _super);
    function EVMStandardUnsignedTx(transaction, codecID) {
        if (transaction === void 0) { transaction = undefined; }
        if (codecID === void 0) { codecID = 0; }
        var _this = _super.call(this) || this;
        _this._typeName = "StandardUnsignedTx";
        _this._typeID = undefined;
        _this.codecID = 0;
        _this.codecID = codecID;
        _this.transaction = transaction;
        return _this;
    }
    EVMStandardUnsignedTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { codecID: serializer.encoder(this.codecID, encoding, "number", "decimalString", 2), transaction: this.transaction.serialize(encoding) });
    };
    EVMStandardUnsignedTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.codecID = serializer.decoder(fields["codecID"], encoding, "decimalString", "number");
    };
    /**
     * Returns the CodecID as a number
     */
    EVMStandardUnsignedTx.prototype.getCodecID = function () {
        return this.codecID;
    };
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the CodecID
     */
    EVMStandardUnsignedTx.prototype.getCodecIDBuffer = function () {
        var codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(this.codecID, 0);
        return codecBuf;
    };
    /**
     * Returns the inputTotal as a BN
     */
    EVMStandardUnsignedTx.prototype.getInputTotal = function (assetID) {
        var ins = [];
        var aIDHex = assetID.toString("hex");
        var total = new bn_js_1.default(0);
        ins.forEach(function (input) {
            // only check StandardAmountInputs
            if (input.getInput() instanceof input_1.StandardAmountInput &&
                aIDHex === input.getAssetID().toString("hex")) {
                var i = input.getInput();
                total = total.add(i.getAmount());
            }
        });
        return total;
    };
    /**
     * Returns the outputTotal as a BN
     */
    EVMStandardUnsignedTx.prototype.getOutputTotal = function (assetID) {
        var outs = [];
        var aIDHex = assetID.toString("hex");
        var total = new bn_js_1.default(0);
        outs.forEach(function (out) {
            // only check StandardAmountOutput
            if (out.getOutput() instanceof output_1.StandardAmountOutput &&
                aIDHex === out.getAssetID().toString("hex")) {
                var output = out.getOutput();
                total = total.add(output.getAmount());
            }
        });
        return total;
    };
    /**
     * Returns the number of burned tokens as a BN
     */
    EVMStandardUnsignedTx.prototype.getBurn = function (assetID) {
        return this.getInputTotal(assetID).sub(this.getOutputTotal(assetID));
    };
    EVMStandardUnsignedTx.prototype.toBuffer = function () {
        var codecID = this.getCodecIDBuffer();
        var txtype = buffer_1.Buffer.alloc(4);
        txtype.writeUInt32BE(this.transaction.getTxType(), 0);
        var basebuff = this.transaction.toBuffer();
        return buffer_1.Buffer.concat([codecID, txtype, basebuff], codecID.length + txtype.length + basebuff.length);
    };
    return EVMStandardUnsignedTx;
}(serialization_1.Serializable));
exports.EVMStandardUnsignedTx = EVMStandardUnsignedTx;
/**
 * Class representing a signed transaction.
 */
var EVMStandardTx = /** @class */ (function (_super) {
    __extends(EVMStandardTx, _super);
    /**
     * Class representing a signed transaction.
     *
     * @param unsignedTx Optional [[StandardUnsignedTx]]
     * @param signatures Optional array of [[Credential]]s
     */
    function EVMStandardTx(unsignedTx, credentials) {
        if (unsignedTx === void 0) { unsignedTx = undefined; }
        if (credentials === void 0) { credentials = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "StandardTx";
        _this._typeID = undefined;
        _this.unsignedTx = undefined;
        _this.credentials = [];
        if (typeof unsignedTx !== "undefined") {
            _this.unsignedTx = unsignedTx;
            if (typeof credentials !== "undefined") {
                _this.credentials = credentials;
            }
        }
        return _this;
    }
    EVMStandardTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { unsignedTx: this.unsignedTx.serialize(encoding), credentials: this.credentials.map(function (c) { return c.serialize(encoding); }) });
    };
    /**
     * Returns the [[StandardUnsignedTx]]
     */
    EVMStandardTx.prototype.getUnsignedTx = function () {
        return this.unsignedTx;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardTx]].
     */
    EVMStandardTx.prototype.toBuffer = function () {
        var txbuff = this.unsignedTx.toBuffer();
        var bsize = txbuff.length;
        var credlen = buffer_1.Buffer.alloc(4);
        credlen.writeUInt32BE(this.credentials.length, 0);
        var barr = [txbuff, credlen];
        bsize += credlen.length;
        this.credentials.forEach(function (credential) {
            var credid = buffer_1.Buffer.alloc(4);
            credid.writeUInt32BE(credential.getCredentialID(), 0);
            barr.push(credid);
            bsize += credid.length;
            var credbuff = credential.toBuffer();
            bsize += credbuff.length;
            barr.push(credbuff);
        });
        var buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    };
    /**
     * Takes a base-58 string containing an [[StandardTx]], parses it, populates the class, and returns the length of the Tx in bytes.
     *
     * @param serialized A base-58 string containing a raw [[StandardTx]]
     *
     * @returns The length of the raw [[StandardTx]]
     *
     * @remarks
     * unlike most fromStrings, it expects the string to be serialized in cb58 format
     */
    EVMStandardTx.prototype.fromString = function (serialized) {
        return this.fromBuffer(bintools.cb58Decode(serialized));
    };
    /**
     * Returns a cb58 representation of the [[StandardTx]].
     *
     * @remarks
     * unlike most toStrings, this returns in cb58 serialization format
     */
    EVMStandardTx.prototype.toString = function () {
        return bintools.cb58Encode(this.toBuffer());
    };
    EVMStandardTx.prototype.toStringHex = function () {
        return "0x".concat(bintools.addChecksum(this.toBuffer()).toString("hex"));
    };
    return EVMStandardTx;
}(serialization_1.Serializable));
exports.EVMStandardTx = EVMStandardTx;
