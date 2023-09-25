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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTXOSet = exports.AssetAmountDestination = exports.UTXO = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-UTXOs
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var bn_js_1 = require("bn.js");
var outputs_1 = require("./outputs");
var constants_1 = require("./constants");
var tx_1 = require("./tx");
var inputs_1 = require("./inputs");
var ops_1 = require("./ops");
var helperfunctions_1 = require("../../utils/helperfunctions");
var initialstates_1 = require("./initialstates");
var utxos_1 = require("../../common/utxos");
var createassettx_1 = require("./createassettx");
var operationtx_1 = require("./operationtx");
var basetx_1 = require("./basetx");
var exporttx_1 = require("./exporttx");
var importtx_1 = require("./importtx");
var constants_2 = require("../../utils/constants");
var assetamount_1 = require("../../common/assetamount");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
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
    UTXO.prototype.create = function (codecID, txid, outputidx, assetID, output) {
        if (codecID === void 0) { codecID = constants_1.AVMConstants.LATESTCODEC; }
        if (txid === void 0) { txid = undefined; }
        if (outputidx === void 0) { outputidx = undefined; }
        if (assetID === void 0) { assetID = undefined; }
        if (output === void 0) { output = undefined; }
        return new UTXO(codecID, txid, outputidx, assetID, output);
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
            for (var i = 0; i < utxoArray.length && !aad.canComplete(); i++) {
                var u = utxoArray["".concat(i)];
                var assetKey = u.getAssetID().toString("hex");
                var fromAddresses = aad.getSenders();
                if (u.getOutput() instanceof outputs_1.AmountOutput &&
                    aad.assetExists(assetKey) &&
                    u.getOutput().meetsThreshold(fromAddresses, asOf)) {
                    var am = aad.getAssetAmount(assetKey);
                    if (!am.isFinished()) {
                        var uout = u.getOutput();
                        outids["".concat(assetKey)] = uout.getOutputID();
                        var amount = uout.getAmount();
                        am.spendAmount(amount);
                        var txid = u.getTxID();
                        var outputidx = u.getOutputIdx();
                        var input = new inputs_1.SECPTransferInput(amount);
                        var xferin = new inputs_1.TransferableInput(txid, outputidx, u.getAssetID(), input);
                        var spenders = uout.getSpenders(fromAddresses, asOf);
                        for (var j = 0; j < spenders.length; j++) {
                            var idx = uout.getAddressIdx(spenders["".concat(j)]);
                            if (idx === -1) {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - UTXOSet.getMinimumSpendable: no such " +
                                    "address in output: ".concat(spenders["".concat(j)]));
                            }
                            xferin.getInput().addSignatureIdx(idx, spenders["".concat(j)]);
                        }
                        aad.addInput(xferin);
                    }
                    else if (aad.assetExists(assetKey) &&
                        !(u.getOutput() instanceof outputs_1.AmountOutput)) {
                        /**
                         * Leaving the below lines, not simply for posterity, but for clarification.
                         * AssetIDs may have mixed OutputTypes.
                         * Some of those OutputTypes may implement AmountOutput.
                         * Others may not.
                         * Simply continue in this condition.
                         */
                        /*return new Error('Error - UTXOSet.getMinimumSpendable: outputID does not '
                          + `implement AmountOutput: ${u.getOutput().getOutputID}`)*/
                        continue;
                    }
                }
            }
            if (!aad.canComplete()) {
                return new errors_1.InsufficientFundsError("Error - UTXOSet.getMinimumSpendable: insufficient " +
                    "funds to create the transaction");
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
         * Creates an [[UnsignedTx]] wrapping a [[BaseTx]]. For more granular control, you may create your own
         * [[UnsignedTx]] wrapping a [[BaseTx]] manually (with their corresponding [[TransferableInput]]s and [[TransferableOutput]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param amount The amount of the asset to be spent in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}.
         * @param assetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for the UTXO
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs. Default: toAddresses
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned. Default: assetID
         * @param memo Optional. Contains arbitrary data, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildBaseTx = function (networkID, blockchainID, amount, assetID, toAddresses, fromAddresses, changeAddresses, fee, feeAssetID, memo, asOf, locktime, threshold) {
            if (changeAddresses === void 0) { changeAddresses = undefined; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            if (threshold > toAddresses.length) {
                /* istanbul ignore next */
                throw new errors_1.ThresholdError("Error - UTXOSet.buildBaseTx: threshold is greater than number of addresses");
            }
            if (typeof changeAddresses === "undefined") {
                changeAddresses = toAddresses;
            }
            if (typeof feeAssetID === "undefined") {
                feeAssetID = assetID;
            }
            var zero = new bn_js_1.default(0);
            if (amount.eq(zero)) {
                return undefined;
            }
            var aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (assetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(assetID, amount, fee);
            }
            else {
                aad.addAssetAmount(assetID, amount, zero);
                if (_this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            var ins = [];
            var outs = [];
            var success = _this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof success === "undefined") {
                ins = aad.getInputs();
                outs = aad.getAllOutputs();
            }
            else {
                throw success;
            }
            var baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins, memo);
            return new tx_1.UnsignedTx(baseTx);
        };
        /**
         * Creates an unsigned Create Asset transaction. For more granular control, you may create your own
         * [[CreateAssetTX]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs
         * @param initialState The [[InitialStates]] that represent the intial state of a created asset
         * @param name String for the descriptive name of the asset
         * @param symbol String for the ticker symbol of the asset
         * @param denomination Optional number for the denomination which is 10^D. D must be >= 0 and <= 32. Ex: $1 AVAX = 10^9 $nAVAX
         * @param mintOutputs Optional. Array of [[SECPMintOutput]]s to be included in the transaction. These outputs can be spent to mint more tokens.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildCreateAssetTx = function (networkID, blockchainID, fromAddresses, changeAddresses, initialState, name, symbol, denomination, mintOutputs, fee, feeAssetID, memo, asOf) {
            if (mintOutputs === void 0) { mintOutputs = undefined; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            var zero = new bn_js_1.default(0);
            var ins = [];
            var outs = [];
            if (_this._feeCheck(fee, feeAssetID)) {
                var aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                var success = _this.getMinimumSpendable(aad, asOf);
                if (typeof success === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw success;
                }
            }
            if (typeof mintOutputs !== "undefined") {
                for (var i = 0; i < mintOutputs.length; i++) {
                    if (mintOutputs["".concat(i)] instanceof outputs_1.SECPMintOutput) {
                        initialState.addOutput(mintOutputs["".concat(i)]);
                    }
                    else {
                        throw new errors_1.SECPMintOutputError("Error - UTXOSet.buildCreateAssetTx: A submitted mintOutput was not of type SECPMintOutput");
                    }
                }
            }
            var CAtx = new createassettx_1.CreateAssetTx(networkID, blockchainID, outs, ins, memo, name, symbol, denomination, initialState);
            return new tx_1.UnsignedTx(CAtx);
        };
        /**
         * Creates an unsigned Secp mint transaction. For more granular control, you may create your own
         * [[OperationTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param mintOwner A [[SECPMintOutput]] which specifies the new set of minters
         * @param transferOwner A [[SECPTransferOutput]] which specifies where the minted tokens will go
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param mintUTXOID The UTXOID for the [[SCPMintOutput]] being spent to produce more tokens
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.buildSECPMintTx = function (networkID, blockchainID, mintOwner, transferOwner, fromAddresses, changeAddresses, mintUTXOID, fee, feeAssetID, memo, asOf) {
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            var zero = new bn_js_1.default(0);
            var ins = [];
            var outs = [];
            if (_this._feeCheck(fee, feeAssetID)) {
                var aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                var success = _this.getMinimumSpendable(aad, asOf);
                if (typeof success === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw success;
                }
            }
            var ops = [];
            var mintOp = new ops_1.SECPMintOperation(mintOwner, transferOwner);
            var utxo = _this.getUTXO(mintUTXOID);
            if (typeof utxo === "undefined") {
                throw new errors_1.UTXOError("Error - UTXOSet.buildSECPMintTx: UTXOID not found");
            }
            if (utxo.getOutput().getOutputID() !== constants_1.AVMConstants.SECPMINTOUTPUTID) {
                throw new errors_1.SECPMintOutputError("Error - UTXOSet.buildSECPMintTx: UTXO is not a SECPMINTOUTPUTID");
            }
            var out = utxo.getOutput();
            var spenders = out.getSpenders(fromAddresses, asOf);
            for (var j = 0; j < spenders.length; j++) {
                var idx = out.getAddressIdx(spenders["".concat(j)]);
                if (idx == -1) {
                    /* istanbul ignore next */
                    throw new Error("Error - UTXOSet.buildSECPMintTx: no such address in output");
                }
                mintOp.addSignatureIdx(idx, spenders["".concat(j)]);
            }
            var transferableOperation = new ops_1.TransferableOperation(utxo.getAssetID(), ["".concat(mintUTXOID)], mintOp);
            ops.push(transferableOperation);
            var operationTx = new operationtx_1.OperationTx(networkID, blockchainID, outs, ins, memo, ops);
            return new tx_1.UnsignedTx(operationTx);
        };
        /**
         * Creates an unsigned Create Asset transaction. For more granular control, you may create your own
         * [[CreateAssetTX]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param minterSets The minters and thresholds required to mint this nft asset
         * @param name String for the descriptive name of the nft asset
         * @param symbol String for the ticker symbol of the nft asset
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting mint output
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildCreateNFTAssetTx = function (networkID, blockchainID, fromAddresses, changeAddresses, minterSets, name, symbol, fee, feeAssetID, memo, asOf, locktime) {
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = undefined; }
            var zero = new bn_js_1.default(0);
            var ins = [];
            var outs = [];
            if (_this._feeCheck(fee, feeAssetID)) {
                var aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                var success = _this.getMinimumSpendable(aad, asOf);
                if (typeof success === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw success;
                }
            }
            var initialState = new initialstates_1.InitialStates();
            for (var i = 0; i < minterSets.length; i++) {
                var nftMintOutput = new outputs_1.NFTMintOutput(i, minterSets["".concat(i)].getMinters(), locktime, minterSets["".concat(i)].getThreshold());
                initialState.addOutput(nftMintOutput, constants_1.AVMConstants.NFTFXID);
            }
            var denomination = 0; // NFTs are non-fungible
            var CAtx = new createassettx_1.CreateAssetTx(networkID, blockchainID, outs, ins, memo, name, symbol, denomination, initialState);
            return new tx_1.UnsignedTx(CAtx);
        };
        /**
         * Creates an unsigned NFT mint transaction. For more granular control, you may create your own
         * [[OperationTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param owners An array of [[OutputOwners]] who will be given the NFTs.
         * @param fromAddresses The addresses being used to send the funds from the UTXOs
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param utxoids An array of strings for the NFTs being transferred
         * @param groupID Optional. The group this NFT is issued to.
         * @param payload Optional. Data for NFT Payload.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildCreateNFTMintTx = function (networkID, blockchainID, owners, fromAddresses, changeAddresses, utxoids, groupID, payload, fee, feeAssetID, memo, asOf) {
            if (groupID === void 0) { groupID = 0; }
            if (payload === void 0) { payload = undefined; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            var zero = new bn_js_1.default(0);
            var ins = [];
            var outs = [];
            if (_this._feeCheck(fee, feeAssetID)) {
                var aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                var success = _this.getMinimumSpendable(aad, asOf);
                if (typeof success === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw success;
                }
            }
            var ops = [];
            var nftMintOperation = new ops_1.NFTMintOperation(groupID, payload, owners);
            for (var i = 0; i < utxoids.length; i++) {
                var utxo = _this.getUTXO(utxoids["".concat(i)]);
                var out = utxo.getOutput();
                var spenders = out.getSpenders(fromAddresses, asOf);
                for (var j = 0; j < spenders.length; j++) {
                    var idx = void 0;
                    idx = out.getAddressIdx(spenders["".concat(j)]);
                    if (idx == -1) {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.buildCreateNFTMintTx: no such address in output");
                    }
                    nftMintOperation.addSignatureIdx(idx, spenders["".concat(j)]);
                }
                var transferableOperation = new ops_1.TransferableOperation(utxo.getAssetID(), utxoids, nftMintOperation);
                ops.push(transferableOperation);
            }
            var operationTx = new operationtx_1.OperationTx(networkID, blockchainID, outs, ins, memo, ops);
            return new tx_1.UnsignedTx(operationTx);
        };
        /**
         * Creates an unsigned NFT transfer transaction. For more granular control, you may create your own
         * [[OperationTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param toAddresses An array of {@link https://github.com/feross/buffer|Buffer}s which indicate who recieves the NFT
         * @param fromAddresses An array for {@link https://github.com/feross/buffer|Buffer} who owns the NFT
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param utxoids An array of strings for the NFTs being transferred
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildNFTTransferTx = function (networkID, blockchainID, toAddresses, fromAddresses, changeAddresses, utxoids, fee, feeAssetID, memo, asOf, locktime, threshold) {
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            var zero = new bn_js_1.default(0);
            var ins = [];
            var outs = [];
            if (_this._feeCheck(fee, feeAssetID)) {
                var aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                var success = _this.getMinimumSpendable(aad, asOf);
                if (typeof success === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw success;
                }
            }
            var ops = [];
            for (var i = 0; i < utxoids.length; i++) {
                var utxo = _this.getUTXO(utxoids["".concat(i)]);
                var out = utxo.getOutput();
                var spenders = out.getSpenders(fromAddresses, asOf);
                var outbound = new outputs_1.NFTTransferOutput(out.getGroupID(), out.getPayload(), toAddresses, locktime, threshold);
                var op = new ops_1.NFTTransferOperation(outbound);
                for (var j = 0; j < spenders.length; j++) {
                    var idx = out.getAddressIdx(spenders["".concat(j)]);
                    if (idx === -1) {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.buildNFTTransferTx: " +
                            "no such address in output: ".concat(spenders["".concat(j)]));
                    }
                    op.addSignatureIdx(idx, spenders["".concat(j)]);
                }
                var xferop = new ops_1.TransferableOperation(utxo.getAssetID(), [utxoids["".concat(i)]], op);
                ops.push(xferop);
            }
            var OpTx = new operationtx_1.OperationTx(networkID, blockchainID, outs, ins, memo, ops);
            return new tx_1.UnsignedTx(OpTx);
        };
        /**
         * Creates an unsigned ImportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param importIns An array of [[TransferableInput]]s being imported
         * @param sourceChain A {@link https://github.com/feross/buffer|Buffer} for the chainid where the imports are coming from.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}. Fee will come from the inputs first, if they can.
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildImportTx = function (networkID, blockchainID, toAddresses, fromAddresses, changeAddresses, atomics, sourceChain, fee, feeAssetID, memo, asOf, locktime, threshold) {
            if (sourceChain === void 0) { sourceChain = undefined; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            var zero = new bn_js_1.default(0);
            var ins = [];
            var outs = [];
            if (typeof fee === "undefined") {
                fee = zero.clone();
            }
            var importIns = [];
            var feepaid = new bn_js_1.default(0);
            var feeAssetStr = feeAssetID.toString("hex");
            for (var i = 0; i < atomics.length; i++) {
                var utxo = atomics["".concat(i)];
                var assetID = utxo.getAssetID();
                var output = utxo.getOutput();
                var amt = output.getAmount().clone();
                var infeeamount = amt.clone();
                var assetStr = assetID.toString("hex");
                if (typeof feeAssetID !== "undefined" &&
                    fee.gt(zero) &&
                    feepaid.lt(fee) &&
                    assetStr === feeAssetStr) {
                    feepaid = feepaid.add(infeeamount);
                    if (feepaid.gt(fee)) {
                        infeeamount = feepaid.sub(fee);
                        feepaid = fee.clone();
                    }
                    else {
                        infeeamount = zero.clone();
                    }
                }
                var txid = utxo.getTxID();
                var outputidx = utxo.getOutputIdx();
                var input = new inputs_1.SECPTransferInput(amt);
                var xferin = new inputs_1.TransferableInput(txid, outputidx, assetID, input);
                var from = output.getAddresses();
                var spenders = output.getSpenders(from, asOf);
                for (var j = 0; j < spenders.length; j++) {
                    var idx = output.getAddressIdx(spenders["".concat(j)]);
                    if (idx === -1) {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.buildImportTx: no such " +
                            "address in output: ".concat(spenders["".concat(j)]));
                    }
                    xferin.getInput().addSignatureIdx(idx, spenders["".concat(j)]);
                }
                importIns.push(xferin);
                //add extra outputs for each amount (calculated from the imported inputs), minus fees
                if (infeeamount.gt(zero)) {
                    var spendout = (0, outputs_1.SelectOutputClass)(output.getOutputID(), infeeamount, toAddresses, locktime, threshold);
                    var xferout = new outputs_1.TransferableOutput(assetID, spendout);
                    outs.push(xferout);
                }
            }
            // get remaining fees from the provided addresses
            var feeRemaining = fee.sub(feepaid);
            if (feeRemaining.gt(zero) && _this._feeCheck(feeRemaining, feeAssetID)) {
                var aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, feeRemaining);
                var success = _this.getMinimumSpendable(aad, asOf, locktime, threshold);
                if (typeof success === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw success;
                }
            }
            var importTx = new importtx_1.ImportTx(networkID, blockchainID, outs, ins, memo, sourceChain, importIns);
            return new tx_1.UnsignedTx(importTx);
        };
        /**
         * Creates an unsigned ExportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param avaxAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AVAX
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who recieves the AVAX
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who owns the AVAX
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param destinationChain Optional. A {@link https://github.com/feross/buffer|Buffer} for the chainid where to send the asset.
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        _this.buildExportTx = function (networkID, blockchainID, amount, assetID, toAddresses, fromAddresses, changeAddresses, destinationChain, fee, feeAssetID, memo, asOf, locktime, threshold) {
            if (changeAddresses === void 0) { changeAddresses = undefined; }
            if (destinationChain === void 0) { destinationChain = undefined; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            var ins = [];
            var outs = [];
            var exportouts = [];
            if (typeof changeAddresses === "undefined") {
                changeAddresses = toAddresses;
            }
            var zero = new bn_js_1.default(0);
            if (amount.eq(zero)) {
                return undefined;
            }
            if (typeof feeAssetID === "undefined") {
                feeAssetID = assetID;
            }
            if (typeof destinationChain === "undefined") {
                destinationChain = bintools.cb58Decode(constants_2.PlatformChainID);
            }
            var aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (assetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(assetID, amount, fee);
            }
            else {
                aad.addAssetAmount(assetID, amount, zero);
                if (_this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            var success = _this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof success === "undefined") {
                ins = aad.getInputs();
                outs = aad.getChangeOutputs();
                exportouts = aad.getOutputs();
            }
            else {
                throw success;
            }
            var exportTx = new exporttx_1.ExportTx(networkID, blockchainID, outs, ins, memo, destinationChain, exportouts);
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
            var utxoidCleaned = serialization.decoder(utxoid, encoding, "base58", "base58");
            utxos["".concat(utxoidCleaned)] = new UTXO();
            utxos["".concat(utxoidCleaned)].deserialize(fields["utxos"]["".concat(utxoid)], encoding);
        }
        var addressUTXOs = {};
        for (var address in fields["addressUTXOs"]) {
            var addressCleaned = serialization.decoder(address, encoding, "cb58", "hex");
            var utxobalance = {};
            for (var utxoid in fields["addressUTXOs"]["".concat(address)]) {
                var utxoidCleaned = serialization.decoder(utxoid, encoding, "base58", "base58");
                utxobalance["".concat(utxoidCleaned)] = serialization.decoder(fields["addressUTXOs"]["".concat(address)]["".concat(utxoid)], encoding, "decimalString", "BN");
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
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
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
