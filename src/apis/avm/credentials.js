"use strict";
/**
 * @packageDocumentation
 * @module API-AVM-Credentials
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
exports.NFTCredential = exports.SECPCredential = exports.SelectCredentialClass = void 0;
var constants_1 = require("./constants");
var credentials_1 = require("../../common/credentials");
var errors_1 = require("../../utils/errors");
/**
 * Takes a buffer representing the credential and returns the proper [[Credential]] instance.
 *
 * @param credid A number representing the credential ID parsed prior to the bytes passed in
 *
 * @returns An instance of an [[Credential]]-extended class.
 */
var SelectCredentialClass = function (credid) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (credid === constants_1.AVMConstants.SECPCREDENTIAL ||
        credid === constants_1.AVMConstants.SECPCREDENTIAL_CODECONE) {
        return new (SECPCredential.bind.apply(SECPCredential, __spreadArray([void 0], args, false)))();
    }
    if (credid === constants_1.AVMConstants.NFTCREDENTIAL ||
        credid === constants_1.AVMConstants.NFTCREDENTIAL_CODECONE) {
        return new (NFTCredential.bind.apply(NFTCredential, __spreadArray([void 0], args, false)))();
    }
    /* istanbul ignore next */
    throw new errors_1.CredIdError("Error - SelectCredentialClass: unknown credid");
};
exports.SelectCredentialClass = SelectCredentialClass;
var SECPCredential = /** @class */ (function (_super) {
    __extends(SECPCredential, _super);
    function SECPCredential() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "SECPCredential";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.SECPCREDENTIAL
            : constants_1.AVMConstants.SECPCREDENTIAL_CODECONE;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    SECPCredential.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - SECPCredential.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.SECPCREDENTIAL
                : constants_1.AVMConstants.SECPCREDENTIAL_CODECONE;
    };
    SECPCredential.prototype.getCredentialID = function () {
        return this._typeID;
    };
    SECPCredential.prototype.clone = function () {
        var newbase = new SECPCredential();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    SECPCredential.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (SECPCredential.bind.apply(SECPCredential, __spreadArray([void 0], args, false)))();
    };
    SECPCredential.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var newbasetx = exports.SelectCredentialClass.apply(void 0, __spreadArray([id], args, false));
        return newbasetx;
    };
    return SECPCredential;
}(credentials_1.Credential));
exports.SECPCredential = SECPCredential;
var NFTCredential = /** @class */ (function (_super) {
    __extends(NFTCredential, _super);
    function NFTCredential() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "NFTCredential";
        _this._codecID = constants_1.AVMConstants.LATESTCODEC;
        _this._typeID = _this._codecID === 0
            ? constants_1.AVMConstants.NFTCREDENTIAL
            : constants_1.AVMConstants.NFTCREDENTIAL_CODECONE;
        return _this;
    }
    //serialize and deserialize both are inherited
    /**
     * Set the codecID
     *
     * @param codecID The codecID to set
     */
    NFTCredential.prototype.setCodecID = function (codecID) {
        if (codecID !== 0 && codecID !== 1) {
            /* istanbul ignore next */
            throw new errors_1.CodecIdError("Error - NFTCredential.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        }
        this._codecID = codecID;
        this._typeID =
            this._codecID === 0
                ? constants_1.AVMConstants.NFTCREDENTIAL
                : constants_1.AVMConstants.NFTCREDENTIAL_CODECONE;
    };
    NFTCredential.prototype.getCredentialID = function () {
        return this._typeID;
    };
    NFTCredential.prototype.clone = function () {
        var newbase = new NFTCredential();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    };
    NFTCredential.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (NFTCredential.bind.apply(NFTCredential, __spreadArray([void 0], args, false)))();
    };
    NFTCredential.prototype.select = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var newbasetx = exports.SelectCredentialClass.apply(void 0, __spreadArray([id], args, false));
        return newbasetx;
    };
    return NFTCredential;
}(credentials_1.Credential));
exports.NFTCredential = NFTCredential;
