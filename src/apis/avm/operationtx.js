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
exports.OperationTx = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-OperationTx
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var ops_1 = require("./ops");
var credentials_1 = require("./credentials");
var credentials_2 = require("../../common/credentials");
var basetx_1 = require("./basetx");
var constants_2 = require("../../utils/constants");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
/**
 * Class representing an unsigned Operation transaction.
 */
var OperationTx = /** @class */ (function (_super) {
    __extends(OperationTx, _super);
    /**
     * Class representing an unsigned Operation transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param ops Array of [[Operation]]s used in the transaction
     */
    function OperationTx(networkID, blockchainID, outs, ins, memo, ops) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (ops === void 0) { ops = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "OperationTx";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.OPERATIONTX
            : constants_1.AVMConstants.OPERATIONTX_CODECONE;
        _this.numOps = buffer_1.Buffer.alloc(4);
        _this.ops = [];
        if (typeof ops !== "undefined" && Array.isArray(ops)) {
            for (var i = 0; i < ops.length; i++) {
                if (!(ops["".concat(i)] instanceof ops_1.TransferableOperation)) {
                    throw new errors_1.OperationError("Error - OperationTx.constructor: invalid op in array parameter ".concat(ops));
                }
            }
            _this.ops = ops;
        }
        return _this;
    }
    OperationTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { ops: this.ops.map(function (o) { return o.serialize(encoding); }) });
    };
    OperationTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.ops = fields["ops"].map(function (o) {
            var op = new ops_1.TransferableOperation();
            op.deserialize(o, encoding);
            return op;
        });
        this.numOps = buffer_1.Buffer.alloc(4);
        this.numOps.writeUInt32BE(this.ops.length, 0);
    };
    OperationTx.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - OperationTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.OPERATIONTX
                : constants_1.AVMConstants.OPERATIONTX_CODECONE;
    };
    /**
     * Returns the id of the [[OperationTx]]
     */
    OperationTx.prototype.getTxType = function () {
        return this._typeID;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[OperationTx]], parses it, populates the class, and returns the length of the [[OperationTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[OperationTx]]
     *
     * @returns The length of the raw [[OperationTx]]
     *
     * @remarks assume not-checksummed
     */
    OperationTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.numOps = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var numOps = this.numOps.readUInt32BE(0);
        for (var i = 0; i < numOps; i++) {
            var op = new ops_1.TransferableOperation();
            offset = op.fromBuffer(bytes, offset);
            this.ops.push(op);
        }
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[OperationTx]].
     */
    OperationTx.prototype.toBuffer = function () {
        this.numOps.writeUInt32BE(this.ops.length, 0);
        var barr = [_super.prototype.toBuffer.call(this), this.numOps];
        this.ops = this.ops.sort(ops_1.TransferableOperation.comparator());
        for (var i = 0; i < this.ops.length; i++) {
            barr.push(this.ops["".concat(i)].toBuffer());
        }
        return buffer_1.Buffer.concat(barr);
    };
    /**
     * Returns an array of [[TransferableOperation]]s in this transaction.
     */
    OperationTx.prototype.getOperations = function () {
        return this.ops;
    };
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    OperationTx.prototype.sign = function (msg, kc) {
        var creds = _super.prototype.sign.call(this, msg, kc);
        for (var i = 0; i < this.ops.length; i++) {
            var cred = (0, credentials_1.SelectCredentialClass)(this.ops["".concat(i)].getOperation().getCredentialID());
            var sigidxs = this.ops["".concat(i)].getOperation().getSigIdxs();
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
    OperationTx.prototype.clone = function () {
        var newbase = new OperationTx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    OperationTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (OperationTx.bind.apply(OperationTx, __spreadArray([void 0], args, false)))();
    };
    return OperationTx;
}(basetx_1.BaseTx));
exports.OperationTx = OperationTx;
