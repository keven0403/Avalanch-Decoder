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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyChain = exports.KeyPair = void 0;
var bintools_1 = require("../../utils/bintools");
var secp256k1_1 = require("../../common/secp256k1");
var utils_1 = require("../../utils");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = utils_1.Serialization.getInstance();
/**
 * Class for representing a private and public keypair on an AVM Chain.
 */
var KeyPair = /** @class */ (function (_super) {
    __extends(KeyPair, _super);
    function KeyPair() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyPair.prototype.clone = function () {
        var newkp = new KeyPair(this.hrp, this.chainID);
        newkp.importKey(bintools.copyFrom(this.getPrivateKey()));
        return newkp;
    };
    KeyPair.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length == 2) {
            return new KeyPair(args[0], args[1]);
        }
        return new KeyPair(this.hrp, this.chainID);
    };
    return KeyPair;
}(secp256k1_1.SECP256k1KeyPair));
exports.KeyPair = KeyPair;
/**
 * Class for representing a key chain in Avalanche.
 *
 * @typeparam KeyPair Class extending [[SECP256k1KeyChain]] which is used as the key in [[KeyChain]]
 */
var KeyChain = /** @class */ (function (_super) {
    __extends(KeyChain, _super);
    /**
     * Returns instance of KeyChain.
     */
    function KeyChain(hrp, chainid) {
        var _this = _super.call(this) || this;
        _this.hrp = "";
        _this.chainid = "";
        /**
         * Makes a new key pair, returns the address.
         *
         * @returns The new key pair
         */
        _this.makeKey = function () {
            var keypair = new KeyPair(_this.hrp, _this.chainid);
            _this.addKey(keypair);
            return keypair;
        };
        _this.addKey = function (newKey) {
            newKey.setChainID(_this.chainid);
            _super.prototype.addKey.call(_this, newKey);
        };
        /**
         * Given a private key, makes a new key pair, returns the address.
         *
         * @param privk A {@link https://github.com/feross/buffer|Buffer} or cb58 serialized string representing the private key
         *
         * @returns The new key pair
         */
        _this.importKey = function (privk) {
            var keypair = new KeyPair(_this.hrp, _this.chainid);
            var pk;
            if (typeof privk === "string") {
                pk = bintools.cb58Decode(privk.split("-")[1]);
            }
            else {
                pk = bintools.copyFrom(privk);
            }
            keypair.importKey(pk);
            if (!(keypair.getAddress().toString("hex") in _this.keys)) {
                _this.addKey(keypair);
            }
            return keypair;
        };
        _this.hrp = hrp;
        _this.chainid = chainid;
        return _this;
    }
    KeyChain.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length == 2) {
            return new KeyChain(args[0], args[1]);
        }
        return new KeyChain(this.hrp, this.chainid);
    };
    KeyChain.prototype.clone = function () {
        var newkc = new KeyChain(this.hrp, this.chainid);
        for (var k in this.keys) {
            newkc.addKey(this.keys["".concat(k)].clone());
        }
        return newkc;
    };
    KeyChain.prototype.union = function (kc) {
        var newkc = kc.clone();
        for (var k in this.keys) {
            newkc.addKey(this.keys["".concat(k)].clone());
        }
        return newkc;
    };
    return KeyChain;
}(secp256k1_1.SECP256k1KeyChain));
exports.KeyChain = KeyChain;
