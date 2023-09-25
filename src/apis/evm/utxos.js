"use strict";
/**
 * @packageDocumentation
 * @module API-EVM-UTXOs
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTXOSet = exports.AssetAmountDestination = exports.UTXO = void 0;
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var bn_js_1 = require("bn.js");
var outputs_1 = require("./outputs");
var constants_1 = require("./constants");
var inputs_1 = require("./inputs");
var helperfunctions_1 = require("../../utils/helperfunctions");
var utxos_1 = require("../../common/utxos");
var constants_2 = require("../../utils/constants");
var assetamount_1 = require("../../common/assetamount");
var serialization_1 = require("../../utils/serialization");
var tx_1 = require("./tx");
var importtx_1 = require("./importtx");
var exporttx_1 = require("./exporttx");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serializer = serialization_1.Serialization.getInstance();
/**
 * Class for representing a single UTXO.
 */
var UTXO = /** @class */ (function (_super) {
    __extends(UTXO, _super);
    function UTXO() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "UTXO";
        _this._typeID = undefined;
        return _this;
    }
    //serialize is inherited
    UTXO.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.output = (0, outputs_1.SelectOutputClass)(fields["output"]["_typeID"]);
        this.output.deserialize(fields["output"], encoding);
    };
    UTXO.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.codecID = bintools.copyFrom(bytes, offset, offset + 2);
        offset += 2;
        this.txid = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.outputidx = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        this.assetID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        var outputid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.output = (0, outputs_1.SelectOutputClass)(outputid);
        return this.output.fromBuffer(bytes, offset);
    };
    /**
     * Takes a base-58 string containing a [[UTXO]], parses it, populates the class, and returns the length of the StandardUTXO in bytes.
     *
     * @param serialized A base-58 string containing a raw [[UTXO]]
     *
     * @returns The length of the raw [[UTXO]]
     *
     * @remarks
     * unlike most fromStrings, it expects the string to be serialized in cb58 format
     */
    UTXO.prototype.fromString = function (serialized) {
        /* istanbul ignore next */
        return this.fromBuffer(bintools.cb58Decode(serialized));
    };
    /**
     * Returns a base-58 representation of the [[UTXO]].
     *
     * @remarks
     * unlike most toStrings, this returns in cb58 serialization format
     */
    UTXO.prototype.toString = function () {
        /* istanbul ignore next */
        return bintools.cb58Encode(this.toBuffer());
    };
    UTXO.prototype.clone = function () {
        var utxo = new UTXO();
        utxo.fromBuffer(this.toBuffer());
        return utxo;
    };
    UTXO.prototype.create = function (codecID, txID, outputidx, assetID, output) {
        if (codecID === void 0) { codecID = constants_1.EVMConstants.LATESTCODEC; }
        if (txID === void 0) { txID = undefined; }
        if (outputidx === void 0) { outputidx = undefined; }
        if (assetID === void 0) { assetID = undefined; }
        if (output === void 0) { output = undefined; }
        return new UTXO(codecID, txID, outputidx, assetID, output);
    };
    return UTXO;
}(utxos_1.StandardUTXO));
exports.UTXO = UTXO;
var AssetAmountDestination = /** @class */ (function (_super) {
    __extends(AssetAmountDestination, _super);
    function AssetAmountDestination() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AssetAmountDestination;
}(assetamount_1.StandardAssetAmountDestination));
exports.AssetAmountDestination = AssetAmountDestination;
/**
 * Class representing a set of [[UTXO]]s.
 */
