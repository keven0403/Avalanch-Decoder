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
exports.Credential = exports.Signature = exports.SigIdx = void 0;
/**
 * @packageDocumentation
 * @module Common-Signature
 */
var nbytes_1 = require("./nbytes");
var buffer_1 = require("buffer/");
var bintools_1 = require("../utils/bintools");
var serialization_1 = require("../utils/serialization");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Type representing a [[Signature]] index used in [[Input]]
 */
var SigIdx = /** @class */ (function (_super) {
    __extends(SigIdx, _super);
    /**
     * Type representing a [[Signature]] index used in [[Input]]
     */
    function SigIdx() {
        var _this = _super.call(this) || this;
        _this._typeName = "SigIdx";
        _this._typeID = undefined;
        _this.source = buffer_1.Buffer.alloc(20);
        _this.bytes = buffer_1.Buffer.alloc(4);
        _this.bsize = 4;
        /**
         * Sets the source address for the signature
         */
        _this.setSource = function (address) {
            _this.source = address;
        };
        /**
         * Retrieves the source address for the signature
         */
        _this.getSource = function () { return _this.source; };
        return _this;
    }
    SigIdx.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { source: serialization.encoder(this.source, encoding, "Buffer", "hex") });
    };
    SigIdx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.source = serialization.decoder(fields["source"], encoding, "hex", "Buffer");
    };
    SigIdx.prototype.clone = function () {
        var newbase = new SigIdx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    SigIdx.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new SigIdx();
    };
    return SigIdx;
}(nbytes_1.NBytes));
exports.SigIdx = SigIdx;
/**
 * Signature for a [[Tx]]
 */
var Signature = /** @class */ (function (_super) {
    __extends(Signature, _super);
    /**
     * Signature for a [[Tx]]
     */
    function Signature() {
        var _this = _super.call(this) || this;
        _this._typeName = "Signature";
        _this._typeID = undefined;
        //serialize and deserialize both are inherited
        _this.bytes = buffer_1.Buffer.alloc(65);
        _this.bsize = 65;
        return _this;
    }
    Signature.prototype.clone = function () {
        var newbase = new Signature();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    Signature.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Signature();
    };
    return Signature;
}(nbytes_1.NBytes));
exports.Signature = Signature;
var Credential = /** @class */ (function (_super) {
    __extends(Credential, _super);
    function Credential(sigarray) {
        if (sigarray === void 0) { sigarray = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "Credential";
        _this._typeID = undefined;
        _this.sigArray = [];
        /**
         * Adds a signature to the credentials and returns the index off the added signature.
         */
        _this.addSignature = function (sig) {
            _this.sigArray.push(sig);
            return _this.sigArray.length - 1;
        };
        if (typeof sigarray !== "undefined") {
            /* istanbul ignore next */
            _this.sigArray = sigarray;
        }
        return _this;
    }
    Credential.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { sigArray: this.sigArray.map(function (s) { return s.serialize(encoding); }) });
    };
    Credential.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.sigArray = fields["sigArray"].map(function (s) {
            var sig = new Signature();
            sig.deserialize(s, encoding);
            return sig;
        });
    };
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    Credential.prototype.setCodecID = function (codecID) { };
    Credential.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        var siglen = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.sigArray = [];
        for (var i = 0; i < siglen; i++) {
            var sig = new Signature();
            offset = sig.fromBuffer(bytes, offset);
            this.sigArray.push(sig);
        }
        return offset;
    };
    Credential.prototype.toBuffer = function () {
        var siglen = buffer_1.Buffer.alloc(4);
        siglen.writeInt32BE(this.sigArray.length, 0);
        var barr = [siglen];
        var bsize = siglen.length;
        for (var i = 0; i < this.sigArray.length; i++) {
            var sigbuff = this.sigArray["".concat(i)].toBuffer();
            bsize += sigbuff.length;
            barr.push(sigbuff);
        }
        return buffer_1.Buffer.concat(barr, bsize);
    };
    return Credential;
}(serialization_1.Serializable));
exports.Credential = Credential;
