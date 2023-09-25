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
exports.Vertex = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-Vertex
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var tx_1 = require("./tx");
var utils_1 = require("../../utils");
var bn_js_1 = require("bn.js");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
/**
 * Class representing a Vertex
 */
var Vertex = /** @class */ (function (_super) {
    __extends(Vertex, _super);
    /**
     * Class representing a Vertex which is a container for AVM Transactions.
     *
     * @param networkID Optional, [[DefaultNetworkID]]
     * @param blockchainID Optional, default "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM"
     * @param height Optional, default new BN(0)
     * @param epoch Optional, default new BN(0)
     * @param parentIDs Optional, default []
     * @param txs Optional, default []
     * @param restrictions Optional, default []
     */
    function Vertex(networkID, blockchainID, height, epoch, parentIDs, txs, restrictions) {
        if (networkID === void 0) { networkID = utils_1.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM"; }
        if (height === void 0) { height = new bn_js_1.default(0); }
        if (epoch === void 0) { epoch = 0; }
        if (parentIDs === void 0) { parentIDs = []; }
        if (txs === void 0) { txs = []; }
        if (restrictions === void 0) { restrictions = []; }
        var _this = _super.call(this) || this;
        _this._typeName = "Vertex";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this.networkID = networkID;
        _this.blockchainID = bintools.cb58Decode(blockchainID);
        _this.height = height;
        _this.epoch = epoch;
        _this.parentIDs = parentIDs;
        _this.numParentIDs = parentIDs.length;
        _this.txs = txs;
        _this.numTxs = txs.length;
        _this.restrictions = restrictions;
        _this.numRestrictions = restrictions.length;
        return _this;
    }
    /**
     * Returns the NetworkID as a number
     */
    Vertex.prototype.getNetworkID = function () {
        return this.networkID;
    };
    /**
     * Returns the BlockchainID as a CB58 string
     */
    Vertex.prototype.getBlockchainID = function () {
        return bintools.cb58Encode(this.blockchainID);
    };
    /**
     * Returns the Height as a {@link https://github.com/indutny/bn.js/|BN}.
     */
    Vertex.prototype.getHeight = function () {
        return this.height;
    };
    /**
     * Returns the Epoch as a number.
     */
    Vertex.prototype.getEpoch = function () {
        return this.epoch;
    };
    /**
     * @returns An array of Buffers
     */
    Vertex.prototype.getParentIDs = function () {
        return this.parentIDs;
    };
    /**
     * Returns array of UnsignedTxs.
     */
    Vertex.prototype.getTxs = function () {
        return this.txs;
    };
    /**
     * @returns An array of Buffers
     */
    Vertex.prototype.getRestrictions = function () {
        return this.restrictions;
    };
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    Vertex.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new utils_1.CodecIdError("Error - Vertex.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0 ? constants_1.AVMConstants.VERTEX : constants_1.AVMConstants.VERTEX_CODECONE;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[Vertex]], parses it, populates the class, and returns the length of the Vertex in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[Vertex]]
     *
     * @returns The length of the raw [[Vertex]]
     *
     * @remarks assume not-checksummed
     */
    Vertex.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset += 2;
        this.blockchainID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        var h = bintools.copyFrom(bytes, offset, offset + 8);
        this.height = bintools.fromBufferToBN(h);
        offset += 8;
        var e = bintools.copyFrom(bytes, offset, offset + 4);
        this.epoch = e.readInt32BE(0);
        offset += 4;
        var nPIDs = bintools.copyFrom(bytes, offset, offset + 4);
        this.numParentIDs = nPIDs.readInt32BE(0);
        offset += 4;
        for (var i = 0; i < this.numParentIDs; i++) {
            var parentID = bintools.copyFrom(bytes, offset, offset + 32);
            offset += 32;
            this.parentIDs.push(parentID);
        }
        var nTxs = bintools.copyFrom(bytes, offset, offset + 4);
        this.numTxs = nTxs.readInt32BE(0);
        // account for tx-size bytes
        offset += 8;
        for (var i = 0; i < this.numTxs; i++) {
            var tx = new tx_1.Tx();
            offset += tx.fromBuffer(bintools.copyFrom(bytes, offset));
            this.txs.push(tx);
        }
        if (bytes.byteLength > offset && bytes.byteLength - offset > 4) {
            var nRs = bintools.copyFrom(bytes, offset, offset + 4);
            this.numRestrictions = nRs.readInt32BE(0);
            offset += 4;
            for (var i = 0; i < this.numRestrictions; i++) {
                var tx = bintools.copyFrom(bytes, offset, offset + 32);
                offset += 32;
                this.restrictions.push(tx);
            }
        }
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[Vertex]].
     */
    Vertex.prototype.toBuffer = function () {
        var codec = this.getCodecID();
        var codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(codec, 0);
        var epochBuf = buffer_1.Buffer.alloc(4);
        epochBuf.writeInt32BE(this.epoch, 0);
        var numParentIDsBuf = buffer_1.Buffer.alloc(4);
        numParentIDsBuf.writeInt32BE(this.numParentIDs, 0);
        var barr = [
            codecBuf,
            this.blockchainID,
            bintools.fromBNToBuffer(this.height, 8),
            epochBuf,
            numParentIDsBuf
        ];
        this.parentIDs.forEach(function (parentID) {
            barr.push(parentID);
        });
        var txs = this.getTxs();
        var numTxs = buffer_1.Buffer.alloc(4);
        numTxs.writeUInt32BE(txs.length, 0);
        barr.push(numTxs);
        var size = 0;
        var txSize = buffer_1.Buffer.alloc(4);
        txs.forEach(function (tx) {
            var b = tx.toBuffer();
            size += b.byteLength;
        });
        txSize.writeUInt32BE(size, 0);
        barr.push(txSize);
        txs.forEach(function (tx) {
            var b = tx.toBuffer();
            barr.push(b);
        });
        return buffer_1.Buffer.concat(barr);
    };
    Vertex.prototype.clone = function () {
        var vertex = new Vertex();
        vertex.fromBuffer(this.toBuffer());
        return vertex;
    };
    return Vertex;
}(utils_1.Serializable));
exports.Vertex = Vertex;