var UTXOSet = /** @class */ (function (_super) {
    __extends(UTXOSet, _super);
    function UTXOSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "UTXOSet";
        _this._typeID = undefined;
        _this.getMinimumSpendable = function (aad, asOf, locktime, threshold) {
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            var utxoArray = _this.getAllUTXOs();
            var outids = {};
            var _loop_1 = function (i) {
                var u = utxoArray["".concat(i)];
                var assetKey = u.getAssetID().toString("hex");
                var fromAddresses = aad.getSenders();
                if (u.getOutput() instanceof outputs_1.AmountOutput &&
                    aad.assetExists(assetKey) &&
                    u.getOutput().meetsThreshold(fromAddresses, asOf)) {
                    var am = aad.getAssetAmount(assetKey);
                    if (!am.isFinished()) {
                        var uout_1 = u.getOutput();
                        outids["".concat(assetKey)] = uout_1.getOutputID();
                        var amount = uout_1.getAmount();
                        am.spendAmount(amount);
                        var txid = u.getTxID();
                        var outputidx = u.getOutputIdx();
                        var input = new inputs_1.SECPTransferInput(amount);
                        var xferin_1 = new inputs_1.TransferableInput(txid, outputidx, u.getAssetID(), input);
                        var spenders = uout_1.getSpenders(fromAddresses, asOf);
                        spenders.forEach(function (spender) {
                            var idx = uout_1.getAddressIdx(spender);
                            if (idx === -1) {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - UTXOSet.getMinimumSpendable: no such address in output");
                            }
                            xferin_1.getInput().addSignatureIdx(idx, spender);
                        });
                        aad.addInput(xferin_1);
                    }
                    else if (aad.assetExists(assetKey) &&
                        !(u.getOutput() instanceof outputs_1.AmountOutput)) {
                        return "continue";
                    }
                }
            };
            for (var i = 0; i < utxoArray.length && !aad.canComplete(); i++) {
                _loop_1(i);
            }
            if (!aad.canComplete()) {
                return new errors_1.InsufficientFundsError("Error - UTXOSet.getMinimumSpendable: insufficient funds to create the transaction");
            }
            var amounts = aad.getAmounts();
            var zero = new bn_js_1.default(0);
            for (var i = 0; i < amounts.length; i++) {
                var assetKey = amounts["".concat(i)].getAssetIDString();
                var amount = amounts["".concat(i)].getAmount();
                if (amount.gt(zero)) {
                    var spendout = (0, outputs_1.SelectOutputClass)(outids["".concat(assetKey)], amount, aad.getDestinations(), locktime, threshold);
                    var xferout = new outputs_1.TransferableOutput(amounts["".concat(i)].getAssetID(), spendout);
                    aad.addOutput(xferout);
                }
                var change = amounts["".concat(i)].getChange();
                if (change.gt(zero)) {
                    var changeout = (0, outputs_1.SelectOutputClass)(outids["".concat(assetKey)], change, aad.getChangeAddresses());
                    var chgxferout = new outputs_1.TransferableOutput(amounts["".concat(i)].getAssetID(), changeout);
                    aad.addChange(chgxferout);
                }
            }
            return undefined;
        };
        /**
         * Creates an unsigned ImportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param toAddress The address to send the funds
         * @param importIns An array of [[TransferableInput]]s being imported
         * @param sourceChain A {@link https://github.com/feross/buffer|Buffer} for the chainid where the imports are coming from.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}. Fee will come from the inputs first, if they can.
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildImportTx = function (networkID, blockchainID, toAddress, atomics, sourceChain, fee, feeAssetID) {
            if (sourceChain === void 0) { sourceChain = undefined; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            var zero = new bn_js_1.default(0);
            var map = new Map();
            var ins = [];
            var outs = [];
            var feepaid = new bn_js_1.default(0);
            if (typeof fee === "undefined") {
                fee = zero.clone();
            }
            // build a set of inputs which covers the fee
            atomics.forEach(function (atomic) {
                var assetIDBuf = atomic.getAssetID();
                var assetID = bintools.cb58Encode(atomic.getAssetID());
                var output = atomic.getOutput();
                var amount = output.getAmount().clone();
                var infeeamount = amount.clone();
                if (typeof feeAssetID !== "undefined" &&
                    fee.gt(zero) &&
                    feepaid.lt(fee) &&
                    buffer_1.Buffer.compare(feeAssetID, assetIDBuf) === 0) {
                    feepaid = feepaid.add(infeeamount);
                    if (feepaid.gt(fee)) {
                        infeeamount = feepaid.sub(fee);
                        feepaid = fee.clone();
                    }
                    else {
                        infeeamount = zero.clone();
                    }
                }
                var txid = atomic.getTxID();
                var outputidx = atomic.getOutputIdx();
                var input = new inputs_1.SECPTransferInput(amount);
                var xferin = new inputs_1.TransferableInput(txid, outputidx, assetIDBuf, input);
                var from = output.getAddresses();
                var spenders = output.getSpenders(from);
                spenders.forEach(function (spender) {
                    var idx = output.getAddressIdx(spender);
                    if (idx === -1) {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.buildImportTx: no such address in output");
                    }
                    xferin.getInput().addSignatureIdx(idx, spender);
                });
                ins.push(xferin);
                if (map.has(assetID)) {
                    infeeamount = infeeamount.add(new bn_js_1.default(map.get(assetID)));
                }
                map.set(assetID, infeeamount.toString());
            });
            for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
                var _a = map_1[_i], assetID = _a[0], amount = _a[1];
                // Create single EVMOutput for each assetID
                var evmOutput = new outputs_1.EVMOutput(toAddress, new bn_js_1.default(amount), bintools.cb58Decode(assetID));
                outs.push(evmOutput);
            }
            // lexicographically sort array
            ins = ins.sort(inputs_1.TransferableInput.comparator());
            outs = outs.sort(outputs_1.EVMOutput.comparator());
            var importTx = new importtx_1.ImportTx(networkID, blockchainID, sourceChain, ins, outs, fee);
            return new tx_1.UnsignedTx(importTx);
        };
        /**
         * Creates an unsigned ExportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param avaxAssetID {@link https://github.com/feross/buffer|Buffer} of the AssetID for AVAX
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who recieves the AVAX
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who owns the AVAX
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param destinationChain Optional. A {@link https://github.com/feross/buffer|Buffer} for the chainid where to send the asset.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildExportTx = function (networkID, blockchainID, amount, avaxAssetID, toAddresses, fromAddresses, changeAddresses, destinationChain, fee, feeAssetID, asOf, locktime, threshold) {
            if (changeAddresses === void 0) { changeAddresses = undefined; }
            if (destinationChain === void 0) { destinationChain = undefined; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            var ins = [];
            var exportouts = [];
            if (typeof changeAddresses === "undefined") {
                changeAddresses = toAddresses;
            }
            var zero = new bn_js_1.default(0);
            if (amount.eq(zero)) {
                return undefined;
            }
            if (typeof feeAssetID === "undefined") {
                feeAssetID = avaxAssetID;
            }
            else if (feeAssetID.toString("hex") !== avaxAssetID.toString("hex")) {
                /* istanbul ignore next */
                throw new errors_1.FeeAssetError("Error - UTXOSet.buildExportTx: feeAssetID must match avaxAssetID");
            }
            if (typeof destinationChain === "undefined") {
                destinationChain = bintools.cb58Decode(constants_2.PlatformChainID);
            }
            var aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (avaxAssetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(avaxAssetID, amount, fee);
            }
            else {
                aad.addAssetAmount(avaxAssetID, amount, zero);
                if (_this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            var success = _this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof success === "undefined") {
                exportouts = aad.getOutputs();
            }
            else {
                throw success;
            }
            var exportTx = new exporttx_1.ExportTx(networkID, blockchainID, destinationChain, ins, exportouts);
            return new tx_1.UnsignedTx(exportTx);
        };
        return _this;
    }
    //serialize is inherited
    UTXOSet.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        var utxos = {};
        for (var utxoid in fields["utxos"]) {
            var utxoidCleaned = serializer.decoder(utxoid, encoding, "base58", "base58");
            utxos["".concat(utxoidCleaned)] = new UTXO();
            utxos["".concat(utxoidCleaned)].deserialize(fields["utxos"]["".concat(utxoid)], encoding);
        }
        var addressUTXOs = {};
        for (var address in fields["addressUTXOs"]) {
            var addressCleaned = serializer.decoder(address, encoding, "cb58", "hex");
            var utxobalance = {};
            for (var utxoid in fields["addressUTXOs"]["".concat(address)]) {
                var utxoidCleaned = serializer.decoder(utxoid, encoding, "base58", "base58");
                utxobalance["".concat(utxoidCleaned)] = serializer.decoder(fields["addressUTXOs"]["".concat(address)]["".concat(utxoid)], encoding, "decimalString", "BN");
            }
            addressUTXOs["".concat(addressCleaned)] = utxobalance;
        }
        this.utxos = utxos;
        this.addressUTXOs = addressUTXOs;
    };
    UTXOSet.prototype.parseUTXO = function (utxo) {
        var utxovar = new UTXO();
        // force a copy
        if (typeof utxo === "string") {
            utxovar.fromBuffer(bintools.cb58Decode(utxo));
        }
        else if (utxo instanceof UTXO) {
            utxovar.fromBuffer(utxo.toBuffer()); // forces a copy
        }
        else {
            /* istanbul ignore next */
            throw new errors_1.UTXOError("Error - UTXO.parseUTXO: utxo parameter is not a UTXO or string");
        }
        return utxovar;
    };
    UTXOSet.prototype.create = function () {
        return new UTXOSet();
    };
    UTXOSet.prototype.clone = function () {
        var newset = this.create();
        var allUTXOs = this.getAllUTXOs();
        newset.addArray(allUTXOs);
        return newset;
    };
    UTXOSet.prototype._feeCheck = function (fee, feeAssetID) {
        return (typeof fee !== "undefined" &&
            typeof feeAssetID !== "undefined" &&
            fee.gt(new bn_js_1.default(0)) &&
            feeAssetID instanceof buffer_1.Buffer);
    };
    return UTXOSet;
}(utxos_1.StandardUTXOSet));
exports.UTXOSet = UTXOSet;
