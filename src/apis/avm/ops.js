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
exports.UTXOID = exports.NFTTransferOperation = exports.NFTMintOperation = exports.SECPMintOperation = exports.TransferableOperation = exports.Operation = exports.SelectOperationClass = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-Operations
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var outputs_1 = require("./outputs");
var nbytes_1 = require("../../common/nbytes");
var credentials_1 = require("../../common/credentials");
var output_1 = require("../../common/output");
var serialization_1 = require("../../utils/serialization");
var errors_1 = require("../../utils/errors");
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
var cb58 = "cb58";
var buffer = "Buffer";
var hex = "hex";
var decimalString = "decimalString";
/**
 * Takes a buffer representing the output and returns the proper [[Operation]] instance.
 *
 * @param opid A number representing the operation ID parsed prior to the bytes passed in
 *
 * @returns An instance of an [[Operation]]-extended class.
 */
var SelectOperationClass = function (opid) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (opid === constants_1.AVMConstants.SECPMINTOPID ||
        opid === constants_1.AVMConstants.SECPMINTOPID_CODECONE) {
        return new (SECPMintOperation.bind.apply(SECPMintOperation, __spreadArray([void 0], args, false)))();
    }
    else if (opid === constants_1.AVMConstants.NFTMINTOPID ||
        opid === constants_1.AVMConstants.NFTMINTOPID_CODECONE) {
        return new (NFTMintOperation.bind.apply(NFTMintOperation, __spreadArray([void 0], args, false)))();
    }
    else if (opid === constants_1.AVMConstants.NFTXFEROPID ||
        opid === constants_1.AVMConstants.NFTXFEROPID_CODECONE) {
        return new (NFTTransferOperation.bind.apply(NFTTransferOperation, __spreadArray([void 0], args, false)))();
    }
    /* istanbul ignore next */
    throw new errors_1.InvalidOperationIdError("Error - SelectOperationClass: unknown opid ".concat(opid));
};
exports.SelectOperationClass = SelectOperationClass;
/**
 * A class representing an operation. All operation types must extend on this class.
 */
var Operation = /** @class */ (function (_super) {
    __extends(Operation, _super);
    function Operation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "Operation";
        _this._typeID = undefined;
        _this.sigCount = buffer_1.Buffer.alloc(4);
        _this.sigIdxs = []; // idxs of signers from utxo
        /**
         * Returns the array of [[SigIdx]] for this [[Operation]]
         */
        _this.getSigIdxs = function () { return _this.sigIdxs; };
        /**
         * Creates and adds a [[SigIdx]] to the [[Operation]].
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
    Operation.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { sigIdxs: this.sigIdxs.map(function (s) { return s.serialize(encoding); }) });
    };
    Operation.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.sigIdxs = fields["sigIdxs"].map(function (s) {
            var sidx = new credentials_1.SigIdx();
            sidx.deserialize(s, encoding);
            return sidx;
        });
        this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
    };
    Operation.prototype.fromBuffer = function (bytes, offset) {
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
    Operation.prototype.toBuffer = function () {
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
     * Returns a base-58 string representing the [[NFTMintOperation]].
     */
    Operation.prototype.toString = function () {
        return bintools.bufferToB58(this.toBuffer());
    };
    Operation.comparator = function () {
        return function (a, b) {
            var aoutid = buffer_1.Buffer.alloc(4);
            aoutid.writeUInt32BE(a.getOperationID(), 0);
            var abuff = a.toBuffer();
            var boutid = buffer_1.Buffer.alloc(4);
            boutid.writeUInt32BE(b.getOperationID(), 0);
            var bbuff = b.toBuffer();
            var asort = buffer_1.Buffer.concat([aoutid, abuff], aoutid.length + abuff.length);
            var bsort = buffer_1.Buffer.concat([boutid, bbuff], boutid.length + bbuff.length);
            return buffer_1.Buffer.compare(asort, bsort);
        };
    };
    return Operation;
}(serialization_1.Serializable));
exports.Operation = Operation;
/**
 * A class which contains an [[Operation]] for transfers.
 *
 */
