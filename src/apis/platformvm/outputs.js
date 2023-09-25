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
exports.SECPOwnerOutput = exports.StakeableLockOut = exports.SECPTransferOutput = exports.AmountOutput = exports.ParseableOutput = exports.TransferableOutput = exports.SelectOutputClass = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-Outputs
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var output_1 = require("../../common/output");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Takes a buffer representing the output and returns the proper Output instance.
 *
 * @param outputid A number representing the inputID parsed prior to the bytes passed in
 *
 * @returns An instance of an [[Output]]-extended class.
 */
var SelectOutputClass = function (outputid) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (outputid == constants_1.PlatformVMConstants.SECPXFEROUTPUTID) {
        return new (SECPTransferOutput.bind.apply(SECPTransferOutput, __spreadArray([void 0], args, false)))();
    }
    else if (outputid == constants_1.PlatformVMConstants.SECPOWNEROUTPUTID) {
        return new (SECPOwnerOutput.bind.apply(SECPOwnerOutput, __spreadArray([void 0], args, false)))();
    }
    else if (outputid == constants_1.PlatformVMConstants.STAKEABLELOCKOUTID) {
        return new (StakeableLockOut.bind.apply(StakeableLockOut, __spreadArray([void 0], args, false)))();
    }
    throw new errors_1.OutputIdError("Error - SelectOutputClass: unknown outputid " + outputid);
};
exports.SelectOutputClass = SelectOutputClass;
var TransferableOutput = /** @class */ (function (_super) {
    __extends(TransferableOutput, _super);
    function TransferableOutput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "TransferableOutput";
        _this._typeID = undefined;
        return _this;
    }
    //serialize is inherited
    TransferableOutput.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.output = (0, exports.SelectOutputClass)(fields["output"]["_typeID"]);
        this.output.deserialize(fields["output"], encoding);
    };
    TransferableOutput.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.assetID = bintools.copyFrom(bytes, offset, offset + constants_1.PlatformVMConstants.ASSETIDLEN);
        offset += constants_1.PlatformVMConstants.ASSETIDLEN;
        var outputid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.output = (0, exports.SelectOutputClass)(outputid);
        return this.output.fromBuffer(bytes, offset);
    };
    return TransferableOutput;
}(output_1.StandardTransferableOutput));
exports.TransferableOutput = TransferableOutput;
var ParseableOutput = /** @class */ (function (_super) {
    __extends(ParseableOutput, _super);
    function ParseableOutput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "ParseableOutput";
        _this._typeID = undefined;
        return _this;
    }
    //serialize is inherited
    ParseableOutput.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.output = (0, exports.SelectOutputClass)(fields["output"]["_typeID"]);
        this.output.deserialize(fields["output"], encoding);
    };
    ParseableOutput.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        var outputid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.output = (0, exports.SelectOutputClass)(outputid);
        return this.output.fromBuffer(bytes, offset);
    };
    return ParseableOutput;
}(output_1.StandardParseableOutput));
exports.ParseableOutput = ParseableOutput;
var AmountOutput = /** @class */ (function (_super) {
    __extends(AmountOutput, _super);
    function AmountOutput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "AmountOutput";
        _this._typeID = undefined;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * @param assetID An assetID which is wrapped around the Buffer of the Output
     */
    AmountOutput.prototype.makeTransferable = function (assetID) {
        return new TransferableOutput(assetID, this);
    };
    AmountOutput.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return exports.SelectOutputClass.apply(void 0, __spreadArray([id], args, false));
    };
    return AmountOutput;
}(output_1.StandardAmountOutput));
exports.AmountOutput = AmountOutput;
/**
 * An [[Output]] class which specifies an Output that carries an ammount for an assetID and uses secp256k1 signature scheme.
 */
var SECPTransferOutput = /** @class */ (function (_super) {
    __extends(SECPTransferOutput, _super);
    function SECPTransferOutput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "SECPTransferOutput";
        _this._typeID = constants_1.PlatformVMConstants.SECPXFEROUTPUTID;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Returns the outputID for this output
     */
    SECPTransferOutput.prototype.getOutputID = function () {
        return this._typeID;
    };
    SECPTransferOutput.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (SECPTransferOutput.bind.apply(SECPTransferOutput, __spreadArray([void 0], args, false)))();
    };
    SECPTransferOutput.prototype.clone = function () {
        var newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    };
    return SECPTransferOutput;
}(AmountOutput));
exports.SECPTransferOutput = SECPTransferOutput;
/**
 * An [[Output]] class which specifies an input that has a locktime which can also enable staking of the value held, preventing transfers but not validation.
 */
