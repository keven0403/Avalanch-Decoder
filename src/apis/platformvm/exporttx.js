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
exports.ExportTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-ExportTx
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var outputs_1 = require("./outputs");
var basetx_1 = require("./basetx");
var constants_2 = require("../../utils/constants");
var bn_js_1 = require("bn.js");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Class representing an unsigned Export transaction.
 */
var ExportTx = /** @class */ (function (_super) {
    __extends(ExportTx, _super);
    /**
     * Class representing an unsigned Export transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param destinationChain Optional chainid which identifies where the funds will send to.
     * @param exportOuts Array of [[TransferableOutputs]]s used in the transaction
     */
    function ExportTx(networkID, blockchainID, outs, ins, memo, destinationChain, exportOuts) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (destinationChain === void 0) { destinationChain = undefined; }
        if (exportOuts === void 0) { exportOuts = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "ExportTx";
        _this._typeID = constants_1.PlatformVMConstants.EXPORTTX;
        _this.destinationChain = buffer_1.Buffer.alloc(32);
        _this.numOuts = buffer_1.Buffer.alloc(4);
        _this.exportOuts = [];
        _this.destinationChain = destinationChain; //do not correct, it should bomb on toBuffer if not provided
        if (typeof exportOuts !== "undefined" && Array.isArray(exportOuts)) {
            for (var i = 0; i < exportOuts.length; i++) {
                if (!(exportOuts["".concat(i)] instanceof outputs_1.TransferableOutput)) {
                    throw new errors_1.TransferableOutputError("Error - ExportTx.constructor: invalid TransferableOutput in array parameter 'exportOuts'");
                }
            }
            _this.exportOuts = exportOuts;
        }
        return _this;
    }
    ExportTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { destinationChain: serialization.encoder(this.destinationChain, encoding, "Buffer", "cb58"), exportOuts: this.exportOuts.map(function (e) { return e.serialize(encoding); }) });
    };
    ExportTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.destinationChain = serialization.decoder(fields["destinationChain"], encoding, "cb58", "Buffer", 32);
        this.exportOuts = fields["exportOuts"].map(function (e) {
            var eo = new outputs_1.TransferableOutput();
            eo.deserialize(e, encoding);
            return eo;
        });
        this.numOuts = buffer_1.Buffer.alloc(4);
        this.numOuts.writeUInt32BE(this.exportOuts.length, 0);
    };
    /**
     * Returns the id of the [[ExportTx]]
     */
    ExportTx.prototype.getTxType = function () {
        return constants_1.PlatformVMConstants.EXPORTTX;
    };
    /**
     * Returns an array of [[TransferableOutput]]s in this transaction.
     */
    ExportTx.prototype.getExportOutputs = function () {
        return this.exportOuts;
    };
    /**
     * Returns the total exported amount as a {@link https://github.com/indutny/bn.js/|BN}.
     */
    ExportTx.prototype.getExportTotal = function () {
        var val = new bn_js_1.default(0);
        for (var i = 0; i < this.exportOuts.length; i++) {
            val = val.add(this.exportOuts["".concat(i)].getOutput().getAmount());
        }
        return val;
    };
    ExportTx.prototype.getTotalOuts = function () {
        return __spreadArray(__spreadArray([], this.getOuts(), true), this.getExportOutputs(), true);
    };
    /**
     * Returns the destinationChain as a {@link https://github.com/feross/buffer|Buffer}
     */
    ExportTx.prototype.getDestinationChain = function () {
        return this.destinationChain;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[ExportTx]], parses it, populates the class, and returns the length of the [[ExportTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[ExportTx]]
     *
     * @returns The length of the raw [[ExportTx]]
     *
     * @remarks assume not-checksummed
     */
    ExportTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.destinationChain = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.numOuts = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var numOuts = this.numOuts.readUInt32BE(0);
        for (var i = 0; i < numOuts; i++) {
            var anOut = new outputs_1.TransferableOutput();
            offset = anOut.fromBuffer(bytes, offset);
            this.exportOuts.push(anOut);
        }
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ExportTx]].
     */
    ExportTx.prototype.toBuffer = function () {
        if (typeof this.destinationChain === "undefined") {
            throw new errors_1.ChainIdError("ExportTx.toBuffer -- this.destinationChain is undefined");
        }
        this.numOuts.writeUInt32BE(this.exportOuts.length, 0);
        var barr = [_super.prototype.toBuffer.call(this), this.destinationChain, this.numOuts];
        this.exportOuts = this.exportOuts.sort(outputs_1.TransferableOutput.comparator());
        for (var i = 0; i < this.exportOuts.length; i++) {
            barr.push(this.exportOuts["".concat(i)].toBuffer());
        }
        return buffer_1.Buffer.concat(barr);
    };
    ExportTx.prototype.clone = function () {
        var newbase = new ExportTx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    ExportTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (ExportTx.bind.apply(ExportTx, __spreadArray([void 0], args, false)))();
    };
    return ExportTx;
}(basetx_1.BaseTx));
exports.ExportTx = ExportTx;
