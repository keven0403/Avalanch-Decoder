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
exports.CreateSubnetTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-CreateSubnetTx
 */
var buffer_1 = require("buffer/");
var basetx_1 = require("./basetx");
var constants_1 = require("./constants");
var constants_2 = require("../../utils/constants");
var outputs_1 = require("./outputs");
var errors_1 = require("../../utils/errors");
var CreateSubnetTx = /** @class */ (function (_super) {
    __extends(CreateSubnetTx, _super);
    /**
     * Class representing an unsigned Create Subnet transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param subnetOwners Optional [[SECPOwnerOutput]] class for specifying who owns the subnet.
     */
    function CreateSubnetTx(networkID, blockchainID, outs, ins, memo, subnetOwners) {
        if (networkID === void 0) { networkID = constants_2.DefaultNetworkID; }
        if (blockchainID === void 0) { blockchainID = buffer_1.Buffer.alloc(32, 16); }
        if (outs === void 0) { outs = undefined; }
        if (ins === void 0) { ins = undefined; }
        if (memo === void 0) { memo = undefined; }
        if (subnetOwners === void 0) { subnetOwners = undefined; }
        var _this = _super.call(this, networkID, blockchainID, outs, ins, memo) || this;
        _this._typeName = "CreateSubnetTx";
        _this._typeID = constants_1.PlatformVMConstants.CREATESUBNETTX;
        _this.subnetOwners = undefined;
        _this.subnetOwners = subnetOwners;
        return _this;
    }
    CreateSubnetTx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { subnetOwners: this.subnetOwners.serialize(encoding) });
    };
    CreateSubnetTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.subnetOwners = new outputs_1.SECPOwnerOutput();
        this.subnetOwners.deserialize(fields["subnetOwners"], encoding);
    };
    /**
     * Returns the id of the [[CreateSubnetTx]]
     */
    CreateSubnetTx.prototype.getTxType = function () {
        return this._typeID;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the reward address.
     */
    CreateSubnetTx.prototype.getSubnetOwners = function () {
        return this.subnetOwners;
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[CreateSubnetTx]], parses it, populates the class, and returns the length of the [[CreateSubnetTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[CreateSubnetTx]]
     * @param offset A number for the starting position in the bytes.
     *
     * @returns The length of the raw [[CreateSubnetTx]]
     *
     * @remarks assume not-checksummed
     */
    CreateSubnetTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset);
        offset += 4;
        this.subnetOwners = new outputs_1.SECPOwnerOutput();
        offset = this.subnetOwners.fromBuffer(bytes, offset);
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[CreateSubnetTx]].
     */
    CreateSubnetTx.prototype.toBuffer = function () {
        if (typeof this.subnetOwners === "undefined" ||
            !(this.subnetOwners instanceof outputs_1.SECPOwnerOutput)) {
            throw new errors_1.SubnetOwnerError("CreateSubnetTx.toBuffer -- this.subnetOwners is not a SECPOwnerOutput");
        }
        var typeID = buffer_1.Buffer.alloc(4);
        typeID.writeUInt32BE(this.subnetOwners.getOutputID(), 0);
        var barr = [
            _super.prototype.toBuffer.call(this),
            typeID,
            this.subnetOwners.toBuffer()
        ];
        return buffer_1.Buffer.concat(barr);
    };
    return CreateSubnetTx;
}(basetx_1.BaseTx));
exports.CreateSubnetTx = CreateSubnetTx;
