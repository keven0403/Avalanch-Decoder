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
exports.NFTTransferOutput = exports.NFTMintOutput = exports.SECPMintOutput = exports.SECPTransferOutput = exports.NFTOutput = exports.AmountOutput = exports.TransferableOutput = exports.SelectOutputClass = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-Outputs
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
    if (outputid === constants_1.AVMConstants.SECPXFEROUTPUTID ||
        outputid === constants_1.AVMConstants.SECPXFEROUTPUTID_CODECONE) {
        return new (SECPTransferOutput.bind.apply(SECPTransferOutput, __spreadArray([void 0], args, false)))();
    }
    else if (outputid === constants_1.AVMConstants.SECPMINTOUTPUTID ||
        outputid === constants_1.AVMConstants.SECPMINTOUTPUTID_CODECONE) {
        return new (SECPMintOutput.bind.apply(SECPMintOutput, __spreadArray([void 0], args, false)))();
    }
    else if (outputid === constants_1.AVMConstants.NFTMINTOUTPUTID ||
        outputid === constants_1.AVMConstants.NFTMINTOUTPUTID_CODECONE) {
        return new (NFTMintOutput.bind.apply(NFTMintOutput, __spreadArray([void 0], args, false)))();
    }
    else if (outputid === constants_1.AVMConstants.NFTXFEROUTPUTID ||
        outputid === constants_1.AVMConstants.NFTXFEROUTPUTID_CODECONE) {
        return new (NFTTransferOutput.bind.apply(NFTTransferOutput, __spreadArray([void 0], args, false)))();
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
        this.assetID = bintools.copyFrom(bytes, offset, offset + constants_1.AVMConstants.ASSETIDLEN);
        offset += constants_1.AVMConstants.ASSETIDLEN;
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
     *
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
var NFTOutput = /** @class */ (function (_super) {
    __extends(NFTOutput, _super);
    function NFTOutput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "NFTOutput";
        _this._typeID = undefined;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     *
     * @param assetID An assetID which is wrapped around the Buffer of the Output
     */
    NFTOutput.prototype.makeTransferable = function (assetID) {
        return new TransferableOutput(assetID, this);
    };
    NFTOutput.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return exports.SelectOutputClass.apply(void 0, __spreadArray([id], args, false));
    };
    return NFTOutput;
}(output_1.BaseNFTOutput));
exports.NFTOutput = NFTOutput;
/**
 * An [[Output]] class which specifies an Output that carries an ammount for an assetID and uses secp256k1 signature scheme.
 */
var SECPTransferOutput = /** @class */ (function (_super) {
    __extends(SECPTransferOutput, _super);
    function SECPTransferOutput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "SECPTransferOutput";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.SECPXFEROUTPUTID
            : constants_1.AVMConstants.SECPXFEROUTPUTID_CODECONE;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    SECPTransferOutput.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - SECPTransferOutput.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.SECPXFEROUTPUTID
                : constants_1.AVMConstants.SECPXFEROUTPUTID_CODECONE;
    };
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
 * An [[Output]] class which specifies an Output that carries an ammount for an assetID and uses secp256k1 signature scheme.
 */
var SECPMintOutput = /** @class */ (function (_super) {
    __extends(SECPMintOutput, _super);
    function SECPMintOutput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "SECPMintOutput";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.SECPMINTOUTPUTID
            : constants_1.AVMConstants.SECPMINTOUTPUTID_CODECONE;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    SECPMintOutput.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - SECPMintOutput.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.SECPMINTOUTPUTID
                : constants_1.AVMConstants.SECPMINTOUTPUTID_CODECONE;
    };
    /**
     * Returns the outputID for this output
     */
    SECPMintOutput.prototype.getOutputID = function () {
        return this._typeID;
    };
    /**
     *
     * @param assetID An assetID which is wrapped around the Buffer of the Output
     */
    SECPMintOutput.prototype.makeTransferable = function (assetID) {
        return new TransferableOutput(assetID, this);
    };
    SECPMintOutput.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (SECPMintOutput.bind.apply(SECPMintOutput, __spreadArray([void 0], args, false)))();
    };
    SECPMintOutput.prototype.clone = function () {
        var newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    };
    SECPMintOutput.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return exports.SelectOutputClass.apply(void 0, __spreadArray([id], args, false));
    };
    return SECPMintOutput;
}(output_1.Output));
exports.SECPMintOutput = SECPMintOutput;
/**
 * An [[Output]] class which specifies an Output that carries an NFT Mint and uses secp256k1 signature scheme.
 */
