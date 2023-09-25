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
exports.ImportTx = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-ImportTx
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var inputs_1 = require("./inputs");
var basetx_1 = require("./basetx");
var credentials_1 = require("./credentials");
var credentials_2 = require("../../common/credentials");
var constants_2 = require("../../utils/constants");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
var cb58 = "cb58";
var buffer = "Buffer";
/**
 * Class representing an unsigned Import transaction.
 */
var ImportTx = /** @class */ (function (_super) {
    __extends(ImportTx, _super);
    /**
     * Class representing an unsigned Import transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param sourceChain Optional chainid for the source inputs to import. Default platform chainid.
     * @param importIns Array of [[TransferableInput]]s used in the transaction
     */
    function ImportTx(networkID, blockchainID, outs, ins, memo, sourceChain, importIns) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (sourceChain === void 0) { sourceChain = undefined; }
        if (importIns === void 0) { importIns = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "ImportTx";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0 ? constants_1.AVMConstants.IMPORTTX : constants_1.AVMConstants.IMPORTTX_CODECONE;
        _this.sourceChain = buffer_1.Buffer.alloc(32);
        _this.numIns = buffer_1.Buffer.alloc(4);
        _this.importIns = [];
        _this.sourceChain = sourceChain; // do not correct, if it's wrong it'll bomb on toBuffer
        if (typeof importIns !== "undefined" && Array.isArray(importIns)) {
            for (var i = 0; i < importIns.length; i++) {
                if (!(importIns["".concat(i)] instanceof inputs_1.TransferableInput)) {
                    throw new errors_1.TransferableInputError("Error - ImportTx.constructor: invalid TransferableInput in array parameter ".concat(importIns));
                }
            }
            _this.importIns = importIns;
        }
        return _this;
    }
    ImportTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { sourceChain: serialization.encoder(this.sourceChain, encoding, buffer, cb58), importIns: this.importIns.map(function (i) { return i.serialize(encoding); }) });
    };
    ImportTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.sourceChain = serialization.decoder(fields["sourceChain"], encoding, cb58, buffer, 32);
        this.importIns = fields["importIns"].map(function (i) {
            var ii = new inputs_1.TransferableInput();
            ii.deserialize(i, encoding);
            return ii;
        });
        this.numIns = buffer_1.Buffer.alloc(4);
        this.numIns.writeUInt32BE(this.importIns.length, 0);
    };
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    ImportTx.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - ImportTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.IMPORTTX
                : constants_1.AVMConstants.IMPORTTX_CODECONE;
    };
    /**
     * Returns the id of the [[ImportTx]]
     */
    ImportTx.prototype.getTxType = function () {
        return this._typeID;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the source chainid.
     */
    ImportTx.prototype.getSourceChain = function () {
        return this.sourceChain;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[ImportTx]], parses it, populates the class, and returns the length of the [[ImportTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[ImportTx]]
     *
     * @returns The length of the raw [[ImportTx]]
     *
     * @remarks assume not-checksummed
     */
    ImportTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.sourceChain = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.numIns = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var numIns = this.numIns.readUInt32BE(0);
        for (var i = 0; i < numIns; i++) {
            var anIn = new inputs_1.TransferableInput();
            offset = anIn.fromBuffer(bytes, offset);
            this.importIns.push(anIn);
        }
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ImportTx]].
     */
    ImportTx.prototype.toBuffer = function () {
        if (typeof this.sourceChain === "undefined") {
            throw new errors_1.ChainIdError("ImportTx.toBuffer -- this.sourceChain is undefined");
        }
        this.numIns.writeUInt32BE(this.importIns.length, 0);
        var barr = [_super.prototype.toBuffer.call(this), this.sourceChain, this.numIns];
        this.importIns = this.importIns.sort(inputs_1.TransferableInput.comparator());
        for (var i = 0; i < this.importIns.length; i++) {
            barr.push(this.importIns["".concat(i)].toBuffer());
        }
        return buffer_1.Buffer.concat(barr);
    };
    /**
     * Returns an array of [[TransferableInput]]s in this transaction.
     */
    ImportTx.prototype.getImportInputs = function () {
        return this.importIns;
    };
    ImportTx.prototype.clone = function () {
        var newbase = new ImportTx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    ImportTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (ImportTx.bind.apply(ImportTx, __spreadArray([void 0], args, false)))();
    };
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    ImportTx.prototype.sign = function (msg, kc) {
        var creds = _super.prototype.sign.call(this, msg, kc);
        for (var i = 0; i < this.importIns.length; i++) {
            var cred = (0, credentials_1.SelectCredentialClass)(this.importIns["".concat(i)].getInput().getCredentialID());
            var sigidxs = this.importIns["".concat(i)].getInput().getSigIdxs();
            for (var j = 0; j < sigidxs.length; j++) {
                var keypair = kc.getKey(sigidxs["".concat(j)].getSource());
                var signval = keypair.sign(msg);
                var sig = new credentials_2.Signature();
                sig.fromBuffer(signval);
                cred.addSignature(sig);
            }
            creds.push(cred);
        }
        return creds;
    };
    return ImportTx;
}(basetx_1.BaseTx));
exports.ImportTx = ImportTx;
