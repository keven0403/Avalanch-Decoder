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
exports.SECPTransferInput = exports.AmountInput = exports.TransferableInput = exports.SelectInputClass = void 0;
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var input_1 = require("../../common/input");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
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
    if (inputid === constants_1.AVMConstants.SECPINPUTID ||
        inputid === constants_1.AVMConstants.SECPINPUTID_CODECONE) {
        return new (SECPTransferInput.bind.apply(SECPTransferInput, __spreadArray([void 0], args, false)))();
    }
    /* istanbul ignore next */
    throw new errors_1.InputIdError("Error - SelectInputClass: unknown inputid");
};
exports.SelectInputClass = SelectInputClass;
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
        this.assetID = bintools.copyFrom(bytes, offset, offset + constants_1.AVMConstants.ASSETIDLEN);
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
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.SECPINPUTID
            : constants_1.AVMConstants.SECPINPUTID_CODECONE;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    SECPTransferInput.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - SECPTransferInput.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.SECPINPUTID
                : constants_1.AVMConstants.SECPINPUTID_CODECONE;
    };
    /**
     * Returns the inputID for this input
     */
    SECPTransferInput.prototype.getInputID = function () {
        return this._typeID;
    };
    SECPTransferInput.prototype.getCredentialID = function () {
        if (this._codecID === 0) {
            return constants_1.AVMConstants.SECPCREDENTIAL;
        }
        else if (this._codecID === 1) {
            return constants_1.AVMConstants.SECPCREDENTIAL_CODECONE;
        }
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
