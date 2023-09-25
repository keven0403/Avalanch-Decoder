"use strict";
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
exports.Serialization = exports.Serializable = exports.SERIALIZATIONVERSION = void 0;
/**
 * @packageDocumentation
 * @module Utils-Serialization
 */
var bintools_1 = require("../utils/bintools");
var bn_js_1 = require("bn.js");
var buffer_1 = require("buffer/");
var xss_1 = require("xss");
var helperfunctions_1 = require("./helperfunctions");
var errors_1 = require("../utils/errors");
exports.SERIALIZATIONVERSION = 0;
var Serializable = /** @class */ (function () {
    function Serializable() {
        this._typeName = undefined;
        this._typeID = undefined;
        this._codecID = undefined;
    }
    /**
     * Used in serialization. TypeName is a string name for the type of object being output.
     */
    Serializable.prototype.getTypeName = function () {
        return this._typeName;
    };
    /**
     * Used in serialization. Optional. TypeID is a number for the typeID of object being output.
     */
    Serializable.prototype.getTypeID = function () {
        return this._typeID;
    };
    /**
     * Used in serialization. Optional. TypeID is a number for the typeID of object being output.
     */
    Serializable.prototype.getCodecID = function () {
        return this._codecID;
    };
    /**
     * Sanitize to prevent cross scripting attacks.
     */
    Serializable.prototype.sanitizeObject = function (obj) {
        for (var k in obj) {
            if (typeof obj["".concat(k)] === "object" && obj["".concat(k)] !== null) {
                this.sanitizeObject(obj["".concat(k)]);
            }
            else if (typeof obj["".concat(k)] === "string") {
                obj["".concat(k)] = (0, xss_1.default)(obj["".concat(k)]);
            }
        }
        return obj;
    };
    //sometimes the parent class manages the fields
    //these are so you can say super.serialize(encoding)
    Serializable.prototype.serialize = function (encoding) {
        return {
            _typeName: (0, xss_1.default)(this._typeName),
            _typeID: typeof this._typeID === "undefined" ? null : this._typeID,
            _codecID: typeof this._codecID === "undefined" ? null : this._codecID
        };
    };
    Serializable.prototype.deserialize = function (fields, encoding) {
        fields = this.sanitizeObject(fields);
        if (typeof fields["_typeName"] !== "string") {
            throw new errors_1.TypeNameError("Error - Serializable.deserialize: _typeName must be a string, found: " +
                typeof fields["_typeName"]);
        }
        if (fields["_typeName"] !== this._typeName) {
            throw new errors_1.TypeNameError("Error - Serializable.deserialize: _typeName mismatch -- expected: " +
                this._typeName +
                " -- received: " +
                fields["_typeName"]);
        }
        if (typeof fields["_typeID"] !== "undefined" &&
            fields["_typeID"] !== null) {
            if (typeof fields["_typeID"] !== "number") {
                throw new errors_1.TypeIdError("Error - Serializable.deserialize: _typeID must be a number, found: " +
                    typeof fields["_typeID"]);
            }
            if (fields["_typeID"] !== this._typeID) {
                throw new errors_1.TypeIdError("Error - Serializable.deserialize: _typeID mismatch -- expected: " +
                    this._typeID +
                    " -- received: " +
                    fields["_typeID"]);
            }
        }
        if (typeof fields["_codecID"] !== "undefined" &&
            fields["_codecID"] !== null) {
            if (typeof fields["_codecID"] !== "number") {
                throw new errors_1.CodecIdError("Error - Serializable.deserialize: _codecID must be a number, found: " +
                    typeof fields["_codecID"]);
            }
            if (fields["_codecID"] !== this._codecID) {
                throw new errors_1.CodecIdError("Error - Serializable.deserialize: _codecID mismatch -- expected: " +
                    this._codecID +
                    " -- received: " +
                    fields["_codecID"]);
            }
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var Serialization = /** @class */ (function () {
    function Serialization() {
        this.bintools = bintools_1.default.getInstance();
    }
    /**
     * Retrieves the Serialization singleton.
     */
    Serialization.getInstance = function () {
        if (!Serialization.instance) {
            Serialization.instance = new Serialization();
        }
        return Serialization.instance;
    };
    /**
     * Convert {@link https://github.com/feross/buffer|Buffer} to [[SerializedType]]
     *
     * @param vb {@link https://github.com/feross/buffer|Buffer}
     * @param type [[SerializedType]]
     * @param ...args remaining arguments
     * @returns type of [[SerializedType]]
     */
    Serialization.prototype.bufferToType = function (vb, type) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (type === "BN") {
            return new bn_js_1.default(vb.toString("hex"), "hex");
        }
        else if (type === "Buffer") {
            if (args.length == 1 && typeof args[0] === "number") {
                vb = buffer_1.Buffer.from(vb.toString("hex").padStart(args[0] * 2, "0"), "hex");
            }
            return vb;
        }
        else if (type === "bech32") {
            return this.bintools.addressToString(args[0], args[1], vb);
        }
        else if (type === "nodeID") {
            return (0, helperfunctions_1.bufferToNodeIDString)(vb);
        }
        else if (type === "privateKey") {
            return (0, helperfunctions_1.bufferToPrivateKeyString)(vb);
        }
        else if (type === "cb58") {
            return this.bintools.cb58Encode(vb);
        }
        else if (type === "base58") {
            return this.bintools.bufferToB58(vb);
        }
        else if (type === "base64") {
            return vb.toString("base64");
        }
        else if (type === "hex") {
            return vb.toString("hex");
        }
        else if (type === "decimalString") {
            return new bn_js_1.default(vb.toString("hex"), "hex").toString(10);
        }
        else if (type === "number") {
            return new bn_js_1.default(vb.toString("hex"), "hex").toNumber();
        }
        else if (type === "utf8") {
            return vb.toString("utf8");
        }
        return undefined;
    };
    /**
     * Convert [[SerializedType]] to {@link https://github.com/feross/buffer|Buffer}
     *
     * @param v type of [[SerializedType]]
     * @param type [[SerializedType]]
     * @param ...args remaining arguments
     * @returns {@link https://github.com/feross/buffer|Buffer}
     */
    Serialization.prototype.typeToBuffer = function (v, type) {
        var _a;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (type === "BN") {
            var str = v.toString("hex");
            if (args.length == 1 && typeof args[0] === "number") {
                return buffer_1.Buffer.from(str.padStart(args[0] * 2, "0"), "hex");
            }
            return buffer_1.Buffer.from(str, "hex");
        }
        else if (type === "Buffer") {
            return v;
        }
        else if (type === "bech32") {
            return (_a = this.bintools).stringToAddress.apply(_a, __spreadArray([v], args, false));
        }
        else if (type === "nodeID") {
            return (0, helperfunctions_1.NodeIDStringToBuffer)(v);
        }
        else if (type === "privateKey") {
            return (0, helperfunctions_1.privateKeyStringToBuffer)(v);
        }
        else if (type === "cb58") {
            return this.bintools.cb58Decode(v);
        }
        else if (type === "base58") {
            return this.bintools.b58ToBuffer(v);
        }
        else if (type === "base64") {
            return buffer_1.Buffer.from(v, "base64");
        }
        else if (type === "hex") {
            if (v.startsWith("0x")) {
                v = v.slice(2);
            }
            return buffer_1.Buffer.from(v, "hex");
        }
        else if (type === "decimalString") {
            var str = new bn_js_1.default(v, 10).toString("hex");
            if (args.length == 1 && typeof args[0] === "number") {
                return buffer_1.Buffer.from(str.padStart(args[0] * 2, "0"), "hex");
            }
            return buffer_1.Buffer.from(str, "hex");
        }
        else if (type === "number") {
            var str = new bn_js_1.default(v, 10).toString("hex");
            if (args.length == 1 && typeof args[0] === "number") {
                return buffer_1.Buffer.from(str.padStart(args[0] * 2, "0"), "hex");
            }
            return buffer_1.Buffer.from(str, "hex");
        }
        else if (type === "utf8") {
            if (args.length == 1 && typeof args[0] === "number") {
                var b = buffer_1.Buffer.alloc(args[0]);
                b.write(v);
                return b;
            }
            return buffer_1.Buffer.from(v, "utf8");
        }
        return undefined;
    };
    /**
     * Convert value to type of [[SerializedType]] or [[SerializedEncoding]]
     *
     * @param value
     * @param encoding [[SerializedEncoding]]
     * @param intype [[SerializedType]]
     * @param outtype [[SerializedType]]
     * @param ...args remaining arguments
     * @returns type of [[SerializedType]] or [[SerializedEncoding]]
     */
    Serialization.prototype.encoder = function (value, encoding, intype, outtype) {
        var args = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            args[_i - 4] = arguments[_i];
        }
        if (typeof value === "undefined") {
            throw new errors_1.UnknownTypeError("Error - Serializable.encoder: value passed is undefined");
        }
        if (encoding !== "display") {
            outtype = encoding;
        }
        var vb = this.typeToBuffer.apply(this, __spreadArray([value, intype], args, false));
        return this.bufferToType.apply(this, __spreadArray([vb, outtype], args, false));
    };
    /**
     * Convert value to type of [[SerializedType]] or [[SerializedEncoding]]
     *
     * @param value
     * @param encoding [[SerializedEncoding]]
     * @param intype [[SerializedType]]
     * @param outtype [[SerializedType]]
     * @param ...args remaining arguments
     * @returns type of [[SerializedType]] or [[SerializedEncoding]]
     */
    Serialization.prototype.decoder = function (value, encoding, intype, outtype) {
        var args = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            args[_i - 4] = arguments[_i];
        }
        if (typeof value === "undefined") {
            throw new errors_1.UnknownTypeError("Error - Serializable.decoder: value passed is undefined");
        }
        if (encoding !== "display") {
            intype = encoding;
        }
        var vb = this.typeToBuffer.apply(this, __spreadArray([value, intype], args, false));
        return this.bufferToType.apply(this, __spreadArray([vb, outtype], args, false));
    };
    Serialization.prototype.serialize = function (serialize, vm, encoding, notes) {
        if (encoding === void 0) { encoding = "display"; }
        if (notes === void 0) { notes = undefined; }
        if (typeof notes === "undefined") {
            notes = serialize.getTypeName();
        }
        return {
            vm: vm,
            encoding: encoding,
            version: exports.SERIALIZATIONVERSION,
            notes: notes,
            fields: serialize.serialize(encoding)
        };
    };
    Serialization.prototype.deserialize = function (input, output) {
        output.deserialize(input.fields, input.encoding);
    };
    return Serialization;
}());
exports.Serialization = Serialization;