var TransferableOperation = /** @class */ (function (_super) {
    __extends(TransferableOperation, _super);
    function TransferableOperation(assetID, utxoids, operation) {
        if (assetID === void 0) { assetID = undefined; }
        if (utxoids === void 0) { utxoids = undefined; }
        if (operation === void 0) { operation = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "TransferableOperation";
        _this._typeID = undefined;
        _this.assetID = buffer_1.Buffer.alloc(32);
        _this.utxoIDs = [];
        /**
         * Returns the assetID as a {@link https://github.com/feross/buffer|Buffer}.
         */
        _this.getAssetID = function () { return _this.assetID; };
        /**
         * Returns an array of UTXOIDs in this operation.
         */
        _this.getUTXOIDs = function () { return _this.utxoIDs; };
        /**
         * Returns the operation
         */
        _this.getOperation = function () { return _this.operation; };
        if (typeof assetID !== "undefined" &&
            assetID.length === constants_1.AVMConstants.ASSETIDLEN &&
            operation instanceof Operation &&
            typeof utxoids !== "undefined" &&
            Array.isArray(utxoids)) {
            _this.assetID = assetID;
            _this.operation = operation;
            for (var i = 0; i < utxoids.length; i++) {
                var utxoid = new UTXOID();
                if (typeof utxoids["".concat(i)] === "string") {
                    utxoid.fromString(utxoids["".concat(i)]);
                }
                else if (utxoids["".concat(i)] instanceof buffer_1.Buffer) {
                    utxoid.fromBuffer(utxoids["".concat(i)]);
                }
                else if (utxoids["".concat(i)] instanceof UTXOID) {
                    utxoid.fromString(utxoids["".concat(i)].toString()); // clone
                }
                _this.utxoIDs.push(utxoid);
            }
        }
        return _this;
    }
    TransferableOperation.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { assetID: serialization.encoder(this.assetID, encoding, buffer, cb58, 32), utxoIDs: this.utxoIDs.map(function (u) { return u.serialize(encoding); }), operation: this.operation.serialize(encoding) });
    };
    TransferableOperation.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.assetID = serialization.decoder(fields["assetID"], encoding, cb58, buffer, 32);
        this.utxoIDs = fields["utxoIDs"].map(function (u) {
            var utxoid = new UTXOID();
            utxoid.deserialize(u, encoding);
            return utxoid;
        });
        this.operation = (0, exports.SelectOperationClass)(fields["operation"]["_typeID"]);
        this.operation.deserialize(fields["operation"], encoding);
    };
    TransferableOperation.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.assetID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        var numutxoIDs = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.utxoIDs = [];
        for (var i = 0; i < numutxoIDs; i++) {
            var utxoid = new UTXOID();
            offset = utxoid.fromBuffer(bytes, offset);
            this.utxoIDs.push(utxoid);
        }
        var opid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.operation = (0, exports.SelectOperationClass)(opid);
        return this.operation.fromBuffer(bytes, offset);
    };
    TransferableOperation.prototype.toBuffer = function () {
        var numutxoIDs = buffer_1.Buffer.alloc(4);
        numutxoIDs.writeUInt32BE(this.utxoIDs.length, 0);
        var bsize = this.assetID.length + numutxoIDs.length;
        var barr = [this.assetID, numutxoIDs];
        this.utxoIDs = this.utxoIDs.sort(UTXOID.comparator());
        for (var i = 0; i < this.utxoIDs.length; i++) {
            var b_1 = this.utxoIDs["".concat(i)].toBuffer();
            barr.push(b_1);
            bsize += b_1.length;
        }
        var opid = buffer_1.Buffer.alloc(4);
        opid.writeUInt32BE(this.operation.getOperationID(), 0);
        barr.push(opid);
        bsize += opid.length;
        var b = this.operation.toBuffer();
        bsize += b.length;
        barr.push(b);
        return buffer_1.Buffer.concat(barr, bsize);
    };
    /**
     * Returns a function used to sort an array of [[TransferableOperation]]s
     */
    TransferableOperation.comparator = function () {
        return function (a, b) {
            return buffer_1.Buffer.compare(a.toBuffer(), b.toBuffer());
        };
    };
    return TransferableOperation;
}(serialization_1.Serializable));
exports.TransferableOperation = TransferableOperation;
/**
 * An [[Operation]] class which specifies a SECP256k1 Mint Op.
 */
