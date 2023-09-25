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
exports.StakeableLockIn = exports.SECPTransferInput = exports.AmountInput = exports.TransferableInput = exports.ParseableInput = exports.SelectInputClass = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-Inputs
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var input_1 = require("../../common/input");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Takes a buffer representing the output and returns the proper [[Input]] instance.
 *
 * @param inputid A number representing the inputID parsed prior to the bytes passed in
 *
 * @returns An instance of an [[Input]]-extended class.
 */
var SelectInputClass = function (inputid) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (inputid === constants_1.PlatformVMConstants.SECPINPUTID) {
        return new (SECPTransferInput.bind.apply(SECPTransferInput, __spreadArray([void 0], args, false)))();
    }
    else if (inputid === constants_1.PlatformVMConstants.STAKEABLELOCKINID) {
        return new (StakeableLockIn.bind.apply(StakeableLockIn, __spreadArray([void 0], args, false)))();
    }
    /* istanbul ignore next */
    throw new errors_1.InputIdError("Error - SelectInputClass: unknown inputid");
};
exports.SelectInputClass = SelectInputClass;
var ParseableInput = /** @class */ (function (_super) {
    __extends(ParseableInput, _super);
    function ParseableInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "ParseableInput";
        _this._typeID = undefined;
        return _this;
    }
    //serialize is inherited
    ParseableInput.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.input = (0, exports.SelectInputClass)(fields["input"]["_typeID"]);
        this.input.deserialize(fields["input"], encoding);
    };
    ParseableInput.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        var inputid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.input = (0, exports.SelectInputClass)(inputid);
        return this.input.fromBuffer(bytes, offset);
    };
    return ParseableInput;
}(input_1.StandardParseableInput));
exports.ParseableInput = ParseableInput;
var TransferableInput = /** @class */ (function (_super) {
    __extends(TransferableInput, _super);
    function TransferableInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "TransferableInput";
        _this._typeID = undefined;
        return _this;
    }
    //serialize is inherited
    TransferableInput.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.input = (0, exports.SelectInputClass)(fields["input"]["_typeID"]);
        this.input.deserialize(fields["input"], encoding);
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing a [[TransferableInput]], parses it, populates the class, and returns the length of the [[TransferableInput]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[TransferableInput]]
     *
     * @returns The length of the raw [[TransferableInput]]
     */
    TransferableInput.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.txid = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.outputidx = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        this.assetID = bintools.copyFrom(bytes, offset, offset + constants_1.PlatformVMConstants.ASSETIDLEN);
        offset += 32;
        var inputid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.input = (0, exports.SelectInputClass)(inputid);
        return this.input.fromBuffer(bytes, offset);
    };
    return TransferableInput;
}(input_1.StandardTransferableInput));
exports.TransferableInput = TransferableInput;
var AmountInput = /** @class */ (function (_super) {
    __extends(AmountInput, _super);
    function AmountInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "AmountInput";
        _this._typeID = undefined;
        return _this;
    }
    //serialize and deserialize both are inherited
    AmountInput.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return exports.SelectInputClass.apply(void 0, __spreadArray([id], args, false));
    };
    return AmountInput;
}(input_1.StandardAmountInput));
exports.AmountInput = AmountInput;
var SECPTransferInput = /** @class */ (function (_super) {
    __extends(SECPTransferInput, _super);
    function SECPTransferInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "SECPTransferInput";
        _this._typeID = constants_1.PlatformVMConstants.SECPINPUTID;
        _this.getCredentialID = function () { return constants_1.PlatformVMConstants.SECPCREDENTIAL; };
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Returns the inputID for this input
     */
    SECPTransferInput.prototype.getInputID = function () {
        return this._typeID;
    };
    SECPTransferInput.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (SECPTransferInput.bind.apply(SECPTransferInput, __spreadArray([void 0], args, false)))();
    };
    SECPTransferInput.prototype.clone = function () {
        var newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    };
    return SECPTransferInput;
}(AmountInput));
exports.SECPTransferInput = SECPTransferInput;
/**
 * An [[Input]] class which specifies an input that has a locktime which can also enable staking of the value held, preventing transfers but not validation.
 */
