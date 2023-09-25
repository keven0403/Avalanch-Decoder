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
exports.SECP256k1KeyChain = exports.SECP256k1KeyPair = void 0;
/**
 * @packageDocumentation
 * @module Common-SECP256k1KeyChain
 */
var buffer_1 = require("buffer/");
var elliptic = require("elliptic");
var create_hash_1 = require("create-hash");
var bintools_1 = require("../utils/bintools");
var keychain_1 = require("./keychain");
var errors_1 = require("../utils/errors");
var utils_1 = require("../utils");
/**
 * @ignore
 */
var EC = elliptic.ec;
/**
 * @ignore
 */
var ec = new EC("secp256k1");
/**
 * @ignore
 */
var ecparams = ec.curve;
/**
 * @ignore
 */
var BN = ecparams.n.constructor;
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = utils_1.Serialization.getInstance();
/**
 * Class for representing a private and public keypair on the Platform Chain.
 */
var SECP256k1KeyPair = /** @class */ (function (_super) {
    __extends(SECP256k1KeyPair, _super);
    function SECP256k1KeyPair(hrp, chainID) {
        var _this = _super.call(this) || this;
        _this.chainID = "";
        _this.hrp = "";
        _this.chainID = chainID;
        _this.hrp = hrp;
        _this.generateKey();
        return _this;
    }
    /**
     * @ignore
     */
    SECP256k1KeyPair.prototype._sigFromSigBuffer = function (sig) {
        var r = new BN(bintools.copyFrom(sig, 0, 32));
        var s = new BN(bintools.copyFrom(sig, 32, 64));
        var recoveryParam = bintools
            .copyFrom(sig, 64, 65)
            .readUIntBE(0, 1);
        var sigOpt = {
            r: r,
            s: s,
            recoveryParam: recoveryParam
        };
        return sigOpt;
    };
    /**
     * Generates a new keypair.
     */
    SECP256k1KeyPair.prototype.generateKey = function () {
        this.keypair = ec.genKeyPair();
        // doing hex translation to get Buffer class
        this.privk = buffer_1.Buffer.from(this.keypair.getPrivate("hex").padStart(64, "0"), "hex");
        this.pubk = buffer_1.Buffer.from(this.keypair.getPublic(true, "hex").padStart(66, "0"), "hex");
    };
    /**
     * Imports a private key and generates the appropriate public key.
     *
     * @param privk A {@link https://github.com/feross/buffer|Buffer} representing the private key
     *
     * @returns true on success, false on failure
     */
    SECP256k1KeyPair.prototype.importKey = function (privk) {
        this.keypair = ec.keyFromPrivate(privk.toString("hex"), "hex");
        // doing hex translation to get Buffer class
        try {
            this.privk = buffer_1.Buffer.from(this.keypair.getPrivate("hex").padStart(64, "0"), "hex");
            this.pubk = buffer_1.Buffer.from(this.keypair.getPublic(true, "hex").padStart(66, "0"), "hex");
            return true; // silly I know, but the interface requires so it returns true on success, so if Buffer fails validation...
        }
        catch (error) {
            return false;
        }
    };
    /**
     * Returns the address as a {@link https://github.com/feross/buffer|Buffer}.
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} representation of the address
     */
    SECP256k1KeyPair.prototype.getAddress = function () {
        return SECP256k1KeyPair.addressFromPublicKey(this.pubk);
    };
    /**
     * Returns the address's string representation.
     *
     * @returns A string representation of the address
     */
    SECP256k1KeyPair.prototype.getAddressString = function () {
        var addr = SECP256k1KeyPair.addressFromPublicKey(this.pubk);
        var type = "bech32";
        return serialization.bufferToType(addr, type, this.hrp, this.chainID);
    };
    /**
     * Returns an address given a public key.
     *
     * @param pubk A {@link https://github.com/feross/buffer|Buffer} representing the public key
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} for the address of the public key.
     */
    SECP256k1KeyPair.addressFromPublicKey = function (pubk) {
        if (pubk.length === 65) {
            /* istanbul ignore next */
            pubk = buffer_1.Buffer.from(ec.keyFromPublic(pubk).getPublic(true, "hex").padStart(66, "0"), "hex"); // make compact, stick back into buffer
        }
        if (pubk.length === 33) {
            var sha256 = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update(pubk).digest());
            var ripesha = buffer_1.Buffer.from((0, create_hash_1.default)("ripemd160").update(sha256).digest());
            return ripesha;
        }
        /* istanbul ignore next */
        throw new errors_1.PublicKeyError("Unable to make address.");
    };
    /**
     * Returns a string representation of the private key.
     *
     * @returns A cb58 serialized string representation of the private key
     */
    SECP256k1KeyPair.prototype.getPrivateKeyString = function () {
        return "PrivateKey-".concat(bintools.cb58Encode(this.privk));
    };
    /**
     * Returns the public key.
     *
     * @returns A cb58 serialized string representation of the public key
     */
    SECP256k1KeyPair.prototype.getPublicKeyString = function () {
        return bintools.cb58Encode(this.pubk);
    };
    /**
     * Takes a message, signs it, and returns the signature.
     *
     * @param msg The message to sign, be sure to hash first if expected
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the signature
     */
    SECP256k1KeyPair.prototype.sign = function (msg) {
        var sigObj = this.keypair.sign(msg, undefined, {
            canonical: true
        });
        var recovery = buffer_1.Buffer.alloc(1);
        recovery.writeUInt8(sigObj.recoveryParam, 0);
        var r = buffer_1.Buffer.from(sigObj.r.toArray("be", 32)); //we have to skip native Buffer class, so this is the way
        var s = buffer_1.Buffer.from(sigObj.s.toArray("be", 32)); //we have to skip native Buffer class, so this is the way
        var result = buffer_1.Buffer.concat([r, s, recovery], 65);
        return result;
    };
    /**
     * Verifies that the private key associated with the provided public key produces the signature associated with the given message.
     *
     * @param msg The message associated with the signature
     * @param sig The signature of the signed message
     *
     * @returns True on success, false on failure
     */
    SECP256k1KeyPair.prototype.verify = function (msg, sig) {
        var sigObj = this._sigFromSigBuffer(sig);
        return ec.verify(msg, sigObj, this.keypair);
    };
    /**
     * Recovers the public key of a message signer from a message and its associated signature.
     *
     * @param msg The message that's signed
     * @param sig The signature that's signed on the message
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the public key of the signer
     */
    SECP256k1KeyPair.prototype.recover = function (msg, sig) {
        var sigObj = this._sigFromSigBuffer(sig);
        var pubk = ec.recoverPubKey(msg, sigObj, sigObj.recoveryParam);
        return buffer_1.Buffer.from(pubk.encodeCompressed());
    };
    /**
     * Returns the chainID associated with this key.
     *
     * @returns The [[KeyPair]]'s chainID
     */
    SECP256k1KeyPair.prototype.getChainID = function () {
        return this.chainID;
    };
    /**
     * Sets the the chainID associated with this key.
     *
     * @param chainID String for the chainID
     */
    SECP256k1KeyPair.prototype.setChainID = function (chainID) {
        this.chainID = chainID;
    };
    /**
     * Returns the Human-Readable-Part of the network associated with this key.
     *
     * @returns The [[KeyPair]]'s Human-Readable-Part of the network's Bech32 addressing scheme
     */
    SECP256k1KeyPair.prototype.getHRP = function () {
        return this.hrp;
    };
    /**
     * Sets the the Human-Readable-Part of the network associated with this key.
     *
     * @param hrp String for the Human-Readable-Part of Bech32 addresses
     */
    SECP256k1KeyPair.prototype.setHRP = function (hrp) {
        this.hrp = hrp;
    };
    return SECP256k1KeyPair;
}(keychain_1.StandardKeyPair));
exports.SECP256k1KeyPair = SECP256k1KeyPair;
/**
 * Class for representing a key chain in Avalanche.
 *
 * @typeparam SECP256k1KeyPair Class extending [[StandardKeyPair]] which is used as the key in [[SECP256k1KeyChain]]
 */
var SECP256k1KeyChain = /** @class */ (function (_super) {
    __extends(SECP256k1KeyChain, _super);
    function SECP256k1KeyChain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SECP256k1KeyChain.prototype.addKey = function (newKey) {
        _super.prototype.addKey.call(this, newKey);
    };
    return SECP256k1KeyChain;
}(keychain_1.StandardKeyChain));
exports.SECP256k1KeyChain = SECP256k1KeyChain;
