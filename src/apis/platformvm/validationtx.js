"use strict";
/**
 * @packageDocumentation
 * @module API-PlatformVM-ValidationTx
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
exports.AddValidatorTx = exports.AddDelegatorTx = exports.WeightedValidatorTx = exports.ValidatorTx = void 0;
var bn_js_1 = require("bn.js");
var bintools_1 = require("../../utils/bintools");
var basetx_1 = require("./basetx");
var outputs_1 = require("../platformvm/outputs");
var buffer_1 = require("buffer/");
var constants_1 = require("./constants");
var constants_2 = require("../../utils/constants");
var helperfunctions_1 = require("../../utils/helperfunctions");
var outputs_2 = require("./outputs");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Abstract class representing an transactions with validation information.
 */
var ValidatorTx = /** @class */ (function (_super) {
    __extends(ValidatorTx, _super);
    function ValidatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime) {
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "ValidatorTx";
        _this._typeID = undefined;
        _this.nodeID = buffer_1.Buffer.alloc(20);
        _this.startTime = buffer_1.Buffer.alloc(8);
        _this.endTime = buffer_1.Buffer.alloc(8);
        _this.nodeID = nodeID;
        _this.startTime = bintools.fromBNToBuffer(startTime, 8);
        _this.endTime = bintools.fromBNToBuffer(endTime, 8);
        return _this;
    }
    ValidatorTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { nodeID: serialization.encoder(this.nodeID, encoding, "Buffer", "nodeID"), startTime: serialization.encoder(this.startTime, encoding, "Buffer", "decimalString"), endTime: serialization.encoder(this.endTime, encoding, "Buffer", "decimalString") });
    };
    ValidatorTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.nodeID = serialization.decoder(fields["nodeID"], encoding, "nodeID", "Buffer", 20);
        this.startTime = serialization.decoder(fields["startTime"], encoding, "decimalString", "Buffer", 8);
        this.endTime = serialization.decoder(fields["endTime"], encoding, "decimalString", "Buffer", 8);
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
     */
    ValidatorTx.prototype.getNodeID = function () {
        return this.nodeID;
    };
    /**
     * Returns a string for the nodeID amount.
     */
    ValidatorTx.prototype.getNodeIDString = function () {
        return (0, helperfunctions_1.bufferToNodeIDString)(this.nodeID);
    };
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
     */
    ValidatorTx.prototype.getStartTime = function () {
        return bintools.fromBufferToBN(this.startTime);
    };
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
     */
    ValidatorTx.prototype.getEndTime = function () {
        return bintools.fromBufferToBN(this.endTime);
    };
    ValidatorTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.nodeID = bintools.copyFrom(bytes, offset, offset + 20);
        offset += 20;
        this.startTime = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        this.endTime = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ValidatorTx]].
     */
    ValidatorTx.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var bsize = superbuff.length +
            this.nodeID.length +
            this.startTime.length +
            this.endTime.length;
        return buffer_1.Buffer.concat([superbuff, this.nodeID, this.startTime, this.endTime], bsize);
    };
    return ValidatorTx;
}(basetx_1.BaseTx));
exports.ValidatorTx = ValidatorTx;
var WeightedValidatorTx = /** @class */ (function (_super) {
    __extends(WeightedValidatorTx, _super);
    /**
     * Class representing an unsigned AddSubnetValidatorTx transaction.
     *
     * @param networkID Optional. Networkid, [[DefaultNetworkID]]
     * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
     * @param outs Optional. Array of the [[TransferableOutput]]s
     * @param ins Optional. Array of the [[TransferableInput]]s
     * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
     * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
     * @param weight Optional. The amount of nAVAX the validator is staking.
     */
    function WeightedValidatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, weight) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (nodeID === void 0) { nodeID = undefined; }
        if (startTime === void 0) { startTime = undefined; }
        if (endTime === void 0) { endTime = undefined; }
        if (weight === void 0) { weight = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime) || this;
        _this._typeName = "WeightedValidatorTx";
        _this._typeID = undefined;
        _this.weight = buffer_1.Buffer.alloc(8);
        if (typeof weight !== undefined) {
            _this.weight = bintools.fromBNToBuffer(weight, 8);
        }
        return _this;
    }
    WeightedValidatorTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { weight: serialization.encoder(this.weight, encoding, "Buffer", "decimalString") });
    };
    WeightedValidatorTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.weight = serialization.decoder(fields["weight"], encoding, "decimalString", "Buffer", 8);
    };
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
     */
    WeightedValidatorTx.prototype.getWeight = function () {
        return bintools.fromBufferToBN(this.weight);
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
     */
    WeightedValidatorTx.prototype.getWeightBuffer = function () {
        return this.weight;
    };
    WeightedValidatorTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.weight = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[AddSubnetValidatorTx]].
     */
    WeightedValidatorTx.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        return buffer_1.Buffer.concat([superbuff, this.weight]);
    };
    return WeightedValidatorTx;
}(ValidatorTx));
exports.WeightedValidatorTx = WeightedValidatorTx;
/**
 * Class representing an unsigned AddDelegatorTx transaction.
 */