var SECPMintOperation = /** @class */ (function (_super) {
    __extends(SECPMintOperation, _super);
    /**
     * An [[Operation]] class which mints new tokens on an assetID.
     *
     * @param mintOutput The [[SECPMintOutput]] that will be produced by this transaction.
     * @param transferOutput A [[SECPTransferOutput]] that will be produced from this minting operation.
     */
    function SECPMintOperation(mintOutput, transferOutput) {
        if (mintOutput === void 0) { mintOutput = undefined; }
        if (transferOutput === void 0) { transferOutput = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "SECPMintOperation";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.SECPMINTOPID
            : constants_1.AVMConstants.SECPMINTOPID_CODECONE;
        _this.mintOutput = undefined;
        _this.transferOutput = undefined;
        if (typeof mintOutput !== "undefined") {
            _this.mintOutput = mintOutput;
        }
        if (typeof transferOutput !== "undefined") {
            _this.transferOutput = transferOutput;
        }
        return _this;
    }
    SECPMintOperation.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { mintOutput: this.mintOutput.serialize(encoding), transferOutputs: this.transferOutput.serialize(encoding) });
    };
    SECPMintOperation.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.mintOutput = new outputs_1.SECPMintOutput();
        this.mintOutput.deserialize(fields["mintOutput"], encoding);
        this.transferOutput = new outputs_1.SECPTransferOutput();
        this.transferOutput.deserialize(fields["transferOutputs"], encoding);
    };
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    SECPMintOperation.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - SECPMintOperation.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.SECPMINTOPID
                : constants_1.AVMConstants.SECPMINTOPID_CODECONE;
    };
    /**
     * Returns the operation ID.
     */
    SECPMintOperation.prototype.getOperationID = function () {
        return this._typeID;
    };
    /**
     * Returns the credential ID.
     */
    SECPMintOperation.prototype.getCredentialID = function () {
        if (this._codecID === 0) {
            return constants_1.AVMConstants.SECPCREDENTIAL;
        }
        else if (this._codecID === 1) {
            return constants_1.AVMConstants.SECPCREDENTIAL_CODECONE;
        }
    };
    /**
     * Returns the [[SECPMintOutput]] to be produced by this operation.
     */
    SECPMintOperation.prototype.getMintOutput = function () {
        return this.mintOutput;
    };
    /**
     * Returns [[SECPTransferOutput]] to be produced by this operation.
     */
    SECPMintOperation.prototype.getTransferOutput = function () {
        return this.transferOutput;
    };
    /**
     * Popuates the instance from a {@link https://github.com/feross/buffer|Buffer} representing the [[SECPMintOperation]] and returns the updated offset.
     */
    SECPMintOperation.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.mintOutput = new outputs_1.SECPMintOutput();
        offset = this.mintOutput.fromBuffer(bytes, offset);
        this.transferOutput = new outputs_1.SECPTransferOutput();
        offset = this.transferOutput.fromBuffer(bytes, offset);
        return offset;
    };
    /**
     * Returns the buffer representing the [[SECPMintOperation]] instance.
     */
    SECPMintOperation.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var mintoutBuff = this.mintOutput.toBuffer();
        var transferOutBuff = this.transferOutput.toBuffer();
        var bsize = superbuff.length + mintoutBuff.length + transferOutBuff.length;
        var barr = [superbuff, mintoutBuff, transferOutBuff];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    return SECPMintOperation;
}(Operation));
exports.SECPMintOperation = SECPMintOperation;
/**
 * An [[Operation]] class which specifies a NFT Mint Op.
 */
