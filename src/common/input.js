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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardAmountInput = exports.StandardTransferableInput = exports.StandardParseableInput = exports.Input = void 0;
/**
 * @packageDocumentation
 * @module Common-Inputs
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../utils/bintools");
var bn_js_1 = require("bn.js");
var credentials_1 = require("./credentials");
var serialization_1 = require("../utils/serialization");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "Input";
        _this._typeID = undefined;
        _this.sigCount = buffer_1.Buffer.alloc(4);
        _this.sigIdxs = []; // idxs of signers from utxo
        /**
         * Returns the array of [[SigIdx]] for this [[Input]]
         */
        _this.getSigIdxs = function () { return _this.sigIdxs; };
        /**
         * Creates and adds a [[SigIdx]] to the [[Input]].
         *
         * @param addressIdx The index of the address to reference in the signatures
         * @param address The address of the source of the signature
         */
        _this.addSignatureIdx = function (addressIdx, address) {
            var sigidx = new credentials_1.SigIdx();
            var b = buffer_1.Buffer.alloc(4);
            b.writeUInt32BE(addressIdx, 0);
            sigidx.fromBuffer(b);
            sigidx.setSource(address);
            _this.sigIdxs.push(sigidx);
            _this.sigCount.writeUInt32BE(_this.sigIdxs.length, 0);
        };
        return _this;
    }
    Input.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { sigIdxs: this.sigIdxs.map(function (s) { return s.serialize(encoding); }) });
    };
    Input.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.sigIdxs = fields["sigIdxs"].map(function (s) {
            var sidx = new credentials_1.SigIdx();
            sidx.deserialize(s, encoding);
            return sidx;
        });
        this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
    };
    Input.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.sigCount = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var sigCount = this.sigCount.readUInt32BE(0);
        this.sigIdxs = [];
        for (var i = 0; i < sigCount; i++) {
            var sigidx = new credentials_1.SigIdx();
            var sigbuff = bintools.copyFrom(bytes, offset, offset + 4);
            sigidx.fromBuffer(sigbuff);
            offset += 4;
            this.sigIdxs.push(sigidx);
        }
        return offset;
    };
    Input.prototype.toBuffer = function () {
        this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
        var bsize = this.sigCount.length;
        var barr = [this.sigCount];
        for (var i = 0; i < this.sigIdxs.length; i++) {
            var b = this.sigIdxs["".concat(i)].toBuffer();
            barr.push(b);
            bsize += b.length;
        }
        return buffer_1.Buffer.concat(barr, bsize);
    };
    /**
     * Returns a base-58 representation of the [[Input]].
     */
    Input.prototype.toString = function () {
        return bintools.bufferToB58(this.toBuffer());
    };
    Input.comparator = function () {
        return function (a, b) {
            var aoutid = buffer_1.Buffer.alloc(4);
            aoutid.writeUInt32BE(a.getInputID(), 0);
            var abuff = a.toBuffer();
            var boutid = buffer_1.Buffer.alloc(4);
            boutid.writeUInt32BE(b.getInputID(), 0);
            var bbuff = b.toBuffer();
            var asort = buffer_1.Buffer.concat([aoutid, abuff], aoutid.length + abuff.length);
            var bsort = buffer_1.Buffer.concat([boutid, bbuff], boutid.length + bbuff.length);
            return buffer_1.Buffer.compare(asort, bsort);
        };
    };
    return Input;
}(serialization_1.Serializable));
exports.Input = Input;
var StandardParseableInput = /** @class */ (function (_super) {
    __extends(StandardParseableInput, _super);
    /**
     * Class representing an [[StandardParseableInput]] for a transaction.
     *
     * @param input A number representing the InputID of the [[StandardParseableInput]]
     */
    function StandardParseableInput(input) {
        if (input === void 0) { input = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "StandardParseableInput";
        _this._typeID = undefined;
        _this.getInput = function () { return _this.input; };
        if (input instanceof Input) {
            _this.input = input;
        }
        return _this;
    }
    StandardParseableInput.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { input: this.input.serialize(encoding) });
    };
    StandardParseableInput.prototype.toBuffer = function () {
        var inbuff = this.input.toBuffer();
        var inid = buffer_1.Buffer.alloc(4);
        inid.writeUInt32BE(this.input.getInputID(), 0);
        var barr = [inid, inbuff];
        return buffer_1.Buffer.concat(barr, inid.length + inbuff.length);
    };
    /**
     * Returns a function used to sort an array of [[StandardParseableInput]]s
     */
    StandardParseableInput.comparator = function () {
        return function (a, b) {
            var sorta = a.toBuffer();
            var sortb = b.toBuffer();
            return buffer_1.Buffer.compare(sorta, sortb);
        };
    };
    return StandardParseableInput;
}(serialization_1.Serializable));
exports.StandardParseableInput = StandardParseableInput;
var StandardTransferableInput = /** @class */ (function (_super) {
    __extends(StandardTransferableInput, _super);
    /**
     * Class representing an [[StandardTransferableInput]] for a transaction.
     *
     * @param txid A {@link https://github.com/feross/buffer|Buffer} containing the transaction ID of the referenced UTXO
     * @param outputidx A {@link https://github.com/feross/buffer|Buffer} containing the index of the output in the transaction consumed in the [[StandardTransferableInput]]
     * @param assetID A {@link https://github.com/feross/buffer|Buffer} representing the assetID of the [[Input]]
     * @param input An [[Input]] to be made transferable
     */
    function StandardTransferableInput(txid, outputidx, assetID, input) {
        if (txid === void 0) { txid = undefined; }
        if (outputidx === void 0) { outputidx = undefined; }
        if (assetID === void 0) { assetID = undefined; }
        if (input === void 0) { input = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "StandardTransferableInput";
        _this._typeID = undefined;
        _this.txid = buffer_1.Buffer.alloc(32);
        _this.outputidx = buffer_1.Buffer.alloc(4);
        _this.assetID = buffer_1.Buffer.alloc(32);
        /**
         * Returns a {@link https://github.com/feross/buffer|Buffer} of the TxID.
         */
        _this.getTxID = function () { return _this.txid; };
        /**
         * Returns a {@link https://github.com/feross/buffer|Buffer}  of the OutputIdx.
         */
        _this.getOutputIdx = function () { return _this.outputidx; };
        /**
         * Returns a base-58 string representation of the UTXOID this [[StandardTransferableInput]] references.
         */
        _this.getUTXOID = function () {
            return bintools.bufferToB58(buffer_1.Buffer.concat([_this.txid, _this.outputidx]));
        };
        /**
         * Returns the input.
         */
        _this.getInput = function () { return _this.input; };
        /**
         * Returns the assetID of the input.
         */
        _this.getAssetID = function () { return _this.assetID; };
        if (typeof txid !== "undefined" &&
            typeof outputidx !== "undefined" &&
            typeof assetID !== "undefined" &&
            input instanceof Input) {
            _this.input = input;
            _this.txid = txid;
            _this.outputidx = outputidx;
            _this.assetID = assetID;
        }
        return _this;
    }
    StandardTransferableInput.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { txid: serialization.encoder(this.txid, encoding, "Buffer", "cb58"), outputidx: serialization.encoder(this.outputidx, encoding, "Buffer", "decimalString"), assetID: serialization.encoder(this.assetID, encoding, "Buffer", "cb58") });
    };
    StandardTransferableInput.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.txid = serialization.decoder(fields["txid"], encoding, "cb58", "Buffer", 32);
        this.outputidx = serialization.decoder(fields["outputidx"], encoding, "decimalString", "Buffer", 4);
        this.assetID = serialization.decoder(fields["assetID"], encoding, "cb58", "Buffer", 32);
        //input deserialization must be implmented in child classes
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardTransferableInput]].
     */
    StandardTransferableInput.prototype.toBuffer = function () {
        var parseableBuff = _super.prototype.toBuffer.call(this);
        var bsize = this.txid.length +
            this.outputidx.length +
            this.assetID.length +
            parseableBuff.length;
        var barr = [
            this.txid,
            this.outputidx,
            this.assetID,
            parseableBuff
        ];
        var buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    };
    /**
     * Returns a base-58 representation of the [[StandardTransferableInput]].
     */
    StandardTransferableInput.prototype.toString = function () {
        /* istanbul ignore next */
        return bintools.bufferToB58(this.toBuffer());
    };
    return StandardTransferableInput;
}(StandardParseableInput));
exports.StandardTransferableInput = StandardTransferableInput;
/**
 * An [[Input]] class which specifies a token amount .
 */