var StakeableLockIn = /** @class */ (function (_super) {
    __extends(StakeableLockIn, _super);
    /**
     * A [[Output]] class which specifies an [[Input]] that has a locktime which can also enable staking of the value held, preventing transfers but not validation.
     *
     * @param amount A {@link https://github.com/indutny/bn.js/|BN} representing the amount in the input
     * @param stakeableLocktime A {@link https://github.com/indutny/bn.js/|BN} representing the stakeable locktime
     * @param transferableInput A [[ParseableInput]] which is embedded into this input.
     */
    function StakeableLockIn(amount, stakeableLocktime, transferableInput) {
        if (amount === void 0) { amount = undefined; }
        if (stakeableLocktime === void 0) { stakeableLocktime = undefined; }
        if (transferableInput === void 0) { transferableInput = undefined; }
        var _this = _super.call(this, amount) || this;
        _this._typeName = "StakeableLockIn";
        _this._typeID = constants_1.PlatformVMConstants.STAKEABLELOCKINID;
        _this.getCredentialID = function () { return constants_1.PlatformVMConstants.SECPCREDENTIAL; };
        if (typeof stakeableLocktime !== "undefined") {
            _this.stakeableLocktime = bintools.fromBNToBuffer(stakeableLocktime, 8);
        }
        if (typeof transferableInput !== "undefined") {
            _this.transferableInput = transferableInput;
            _this.synchronize();
        }
        return _this;
    }
    //serialize and deserialize both are inherited
    StakeableLockIn.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        var outobj = __assign(__assign({}, fields), { stakeableLocktime: serialization.encoder(this.stakeableLocktime, encoding, "Buffer", "decimalString", 8), transferableInput: this.transferableInput.serialize(encoding) });
        delete outobj["sigIdxs"];
        delete outobj["sigCount"];
        delete outobj["amount"];
        return outobj;
    };
    StakeableLockIn.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        fields["sigIdxs"] = [];
        fields["sigCount"] = "0";
        fields["amount"] = "98";
        _super.prototype.deserialize.call(this, fields, encoding);
        this.stakeableLocktime = serialization.decoder(fields["stakeableLocktime"], encoding, "decimalString", "Buffer", 8);
        this.transferableInput = new ParseableInput();
        this.transferableInput.deserialize(fields["transferableInput"], encoding);
        this.synchronize();
    };
    StakeableLockIn.prototype.synchronize = function () {
        var input = this.transferableInput.getInput();
        this.sigIdxs = input.getSigIdxs();
        this.sigCount = buffer_1.Buffer.alloc(4);
        this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
        this.amount = bintools.fromBNToBuffer(input.getAmount(), 8);
        this.amountValue = input.getAmount();
    };
    StakeableLockIn.prototype.getStakeableLocktime = function () {
        return bintools.fromBufferToBN(this.stakeableLocktime);
    };
    StakeableLockIn.prototype.getTransferablInput = function () {
        return this.transferableInput;
    };
    /**
     * Returns the inputID for this input
     */
    StakeableLockIn.prototype.getInputID = function () {
        return this._typeID;
    };
    /**
     * Popuates the instance from a {@link https://github.com/feross/buffer|Buffer} representing the [[StakeableLockIn]] and returns the size of the output.
     */
    StakeableLockIn.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.stakeableLocktime = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        this.transferableInput = new ParseableInput();
        offset = this.transferableInput.fromBuffer(bytes, offset);
        this.synchronize();
        return offset;
    };
    /**
     * Returns the buffer representing the [[StakeableLockIn]] instance.
     */
    StakeableLockIn.prototype.toBuffer = function () {
        var xferinBuff = this.transferableInput.toBuffer();
        var bsize = this.stakeableLocktime.length + xferinBuff.length;
        var barr = [this.stakeableLocktime, xferinBuff];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    StakeableLockIn.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (StakeableLockIn.bind.apply(StakeableLockIn, __spreadArray([void 0], args, false)))();
    };
    StakeableLockIn.prototype.clone = function () {
        var newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    };
    StakeableLockIn.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return exports.SelectInputClass.apply(void 0, __spreadArray([id], args, false));
    };
    return StakeableLockIn;
}(AmountInput));
exports.StakeableLockIn = StakeableLockIn;