var NFTMintOperation = /** @class */ (function (_super) {
    __extends(NFTMintOperation, _super);
    /**
     * An [[Operation]] class which contains an NFT on an assetID.
     *
     * @param groupID The group to which to issue the NFT Output
     * @param payload A {@link https://github.com/feross/buffer|Buffer} of the NFT payload
     * @param outputOwners An array of outputOwners
     */
    function NFTMintOperation(groupID, payload, outputOwners) {
        if (groupID === void 0) { groupID = undefined; }
        if (payload === void 0) { payload = undefined; }
        if (outputOwners === void 0) { outputOwners = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "NFTMintOperation";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.NFTMINTOPID
            : constants_1.AVMConstants.NFTMINTOPID_CODECONE;
        _this.groupID = buffer_1.Buffer.alloc(4);
        _this.outputOwners = [];
        /**
         * Returns the credential ID.
         */
        _this.getCredentialID = function () {
            if (_this._codecID === 0) {
                return constants_1.AVMConstants.NFTCREDENTIAL;
            }
            else if (_this._codecID === 1) {
                return constants_1.AVMConstants.NFTCREDENTIAL_CODECONE;
            }
        };
        /**
         * Returns the payload.
         */
        _this.getGroupID = function () {
            return bintools.copyFrom(_this.groupID, 0);
        };
        /**
         * Returns the payload.
         */
        _this.getPayload = function () {
            return bintools.copyFrom(_this.payload, 0);
        };
        /**
         * Returns the payload's raw {@link https://github.com/feross/buffer|Buffer} with length prepended, for use with [[PayloadBase]]'s fromBuffer
         */
        _this.getPayloadBuffer = function () {
            var payloadlen = buffer_1.Buffer.alloc(4);
            payloadlen.writeUInt32BE(_this.payload.length, 0);
            return buffer_1.Buffer.concat([payloadlen, bintools.copyFrom(_this.payload, 0)]);
        };
        /**
         * Returns the outputOwners.
         */
        _this.getOutputOwners = function () {
            return _this.outputOwners;
        };
        if (typeof groupID !== "undefined" &&
            typeof payload !== "undefined" &&
            outputOwners.length) {
            _this.groupID.writeUInt32BE(groupID ? groupID : 0, 0);
            _this.payload = payload;
            _this.outputOwners = outputOwners;
        }
        return _this;
    }
    NFTMintOperation.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { groupID: serialization.encoder(this.groupID, encoding, buffer, decimalString, 4), payload: serialization.encoder(this.payload, encoding, buffer, hex), outputOwners: this.outputOwners.map(function (o) { return o.serialize(encoding); }) });
    };
    NFTMintOperation.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.groupID = serialization.decoder(fields["groupID"], encoding, decimalString, buffer, 4);
        this.payload = serialization.decoder(fields["payload"], encoding, hex, buffer);
        // this.outputOwners = fields["outputOwners"].map((o: NFTMintOutput) => {
        //   let oo: NFTMintOutput = new NFTMintOutput()
        //   oo.deserialize(o, encoding)
        //   return oo
        // })
        this.outputOwners = fields["outputOwners"].map(function (o) {
            var oo = new output_1.OutputOwners();
            oo.deserialize(o, encoding);
            return oo;
        });
    };
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    NFTMintOperation.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - NFTMintOperation.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.NFTMINTOPID
                : constants_1.AVMConstants.NFTMINTOPID_CODECONE;
    };
    /**
     * Returns the operation ID.
     */
    NFTMintOperation.prototype.getOperationID = function () {
        return this._typeID;
    };
    /**
     * Popuates the instance from a {@link https://github.com/feross/buffer|Buffer} representing the [[NFTMintOperation]] and returns the updated offset.
     */
    NFTMintOperation.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.groupID = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var payloadLen = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.payload = bintools.copyFrom(bytes, offset, offset + payloadLen);
        offset += payloadLen;
        var numoutputs = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.outputOwners = [];
        for (var i = 0; i < numoutputs; i++) {
            var outputOwner = new output_1.OutputOwners();
            offset = outputOwner.fromBuffer(bytes, offset);
            this.outputOwners.push(outputOwner);
        }
        return offset;
    };
    /**
     * Returns the buffer representing the [[NFTMintOperation]] instance.
     */
    NFTMintOperation.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var payloadlen = buffer_1.Buffer.alloc(4);
        payloadlen.writeUInt32BE(this.payload.length, 0);
        var outputownerslen = buffer_1.Buffer.alloc(4);
        outputownerslen.writeUInt32BE(this.outputOwners.length, 0);
        var bsize = superbuff.length +
            this.groupID.length +
            payloadlen.length +
            this.payload.length +
            outputownerslen.length;
        var barr = [
            superbuff,
            this.groupID,
            payloadlen,
            this.payload,
            outputownerslen
        ];
        for (var i = 0; i < this.outputOwners.length; i++) {
            var b = this.outputOwners["".concat(i)].toBuffer();
            barr.push(b);
            bsize += b.length;
        }
        return buffer_1.Buffer.concat(barr, bsize);
    };
    /**
     * Returns a base-58 string representing the [[NFTMintOperation]].
     */
    NFTMintOperation.prototype.toString = function () {
        return bintools.bufferToB58(this.toBuffer());
    };
    return NFTMintOperation;
}(Operation));
exports.NFTMintOperation = NFTMintOperation;
/**
 * A [[Operation]] class which specifies a NFT Transfer Op.
 */
