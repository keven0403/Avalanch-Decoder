"use strict";
/**
 * @packageDocumentation
 * @module API-EVM-BaseTx
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
exports.EVMBaseTx = void 0;
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var evmtx_1 = require("../../common/evmtx");
var constants_1 = require("../../utils/constants");
var tx_1 = require("./tx");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
/**
 * Class representing a base for all transactions.
 */
var EVMBaseTx = /** @class */ (function (_super) {
    __extends(EVMBaseTx, _super);
    /**
     * Class representing an EVMBaseTx which is the foundation for all EVM transactions.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     */
    function EVMBaseTx(networkID, blockchainID) {
        if (networkID === void 0) { networkID = constants_1.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        var _this = _super.call(this, networkID, blockchainID) || this;
        _this._typeName = "BaseTx";
        _this._typeID = undefined;
        return _this;
    }
    //serialize is inherited
    EVMBaseTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
    };
    /**
     * Returns the id of the [[BaseTx]]
     */
    EVMBaseTx.prototype.getTxType = function () {
        return this._typeID;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[BaseTx]], parses it, populates the class, and returns the length of the BaseTx in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[BaseTx]]
     *
     * @returns The length of the raw [[BaseTx]]
     *
     * @remarks assume not-checksummed
     */
    EVMBaseTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.networkID = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        this.blockchainID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        return offset;
    };
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    EVMBaseTx.prototype.sign = function (msg, kc) {
        var creds = [];
        return creds;
    };
    EVMBaseTx.prototype.clone = function () {
        var newEVMBaseTx = new EVMBaseTx();
        newEVMBaseTx.fromBuffer(this.toBuffer());
        return newEVMBaseTx;
    };
    EVMBaseTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (EVMBaseTx.bind.apply(EVMBaseTx, __spreadArray([void 0], args, false)))();
    };
    EVMBaseTx.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var newEVMBaseTx = tx_1.SelectTxClass.apply(void 0, __spreadArray([id], args, false));
        return newEVMBaseTx;
    };
    return EVMBaseTx;
}(evmtx_1.EVMStandardBaseTx));
exports.EVMBaseTx = EVMBaseTx;
