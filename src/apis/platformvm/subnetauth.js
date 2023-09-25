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
exports.SubnetAuth = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-SubnetAuth
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var utils_1 = require("../../utils");
var _1 = require(".");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var SubnetAuth = /** @class */ (function (_super) {
    __extends(SubnetAuth, _super);
    function SubnetAuth() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "SubnetAuth";
        _this._typeID = _1.PlatformVMConstants.SUBNETAUTH;
        _this.addressIndices = [];
        _this.numAddressIndices = buffer_1.Buffer.alloc(4);
        return _this;
    }
    SubnetAuth.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign({}, fields);
    };
    SubnetAuth.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
    };
    /**
     * Add an address index for Subnet Auth signing
     *
     * @param index the Buffer of the address index to add
     */
    SubnetAuth.prototype.addAddressIndex = function (index) {
        var numAddrIndices = this.getNumAddressIndices();
        this.numAddressIndices.writeUIntBE(numAddrIndices + 1, 0, 4);
        this.addressIndices.push(index);
    };
    /**
     * Returns the number of address indices as a number
     */
    SubnetAuth.prototype.getNumAddressIndices = function () {
        return this.numAddressIndices.readUIntBE(0, 4);
    };
    /**
     * Returns an array of AddressIndices as Buffers
     */
    SubnetAuth.prototype.getAddressIndices = function () {
        return this.addressIndices;
    };
    SubnetAuth.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        // increase offset for type id
        offset += 4;
        this.numAddressIndices = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        for (var i = 0; i < this.getNumAddressIndices(); i++) {
            this.addressIndices.push(bintools.copyFrom(bytes, offset, offset + 4));
            offset += 4;
        }
        return offset;
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[SubnetAuth]].
     */
    SubnetAuth.prototype.toBuffer = function () {
        var _this = this;
        var typeIDBuf = buffer_1.Buffer.alloc(4);
        typeIDBuf.writeUIntBE(this._typeID, 0, 4);
        var numAddressIndices = buffer_1.Buffer.alloc(4);
        numAddressIndices.writeIntBE(this.addressIndices.length, 0, 4);
        var barr = [typeIDBuf, numAddressIndices];
        var bsize = typeIDBuf.length + numAddressIndices.length;
        this.addressIndices.forEach(function (addressIndex, i) {
            bsize += 4;
            barr.push(_this.addressIndices["".concat(i)]);
        });
        return buffer_1.Buffer.concat(barr, bsize);
    };
    return SubnetAuth;
}(utils_1.Serializable));
exports.SubnetAuth = SubnetAuth;
