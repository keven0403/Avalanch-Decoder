"use strict";
/**
 * @packageDocumentation
 * @module Common-KeyChain
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardKeyChain = exports.StandardKeyPair = void 0;
var buffer_1 = require("buffer/");
/**
 * Class for representing a private and public keypair in Avalanche.
 * All APIs that need key pairs should extend on this class.
 */
var StandardKeyPair = /** @class */ (function () {
    function StandardKeyPair() {
    }
    /**
     * Returns a reference to the private key.
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the private key
     */
    StandardKeyPair.prototype.getPrivateKey = function () {
        return this.privk;
    };
    /**
     * Returns a reference to the public key.
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the public key
     */
    StandardKeyPair.prototype.getPublicKey = function () {
        return this.pubk;
    };
    return StandardKeyPair;
}());
exports.StandardKeyPair = StandardKeyPair;
/**
 * Class for representing a key chain in Avalanche.
 * All endpoints that need key chains should extend on this class.
 *
 * @typeparam KPClass extending [[StandardKeyPair]] which is used as the key in [[StandardKeyChain]]
 */
var StandardKeyChain = /** @class */ (function () {
    function StandardKeyChain() {
        var _this = this;
        this.keys = {};
        /**
         * Gets an array of addresses stored in the [[StandardKeyChain]].
         *
         * @returns An array of {@link https://github.com/feross/buffer|Buffer}  representations
         * of the addresses
         */
        this.getAddresses = function () {
            return Object.values(_this.keys).map(function (kp) { return kp.getAddress(); });
        };
        /**
         * Gets an array of addresses stored in the [[StandardKeyChain]].
         *
         * @returns An array of string representations of the addresses
         */
        this.getAddressStrings = function () {
            return Object.values(_this.keys).map(function (kp) { return kp.getAddressString(); });
        };
        /**
         * Removes the key pair from the list of they keys managed in the [[StandardKeyChain]].
         *
         * @param key A {@link https://github.com/feross/buffer|Buffer} for the address or
         * KPClass to remove
         *
         * @returns The boolean true if a key was removed.
         */
        this.removeKey = function (key) {
            var kaddr;
            if (key instanceof buffer_1.Buffer) {
                kaddr = key.toString("hex");
            }
            else {
                kaddr = key.getAddress().toString("hex");
            }
            if (kaddr in _this.keys) {
                delete _this.keys["".concat(kaddr)];
                return true;
            }
            return false;
        };
        /**
         * Checks if there is a key associated with the provided address.
         *
         * @param address The address to check for existence in the keys database
         *
         * @returns True on success, false if not found
         */
        this.hasKey = function (address) { return address.toString("hex") in _this.keys; };
        /**
         * Returns the [[StandardKeyPair]] listed under the provided address
         *
         * @param address The {@link https://github.com/feross/buffer|Buffer} of the address to
         * retrieve from the keys database
         *
         * @returns A reference to the [[StandardKeyPair]] in the keys database
         */
        this.getKey = function (address) { return _this.keys[address.toString("hex")]; };
    }
    /**
     * Adds the key pair to the list of the keys managed in the [[StandardKeyChain]].
     *
     * @param newKey A key pair of the appropriate class to be added to the [[StandardKeyChain]]
     */
    StandardKeyChain.prototype.addKey = function (newKey) {
        this.keys[newKey.getAddress().toString("hex")] = newKey;
    };
    return StandardKeyChain;
}());
exports.StandardKeyChain = StandardKeyChain;