var StakeableLockOut = /** @class */ (function (_super) {
    __extends(StakeableLockOut, _super);
    /**
     * A [[Output]] class which specifies a [[ParseableOutput]] that has a locktime which can also enable staking of the value held, preventing transfers but not validation.
     *
     * @param amount A {@link https://github.com/indutny/bn.js/|BN} representing the amount in the output
     * @param addresses An array of {@link https://github.com/feross/buffer|Buffer}s representing addresses
     * @param locktime A {@link https://github.com/indutny/bn.js/|BN} representing the locktime
     * @param threshold A number representing the the threshold number of signers required to sign the transaction
     * @param stakeableLocktime A {@link https://github.com/indutny/bn.js/|BN} representing the stakeable locktime
     * @param transferableOutput A [[ParseableOutput]] which is embedded into this output.
     */
    function StakeableLockOut(amount, addresses, locktime, threshold, stakeableLocktime, transferableOutput) {
        if (amount === void 0) { amount = undefined; }
        if (addresses === void 0) { addresses = undefined; }
        if (locktime === void 0) { locktime = undefined; }
        if (threshold === void 0) { threshold = undefined; }
        if (stakeableLocktime === void 0) { stakeableLocktime = undefined; }
        if (transferableOutput === void 0) { transferableOutput = undefined; }
        var _this = _super.call(this, amount, addresses, locktime, threshold) || this;
        _this._typeName = "StakeableLockOut";
        _this._typeID = constants_1.PlatformVMConstants.STAKEABLELOCKOUTID;
        if (typeof stakeableLocktime !== "undefined") {
            _this.stakeableLocktime = bintools.fromBNToBuffer(stakeableLocktime, 8);
        }
        if (typeof transferableOutput !== "undefined") {
            _this.transferableOutput = transferableOutput;
            _this.synchronize();
        }
        return _this;
    }
    //serialize and deserialize both are inherited
    StakeableLockOut.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        var outobj = __assign(__assign({}, fields), { stakeableLocktime: serialization.encoder(this.stakeableLocktime, encoding, "Buffer", "decimalString", 8), transferableOutput: this.transferableOutput.serialize(encoding) });
        delete outobj["addresses"];
        delete outobj["locktime"];
        delete outobj["threshold"];
        delete outobj["amount"];
        return outobj;
    };
    StakeableLockOut.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        fields["addresses"] = [];
        fields["locktime"] = "0";
        fields["threshold"] = "1";
        fields["amount"] = "99";
        _super.prototype.deserialize.call(this, fields, encoding);
        this.stakeableLocktime = serialization.decoder(fields["stakeableLocktime"], encoding, "decimalString", "Buffer", 8);
        this.transferableOutput = new ParseableOutput();
        this.transferableOutput.deserialize(fields["transferableOutput"], encoding);
        this.synchronize();
    };
    //call this every time you load in data
    StakeableLockOut.prototype.synchronize = function () {
        var output = this.transferableOutput.getOutput();
        this.addresses = output.getAddresses().map(function (a) {
            var addr = new output_1.Address();
            addr.fromBuffer(a);
            return addr;
        });
        this.numaddrs = buffer_1.Buffer.alloc(4);
        this.numaddrs.writeUInt32BE(this.addresses.length, 0);
        this.locktime = bintools.fromBNToBuffer(output.getLocktime(), 8);
        this.threshold = buffer_1.Buffer.alloc(4);
        this.threshold.writeUInt32BE(output.getThreshold(), 0);
        this.amount = bintools.fromBNToBuffer(output.getAmount(), 8);
        this.amountValue = output.getAmount();
    };
    StakeableLockOut.prototype.getStakeableLocktime = function () {
        return bintools.fromBufferToBN(this.stakeableLocktime);
    };
    StakeableLockOut.prototype.getTransferableOutput = function () {
        return this.transferableOutput;
    };
    /**
     * @param assetID An assetID which is wrapped around the Buffer of the Output
     */
    StakeableLockOut.prototype.makeTransferable = function (assetID) {
        return new TransferableOutput(assetID, this);
    };
    StakeableLockOut.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return exports.SelectOutputClass.apply(void 0, __spreadArray([id], args, false));
    };
    /**
     * Popuates the instance from a {@link https://github.com/feross/buffer|Buffer} representing the [[StakeableLockOut]] and returns the size of the output.
     */
    StakeableLockOut.prototype.fromBuffer = function (outbuff, offset) {
        if (offset === void 0) { offset = 0; }
        this.stakeableLocktime = bintools.copyFrom(outbuff, offset, offset + 8);
        offset += 8;
        this.transferableOutput = new ParseableOutput();
        offset = this.transferableOutput.fromBuffer(outbuff, offset);
        this.synchronize();
        return offset;
    };
    /**
     * Returns the buffer representing the [[StakeableLockOut]] instance.
     */
    StakeableLockOut.prototype.toBuffer = function () {
        var xferoutBuff = this.transferableOutput.toBuffer();
        var bsize = this.stakeableLocktime.length + xferoutBuff.length;
        var barr = [this.stakeableLocktime, xferoutBuff];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    /**
     * Returns the outputID for this output
     */
    StakeableLockOut.prototype.getOutputID = function () {
        return this._typeID;
    };
    StakeableLockOut.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (StakeableLockOut.bind.apply(StakeableLockOut, __spreadArray([void 0], args, false)))();
    };
    StakeableLockOut.prototype.clone = function () {
        var newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    };
    return StakeableLockOut;
}(AmountOutput));
exports.StakeableLockOut = StakeableLockOut;
/**
 * An [[Output]] class which only specifies an Output ownership and uses secp256k1 signature scheme.
 */
var SECPOwnerOutput = /** @class */ (function (_super) {
    __extends(SECPOwnerOutput, _super);
    function SECPOwnerOutput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "SECPOwnerOutput";
        _this._typeID = constants_1.PlatformVMConstants.SECPOWNEROUTPUTID;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Returns the outputID for this output
     */
    SECPOwnerOutput.prototype.getOutputID = function () {
        return this._typeID;
    };
    /**
     *
     * @param assetID An assetID which is wrapped around the Buffer of the Output
     */
    SECPOwnerOutput.prototype.makeTransferable = function (assetID) {
        return new TransferableOutput(assetID, this);
    };
    SECPOwnerOutput.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (SECPOwnerOutput.bind.apply(SECPOwnerOutput, __spreadArray([void 0], args, false)))();
    };
    SECPOwnerOutput.prototype.clone = function () {
        var newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    };
    SECPOwnerOutput.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return exports.SelectOutputClass.apply(void 0, __spreadArray([id], args, false));
    };
    return SECPOwnerOutput;
}(output_1.Output));
exports.SECPOwnerOutput = SECPOwnerOutput;