var StandardAmountInput = /** @class */ (function (_super) {
    __extends(StandardAmountInput, _super);
    /**
     * An [[AmountInput]] class which issues a payment on an assetID.
     *
     * @param amount A {@link https://github.com/indutny/bn.js/|BN} representing the amount in the input
     */
    function StandardAmountInput(amount) {
        if (amount === void 0) { amount = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "StandardAmountInput";
        _this._typeID = undefined;
        _this.amount = buffer_1.Buffer.alloc(8);
        _this.amountValue = new bn_js_1(0);
        /**
         * Returns the amount as a {@link https://github.com/indutny/bn.js/|BN}.
         */
        _this.getAmount = function () { return _this.amountValue.clone(); };
        if (amount) {
            _this.amountValue = amount.clone();
            _this.amount = bintools.fromBNToBuffer(amount, 8);
        }
        return _this;
    }
    StandardAmountInput.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { amount: serialization.encoder(this.amount, encoding, "Buffer", "decimalString", 8) });
    };
    StandardAmountInput.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.amount = serialization.decoder(fields["amount"], encoding, "decimalString", "Buffer", 8);
        this.amountValue = bintools.fromBufferToBN(this.amount);
    };
    /**
     * Popuates the instance from a {@link https://github.com/feross/buffer|Buffer} representing the [[AmountInput]] and returns the size of the input.
     */
    StandardAmountInput.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.amount = bintools.copyFrom(bytes, offset, offset + 8);
        this.amountValue = bintools.fromBufferToBN(this.amount);
        offset += 8;
        return _super.prototype.fromBuffer.call(this, bytes, offset);
    };
    /**
     * Returns the buffer representing the [[AmountInput]] instance.
     */
    StandardAmountInput.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var bsize = this.amount.length + superbuff.length;
        var barr = [this.amount, superbuff];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    return StandardAmountInput;
}(Input));
exports.StandardAmountInput = StandardAmountInput;
