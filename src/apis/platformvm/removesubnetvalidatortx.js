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
exports.RemoveSubnetValidatorTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-RemoveSubnetValidatorTx
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var credentials_1 = require("../../common/credentials");
var basetx_1 = require("./basetx");
var constants_2 = require("../../utils/constants");
var _1 = require(".");
var utils_1 = require("../../utils");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
/**
 * Class representing an unsigned RemoveSubnetValidatorTx transaction.
 */
var RemoveSubnetValidatorTx = /** @class */ (function (_super) {
    __extends(RemoveSubnetValidatorTx, _super);
    /**
     * Class representing an unsigned RemoveSubnetValidatorTx transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param subnetID Optional. ID of the subnet this validator is validating
     */
    function RemoveSubnetValidatorTx(networkID, blockchainID, outs, ins, memo, nodeID, subnetID) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (nodeID === void 0) { nodeID = undefined; }
        if (subnetID === void 0) { subnetID = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "RemoveSubnetValidatorTx";
        _this._typeID = constants_1.PlatformVMConstants.REMOVESUBNETVALIDATORTX;
        _this.nodeID = buffer_1.Buffer.alloc(20);
        _this.subnetID = buffer_1.Buffer.alloc(32);
        _this.sigCount = buffer_1.Buffer.alloc(4);
        _this.sigIdxs = []; // idxs of subnet auth signers
        if (typeof subnetID != "undefined") {
            if (typeof subnetID === "string") {
                _this.subnetID = bintools.cb58Decode(subnetID);
            }
            else {
                _this.subnetID = subnetID;
            }
        }
        if (typeof nodeID != "undefined") {
            _this.nodeID = nodeID;
        }
        var subnetAuth = new _1.SubnetAuth();
        _this.subnetAuth = subnetAuth;
        return _this;
    }
    /**
     * Returns the id of the [[RemoveSubnetValidatorTx]]
     */
    RemoveSubnetValidatorTx.prototype.getTxType = function () {
        return constants_1.PlatformVMConstants.REMOVESUBNETVALIDATORTX;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the nodeID.
     */
    RemoveSubnetValidatorTx.prototype.getNodeID = function () {
        return this.nodeID;
    };
    /**
     * Returns a string for the nodeID.
     */
    RemoveSubnetValidatorTx.prototype.getNodeIDString = function () {
        return (0, utils_1.bufferToNodeIDString)(this.nodeID);
    };
    /**
     * Returns the subnetID as a string
     */
    RemoveSubnetValidatorTx.prototype.getSubnetID = function () {
        return bintools.cb58Encode(this.subnetID);
    };
    /**
     * Returns the subnetAuth
     */
    RemoveSubnetValidatorTx.prototype.getSubnetAuth = function () {
        return this.subnetAuth;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[RemoveSubnetValidatorTx]], parses it, populates the class, and returns the length of the [[RemoveSubnetValidatorTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[RemoveSubnetValidatorTx]]
     *
     * @returns The length of the raw [[RemoveSubnetValidatorTx]]
     *
     * @remarks assume not-checksummed
     */
    RemoveSubnetValidatorTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.nodeID = bintools.copyFrom(bytes, offset, offset + 20);
        offset += 20;
        this.subnetID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        var sa = new _1.SubnetAuth();
        offset += sa.fromBuffer(bintools.copyFrom(bytes, offset));
        this.subnetAuth = sa;
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[RemoveSubnetValidatorTx]].
     */
    RemoveSubnetValidatorTx.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var bsize = superbuff.length +
            this.nodeID.length +
            this.subnetID.length +
            this.subnetAuth.toBuffer().length;
        var barr = [
            superbuff,
            this.nodeID,
            this.subnetID,
            this.subnetAuth.toBuffer()
        ];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    RemoveSubnetValidatorTx.prototype.clone = function () {
        var newRemoveSubnetValidatorTx = new RemoveSubnetValidatorTx();
        newRemoveSubnetValidatorTx.fromBuffer(this.toBuffer());
        return newRemoveSubnetValidatorTx;
    };
    RemoveSubnetValidatorTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (RemoveSubnetValidatorTx.bind.apply(RemoveSubnetValidatorTx, __spreadArray([void 0], args, false)))();
    };
    /**
     * Creates and adds a [[SigIdx]] to the [[RemoveSubnetValidatorTx]].
     *
     * @param addressIdx The index of the address to reference in the signatures
     * @param address The address of the source of the signature
     */
    RemoveSubnetValidatorTx.prototype.addSignatureIdx = function (addressIdx, address) {
        var addressIndex = buffer_1.Buffer.alloc(4);
        addressIndex.writeUIntBE(addressIdx, 0, 4);
        this.subnetAuth.addAddressIndex(addressIndex);
        var sigidx = new credentials_1.SigIdx();
        var b = buffer_1.Buffer.alloc(4);
        b.writeUInt32BE(addressIdx, 0);
        sigidx.fromBuffer(b);
        sigidx.setSource(address);
        this.sigIdxs.push(sigidx);
        this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
    };
    /**
     * Returns the array of [[SigIdx]] for this [[Input]]
     */
    RemoveSubnetValidatorTx.prototype.getSigIdxs = function () {
        return this.sigIdxs;
    };
    RemoveSubnetValidatorTx.prototype.getCredentialID = function () {
        return constants_1.PlatformVMConstants.SECPCREDENTIAL;
    };
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    RemoveSubnetValidatorTx.prototype.sign = function (msg, kc) {
        var creds = _super.prototype.sign.call(this, msg, kc);
        var sigidxs = this.getSigIdxs();
        var cred = (0, _1.SelectCredentialClass)(this.getCredentialID());
        for (var i = 0; i < sigidxs.length; i++) {
            var keypair = kc.getKey(sigidxs["".concat(i)].getSource());
            var signval = keypair.sign(msg);
            var sig = new credentials_1.Signature();
            sig.fromBuffer(signval);
            cred.addSignature(sig);
        }
        creds.push(cred);
        return creds;
    };
    return RemoveSubnetValidatorTx;
}(basetx_1.BaseTx));
exports.RemoveSubnetValidatorTx = RemoveSubnetValidatorTx;
