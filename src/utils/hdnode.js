"use strict";
/**
 * @packageDocumentation
 * @module Utils-HDNode
 */
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer/");
var hdkey_1 = require("hdkey");
var bintools_1 = require("./bintools");
var bintools = bintools_1.default.getInstance();
/**
 * BIP32 hierarchical deterministic keys.
 */
var HDNode = /** @class */ (function () {
    /**
     * Creates an HDNode from a master seed or an extended public/private key
     * @param from seed or key to create HDNode from
     */
    function HDNode(from) {
        if (typeof from === "string" && from.substring(0, 2) === "xp") {
            this.hdkey = hdkey_1.default.fromExtendedKey(from);
        }
        else if (buffer_1.Buffer.isBuffer(from)) {
            this.hdkey = hdkey_1.default.fromMasterSeed(from);
        }
        else {
            this.hdkey = hdkey_1.default.fromMasterSeed(buffer_1.Buffer.from(from));
        }
        this.publicKey = this.hdkey.publicKey;
        this.privateKey = this.hdkey.privateKey;
        if (this.privateKey) {
            this.privateKeyCB58 = "PrivateKey-".concat(bintools.cb58Encode(this.privateKey));
        }
        else {
            this.privateExtendedKey = null;
        }
        this.chainCode = this.hdkey.chainCode;
        this.privateExtendedKey = this.hdkey.privateExtendedKey;
        this.publicExtendedKey = this.hdkey.publicExtendedKey;
    }
    /**
     * Derives the HDNode at path from the current HDNode.
     * @param path
     * @returns derived child HDNode
     */
    HDNode.prototype.derive = function (path) {
        var hdKey = this.hdkey.derive(path);
        var hdNode;
        if (hdKey.privateExtendedKey != null) {
            hdNode = new HDNode(hdKey.privateExtendedKey);
        }
        else {
            hdNode = new HDNode(hdKey.publicExtendedKey);
        }
        return hdNode;
    };
    /**
     * Signs the buffer hash with the private key using secp256k1 and returns the signature as a buffer.
     * @param hash
     * @returns signature as a Buffer
     */
    HDNode.prototype.sign = function (hash) {
        var sig = this.hdkey.sign(hash);
        return buffer_1.Buffer.from(sig);
    };
    /**
     * Verifies that the signature is valid for hash and the HDNode's public key using secp256k1.
     * @param hash
     * @param signature
     * @returns true for valid, false for invalid.
     * @throws if the hash or signature is the wrong length.
     */
    HDNode.prototype.verify = function (hash, signature) {
        return this.hdkey.verify(hash, signature);
    };
    /**
     * Wipes all record of the private key from the HDNode instance.
     * After calling this method, the instance will behave as if it was created via an xpub.
     */
    HDNode.prototype.wipePrivateData = function () {
        this.privateKey = null;
        this.privateExtendedKey = null;
        this.privateKeyCB58 = null;
        this.hdkey.wipePrivateData();
    };
    return HDNode;
}());
exports.default = HDNode;
