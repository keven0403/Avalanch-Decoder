"use strict";
/**
 * @packageDocumentation
 * @module API-AVM-InitialStates
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
exports.InitialStates = void 0;
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var output_1 = require("../../common/output");
var outputs_1 = require("./outputs");
var constants_1 = require("./constants");
var serialization_1 = require("../../utils/serialization");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
/**
 * Class for creating initial output states used in asset creation
 */
var InitialStates = /** @class */ (function (_super) {
    __extends(InitialStates, _super);
    function InitialStates() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "InitialStates";
        _this._typeID = undefined;
        _this.fxs = {};
        return _this;
    }
    InitialStates.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        var flatfxs = {};
        for (var fxid in this.fxs) {
            flatfxs["".concat(fxid)] = this.fxs["".concat(fxid)].map(function (o) {
                return o.serialize(encoding);
            });
        }
        return __assign(__assign({}, fields), { fxs: flatfxs });
    };
    InitialStates.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        var unflat = {};
        for (var fxid in fields["fxs"]) {
            unflat["".concat(fxid)] = fields["fxs"]["".concat(fxid)].map(function (o) {
                var out = (0, outputs_1.SelectOutputClass)(o["_typeID"]);
                out.deserialize(o, encoding);
                return out;
            });
        }
        this.fxs = unflat;
    };
    /**
     *
     * @param out The output state to add to the collection
     * @param fxid The FxID that will be used for this output, default AVMConstants.SECPFXID
     */
    InitialStates.prototype.addOutput = function (out, fxid) {
        if (fxid === void 0) { fxid = constants_1.AVMConstants.SECPFXID; }
        if (!(fxid in this.fxs)) {
            this.fxs["".concat(fxid)] = [];
        }
        this.fxs["".concat(fxid)].push(out);
    };
    InitialStates.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        var result = [];
        var klen = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        var klennum = klen.readUInt32BE(0);
        for (var i = 0; i < klennum; i++) {
            var fxidbuff = bintools.copyFrom(bytes, offset, offset + 4);
            offset += 4;
            var fxid = fxidbuff.readUInt32BE(0);
            result["".concat(fxid)] = [];
            var statelenbuff = bintools.copyFrom(bytes, offset, offset + 4);
            offset += 4;
            var statelen = statelenbuff.readUInt32BE(0);
            for (var j = 0; j < statelen; j++) {
                var outputid = bintools
                    .copyFrom(bytes, offset, offset + 4)
                    .readUInt32BE(0);
                offset += 4;
                var out = (0, outputs_1.SelectOutputClass)(outputid);
                offset = out.fromBuffer(bytes, offset);
                result["".concat(fxid)].push(out);
            }
        }
        this.fxs = result;
        return offset;
    };
    InitialStates.prototype.toBuffer = function () {
        var buff = [];
        var keys = Object.keys(this.fxs)
            .map(function (k) { return parseInt(k, 10); })
            .sort();
        var klen = buffer_1.Buffer.alloc(4);
        klen.writeUInt32BE(keys.length, 0);
        buff.push(klen);
        for (var i = 0; i < keys.length; i++) {
            var fxid = keys["".concat(i)];
            var fxidbuff = buffer_1.Buffer.alloc(4);
            fxidbuff.writeUInt32BE(fxid, 0);
            buff.push(fxidbuff);
            var initialState = this.fxs["".concat(fxid)].sort(output_1.Output.comparator());
            var statelen = buffer_1.Buffer.alloc(4);
            statelen.writeUInt32BE(initialState.length, 0);
            buff.push(statelen);
            for (var j = 0; j < initialState.length; j++) {
                var outputid = buffer_1.Buffer.alloc(4);
                outputid.writeInt32BE(initialState["".concat(j)].getOutputID(), 0);
                buff.push(outputid);
                buff.push(initialState["".concat(j)].toBuffer());
            }
        }
        return buffer_1.Buffer.concat(buff);
    };
    return InitialStates;
}(serialization_1.Serializable));
exports.InitialStates = InitialStates;
