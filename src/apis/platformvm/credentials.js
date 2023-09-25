"use strict";
/**
 * @packageDocumentation
 * @module API-PlatformVM-Credentials
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
exports.SECPCredential = exports.SelectCredentialClass = void 0;
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
    if (credid === constants_1.PlatformVMConstants.SECPCREDENTIAL) {
        return new (SECPCredential.bind.apply(SECPCredential, __spreadArray([void 0], args, false)))();
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
        _this._typeID = constants_1.PlatformVMConstants.SECPCREDENTIAL;
        return _this;
    }
    //serialize and deserialize both are inherited
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