var AddDelegatorTx = /** @class */ (function (_super) {
    __extends(AddDelegatorTx, _super);
    /**
     * Class representing an unsigned AddDelegatorTx transaction.
     *
     * @param networkID Optional. Networkid, [[DefaultNetworkID]]
     * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
     * @param outs Optional. Array of the [[TransferableOutput]]s
     * @param ins Optional. Array of the [[TransferableInput]]s
     * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
     * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
     * @param stakeAmount Optional. The amount of nAVAX the validator is staking.
     * @param stakeOuts Optional. The outputs used in paying the stake.
     * @param rewardOwners Optional. The [[ParseableOutput]] containing a [[SECPOwnerOutput]] for the rewards.
     */
    function AddDelegatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount, stakeOuts, rewardOwners) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (nodeID === void 0) { nodeID = undefined; }
        if (startTime === void 0) { startTime = undefined; }
        if (endTime === void 0) { endTime = undefined; }
        if (stakeAmount === void 0) { stakeAmount = undefined; }
        if (stakeOuts === void 0) { stakeOuts = undefined; }
        if (rewardOwners === void 0) { rewardOwners = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount) || this;
        _this._typeName = "AddDelegatorTx";
        _this._typeID = constants_1.PlatformVMConstants.ADDDELEGATORTX;
        _this.stakeOuts = [];
        _this.rewardOwners = undefined;
        if (typeof stakeOuts !== undefined) {
            _this.stakeOuts = stakeOuts;
        }
        _this.rewardOwners = rewardOwners;
        return _this;
    }
    AddDelegatorTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { stakeOuts: this.stakeOuts.map(function (s) { return s.serialize(encoding); }), rewardOwners: this.rewardOwners.serialize(encoding) });
    };
    AddDelegatorTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.stakeOuts = fields["stakeOuts"].map(function (s) {
            var xferout = new outputs_1.TransferableOutput();
            xferout.deserialize(s, encoding);
            return xferout;
        });
        this.rewardOwners = new outputs_2.ParseableOutput();
        this.rewardOwners.deserialize(fields["rewardOwners"], encoding);
    };
    /**
     * Returns the id of the [[AddDelegatorTx]]
     */
    AddDelegatorTx.prototype.getTxType = function () {
        return this._typeID;
    };
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
     */
    AddDelegatorTx.prototype.getStakeAmount = function () {
        return this.getWeight();
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
     */
    AddDelegatorTx.prototype.getStakeAmountBuffer = function () {
        return this.weight;
    };
    /**
     * Returns the array of outputs being staked.
     */
    AddDelegatorTx.prototype.getStakeOuts = function () {
        return this.stakeOuts;
    };
    /**
     * Should match stakeAmount. Used in sanity checking.
     */
    AddDelegatorTx.prototype.getStakeOutsTotal = function () {
        var val = new bn_js_1.default(0);
        for (var i = 0; i < this.stakeOuts.length; i++) {
            val = val.add(this.stakeOuts["".concat(i)].getOutput().getAmount());
        }
        return val;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the reward address.
     */
    AddDelegatorTx.prototype.getRewardOwners = function () {
        return this.rewardOwners;
    };
    AddDelegatorTx.prototype.getTotalOuts = function () {
        return __spreadArray(__spreadArray([], this.getOuts(), true), this.getStakeOuts(), true);
    };
    AddDelegatorTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        var numstakeouts = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var outcount = numstakeouts.readUInt32BE(0);
        this.stakeOuts = [];
        for (var i = 0; i < outcount; i++) {
            var xferout = new outputs_1.TransferableOutput();
            offset = xferout.fromBuffer(bytes, offset);
            this.stakeOuts.push(xferout);
        }
        this.rewardOwners = new outputs_2.ParseableOutput();
        offset = this.rewardOwners.fromBuffer(bytes, offset);
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[AddDelegatorTx]].
     */
    AddDelegatorTx.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var bsize = superbuff.length;
        var numouts = buffer_1.Buffer.alloc(4);
        numouts.writeUInt32BE(this.stakeOuts.length, 0);
        var barr = [_super.prototype.toBuffer.call(this), numouts];
        bsize += numouts.length;
        this.stakeOuts = this.stakeOuts.sort(outputs_1.TransferableOutput.comparator());
        for (var i = 0; i < this.stakeOuts.length; i++) {
            var out = this.stakeOuts["".concat(i)].toBuffer();
            barr.push(out);
            bsize += out.length;
        }
        var ro = this.rewardOwners.toBuffer();
        barr.push(ro);
        bsize += ro.length;
        return buffer_1.Buffer.concat(barr, bsize);
    };
    AddDelegatorTx.prototype.clone = function () {
        var newbase = new AddDelegatorTx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    AddDelegatorTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (AddDelegatorTx.bind.apply(AddDelegatorTx, __spreadArray([void 0], args, false)))();
    };
    return AddDelegatorTx;
}(WeightedValidatorTx));
exports.AddDelegatorTx = AddDelegatorTx;
var AddValidatorTx = /** @class */ (function (_super) {
    __extends(AddValidatorTx, _super);
    /**
     * Class representing an unsigned AddValidatorTx transaction.
     *
     * @param networkID Optional. Networkid, [[DefaultNetworkID]]
     * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
     * @param outs Optional. Array of the [[TransferableOutput]]s
     * @param ins Optional. Array of the [[TransferableInput]]s
     * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
     * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
     * @param stakeAmount Optional. The amount of nAVAX the validator is staking.
     * @param stakeOuts Optional. The outputs used in paying the stake.
     * @param rewardOwners Optional. The [[ParseableOutput]] containing the [[SECPOwnerOutput]] for the rewards.
     * @param delegationFee Optional. The percent fee this validator charges when others delegate stake to them.
     * Up to 4 decimal places allowed; additional decimal places are ignored. Must be between 0 and 100, inclusive.
     * For example, if delegationFeeRate is 1.2345 and someone delegates to this validator, then when the delegation
     * period is over, 1.2345% of the reward goes to the validator and the rest goes to the delegator.
     */
    function AddValidatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount, stakeOuts, rewardOwners, delegationFee) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (nodeID === void 0) { nodeID = undefined; }
        if (startTime === void 0) { startTime = undefined; }
        if (endTime === void 0) { endTime = undefined; }
        if (stakeAmount === void 0) { stakeAmount = undefined; }
        if (stakeOuts === void 0) { stakeOuts = undefined; }
        if (rewardOwners === void 0) { rewardOwners = undefined; }
        if (delegationFee === void 0) { delegationFee = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount, stakeOuts, rewardOwners) || this;
        _this._typeName = "AddValidatorTx";
        _this._typeID = constants_1.PlatformVMConstants.ADDVALIDATORTX;
        _this.delegationFee = 0;
        if (typeof delegationFee === "number") {
            if (delegationFee >= 0 && delegationFee <= 100) {
                _this.delegationFee = parseFloat(delegationFee.toFixed(4));
            }
            else {
                throw new errors_1.DelegationFeeError("AddValidatorTx.constructor -- delegationFee must be in the range of 0 and 100, inclusively.");
            }
        }
        return _this;
    }
    AddValidatorTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { delegationFee: serialization.encoder(this.getDelegationFeeBuffer(), encoding, "Buffer", "decimalString", 4) });
    };
    AddValidatorTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        var dbuff = serialization.decoder(fields["delegationFee"], encoding, "decimalString", "Buffer", 4);
        this.delegationFee =
            dbuff.readUInt32BE(0) / AddValidatorTx.delegatorMultiplier;
    };
    /**
     * Returns the id of the [[AddValidatorTx]]
     */
    AddValidatorTx.prototype.getTxType = function () {
        return this._typeID;
    };
    /**
     * Returns the delegation fee (represents a percentage from 0 to 100);
     */
    AddValidatorTx.prototype.getDelegationFee = function () {
        return this.delegationFee;
    };
    /**
     * Returns the binary representation of the delegation fee as a {@link https://github.com/feross/buffer|Buffer}.
     */
    AddValidatorTx.prototype.getDelegationFeeBuffer = function () {
        var dBuff = buffer_1.Buffer.alloc(4);
        var buffnum = parseFloat(this.delegationFee.toFixed(4)) *
            AddValidatorTx.delegatorMultiplier;
        dBuff.writeUInt32BE(buffnum, 0);
        return dBuff;
    };
    AddValidatorTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        var dbuff = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        this.delegationFee =
            dbuff.readUInt32BE(0) / AddValidatorTx.delegatorMultiplier;
        return offset;
    };
    AddValidatorTx.prototype.toBuffer = function () {
        var superBuff = _super.prototype.toBuffer.call(this);
        var feeBuff = this.getDelegationFeeBuffer();
        return buffer_1.Buffer.concat([superBuff, feeBuff]);
    };
    AddValidatorTx.delegatorMultiplier = 10000;
    return AddValidatorTx;
}(AddDelegatorTx));
exports.AddValidatorTx = AddValidatorTx;