var NFTTransferOperation = /** @class */ (function (_super) {
    __extends(NFTTransferOperation, _super);
    /**
     * An [[Operation]] class which contains an NFT on an assetID.
     *
     * @param output An [[NFTTransferOutput]]
     */
    function NFTTransferOperation(output) {
        if (output === void 0) { output = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "NFTTransferOperation";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.NFTXFEROPID
            : constants_1.AVMConstants.NFTXFEROPID_CODECONE;
        _this.getOutput = function () { return _this.output; };
        if (typeof output !== "undefined") {
            _this.output = output;
        }
        return _this;
    }
    NFTTransferOperation.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { output: this.output.serialize(encoding) });
    };
    NFTTransferOperation.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.output = new outputs_1.NFTTransferOutput();
        this.output.deserialize(fields["output"], encoding);
    };
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    NFTTransferOperation.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - NFTTransferOperation.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.NFTXFEROPID
                : constants_1.AVMConstants.NFTXFEROPID_CODECONE;
    };
    /**
     * Returns the operation ID.
     */
    NFTTransferOperation.prototype.getOperationID = function () {
        return this._typeID;
    };
    /**
     * Returns the credential ID.
     */
    NFTTransferOperation.prototype.getCredentialID = function () {
        if (this._codecID === 0) {
            return constants_1.AVMConstants.NFTCREDENTIAL;
        }
        else if (this._codecID === 1) {
            return constants_1.AVMConstants.NFTCREDENTIAL_CODECONE;
        }
    };
    /**
     * Popuates the instance from a {@link https://github.com/feross/buffer|Buffer} representing the [[NFTTransferOperation]] and returns the updated offset.
     */
    NFTTransferOperation.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.output = new outputs_1.NFTTransferOutput();
        return this.output.fromBuffer(bytes, offset);
    };
    /**
     * Returns the buffer representing the [[NFTTransferOperation]] instance.
     */
    NFTTransferOperation.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var outbuff = this.output.toBuffer();
        var bsize = superbuff.length + outbuff.length;
        var barr = [superbuff, outbuff];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    /**
     * Returns a base-58 string representing the [[NFTTransferOperation]].
     */
    NFTTransferOperation.prototype.toString = function () {
        return bintools.bufferToB58(this.toBuffer());
    };
    return NFTTransferOperation;
}(Operation));
exports.NFTTransferOperation = NFTTransferOperation;
/**
 * Class for representing a UTXOID used in [[TransferableOp]] types
 */
var UTXOID = /** @class */ (function (_super) {
    __extends(UTXOID, _super);
    /**
     * Class for representing a UTXOID used in [[TransferableOp]] types
     */
    function UTXOID() {
        var _this = _super.call(this) || this;
        _this._typeName = "UTXOID";
        _this._typeID = undefined;
        //serialize and deserialize both are inherited
        _this.bytes = buffer_1.Buffer.alloc(36);
        _this.bsize = 36;
        return _this;
    }
    /**
     * Returns a base-58 representation of the [[UTXOID]].
     */
    UTXOID.prototype.toString = function () {
        return bintools.cb58Encode(this.toBuffer());
    };
    /**
     * Takes a base-58 string containing an [[UTXOID]], parses it, populates the class, and returns the length of the UTXOID in bytes.
     *
     * @param bytes A base-58 string containing a raw [[UTXOID]]
     *
     * @returns The length of the raw [[UTXOID]]
     */
    UTXOID.prototype.fromString = function (utxoid) {
        var utxoidbuff = bintools.b58ToBuffer(utxoid);
        if (utxoidbuff.length === 40 && bintools.validateChecksum(utxoidbuff)) {
            var newbuff = bintools.copyFrom(utxoidbuff, 0, utxoidbuff.length - 4);
            if (newbuff.length === 36) {
                this.bytes = newbuff;
            }
        }
        else if (utxoidbuff.length === 40) {
            throw new errors_1.ChecksumError("Error - UTXOID.fromString: invalid checksum on address");
        }
        else if (utxoidbuff.length === 36) {
            this.bytes = utxoidbuff;
        }
        else {
            /* istanbul ignore next */
            throw new errors_1.AddressError("Error - UTXOID.fromString: invalid address");
        }
        return this.getSize();
    };
    UTXOID.prototype.clone = function () {
        var newbase = new UTXOID();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    UTXOID.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new UTXOID();
    };
    /**
     * Returns a function used to sort an array of [[UTXOID]]s
     */
    UTXOID.comparator = function () {
        return function (a, b) {
            return buffer_1.Buffer.compare(a.toBuffer(), b.toBuffer());
        };
    };
    return UTXOID;
}(nbytes_1.NBytes));
exports.UTXOID = UTXOID;
