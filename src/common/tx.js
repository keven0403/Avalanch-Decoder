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
exports.StandardTx = exports.StandardUnsignedTx = exports.StandardBaseTx = void 0;
/**
 * @packageDocumentation
 * @module Common-Transactions
 */
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
var serialization = serialization_1.Serialization.getInstance();
var cb58 = "cb58";
var hex = "hex";
var decimalString = "decimalString";
var buffer = "Buffer";
/**
 * Class representing a base for all transactions.
 */
var StandardBaseTx = /** @class */ (function (_super) {
    __extends(StandardBaseTx, _super);
    /**
     * Class representing a StandardBaseTx which is the foundation for all transactions.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     */
    function StandardBaseTx(networkID, blockchainID, outs, ins, memo) {
        if (networkID === void 0) { networkID = constants_1.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "StandardBaseTx";
        _this._typeID = undefined;
        _this.networkID = buffer_1.Buffer.alloc(4);
        _this.blockchainID = buffer_1.Buffer.alloc(32);
        _this.numouts = buffer_1.Buffer.alloc(4);
        _this.numins = buffer_1.Buffer.alloc(4);
        _this.memo = buffer_1.Buffer.alloc(0);
        _this.networkID.writeUInt32BE(networkID, 0);
        _this.blockchainID = blockchainID;
        if (typeof memo != "undefined") {
            _this.memo = memo;
        }
        if (typeof ins !== "undefined" && typeof outs !== "undefined") {
            _this.numouts.writeUInt32BE(outs.length, 0);
            _this.outs = outs.sort(output_1.StandardTransferableOutput.comparator());
            _this.numins.writeUInt32BE(ins.length, 0);
            _this.ins = ins.sort(input_1.StandardTransferableInput.comparator());
        }
        return _this;
    }
    StandardBaseTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { networkID: serialization.encoder(this.networkID, encoding, buffer, decimalString), blockchainID: serialization.encoder(this.blockchainID, encoding, buffer, cb58), outs: this.outs.map(function (o) { return o.serialize(encoding); }), ins: this.ins.map(function (i) { return i.serialize(encoding); }), memo: serialization.encoder(this.memo, encoding, buffer, hex) });
    };
    StandardBaseTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.networkID = serialization.decoder(fields["networkID"], encoding, decimalString, buffer, 4);
        this.blockchainID = serialization.decoder(fields["blockchainID"], encoding, cb58, buffer, 32);
        this.memo = serialization.decoder(fields["memo"], encoding, hex, buffer);
    };
    /**
     * Returns the NetworkID as a number
     */
    StandardBaseTx.prototype.getNetworkID = function () {
        return this.networkID.readUInt32BE(0);
    };
    /**
     * Returns the Buffer representation of the BlockchainID
     */
    StandardBaseTx.prototype.getBlockchainID = function () {
        return this.blockchainID;
    };
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the memo
     */
    StandardBaseTx.prototype.getMemo = function () {
        return this.memo;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardBaseTx]].
     */
    StandardBaseTx.prototype.toBuffer = function () {
        this.outs.sort(output_1.StandardTransferableOutput.comparator());
        this.ins.sort(input_1.StandardTransferableInput.comparator());
        this.numouts.writeUInt32BE(this.outs.length, 0);
        this.numins.writeUInt32BE(this.ins.length, 0);
        var bsize = this.networkID.length + this.blockchainID.length + this.numouts.length;
        var barr = [this.networkID, this.blockchainID, this.numouts];
        for (var i = 0; i < this.outs.length; i++) {
            var b = this.outs["".concat(i)].toBuffer();
            barr.push(b);
            bsize += b.length;
        }
        barr.push(this.numins);
        bsize += this.numins.length;
        for (var i = 0; i < this.ins.length; i++) {
            var b = this.ins["".concat(i)].toBuffer();
            barr.push(b);
            bsize += b.length;
        }
        var memolen = buffer_1.Buffer.alloc(4);
        memolen.writeUInt32BE(this.memo.length, 0);
        barr.push(memolen);
        bsize += 4;
        barr.push(this.memo);
        bsize += this.memo.length;
        var buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    };
    /**
     * Returns a base-58 representation of the [[StandardBaseTx]].
     */
    StandardBaseTx.prototype.toString = function () {
        return bintools.bufferToB58(this.toBuffer());
    };
    StandardBaseTx.prototype.toStringHex = function () {
        return "0x".concat(bintools.addChecksum(this.toBuffer()).toString("hex"));
    };
    return StandardBaseTx;
}(serialization_1.Serializable));
exports.StandardBaseTx = StandardBaseTx;
/**
 * Class representing an unsigned transaction.
 */