var NFTMintOutput = /** @class */ (function (_super) {
    __extends(NFTMintOutput, _super);
    /**
     * An [[Output]] class which contains an NFT mint for an assetID.
     *
     * @param groupID A number specifies the group this NFT is issued to
     * @param addresses An array of {@link https://github.com/feross/buffer|Buffer}s representing  addresses
     * @param locktime A {@link https://github.com/indutny/bn.js/|BN} representing the locktime
     * @param threshold A number representing the the threshold number of signers required to sign the transaction
  
     */
    function NFTMintOutput(groupID, addresses, locktime, threshold) {
        if (groupID === void 0) { groupID = undefined; }
        if (addresses === void 0) { addresses = undefined; }
        if (locktime === void 0) { locktime = undefined; }
        if (threshold === void 0) { threshold = undefined; }
        var _this = _super.call(this, addresses, locktime, threshold) || this;
        _this._typeName = "NFTMintOutput";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.NFTMINTOUTPUTID
            : constants_1.AVMConstants.NFTMINTOUTPUTID_CODECONE;
        if (typeof groupID !== "undefined") {
            _this.groupID.writeUInt32BE(groupID, 0);
        }
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    NFTMintOutput.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - NFTMintOutput.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.NFTMINTOUTPUTID
                : constants_1.AVMConstants.NFTMINTOUTPUTID_CODECONE;
    };
    /**
     * Returns the outputID for this output
     */
    NFTMintOutput.prototype.getOutputID = function () {
        return this._typeID;
    };
    /**
     * Popuates the instance from a {@link https://github.com/feross/buffer|Buffer} representing the [[NFTMintOutput]] and returns the size of the output.
     */
    NFTMintOutput.prototype.fromBuffer = function (utxobuff, offset) {
        if (offset === void 0) { offset = 0; }
        this.groupID = bintools.copyFrom(utxobuff, offset, offset + 4);
        offset += 4;
        return _super.prototype.fromBuffer.call(this, utxobuff, offset);
    };
    /**
     * Returns the buffer representing the [[NFTMintOutput]] instance.
     */
    NFTMintOutput.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var bsize = this.groupID.length + superbuff.length;
        var barr = [this.groupID, superbuff];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    NFTMintOutput.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (NFTMintOutput.bind.apply(NFTMintOutput, __spreadArray([void 0], args, false)))();
    };
    NFTMintOutput.prototype.clone = function () {
        var newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    };
    return NFTMintOutput;
}(NFTOutput));
exports.NFTMintOutput = NFTMintOutput;
/**
 * An [[Output]] class which specifies an Output that carries an NFT and uses secp256k1 signature scheme.
 */
var NFTTransferOutput = /** @class */ (function (_super) {
    __extends(NFTTransferOutput, _super);
    /**
       * An [[Output]] class which contains an NFT on an assetID.
       *
       * @param groupID A number representing the amount in the output
       * @param payload A {@link https://github.com/feross/buffer|Buffer} of max length 1024
       * @param addresses An array of {@link https://github.com/feross/buffer|Buffer}s representing addresses
       * @param locktime A {@link https://github.com/indutny/bn.js/|BN} representing the locktime
       * @param threshold A number representing the the threshold number of signers required to sign the transaction
  
       */
    function NFTTransferOutput(groupID, payload, addresses, locktime, threshold) {
        if (groupID === void 0) { groupID = undefined; }
        if (payload === void 0) { payload = undefined; }
        if (addresses === void 0) { addresses = undefined; }
        if (locktime === void 0) { locktime = undefined; }
        if (threshold === void 0) { threshold = undefined; }
        var _this = _super.call(this, addresses, locktime, threshold) || this;
        _this._typeName = "NFTTransferOutput";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.NFTXFEROUTPUTID
            : constants_1.AVMConstants.NFTXFEROUTPUTID_CODECONE;
        _this.sizePayload = buffer_1.Buffer.alloc(4);
        /**
         * Returns the payload as a {@link https://github.com/feross/buffer|Buffer} with content only.
         */
        _this.getPayload = function () { return bintools.copyFrom(_this.payload); };
        /**
         * Returns the payload as a {@link https://github.com/feross/buffer|Buffer} with length of payload prepended.
         */
        _this.getPayloadBuffer = function () {
            return buffer_1.Buffer.concat([
                bintools.copyFrom(_this.sizePayload),
                bintools.copyFrom(_this.payload)
            ]);
        };
        if (typeof groupID !== "undefined" && typeof payload !== "undefined") {
            _this.groupID.writeUInt32BE(groupID, 0);
            _this.sizePayload.writeUInt32BE(payload.length, 0);
            _this.payload = bintools.copyFrom(payload, 0, payload.length);
        }
        return _this;
    }
    NFTTransferOutput.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { payload: serialization.encoder(this.payload, encoding, "Buffer", "hex", this.payload.length) });
    };
    NFTTransferOutput.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.payload = serialization.decoder(fields["payload"], encoding, "hex", "Buffer");
        this.sizePayload = buffer_1.Buffer.alloc(4);
        this.sizePayload.writeUInt32BE(this.payload.length, 0);
    };
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    NFTTransferOutput.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - NFTTransferOutput.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.NFTXFEROUTPUTID
                : constants_1.AVMConstants.NFTXFEROUTPUTID_CODECONE;
    };
    /**
     * Returns the outputID for this output
     */
    NFTTransferOutput.prototype.getOutputID = function () {
        return this._typeID;
    };
    /**
     * Popuates the instance from a {@link https://github.com/feross/buffer|Buffer} representing the [[NFTTransferOutput]] and returns the size of the output.
     */
    NFTTransferOutput.prototype.fromBuffer = function (utxobuff, offset) {
        if (offset === void 0) { offset = 0; }
        this.groupID = bintools.copyFrom(utxobuff, offset, offset + 4);
        offset += 4;
        this.sizePayload = bintools.copyFrom(utxobuff, offset, offset + 4);
        var psize = this.sizePayload.readUInt32BE(0);
        offset += 4;
        this.payload = bintools.copyFrom(utxobuff, offset, offset + psize);
        offset = offset + psize;
        return _super.prototype.fromBuffer.call(this, utxobuff, offset);
    };
    /**
     * Returns the buffer representing the [[NFTTransferOutput]] instance.
     */
    NFTTransferOutput.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var bsize = this.groupID.length +
            this.sizePayload.length +
            this.payload.length +
            superbuff.length;
        this.sizePayload.writeUInt32BE(this.payload.length, 0);
        var barr = [
            this.groupID,
            this.sizePayload,
            this.payload,
            superbuff
        ];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    NFTTransferOutput.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (NFTTransferOutput.bind.apply(NFTTransferOutput, __spreadArray([void 0], args, false)))();
    };
    NFTTransferOutput.prototype.clone = function () {
        var newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    };
    return NFTTransferOutput;
}(NFTOutput));
exports.NFTTransferOutput = NFTTransferOutput;
