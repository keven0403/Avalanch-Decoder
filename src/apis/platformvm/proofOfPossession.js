"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofOfPossession = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-ProofOfPossession
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
// A BLS public key and a proof of possession of the key.
var ProofOfPossession = /** @class */ (function () {
    /**
     * Class representing a Proof of Possession
     *
     * @param publicKey {@link https://github.com/feross/buffer|Buffer} for the public key
     * @param signature {@link https://github.com/feross/buffer|Buffer} for the signature
     */
    function ProofOfPossession(publicKey, signature) {
        if (publicKey === void 0) { publicKey = undefined; }
        if (signature === void 0) { signature = undefined; }
        this._typeName = "ProofOfPossession";
        this._typeID = undefined;
        this.publicKey = buffer_1.Buffer.alloc(48);
        this.signature = buffer_1.Buffer.alloc(96);
        this.publicKey = publicKey;
        this.signature = signature;
    }
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the publicKey
     */
    ProofOfPossession.prototype.getPublicKey = function () {
        return this.publicKey;
    };
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the signature
     */
    ProofOfPossession.prototype.getSignature = function () {
        return this.signature;
    };
    /**
    * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[ProofOfPossession]], parses it, populates the class, and returns the length of the [[ProofOfPossession]] in bytes.
    *
    * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[ProofOfPossession]]
    *
    * @returns The length of the raw [[ProofOfPossession]]
    *
    * @remarks assume not-checksummed
    */
    ProofOfPossession.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.publicKey = bintools.copyFrom(bytes, offset, offset + 48);
        offset += 48;
        this.signature = bintools.copyFrom(bytes, offset, offset + 96);
        offset += 96;
        return offset;
    };
    /**
    * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ProofOfPossession]]
    */
    ProofOfPossession.prototype.toBuffer = function () {
        var bsize = this.publicKey.length + this.signature.length;
        var barr = [
            this.publicKey,
            this.signature
        ];
        return buffer_1.Buffer.concat(barr, bsize);
    };
    return ProofOfPossession;
}());
exports.ProofOfPossession = ProofOfPossession;
