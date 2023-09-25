"use strict";
/**
 * @packageDocumentation
 * @module Common-AssetAmount
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardAssetAmountDestination = exports.AssetAmount = void 0;
var buffer_1 = require("buffer/");
var bn_js_1 = require("bn.js");
var errors_1 = require("../utils/errors");
/**
 * Class for managing asset amounts in the UTXOSet fee calcuation
 */
var AssetAmount = /** @class */ (function () {
    function AssetAmount(assetID, amount, burn) {
        var _this = this;
        // assetID that is amount is managing.
        this.assetID = buffer_1.Buffer.alloc(32);
        // amount of this asset that should be sent.
        this.amount = new bn_js_1.default(0);
        // burn is the amount of this asset that should be burned.
        this.burn = new bn_js_1.default(0);
        // spent is the total amount of this asset that has been consumed.
        this.spent = new bn_js_1.default(0);
        // stakeableLockSpent is the amount of this asset that has been consumed that
        // was locked.
        this.stakeableLockSpent = new bn_js_1.default(0);
        // change is the excess amount of this asset that was consumed over the amount
        // requested to be consumed(amount + burn).
        this.change = new bn_js_1.default(0);
        // stakeableLockChange is a flag to mark if the input that generated the
        // change was locked.
        this.stakeableLockChange = false;
        // finished is a convenience flag to track "spent >= amount + burn"
        this.finished = false;
        this.getAssetID = function () {
            return _this.assetID;
        };
        this.getAssetIDString = function () {
            return _this.assetID.toString("hex");
        };
        this.getAmount = function () {
            return _this.amount;
        };
        this.getSpent = function () {
            return _this.spent;
        };
        this.getBurn = function () {
            return _this.burn;
        };
        this.getChange = function () {
            return _this.change;
        };
        this.getStakeableLockSpent = function () {
            return _this.stakeableLockSpent;
        };
        this.getStakeableLockChange = function () {
            return _this.stakeableLockChange;
        };
        this.isFinished = function () {
            return _this.finished;
        };
        // spendAmount should only be called if this asset is still awaiting more
        // funds to consume.
        this.spendAmount = function (amt, stakeableLocked) {
            if (stakeableLocked === void 0) { stakeableLocked = false; }
            if (_this.finished) {
                /* istanbul ignore next */
                throw new errors_1.InsufficientFundsError("Error - AssetAmount.spendAmount: attempted to spend " + "excess funds");
            }
            _this.spent = _this.spent.add(amt);
            if (stakeableLocked) {
                _this.stakeableLockSpent = _this.stakeableLockSpent.add(amt);
            }
            var total = _this.amount.add(_this.burn);
            if (_this.spent.gte(total)) {
                _this.change = _this.spent.sub(total);
                if (stakeableLocked) {
                    _this.stakeableLockChange = true;
                }
                _this.finished = true;
            }
            return _this.finished;
        };
        this.assetID = assetID;
        this.amount = typeof amount === "undefined" ? new bn_js_1.default(0) : amount;
        this.burn = typeof burn === "undefined" ? new bn_js_1.default(0) : burn;
        this.spent = new bn_js_1.default(0);
        this.stakeableLockSpent = new bn_js_1.default(0);
        this.stakeableLockChange = false;
    }
    return AssetAmount;
}());
exports.AssetAmount = AssetAmount;
var StandardAssetAmountDestination = /** @class */ (function () {
    function StandardAssetAmountDestination(destinations, senders, changeAddresses) {
        var _this = this;
        this.amounts = [];
        this.destinations = [];
        this.senders = [];
        this.changeAddresses = [];
        this.amountkey = {};
        this.inputs = [];
        this.outputs = [];
        this.change = [];
        // TODO: should this function allow for repeated calls with the same
        //       assetID?
        this.addAssetAmount = function (assetID, amount, burn) {
            var aa = new AssetAmount(assetID, amount, burn);
            _this.amounts.push(aa);
            _this.amountkey[aa.getAssetIDString()] = aa;
        };
        this.addInput = function (input) {
            _this.inputs.push(input);
        };
        this.addOutput = function (output) {
            _this.outputs.push(output);
        };
        this.addChange = function (output) {
            _this.change.push(output);
        };
        this.getAmounts = function () {
            return _this.amounts;
        };
        this.getDestinations = function () {
            return _this.destinations;
        };
        this.getSenders = function () {
            return _this.senders;
        };
        this.getChangeAddresses = function () {
            return _this.changeAddresses;
        };
        this.getAssetAmount = function (assetHexStr) {
            return _this.amountkey["".concat(assetHexStr)];
        };
        this.assetExists = function (assetHexStr) {
            return assetHexStr in _this.amountkey;
        };
        this.getInputs = function () {
            return _this.inputs;
        };
        this.getOutputs = function () {
            return _this.outputs;
        };
        this.getChangeOutputs = function () {
            return _this.change;
        };
        this.getAllOutputs = function () {
            return _this.outputs.concat(_this.change);
        };
        this.canComplete = function () {
            for (var i = 0; i < _this.amounts.length; i++) {
                if (!_this.amounts["".concat(i)].isFinished()) {
                    return false;
                }
            }
            return true;
        };
        this.destinations = destinations;
        this.changeAddresses = changeAddresses;
        this.senders = senders;
    }
    return StandardAssetAmountDestination;
}());
exports.StandardAssetAmountDestination = StandardAssetAmountDestination;
