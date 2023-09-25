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
exports.Tx = exports.UnsignedTx = exports.SelectTxClass = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-Transactions
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var constants_1 = require("./constants");
var credentials_1 = require("./credentials");
var tx_1 = require("../../common/tx");
var create_hash_1 = require("create-hash");
var basetx_1 = require("./basetx");
var createassettx_1 = require("./createassettx");
var operationtx_1 = require("./operationtx");
var importtx_1 = require("./importtx");
var exporttx_1 = require("./exporttx");
var errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
/**
 * Takes a buffer representing the output and returns the proper [[BaseTx]] instance.
 *
 * @param txtype The id of the transaction type
 *
 * @returns An instance of an [[BaseTx]]-extended class.
 */
var SelectTxClass = function (txtype) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (txtype === constants_1.AVMConstants.BASETX) {
        return new (basetx_1.BaseTx.bind.apply(basetx_1.BaseTx, __spreadArray([void 0], args, false)))();
    }
    else if (txtype === constants_1.AVMConstants.CREATEASSETTX) {
        return new (createassettx_1.CreateAssetTx.bind.apply(createassettx_1.CreateAssetTx, __spreadArray([void 0], args, false)))();
    }
    else if (txtype === constants_1.AVMConstants.OPERATIONTX) {
        return new (operationtx_1.OperationTx.bind.apply(operationtx_1.OperationTx, __spreadArray([void 0], args, false)))();
    }
    else if (txtype === constants_1.AVMConstants.IMPORTTX) {
        return new (importtx_1.ImportTx.bind.apply(importtx_1.ImportTx, __spreadArray([void 0], args, false)))();
    }
    else if (txtype === constants_1.AVMConstants.EXPORTTX) {
        return new (exporttx_1.ExportTx.bind.apply(exporttx_1.ExportTx, __spreadArray([void 0], args, false)))();
    }
    /* istanbul ignore next */
    throw new errors_1.TransactionError("Error - SelectTxClass: unknown txtype");
};
exports.SelectTxClass = SelectTxClass;
var UnsignedTx = /** @class */ (function (_super) {
    __extends(UnsignedTx, _super);
    function UnsignedTx() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "UnsignedTx";
        _this._typeID = undefined;
        return _this;
    }
    //serialize is inherited
    UnsignedTx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.transaction = (0, exports.SelectTxClass)(fields["transaction"]["_typeID"]);
        this.transaction.deserialize(fields["transaction"], encoding);
    };
    UnsignedTx.prototype.getTransaction = function () {
        return this.transaction;
    };
    UnsignedTx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.codecID = bintools.copyFrom(bytes, offset, offset + 2).readUInt16BE(0);
        offset += 2;
        var txtype = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.transaction = (0, exports.SelectTxClass)(txtype);
        return this.transaction.fromBuffer(bytes, offset);
    };
    /**
     * Signs this [[UnsignedTx]] and returns signed [[StandardTx]]
     *
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns A signed [[StandardTx]]
     */
    UnsignedTx.prototype.sign = function (kc) {
        var txbuff = this.toBuffer();
        var msg = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update(txbuff).digest());
        var creds = this.transaction.sign(msg, kc);
        return new Tx(this, creds);
    };
    return UnsignedTx;
}(tx_1.StandardUnsignedTx));
exports.UnsignedTx = UnsignedTx;
var Tx = /** @class */ (function (_super) {
    __extends(Tx, _super);
    function Tx() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "Tx";
        _this._typeID = undefined;
        return _this;
    }
    //serialize is inherited
    Tx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.unsignedTx = new UnsignedTx();
        this.unsignedTx.deserialize(fields["unsignedTx"], encoding);
        this.credentials = [];
        for (var i = 0; i < fields["credentials"].length; i++) {
            var cred = (0, credentials_1.SelectCredentialClass)(fields["credentials"]["".concat(i)]["_typeID"]);
            cred.deserialize(fields["credentials"]["".concat(i)], encoding);
            this.credentials.push(cred);
        }
    };
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[Tx]], parses it, populates the class, and returns the length of the Tx in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[Tx]]
     * @param offset A number representing the starting point of the bytes to begin parsing
     *
     * @returns The length of the raw [[Tx]]
     */
    Tx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.unsignedTx = new UnsignedTx();
        offset = this.unsignedTx.fromBuffer(bytes, offset);
        var numcreds = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.credentials = [];
        for (var i = 0; i < numcreds; i++) {
            var credid = bintools
                .copyFrom(bytes, offset, offset + 4)
                .readUInt32BE(0);
            offset += 4;
            var cred = (0, credentials_1.SelectCredentialClass)(credid);
            offset = cred.fromBuffer(bytes, offset);
            this.credentials.push(cred);
        }
        return offset;
    };
    return Tx;
}(tx_1.StandardTx));
exports.Tx = Tx;
