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
exports.CreateChainTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-CreateChainTx
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var credentials_1 = require("../../common/credentials");
var basetx_1 = require("./basetx");
var constants_2 = require("../../utils/constants");
var serialization_1 = require("../../utils/serialization");
var _1 = require(".");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Class representing an unsigned CreateChainTx transaction.
 */
var CreateChainTx = /** @class */ (function (_super) {
    __extends(CreateChainTx, _super);
    /**
     * Class representing an unsigned CreateChain transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param subnetID Optional ID of the Subnet that validates this blockchain.
     * @param chainName Optional A human readable name for the chain; need not be unique
     * @param vmID Optional ID of the VM running on the new chain
     * @param fxIDs Optional IDs of the feature extensions running on the new chain
     * @param genesisData Optional Byte representation of genesis state of the new chain
     */
    function CreateChainTx(networkID, blockchainID, outs, ins, memo, subnetID, chainName, vmID, fxIDs, genesisData) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (subnetID === void 0) { subnetID = undefined; }
        if (chainName === void 0) { chainName = undefined; }
        if (vmID === void 0) { vmID = undefined; }
        if (fxIDs === void 0) { fxIDs = undefined; }
        if (genesisData === void 0) { genesisData = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "CreateChainTx";
        _this._typeID = constants_1.PlatformVMConstants.CREATECHAINTX;
        _this.subnetID = buffer_1.Buffer.alloc(32);
        _this.chainName = "";
        _this.vmID = buffer_1.Buffer.alloc(32);
        _this.numFXIDs = buffer_1.Buffer.alloc(4);
        _this.fxIDs = [];
        _this.genesisData = buffer_1.Buffer.alloc(32);
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
        if (typeof chainName != "undefined") {
            _this.chainName = chainName;
        }
        if (typeof vmID != "undefined") {
            var buf = buffer_1.Buffer.alloc(32);
            buf.write(vmID, 0, vmID.length);
            _this.vmID = buf;
        }
        if (typeof fxIDs != "undefined") {
            _this.numFXIDs.writeUInt32BE(fxIDs.length, 0);
            var fxIDBufs_1 = [];
            fxIDs.forEach(function (fxID) {
                var buf = buffer_1.Buffer.alloc(32);
                buf.write(fxID, 0, fxID.length, "utf8");
                fxIDBufs_1.push(buf);
            });
            _this.fxIDs = fxIDBufs_1;
        }
        if (typeof genesisData != "undefined" && typeof genesisData != "string") {
            _this.genesisData = genesisData.toBuffer();
        }
        else if (typeof genesisData == "string") {
            _this.genesisData = buffer_1.Buffer.from(genesisData);
        }
        var subnetAuth = new _1.SubnetAuth();
        _this.subnetAuth = subnetAuth;
        return _this;
    }
    CreateChainTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { subnetID: serialization.encoder(this.subnetID, encoding, "Buffer", "cb58") });
    };
    CreateChainTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.subnetID = serialization.decoder(fields["subnetID"], encoding, "cb58", "Buffer", 32);
        // this.exportOuts = fields["exportOuts"].map((e: object) => {
        //   let eo: TransferableOutput = new TransferableOutput()
        //   eo.deserialize(e, encoding)
        //   return eo
        // })
    };
    /**
     * Returns the id of the [[CreateChainTx]]
     */
    CreateChainTx.prototype.getTxType = function () {
        return constants_1.PlatformVMConstants.CREATECHAINTX;
    };
    /**
     * Returns the subnetAuth
     */
    CreateChainTx.prototype.getSubnetAuth = function () {
        return this.subnetAuth;
    };
    /**
     * Returns the subnetID as a string
     */
    CreateChainTx.prototype.getSubnetID = function () {
        return bintools.cb58Encode(this.subnetID);
    };
    /**
     * Returns a string of the chainName
     */
    CreateChainTx.prototype.getChainName = function () {
        return this.chainName;
    };
    /**
     * Returns a Buffer of the vmID
     */
    CreateChainTx.prototype.getVMID = function () {
        return this.vmID;
    };
    /**
     * Returns an array of fxIDs as Buffers
     */
    CreateChainTx.prototype.getFXIDs = function () {
        return this.fxIDs;
    };
    /**
     * Returns a string of the genesisData
     */
    CreateChainTx.prototype.getGenesisData = function () {
        return bintools.cb58Encode(this.genesisData);
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[CreateChainTx]], parses it, populates the class, and returns the length of the [[CreateChainTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[CreateChainTx]]
     *
     * @returns The length of the raw [[CreateChainTx]]
     *
     * @remarks assume not-checksummed
     */
    CreateChainTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        this.subnetID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        var chainNameSize = bintools
            .copyFrom(bytes, offset, offset + 2)
            .readUInt16BE(0);
        offset += 2;
        this.chainName = bintools
            .copyFrom(bytes, offset, offset + chainNameSize)
            .toString("utf8");
        offset += chainNameSize;
        this.vmID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.numFXIDs = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var nfxids = parseInt(this.numFXIDs.toString("hex"), 10);
        for (var i = 0; i < nfxids; i++) {
            this.fxIDs.push(bintools.copyFrom(bytes, offset, offset + 32));
            offset += 32;
        }
        var genesisDataSize = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.genesisData = bintools.copyFrom(bytes, offset, offset + genesisDataSize);
        offset += genesisDataSize;
        var sa = new _1.SubnetAuth();
        offset += sa.fromBuffer(bintools.copyFrom(bytes, offset));
        this.subnetAuth = sa;
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[CreateChainTx]].
     */
    CreateChainTx.prototype.toBuffer = function () {
        var superbuff = _super.prototype.toBuffer.call(this);
        var chainNameBuff = buffer_1.Buffer.alloc(this.chainName.length);
        chainNameBuff.write(this.chainName, 0, this.chainName.length, "utf8");
        var chainNameSize = buffer_1.Buffer.alloc(2);
        chainNameSize.writeUIntBE(this.chainName.length, 0, 2);
        var bsize = superbuff.length +
            this.subnetID.length +
            chainNameSize.length +
            chainNameBuff.length +
            this.vmID.length +
            this.numFXIDs.length;
        var barr = [
            superbuff,
            this.subnetID,
            chainNameSize,
            chainNameBuff,
            this.vmID,
            this.numFXIDs
        ];
        this.fxIDs.forEach(function (fxID) {
            bsize += fxID.length;
            barr.push(fxID);
        });
        bsize += 4;
        bsize += this.genesisData.length;
        var gdLength = buffer_1.Buffer.alloc(4);
        gdLength.writeUIntBE(this.genesisData.length, 0, 4);
        barr.push(gdLength);
        barr.push(this.genesisData);
        bsize += this.subnetAuth.toBuffer().length;
        barr.push(this.subnetAuth.toBuffer());
        return buffer_1.Buffer.concat(barr, bsize);
    };
    CreateChainTx.prototype.clone = function () {
        var newCreateChainTx = new CreateChainTx();
        newCreateChainTx.fromBuffer(this.toBuffer());
        return newCreateChainTx;
    };
    CreateChainTx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (CreateChainTx.bind.apply(CreateChainTx, __spreadArray([void 0], args, false)))();
    };
    /**
     * Creates and adds a [[SigIdx]] to the [[AddSubnetValidatorTx]].
     *
     * @param addressIdx The index of the address to reference in the signatures
     * @param address The address of the source of the signature
     */
    CreateChainTx.prototype.addSignatureIdx = function (addressIdx, address) {
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
    CreateChainTx.prototype.getSigIdxs = function () {
        return this.sigIdxs;
    };
    CreateChainTx.prototype.getCredentialID = function () {
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
    CreateChainTx.prototype.sign = function (msg, kc) {
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
    return CreateChainTx;
}(basetx_1.BaseTx));
exports.CreateChainTx = CreateChainTx;
