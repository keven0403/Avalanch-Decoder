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
exports.BaseTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-BaseTx
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var outputs_1 = require("./outputs");
var inputs_1 = require("./inputs");
var credentials_1 = require("./credentials");
var tx_1 = require("../../common/tx");
var credentials_2 = require("../../common/credentials");
var constants_2 = require("../../utils/constants");
var tx_2 = require("../platformvm/tx");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
/**
 * Class representing a base for all transactions.
 */
var BaseTx = /** @class */ (function (_super) {
    __extends(BaseTx, _super);
    /**
     * Class representing a BaseTx which is the foundation for all transactions.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     */
    function BaseTx(networkID, blockchainID, outs, ins, memo) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "BaseTx";
        _this._typeID = constants_1.PlatformVMConstants.CREATESUBNETTX;
        return _this;
    }
    BaseTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.outs = fields["outs"].map(function (o) {
            var newOut = new outputs_1.TransferableOutput();
            newOut.deserialize(o, encoding);
            return newOut;
        });
        this.ins = fields["ins"].map(function (i) {
            var newIn = new inputs_1.TransferableInput();
            newIn.deserialize(i, encoding);
            return newIn;
        });
        this.numouts = buffer_1.Buffer.alloc(4);
        this.numouts.writeUInt32BE(this.outs.length, 0);
        this.numins = buffer_1.Buffer.alloc(4);
        this.numins.writeUInt32BE(this.ins.length, 0);
    };
    BaseTx.prototype.getOuts = function () {
        return this.outs;
    };
    BaseTx.prototype.getIns = function () {
        return this.ins;
    };
    BaseTx.prototype.getTotalOuts = function () {
        return this.getOuts();
    };
    /**
     * Returns the id of the [[BaseTx]]
     */
    BaseTx.prototype.getTxType = function () {
        return constants_1.PlatformVMConstants.BASETX;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[BaseTx]], parses it, populates the class, and returns the length of the BaseTx in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[BaseTx]]
     *
     * @returns The length of the raw [[BaseTx]]
     *
     * @remarks assume not-checksummed
     */
    BaseTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.networkID = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        this.blockchainID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.numouts = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var outcount = this.numouts.readUInt32BE(0);
        this.outs = [];
        for (var i = 0; i < outcount; i++) {
            var xferout = new outputs_1.TransferableOutput();
            offset = xferout.fromBuffer(bytes, offset);
            this.outs.push(xferout);
        }
        this.numins = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var incount = this.numins.readUInt32BE(0);
        this.ins = [];
        for (var i = 0; i < incount; i++) {
            var xferin = new inputs_1.TransferableInput();
            offset = xferin.fromBuffer(bytes, offset);
            this.ins.push(xferin);
        }
        var memolen = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.memo = bintools.copyFrom(bytes, offset, offset + memolen);
        offset += memolen;
        return offset;
    };
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    BaseTx.prototype.sign = function (msg, kc) {
        var creds = [];
        for (var i = 0; i < this.ins.length; i++) {
            var cred = (0, credentials_1.SelectCredentialClass)(this.ins["".concat(i)].getInput().getCredentialID());
            var sigidxs = this.ins["".concat(i)].getInput().getSigIdxs();
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
    BaseTx.prototype.clone = function () {
        var newbase = new BaseTx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    BaseTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (BaseTx.bind.apply(BaseTx, __spreadArray([void 0], args, false)))();
    };
    BaseTx.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var newbasetx = tx_2.SelectTxClass.apply(void 0, __spreadArray([id], args, false));
        return newbasetx;
    };
    return BaseTx;
}(tx_1.StandardBaseTx));
exports.BaseTx = BaseTx;