var StandardUnsignedTx = /** @class */ (function (_super) {
    __extends(StandardUnsignedTx, _super);
    function StandardUnsignedTx(transaction, codecID) {
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
    StandardUnsignedTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { codecID: serialization.encoder(this.codecID, encoding, "number", "decimalString", 2), transaction: this.transaction.serialize(encoding) });
    };
    StandardUnsignedTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.codecID = serialization.decoder(fields["codecID"], encoding, "decimalString", "number");
    };
    /**
     * Returns the CodecID as a number
     */
    StandardUnsignedTx.prototype.getCodecID = function () {
        return this.codecID;
    };
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the CodecID
     */
    StandardUnsignedTx.prototype.getCodecIDBuffer = function () {
        var codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(this.codecID, 0);
        return codecBuf;
    };
    /**
     * Returns the inputTotal as a BN
     */
    StandardUnsignedTx.prototype.getInputTotal = function (assetID) {
        var ins = this.getTransaction().getIns();
        var aIDHex = assetID.toString("hex");
        var total = new bn_js_1.default(0);
        for (var i = 0; i < ins.length; i++) {
            // only check StandardAmountInputs
            if (ins["".concat(i)].getInput() instanceof input_1.StandardAmountInput &&
                aIDHex === ins["".concat(i)].getAssetID().toString("hex")) {
                var input = ins["".concat(i)].getInput();
                total = total.add(input.getAmount());
            }
        }
        return total;
    };
    /**
     * Returns the outputTotal as a BN
     */
    StandardUnsignedTx.prototype.getOutputTotal = function (assetID) {
        var outs = this.getTransaction().getTotalOuts();
        var aIDHex = assetID.toString("hex");
        var total = new bn_js_1.default(0);
        for (var i = 0; i < outs.length; i++) {
            // only check StandardAmountOutput
            if (outs["".concat(i)].getOutput() instanceof output_1.StandardAmountOutput &&
                aIDHex === outs["".concat(i)].getAssetID().toString("hex")) {
                var output = outs["".concat(i)].getOutput();
                total = total.add(output.getAmount());
            }
        }
        return total;
    };
    /**
     * Returns the number of burned tokens as a BN
     */
    StandardUnsignedTx.prototype.getBurn = function (assetID) {
        return this.getInputTotal(assetID).sub(this.getOutputTotal(assetID));
    };
    StandardUnsignedTx.prototype.toBuffer = function () {
        var codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(this.transaction.getCodecID(), 0);
        var txtype = buffer_1.Buffer.alloc(4);
        txtype.writeUInt32BE(this.transaction.getTxType(), 0);
        var basebuff = this.transaction.toBuffer();
        return buffer_1.Buffer.concat([codecBuf, txtype, basebuff], codecBuf.length + txtype.length + basebuff.length);
    };
    return StandardUnsignedTx;
}(serialization_1.Serializable));
exports.StandardUnsignedTx = StandardUnsignedTx;
/**
 * Class representing a signed transaction.
 */
var StandardTx = /** @class */ (function (_super) {
    __extends(StandardTx, _super);
    /**
     * Class representing a signed transaction.
     *
     * @param unsignedTx Optional [[StandardUnsignedTx]]
     * @param signatures Optional array of [[Credential]]s
     */
    function StandardTx(unsignedTx, credentials) {
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
    StandardTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { unsignedTx: this.unsignedTx.serialize(encoding), credentials: this.credentials.map(function (c) { return c.serialize(encoding); }) });
    };
    /**
     * Returns the [[Credential[]]]
     */
    StandardTx.prototype.getCredentials = function () {
        return this.credentials;
    };
    /**
     * Returns the [[StandardUnsignedTx]]
     */
    StandardTx.prototype.getUnsignedTx = function () {
        return this.unsignedTx;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardTx]].
     */
    StandardTx.prototype.toBuffer = function () {
        var tx = this.unsignedTx.getTransaction();
        var codecID = tx.getCodecID();
        var txbuff = this.unsignedTx.toBuffer();
        var bsize = txbuff.length;
        var credlen = buffer_1.Buffer.alloc(4);
        credlen.writeUInt32BE(this.credentials.length, 0);
        var barr = [txbuff, credlen];
        bsize += credlen.length;
        for (var i = 0; i < this.credentials.length; i++) {
            this.credentials["".concat(i)].setCodecID(codecID);
            var credID = buffer_1.Buffer.alloc(4);
            credID.writeUInt32BE(this.credentials["".concat(i)].getCredentialID(), 0);
            barr.push(credID);
            bsize += credID.length;
            var credbuff = this.credentials["".concat(i)].toBuffer();
            bsize += credbuff.length;
            barr.push(credbuff);
        }
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
    StandardTx.prototype.fromString = function (serialized) {
        return this.fromBuffer(bintools.cb58Decode(serialized));
    };
    /**
     * Returns a cb58 representation of the [[StandardTx]].
     *
     * @remarks
     * unlike most toStrings, this returns in cb58 serialization format
     */
    StandardTx.prototype.toString = function () {
        return bintools.cb58Encode(this.toBuffer());
    };
    StandardTx.prototype.toStringHex = function () {
        return "0x".concat(bintools.addChecksum(this.toBuffer()).toString("hex"));
    };
    return StandardTx;
}(serialization_1.Serializable));
exports.StandardTx = StandardTx;
