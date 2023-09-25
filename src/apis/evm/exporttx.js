"use strict";
/**
 * @packageDocumentation
 * @module API-EVM-ExportTx
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
exports.ExportTx = void 0;
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var basetx_1 = require("./basetx");
var credentials_1 = require("./credentials");
var credentials_2 = require("../../common/credentials");
var inputs_1 = require("./inputs");
var serialization_1 = require("../../utils/serialization");
var outputs_1 = require("./outputs");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serializer = serialization_1.Serialization.getInstance();
var ExportTx = /** @class */ (function (_super) {
    __extends(ExportTx, _super);
    /**
     * Class representing a ExportTx.
     *
     * @param networkID Optional networkID
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param destinationChain Optional destinationChain, default Buffer.alloc(32, 16)
     * @param inputs Optional array of the [[EVMInputs]]s
     * @param exportedOutputs Optional array of the [[EVMOutputs]]s
     */
    function ExportTx(networkID, blockchainID, destinationChain, inputs, exportedOutputs) {
        if (networkID === void 0) { networkID = undefined; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (destinationChain === void 0) { destinationChain = buffer_1.Buffer.alloc(32, 16); }
        if (inputs === void 0) { inputs = undefined; }
        if (exportedOutputs === void 0) { exportedOutputs = undefined; }
        var _this = _super.call(this, networkID, blockchainID) || this;
        _this._typeName = "ExportTx";
        _this._typeID = constants_1.EVMConstants.EXPORTTX;
        _this.destinationChain = buffer_1.Buffer.alloc(32);
        _this.numInputs = buffer_1.Buffer.alloc(4);
        _this.inputs = [];
        _this.numExportedOutputs = buffer_1.Buffer.alloc(4);
        _this.exportedOutputs = [];
        _this.destinationChain = destinationChain;
        if (typeof inputs !== "undefined" && Array.isArray(inputs)) {
            inputs.forEach(function (input) {
                if (!(input instanceof inputs_1.EVMInput)) {
                    throw new errors_1.EVMInputError("Error - ExportTx.constructor: invalid EVMInput in array parameter 'inputs'");
                }
            });
            if (inputs.length > 1) {
                inputs = inputs.sort(inputs_1.EVMInput.comparator());
            }
            _this.inputs = inputs;
        }
        if (typeof exportedOutputs !== "undefined" &&
            Array.isArray(exportedOutputs)) {
            exportedOutputs.forEach(function (exportedOutput) {
                if (!(exportedOutput instanceof outputs_1.TransferableOutput)) {
                    throw new errors_1.TransferableOutputError("Error - ExportTx.constructor: TransferableOutput EVMInput in array parameter 'exportedOutputs'");
                }
            });
            _this.exportedOutputs = exportedOutputs;
        }
        return _this;
    }
    ExportTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { destinationChain: serializer.encoder(this.destinationChain, encoding, "Buffer", "cb58"), exportedOutputs: this.exportedOutputs.map(function (i) { return i.serialize(encoding); }) });
    };
    ExportTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.destinationChain = serializer.decoder(fields["destinationChain"], encoding, "cb58", "Buffer", 32);
        this.exportedOutputs = fields["exportedOutputs"].map(function (i) {
            var eo = new outputs_1.TransferableOutput();
            eo.deserialize(i, encoding);
            return eo;
        });
        this.numExportedOutputs = buffer_1.Buffer.alloc(4);
        this.numExportedOutputs.writeUInt32BE(this.exportedOutputs.length, 0);
    };
    /**
     * Returns the destinationChain as a {@link https://github.com/feross/buffer|Buffer}
     */
    ExportTx.prototype.getDestinationChain = function () {
        return this.destinationChain;
    };
    /**
     * Returns the inputs as an array of [[EVMInputs]]
     */
    ExportTx.prototype.getInputs = function () {
        return this.inputs;
    };
    /**
     * Returns the outs as an array of [[EVMOutputs]]
     */
    ExportTx.prototype.getExportedOutputs = function () {
        return this.exportedOutputs;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ExportTx]].
     */
    ExportTx.prototype.toBuffer = function () {
        if (typeof this.destinationChain === "undefined") {
            throw new errors_1.ChainIdError("ExportTx.toBuffer -- this.destinationChain is undefined");
        }
        this.numInputs.writeUInt32BE(this.inputs.length, 0);
        this.numExportedOutputs.writeUInt32BE(this.exportedOutputs.length, 0);
        var barr = [
            _super.prototype.toBuffer.call(this),
            this.destinationChain,
            this.numInputs
        ];
        var bsize = _super.prototype.toBuffer.call(this).length +
            this.destinationChain.length +
            this.numInputs.length;
        this.inputs.forEach(function (importIn) {
            bsize += importIn.toBuffer().length;
            barr.push(importIn.toBuffer());
        });
        bsize += this.numExportedOutputs.length;
        barr.push(this.numExportedOutputs);
        this.exportedOutputs.forEach(function (out) {
            bsize += out.toBuffer().length;
            barr.push(out.toBuffer());
        });
        return buffer_1.Buffer.concat(barr, bsize);
    };
    /**
     * Decodes the [[ExportTx]] as a {@link https://github.com/feross/buffer|Buffer} and returns the size.
     */
    ExportTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.destinationChain = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.numInputs = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var numInputs = this.numInputs.readUInt32BE(0);
        for (var i = 0; i < numInputs; i++) {
            var anIn = new inputs_1.EVMInput();
            offset = anIn.fromBuffer(bytes, offset);
            this.inputs.push(anIn);
        }
        this.numExportedOutputs = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var numExportedOutputs = this.numExportedOutputs.readUInt32BE(0);
        for (var i = 0; i < numExportedOutputs; i++) {
            var anOut = new outputs_1.TransferableOutput();
            offset = anOut.fromBuffer(bytes, offset);
            this.exportedOutputs.push(anOut);
        }
        return offset;
    };
    /**
     * Returns a base-58 representation of the [[ExportTx]].
     */
    ExportTx.prototype.toString = function () {
        return bintools.bufferToB58(this.toBuffer());
    };
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    ExportTx.prototype.sign = function (msg, kc) {
        var creds = _super.prototype.sign.call(this, msg, kc);
        this.inputs.forEach(function (input) {
            var cred = (0, credentials_1.SelectCredentialClass)(input.getCredentialID());
            var sigidxs = input.getSigIdxs();
            sigidxs.forEach(function (sigidx) {
                var keypair = kc.getKey(sigidx.getSource());
                var signval = keypair.sign(msg);
                var sig = new credentials_2.Signature();
                sig.fromBuffer(signval);
                cred.addSignature(sig);
            });
            creds.push(cred);
        });
        return creds;
    };
    return ExportTx;
}(basetx_1.EVMBaseTx));
exports.ExportTx = ExportTx;
