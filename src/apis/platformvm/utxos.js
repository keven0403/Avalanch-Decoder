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
 * @module API-PlatformVM-UTXOs
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var bn_js_1 = require("bn.js");
var outputs_1 = require("./outputs");
var inputs_1 = require("./inputs");
var helperfunctions_1 = require("../../utils/helperfunctions");
var utxos_1 = require("../../common/utxos");
var constants_1 = require("./constants");
var tx_1 = require("./tx");
var exporttx_1 = require("../platformvm/exporttx");
var constants_2 = require("../../utils/constants");
var importtx_1 = require("../platformvm/importtx");
var basetx_1 = require("../platformvm/basetx");
var assetamount_1 = require("../../common/assetamount");
var validationtx_1 = require("./validationtx");
var createsubnettx_1 = require("./createsubnettx");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
var _1 = require(".");
var addsubnetvalidatortx_1 = require("../platformvm/addsubnetvalidatortx");
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
     * Takes a base-58 or hex string containing a [[UTXO]], parses it, populates the class, and returns the length of the StandardUTXO in bytes.
     *
     * @param serialized A base-58 string containing a raw [[UTXO]]
     * @param format The format of the encoded [[UTXO]] (cb58 or hex). Defaults to cb58 per existing codebase
     *
     * @returns The length of the raw [[UTXO]]
     *
     * @remarks
     * Default encoding format is cb58, if providing hex encoded string please specify format as 'hex'
     */
    UTXO.prototype.fromString = function (serialized, format) {
        if (format === void 0) { format = 'cb58'; }
        switch (format) {
            case "cb58":
                {
                    /* istanbul ignore next */
                    return this.fromBuffer(bintools.cb58Decode(serialized));
                }
                ;
            case "hex":
                {
                    var decoded = serialization.decoder(serialized, 'hex', 'hex', 'cb58');
                    this.fromString(decoded);
                    return this.toBuffer().length;
                }
                ;
            default:
                {
                    throw new errors_1.UnknownFormatError("Specified format '".concat(format, "' is unknown, should be hex or cb58."));
                }
                ;
        }
    };
    /**
     * Returns a base-58 representation of the [[UTXO]].
     *
     * @param format The format of the encoded [[UTXO]] (cb58 or hex). Defaults to cb58 per existing codebase
     *
     * @remarks
     * Default encoding format to cb58, if you want a hex encoded output please specify format as 'hex'
     */
    UTXO.prototype.toString = function (format) {
        if (format === void 0) { format = 'cb58'; }
        switch (format) {
            case "cb58":
                {
                    /* istanbul ignore next */
                    return bintools.cb58Encode(this.toBuffer());
                }
                ;
            case "hex":
                {
                    return serialization.encoder(bintools.cb58Encode(this.toBuffer()), 'hex', 'cb58', 'hex');
                }
                ;
            default:
                {
                    throw new errors_1.UnknownFormatError("Specified format '".concat(format, "' is unknown, should be hex or cb58."));
                }
                ;
        }
    };
    UTXO.prototype.clone = function () {
        var utxo = new UTXO();
        utxo.fromBuffer(this.toBuffer());
        return utxo;
    };
    UTXO.prototype.create = function (codecID, txid, outputidx, assetID, output) {
        if (codecID === void 0) { codecID = constants_1.PlatformVMConstants.LATESTCODEC; }
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
        _this.getConsumableUXTO = function (asOf, stakeable) {
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (stakeable === void 0) { stakeable = false; }
            return _this.getAllUTXOs().filter(function (utxo) {
                if (stakeable) {
                    // stakeable transactions can consume any UTXO.
                    return true;
                }
                var output = utxo.getOutput();
                if (!(output instanceof outputs_1.StakeableLockOut)) {
                    // non-stakeable transactions can consume any UTXO that isn't locked.
                    return true;
                }
                var stakeableOutput = output;
                if (stakeableOutput.getStakeableLocktime().lt(asOf)) {
                    // If the stakeable outputs locktime has ended, then this UTXO can still
                    // be consumed by a non-stakeable transaction.
                    return true;
                }
                // This output is locked and can't be consumed by a non-stakeable
                // transaction.
                return false;
            });
        };
        _this.getMinimumSpendable = function (aad, asOf, locktime, threshold, stakeable) {
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            if (stakeable === void 0) { stakeable = false; }
            var utxoArray = _this.getConsumableUXTO(asOf, stakeable);
            var tmpUTXOArray = [];
            if (stakeable) {
                // If this is a stakeable transaction then have StakeableLockOut come before SECPTransferOutput
                // so that users first stake locked tokens before staking unlocked tokens
                utxoArray.forEach(function (utxo) {
                    // StakeableLockOuts
                    if (utxo.getOutput().getTypeID() === 22) {
                        tmpUTXOArray.push(utxo);
                    }
                });
                // Sort the StakeableLockOuts by StakeableLocktime so that the greatest StakeableLocktime are spent first
                tmpUTXOArray.sort(function (a, b) {
                    var stakeableLockOut1 = a.getOutput();
                    var stakeableLockOut2 = b.getOutput();
                    return (stakeableLockOut2.getStakeableLocktime().toNumber() -
                        stakeableLockOut1.getStakeableLocktime().toNumber());
                });
                utxoArray.forEach(function (utxo) {
                    // SECPTransferOutputs
                    if (utxo.getOutput().getTypeID() === 7) {
                        tmpUTXOArray.push(utxo);
                    }
                });
                utxoArray = tmpUTXOArray;
            }
            // outs is a map from assetID to a tuple of (lockedStakeable, unlocked)
            // which are arrays of outputs.
            var outs = {};
            // We only need to iterate over UTXOs until we have spent sufficient funds
            // to met the requested amounts.
            utxoArray.forEach(function (utxo, index) {
                var assetID = utxo.getAssetID();
                var assetKey = assetID.toString("hex");
                var fromAddresses = aad.getSenders();
                var output = utxo.getOutput();
                if (!(output instanceof outputs_1.AmountOutput) ||
                    !aad.assetExists(assetKey) ||
                    !output.meetsThreshold(fromAddresses, asOf)) {
                    // We should only try to spend fungible assets.
                    // We should only spend {{ assetKey }}.
                    // We need to be able to spend the output.
                    return;
                }
                var assetAmount = aad.getAssetAmount(assetKey);
                if (assetAmount.isFinished()) {
                    // We've already spent the needed UTXOs for this assetID.
                    return;
                }
                if (!(assetKey in outs)) {
                    // If this is the first time spending this assetID, we need to
                    // initialize the outs object correctly.
                    outs["".concat(assetKey)] = {
                        lockedStakeable: [],
                        unlocked: []
                    };
                }
                var amountOutput = output;
                // amount is the amount of funds available from this UTXO.
                var amount = amountOutput.getAmount();
                // Set up the SECP input with the same amount as the output.
                var input = new inputs_1.SECPTransferInput(amount);
                var locked = false;
                if (amountOutput instanceof outputs_1.StakeableLockOut) {
                    var stakeableOutput = amountOutput;
                    var stakeableLocktime = stakeableOutput.getStakeableLocktime();
                    if (stakeableLocktime.gt(asOf)) {
                        // Add a new input and mark it as being locked.
                        input = new inputs_1.StakeableLockIn(amount, stakeableLocktime, new inputs_1.ParseableInput(input));
                        // Mark this UTXO as having been re-locked.
                        locked = true;
                    }
                }
                assetAmount.spendAmount(amount, locked);
                if (locked) {
                    // Track the UTXO as locked.
                    outs["".concat(assetKey)].lockedStakeable.push(amountOutput);
                }
                else {
                    // Track the UTXO as unlocked.
                    outs["".concat(assetKey)].unlocked.push(amountOutput);
                }
                // Get the indices of the outputs that should be used to authorize the
                // spending of this input.
                // TODO: getSpenders should return an array of indices rather than an
                // array of addresses.
                var spenders = amountOutput.getSpenders(fromAddresses, asOf);
                spenders.forEach(function (spender) {
                    var idx = amountOutput.getAddressIdx(spender);
                    if (idx === -1) {
                        // This should never happen, which is why the error is thrown rather
                        // than being returned. If this were to ever happen this would be an
                        // error in the internal logic rather having called this function with
                        // invalid arguments.
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.getMinimumSpendable: no such " +
                            "address in output: ".concat(spender));
                    }
                    input.addSignatureIdx(idx, spender);
                });
                var txID = utxo.getTxID();
                var outputIdx = utxo.getOutputIdx();
                var transferInput = new inputs_1.TransferableInput(txID, outputIdx, assetID, input);
                aad.addInput(transferInput);
            });
            if (!aad.canComplete()) {
                // After running through all the UTXOs, we still weren't able to get all
                // the necessary funds, so this transaction can't be made.
                return new errors_1.InsufficientFundsError("Error - UTXOSet.getMinimumSpendable: insufficient " +
                    "funds to create the transaction");
            }
            // TODO: We should separate the above functionality into a single function
            // that just selects the UTXOs to consume.
            var zero = new bn_js_1.default(0);
            // assetAmounts is an array of asset descriptions and how much is left to
            // spend for them.
            var assetAmounts = aad.getAmounts();
            assetAmounts.forEach(function (assetAmount) {
                // change is the amount that should be returned back to the source of the
                // funds.
                var change = assetAmount.getChange();
                // isStakeableLockChange is if the change is locked or not.
                var isStakeableLockChange = assetAmount.getStakeableLockChange();
                // lockedChange is the amount of locked change that should be returned to
                // the sender
                var lockedChange = isStakeableLockChange ? change : zero.clone();
                var assetID = assetAmount.getAssetID();
                var assetKey = assetAmount.getAssetIDString();
                var lockedOutputs = outs["".concat(assetKey)].lockedStakeable;
                lockedOutputs.forEach(function (lockedOutput, i) {
                    var stakeableLocktime = lockedOutput.getStakeableLocktime();
                    var parseableOutput = lockedOutput.getTransferableOutput();
                    // We know that parseableOutput contains an AmountOutput because the
                    // first loop filters for fungible assets.
                    var output = parseableOutput.getOutput();
                    var outputAmountRemaining = output.getAmount();
                    // The only output that could generate change is the last output.
                    // Otherwise, any further UTXOs wouldn't have needed to be spent.
                    if (i == lockedOutputs.length - 1 && lockedChange.gt(zero)) {
                        // update outputAmountRemaining to no longer hold the change that we
                        // are returning.
                        outputAmountRemaining = outputAmountRemaining.sub(lockedChange);
                        // Create the inner output.
                        var newChangeOutput = (0, outputs_1.SelectOutputClass)(output.getOutputID(), lockedChange, output.getAddresses(), output.getLocktime(), output.getThreshold());
                        // Wrap the inner output in the StakeableLockOut wrapper.
                        var newLockedChangeOutput = (0, outputs_1.SelectOutputClass)(lockedOutput.getOutputID(), lockedChange, output.getAddresses(), output.getLocktime(), output.getThreshold(), stakeableLocktime, new outputs_1.ParseableOutput(newChangeOutput));
                        var transferOutput_1 = new outputs_1.TransferableOutput(assetID, newLockedChangeOutput);
                        aad.addChange(transferOutput_1);
                    }
                    // We know that outputAmountRemaining > 0. Otherwise, we would never
                    // have consumed this UTXO, as it would be only change.
                    // Create the inner output.
                    var newOutput = (0, outputs_1.SelectOutputClass)(output.getOutputID(), outputAmountRemaining, output.getAddresses(), output.getLocktime(), output.getThreshold());
                    // Wrap the inner output in the StakeableLockOut wrapper.
                    var newLockedOutput = (0, outputs_1.SelectOutputClass)(lockedOutput.getOutputID(), outputAmountRemaining, output.getAddresses(), output.getLocktime(), output.getThreshold(), stakeableLocktime, new outputs_1.ParseableOutput(newOutput));
                    var transferOutput = new outputs_1.TransferableOutput(assetID, newLockedOutput);
                    aad.addOutput(transferOutput);
                });
                // unlockedChange is the amount of unlocked change that should be returned
                // to the sender
                var unlockedChange = isStakeableLockChange ? zero.clone() : change;
                if (unlockedChange.gt(zero)) {
                    var newChangeOutput = new outputs_1.SECPTransferOutput(unlockedChange, aad.getChangeAddresses(), zero.clone(), // make sure that we don't lock the change output.
                    threshold);
                    var transferOutput = new outputs_1.TransferableOutput(assetID, newChangeOutput);
                    aad.addChange(transferOutput);
                }
                // totalAmountSpent is the total amount of tokens consumed.
                var totalAmountSpent = assetAmount.getSpent();
                // stakeableLockedAmount is the total amount of locked tokens consumed.
                var stakeableLockedAmount = assetAmount.getStakeableLockSpent();
                // totalUnlockedSpent is the total amount of unlocked tokens consumed.
                var totalUnlockedSpent = totalAmountSpent.sub(stakeableLockedAmount);
                // amountBurnt is the amount of unlocked tokens that must be burn.
                var amountBurnt = assetAmount.getBurn();
                // totalUnlockedAvailable is the total amount of unlocked tokens available
                // to be produced.
                var totalUnlockedAvailable = totalUnlockedSpent.sub(amountBurnt);
                // unlockedAmount is the amount of unlocked tokens that should be sent.
                var unlockedAmount = totalUnlockedAvailable.sub(unlockedChange);
                if (unlockedAmount.gt(zero)) {
                    var newOutput = new outputs_1.SECPTransferOutput(unlockedAmount, aad.getDestinations(), locktime, threshold);
                    var transferOutput = new outputs_1.TransferableOutput(assetID, newOutput);
                    aad.addOutput(transferOutput);
                }
            });
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
            var minSpendableErr = _this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof minSpendableErr === "undefined") {
                ins = aad.getInputs();
                outs = aad.getAllOutputs();
            }
            else {
                throw minSpendableErr;
            }
            var baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins, memo);
            return new tx_1.UnsignedTx(baseTx);
        };
        /**
         * Creates an unsigned ImportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs. Default: toAddresses
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
                    if (feepaid.gte(fee)) {
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
                var minSpendableErr = _this.getMinimumSpendable(aad, asOf, locktime, threshold);
                if (typeof minSpendableErr === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw minSpendableErr;
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
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover of the AVAX
         * @param destinationChain Optional. A {@link https://github.com/feross/buffer|Buffer} for the chainid where to send the asset.
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
        _this.buildExportTx = function (networkID, blockchainID, amount, avaxAssetID, // TODO: rename this to amountAssetID
        toAddresses, fromAddresses, changeAddresses, destinationChain, fee, feeAssetID, memo, asOf, locktime, threshold) {
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
                feeAssetID = avaxAssetID;
            }
            else if (feeAssetID.toString("hex") !== avaxAssetID.toString("hex")) {
                /* istanbul ignore next */
                throw new errors_1.FeeAssetError("Error - UTXOSet.buildExportTx: " + "feeAssetID must match avaxAssetID");
            }
            if (typeof destinationChain === "undefined") {
                destinationChain = bintools.cb58Decode(constants_2.Defaults.network["".concat(networkID)].X["blockchainID"]);
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
            var minSpendableErr = _this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof minSpendableErr === "undefined") {
                ins = aad.getInputs();
                outs = aad.getChangeOutputs();
                exportouts = aad.getOutputs();
            }
            else {
                throw minSpendableErr;
            }
            var exportTx = new exporttx_1.ExportTx(networkID, blockchainID, outs, ins, memo, destinationChain, exportouts);
            return new tx_1.UnsignedTx(exportTx);
        };
        /**
         * Class representing an unsigned [[AddSubnetValidatorTx]] transaction.
         *
         * @param networkID Networkid, [[DefaultNetworkID]]
         * @param blockchainID Blockchainid, default undefined
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees in AVAX
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
         * @param weight The amount of weight for this subnet validator.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param subnetAuthCredentials Optional. An array of index and address to sign for each SubnetAuth.
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildAddSubnetValidatorTx = function (networkID, blockchainID, fromAddresses, changeAddresses, nodeID, startTime, endTime, weight, subnetID, fee, feeAssetID, memo, asOf, subnetAuthCredentials) {
            if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (subnetAuthCredentials === void 0) { subnetAuthCredentials = []; }
            var ins = [];
            var outs = [];
            var zero = new bn_js_1.default(0);
            var now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new Error("UTXOSet.buildAddSubnetValidatorTx -- startTime must be in the future and endTime must come after startTime");
            }
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
            var addSubnetValidatorTx = new addsubnetvalidatortx_1.AddSubnetValidatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, weight, subnetID);
            subnetAuthCredentials.forEach(function (subnetAuthCredential) {
                addSubnetValidatorTx.addSignatureIdx(subnetAuthCredential[0], subnetAuthCredential[1]);
            });
            return new tx_1.UnsignedTx(addSubnetValidatorTx);
        };
        /**
         * Class representing an unsigned [[AddDelegatorTx]] transaction.
         *
         * @param networkID Networkid, [[DefaultNetworkID]]
         * @param blockchainID Blockchainid, default undefined
         * @param avaxAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AVAX
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} recieves the stake at the end of the staking period
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees and the stake
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the staking payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
         * @param stakeAmount A {@link https://github.com/indutny/bn.js/|BN} for the amount of stake to be delegated in nAVAX.
         * @param rewardLocktime The locktime field created in the resulting reward outputs
         * @param rewardThreshold The number of signatures required to spend the funds in the resultant reward UTXO
         * @param rewardAddresses The addresses the validator reward goes.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param changeThreshold Optional. The number of signatures required to spend the funds in the change UTXO
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildAddDelegatorTx = function (networkID, blockchainID, avaxAssetID, toAddresses, fromAddresses, changeAddresses, nodeID, startTime, endTime, stakeAmount, rewardLocktime, rewardThreshold, rewardAddresses, fee, feeAssetID, memo, asOf, changeThreshold) {
            if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (changeThreshold === void 0) { changeThreshold = 1; }
            if (rewardThreshold > rewardAddresses.length) {
                /* istanbul ignore next */
                throw new errors_1.ThresholdError("Error - UTXOSet.buildAddDelegatorTx: reward threshold is greater than number of addresses");
            }
            if (typeof changeAddresses === "undefined") {
                changeAddresses = toAddresses;
            }
            var ins = [];
            var outs = [];
            var stakeOuts = [];
            var zero = new bn_js_1.default(0);
            var now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new errors_1.TimeError("UTXOSet.buildAddDelegatorTx -- startTime must be in the future and endTime must come after startTime");
            }
            var aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (avaxAssetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(avaxAssetID, stakeAmount, fee);
            }
            else {
                aad.addAssetAmount(avaxAssetID, stakeAmount, zero);
                if (_this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            var minSpendableErr = _this.getMinimumSpendable(aad, asOf, undefined, changeThreshold, true);
            if (typeof minSpendableErr === "undefined") {
                ins = aad.getInputs();
                outs = aad.getChangeOutputs();
                stakeOuts = aad.getOutputs();
            }
            else {
                throw minSpendableErr;
            }
            var rewardOutputOwners = new outputs_1.SECPOwnerOutput(rewardAddresses, rewardLocktime, rewardThreshold);
            var UTx = new validationtx_1.AddDelegatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount, stakeOuts, new outputs_1.ParseableOutput(rewardOutputOwners));
            return new tx_1.UnsignedTx(UTx);
        };
        /**
         * Class representing an unsigned [[AddValidatorTx]] transaction.
         *
         * @param networkID NetworkID, [[DefaultNetworkID]]
         * @param blockchainID BlockchainID, default undefined
         * @param avaxAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AVAX
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} recieves the stake at the end of the staking period
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees and the stake
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the staking payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
         * @param stakeAmount A {@link https://github.com/indutny/bn.js/|BN} for the amount of stake to be delegated in nAVAX.
         * @param rewardLocktime The locktime field created in the resulting reward outputs
         * @param rewardThreshold The number of signatures required to spend the funds in the resultant reward UTXO
         * @param rewardAddresses The addresses the validator reward goes.
         * @param delegationFee A number for the percentage of reward to be given to the validator when someone delegates to them. Must be between 0 and 100.
         * @param minStake A {@link https://github.com/indutny/bn.js/|BN} representing the minimum stake required to validate on this network.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildAddValidatorTx = function (networkID, blockchainID, avaxAssetID, toAddresses, fromAddresses, changeAddresses, nodeID, startTime, endTime, stakeAmount, rewardLocktime, rewardThreshold, rewardAddresses, delegationFee, fee, feeAssetID, memo, asOf) {
            if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            var ins = [];
            var outs = [];
            var stakeOuts = [];
            var zero = new bn_js_1.default(0);
            var now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new errors_1.TimeError("UTXOSet.buildAddValidatorTx -- startTime must be in the future and endTime must come after startTime");
            }
            if (delegationFee > 100 || delegationFee < 0) {
                throw new errors_1.TimeError("UTXOSet.buildAddValidatorTx -- startTime must be in the range of 0 to 100, inclusively");
            }
            var aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (avaxAssetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(avaxAssetID, stakeAmount, fee);
            }
            else {
                aad.addAssetAmount(avaxAssetID, stakeAmount, zero);
                if (_this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            var minSpendableErr = _this.getMinimumSpendable(aad, asOf, undefined, undefined, true);
            if (typeof minSpendableErr === "undefined") {
                ins = aad.getInputs();
                outs = aad.getChangeOutputs();
                stakeOuts = aad.getOutputs();
            }
            else {
                throw minSpendableErr;
            }
            var rewardOutputOwners = new outputs_1.SECPOwnerOutput(rewardAddresses, rewardLocktime, rewardThreshold);
            var UTx = new validationtx_1.AddValidatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount, stakeOuts, new outputs_1.ParseableOutput(rewardOutputOwners), delegationFee);
            return new tx_1.UnsignedTx(UTx);
        };
        /**
         * Class representing an unsigned [[CreateSubnetTx]] transaction.
         *
         * @param networkID Networkid, [[DefaultNetworkID]]
         * @param blockchainID Blockchainid, default undefined
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs.
         * @param subnetOwnerAddresses An array of {@link https://github.com/feross/buffer|Buffer} for the addresses to add to a subnet
         * @param subnetOwnerThreshold The number of owners's signatures required to add a validator to the network
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildCreateSubnetTx = function (networkID, blockchainID, fromAddresses, changeAddresses, subnetOwnerAddresses, subnetOwnerThreshold, fee, feeAssetID, memo, asOf) {
            if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
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
                var minSpendableErr = _this.getMinimumSpendable(aad, asOf, undefined, undefined);
                if (typeof minSpendableErr === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw minSpendableErr;
                }
            }
            var locktime = new bn_js_1.default(0);
            var subnetOwners = new outputs_1.SECPOwnerOutput(subnetOwnerAddresses, locktime, subnetOwnerThreshold);
            var createSubnetTx = new createsubnettx_1.CreateSubnetTx(networkID, blockchainID, outs, ins, memo, subnetOwners);
            return new tx_1.UnsignedTx(createSubnetTx);
        };
        /**
         * Build an unsigned [[CreateChainTx]].
         *
         * @param networkID Networkid, [[DefaultNetworkID]]
         * @param blockchainID Blockchainid, default undefined
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs.
         * @param subnetID Optional ID of the Subnet that validates this blockchain
         * @param chainName Optional A human readable name for the chain; need not be unique
         * @param vmID Optional ID of the VM running on the new chain
         * @param fxIDs Optional IDs of the feature extensions running on the new chain
         * @param genesisData Optional Byte representation of genesis state of the new chain
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param subnetAuthCredentials Optional. An array of index and address to sign for each SubnetAuth.
         *
         * @returns An unsigned CreateChainTx created from the passed in parameters.
         */
        _this.buildCreateChainTx = function (networkID, blockchainID, fromAddresses, changeAddresses, subnetID, chainName, vmID, fxIDs, genesisData, fee, feeAssetID, memo, asOf, subnetAuthCredentials) {
            if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
            if (subnetID === void 0) { subnetID = undefined; }
            if (chainName === void 0) { chainName = undefined; }
            if (vmID === void 0) { vmID = undefined; }
            if (fxIDs === void 0) { fxIDs = undefined; }
            if (genesisData === void 0) { genesisData = undefined; }
            if (fee === void 0) { fee = undefined; }
            if (feeAssetID === void 0) { feeAssetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (subnetAuthCredentials === void 0) { subnetAuthCredentials = []; }
            var zero = new bn_js_1.default(0);
            var ins = [];
            var outs = [];
            if (_this._feeCheck(fee, feeAssetID)) {
                var aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                var minSpendableErr = _this.getMinimumSpendable(aad, asOf, undefined, undefined);
                if (typeof minSpendableErr === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw minSpendableErr;
                }
            }
            var createChainTx = new _1.CreateChainTx(networkID, blockchainID, outs, ins, memo, subnetID, chainName, vmID, fxIDs, genesisData);
            subnetAuthCredentials.forEach(function (subnetAuthCredential) {
                createChainTx.addSignatureIdx(subnetAuthCredential[0], subnetAuthCredential[1]);
            });
            return new tx_1.UnsignedTx(createChainTx);
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
        else if (utxo instanceof utxos_1.StandardUTXO) {
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
