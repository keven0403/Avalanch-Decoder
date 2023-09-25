"use strict";
/**
 * @packageDocumentation
 * @module API-EVM-ImportTx
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
var buffer_1 = require("buffer/");
var bn_js_1 = require("bn.js");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var outputs_1 = require("./outputs");
var inputs_1 = require("./inputs");
var basetx_1 = require("./basetx");
var credentials_1 = require("./credentials");
var credentials_2 = require("../../common/credentials");
var input_1 = require("../../common/input");
var constants_2 = require("../../utils/constants");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serializer = serialization_1.Serialization.getInstance();
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
     * @param sourceChainID Optional chainID for the source inputs to import. Default Buffer.alloc(32, 16)
     * @param importIns Optional array of [[TransferableInput]]s used in the transaction
     * @param outs Optional array of the [[EVMOutput]]s
     * @param fee Optional the fee as a BN
     */
    function ImportTx(networkID, blockchainID, sourceChainID, importIns, outs, fee) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (sourceChainID === void 0) { sourceChainID = buffer_1.Buffer.alloc(32, 16); }
        if (importIns === void 0) { importIns = undefined; }
        if (outs === void 0) { outs = undefined; }
        if (fee === void 0) { fee = new bn_js_1.default(0); }
        var _this = _super.call(this, networkID, blockchainID) || this;
        _this._typeName = "ImportTx";
        _this._typeID = constants_1.EVMConstants.IMPORTTX;
        _this.sourceChain = buffer_1.Buffer.alloc(32);
        _this.numIns = buffer_1.Buffer.alloc(4);
        _this.importIns = [];
        _this.numOuts = buffer_1.Buffer.alloc(4);
        _this.outs = [];
        _this.sourceChain = sourceChainID;
        var inputsPassed = false;
        var outputsPassed = false;
        if (typeof importIns !== "undefined" &&
            Array.isArray(importIns) &&
            importIns.length > 0) {
            importIns.forEach(function (importIn) {
                if (!(importIn instanceof inputs_1.TransferableInput)) {
                    throw new errors_1.TransferableInputError("Error - ImportTx.constructor: invalid TransferableInput in array parameter 'importIns'");
                }
            });
            inputsPassed = true;
            _this.importIns = importIns;
        }
        if (typeof outs !== "undefined" && Array.isArray(outs) && outs.length > 0) {
            outs.forEach(function (out) {
                if (!(out instanceof outputs_1.EVMOutput)) {
                    throw new errors_1.EVMOutputError("Error - ImportTx.constructor: invalid EVMOutput in array parameter 'outs'");
                }
            });
            if (outs.length > 1) {
                outs = outs.sort(outputs_1.EVMOutput.comparator());
            }
            outputsPassed = true;
            _this.outs = outs;
        }
        if (inputsPassed && outputsPassed) {
            _this.validateOuts(fee);
        }
        return _this;
    }
    ImportTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { sourceChain: serializer.encoder(this.sourceChain, encoding, "Buffer", "cb58"), importIns: this.importIns.map(function (i) { return i.serialize(encoding); }) });
    };
    ImportTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.sourceChain = serializer.decoder(fields["sourceChain"], encoding, "cb58", "Buffer", 32);
        this.importIns = fields["importIns"].map(function (i) {
            var ii = new inputs_1.TransferableInput();
            ii.deserialize(i, encoding);
            return ii;
        });
        this.numIns = buffer_1.Buffer.alloc(4);
        this.numIns.writeUInt32BE(this.importIns.length, 0);
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
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[ImportTx]], parses it,
     * populates the class, and returns the length of the [[ImportTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[ImportTx]]
     * @param offset A number representing the byte offset. Defaults to 0.
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
        this.numOuts = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var numOuts = this.numOuts.readUInt32BE(0);
        for (var i = 0; i < numOuts; i++) {
            var anOut = new outputs_1.EVMOutput();
            offset = anOut.fromBuffer(bytes, offset);
            this.outs.push(anOut);
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
        this.numOuts.writeUInt32BE(this.outs.length, 0);
        var barr = [_super.prototype.toBuffer.call(this), this.sourceChain, this.numIns];
        var bsize = _super.prototype.toBuffer.call(this).length + this.sourceChain.length + this.numIns.length;
        this.importIns = this.importIns.sort(inputs_1.TransferableInput.comparator());
        this.importIns.forEach(function (importIn) {
            bsize += importIn.toBuffer().length;
            barr.push(importIn.toBuffer());
        });
        bsize += this.numOuts.length;
        barr.push(this.numOuts);
        this.outs.forEach(function (out) {
            bsize += out.toBuffer().length;
            barr.push(out.toBuffer());
        });
        return buffer_1.Buffer.concat(barr, bsize);
    };
    /**
     * Returns an array of [[TransferableInput]]s in this transaction.
     */
    ImportTx.prototype.getImportInputs = function () {
        return this.importIns;
    };
    /**
     * Returns an array of [[EVMOutput]]s in this transaction.
     */
    ImportTx.prototype.getOuts = function () {
        return this.outs;
    };
    ImportTx.prototype.clone = function () {
        var newImportTx = new ImportTx();
        newImportTx.fromBuffer(this.toBuffer());
        return newImportTx;
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
        this.importIns.forEach(function (importIn) {
            var cred = (0, credentials_1.SelectCredentialClass)(importIn.getInput().getCredentialID());
            var sigidxs = importIn.getInput().getSigIdxs();
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
    ImportTx.prototype.validateOuts = function (fee) {
        // This Map enforces uniqueness of pair(address, assetId) for each EVMOutput.
        // For each imported assetID, each ETH-style C-Chain address can
        // have exactly 1 EVMOutput.
        // Map(2) {
        //   '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC' => [
        //     'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z',
        //     'F4MyJcUvq3Rxbqgd4Zs8sUpvwLHApyrp4yxJXe2bAV86Vvp38'
        //   ],
        //   '0xecC3B2968B277b837a81A7181e0b94EB1Ca54EdE' => [
        //     'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z',
        //     '2Df96yHyhNc3vooieNNhyKwrjEfTsV2ReMo5FKjMpr8vwN4Jqy',
        //     'SfSXBzDb9GZ9R2uH61qZKe8nxQHW9KERW9Kq9WRe4vHJZRN3e'
        //   ]
        // }
        var seenAssetSends = new Map();
        this.outs.forEach(function (evmOutput) {
            var address = evmOutput.getAddressString();
            var assetId = bintools.cb58Encode(evmOutput.getAssetID());
            if (seenAssetSends.has(address)) {
                var assetsSentToAddress = seenAssetSends.get(address);
                if (assetsSentToAddress.includes(assetId)) {
                    var errorMessage = "Error - ImportTx: duplicate (address, assetId) pair found in outputs: (0x".concat(address, ", ").concat(assetId, ")");
                    throw new errors_1.EVMOutputError(errorMessage);
                }
                assetsSentToAddress.push(assetId);
            }
            else {
                seenAssetSends.set(address, [assetId]);
            }
        });
        // make sure this transaction pays the required avax fee
        var selectedNetwork = this.getNetworkID();
        var feeDiff = new bn_js_1.default(0);
        var avaxAssetID = constants_2.Defaults.network["".concat(selectedNetwork)].X.avaxAssetID;
        // sum incoming AVAX
        this.importIns.forEach(function (input) {
            // only check StandardAmountInputs
            if (input.getInput() instanceof input_1.StandardAmountInput &&
                avaxAssetID === bintools.cb58Encode(input.getAssetID())) {
                var ui = input.getInput();
                var i = ui;
                feeDiff.iadd(i.getAmount());
            }
        });
        // subtract all outgoing AVAX
        this.outs.forEach(function (evmOutput) {
            if (avaxAssetID === bintools.cb58Encode(evmOutput.getAssetID())) {
                feeDiff.isub(evmOutput.getAmount());
            }
        });
        if (feeDiff.lt(fee)) {
            var errorMessage = "Error - ".concat(fee, " nAVAX required for fee and only ").concat(feeDiff, " nAVAX provided");
            throw new errors_1.EVMFeeError(errorMessage);
        }
    };
    return ImportTx;
}(basetx_1.EVMBaseTx));
exports.ImportTx = ImportTx;
