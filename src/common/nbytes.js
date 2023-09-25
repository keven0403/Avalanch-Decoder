"use strict";
/**
 * @packageDocumentation
 * @module Common-NBytes
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
exports.NBytes = void 0;
var bintools_1 = require("../utils/bintools");
var serialization_1 = require("../utils/serialization");
var errors_1 = require("../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Abstract class that implements basic functionality for managing a
 * {@link https://github.com/feross/buffer|Buffer} of an exact length.
 *
 * Create a class that extends this one and override bsize to make it validate for exactly
 * the correct length.
 */
var NBytes = /** @class */ (function (_super) {
    __extends(NBytes, _super);
    function NBytes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "NBytes";
        _this._typeID = undefined;
        /**
         * Returns the length of the {@link https://github.com/feross/buffer|Buffer}.
         *
         * @returns The exact length requirement of this class
         */
        _this.getSize = function () { return _this.bsize; };
        return _this;
    }
    NBytes.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { bsize: serialization.encoder(this.bsize, encoding, "number", "decimalString", 4), bytes: serialization.encoder(this.bytes, encoding, "Buffer", "hex", this.bsize) });
    };
    NBytes.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.bsize = serialization.decoder(fields["bsize"], encoding, "decimalString", "number", 4);
        this.bytes = serialization.decoder(fields["bytes"], encoding, "hex", "Buffer", this.bsize);
    };
    /**
     * Takes a base-58 encoded string, verifies its length, and stores it.
     *
     * @returns The size of the {@link https://github.com/feross/buffer|Buffer}
     */
    NBytes.prototype.fromString = function (b58str) {
        try {
            this.fromBuffer(bintools.b58ToBuffer(b58str));
        }
        catch (e) {
            /* istanbul ignore next */
            var emsg = "Error - NBytes.fromString: ".concat(e);
            /* istanbul ignore next */
            throw new Error(emsg);
        }
        return this.bsize;
    };
    /**
     * Takes a [[Buffer]], verifies its length, and stores it.
     *
     * @returns The size of the {@link https://github.com/feross/buffer|Buffer}
     */
    NBytes.prototype.fromBuffer = function (buff, offset) {
        if (offset === void 0) { offset = 0; }
        try {
            if (buff.length - offset < this.bsize) {
                /* istanbul ignore next */
                throw new errors_1.BufferSizeError("Error - NBytes.fromBuffer: not enough space available in buffer.");
            }
            this.bytes = bintools.copyFrom(buff, offset, offset + this.bsize);
        }
        catch (e) {
            /* istanbul ignore next */
            var emsg = "Error - NBytes.fromBuffer: ".concat(e);
            /* istanbul ignore next */
            throw new Error(emsg);
        }
        return offset + this.bsize;
    };
    /**
     * @returns A reference to the stored {@link https://github.com/feross/buffer|Buffer}
     */
    NBytes.prototype.toBuffer = function () {
        return this.bytes;
    };
    /**
     * @returns A base-58 string of the stored {@link https://github.com/feross/buffer|Buffer}
     */
    NBytes.prototype.toString = function () {
        return bintools.bufferToB58(this.toBuffer());
    };
    return NBytes;
}(serialization_1.Serializable));
exports.NBytes = NBytes;
