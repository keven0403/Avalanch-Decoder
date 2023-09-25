"use strict";
/**
 * @packageDocumentation
 * @module Utils-Payload
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
exports.MAGNETPayload = exports.ONIONPayload = exports.IPFSPayload = exports.URLPayload = exports.EMAILPayload = exports.YAMLPayload = exports.JSONPayload = exports.CSVPayload = exports.SVGPayload = exports.ICOPayload = exports.BMPPayload = exports.PNGPayload = exports.JPEGPayload = exports.SECPENCPayload = exports.SECPSIGPayload = exports.NODEIDPayload = exports.CHAINIDPayload = exports.SUBNETIDPayload = exports.NFTIDPayload = exports.UTXOIDPayload = exports.ASSETIDPayload = exports.TXIDPayload = exports.cb58EncodedPayload = exports.CCHAINADDRPayload = exports.PCHAINADDRPayload = exports.XCHAINADDRPayload = exports.ChainAddressPayload = exports.BIGNUMPayload = exports.B64STRPayload = exports.B58STRPayload = exports.HEXSTRPayload = exports.UTF8Payload = exports.BINPayload = exports.PayloadBase = exports.PayloadTypes = void 0;
var buffer_1 = require("buffer/");
var bintools_1 = require("./bintools");
var bn_js_1 = require("bn.js");
var errors_1 = require("../utils/errors");
var serialization_1 = require("../utils/serialization");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Class for determining payload types and managing the lookup table.
 */
var PayloadTypes = /** @class */ (function () {
    function PayloadTypes() {
        this.types = [];
        this.types = [
            "BIN",
            "UTF8",
            "HEXSTR",
            "B58STR",
            "B64STR",
            "BIGNUM",
            "XCHAINADDR",
            "PCHAINADDR",
            "CCHAINADDR",
            "TXID",
            "ASSETID",
            "UTXOID",
            "NFTID",
            "SUBNETID",
            "CHAINID",
            "NODEID",
            "SECPSIG",
            "SECPENC",
            "JPEG",
            "PNG",
            "BMP",
            "ICO",
            "SVG",
            "CSV",
            "JSON",
            "YAML",
            "EMAIL",
            "URL",
            "IPFS",
            "ONION",
            "MAGNET"
        ];
    }
    /**
     * Given an encoded payload buffer returns the payload content (minus typeID).
     */
    PayloadTypes.prototype.getContent = function (payload) {
        var pl = bintools.copyFrom(payload, 5);
        return pl;
    };
    /**
     * Given an encoded payload buffer returns the payload (with typeID).
     */
    PayloadTypes.prototype.getPayload = function (payload) {
        var pl = bintools.copyFrom(payload, 4);
        return pl;
    };
    /**
     * Given a payload buffer returns the proper TypeID.
     */
    PayloadTypes.prototype.getTypeID = function (payload) {
        var offset = 4;
        var typeID = bintools
            .copyFrom(payload, offset, offset + 1)
            .readUInt8(0);
        return typeID;
    };
    /**
     * Given a type string returns the proper TypeID.
     */
    PayloadTypes.prototype.lookupID = function (typestr) {
        return this.types.indexOf(typestr);
    };
    /**
     * Given a TypeID returns a string describing the payload type.
     */
    PayloadTypes.prototype.lookupType = function (value) {
        return this.types["".concat(value)];
    };
    /**
     * Given a TypeID returns the proper [[PayloadBase]].
     */
    PayloadTypes.prototype.select = function (typeID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        switch (typeID) {
            case 0:
                return new (BINPayload.bind.apply(BINPayload, __spreadArray([void 0], args, false)))();
            case 1:
                return new (UTF8Payload.bind.apply(UTF8Payload, __spreadArray([void 0], args, false)))();
            case 2:
                return new (HEXSTRPayload.bind.apply(HEXSTRPayload, __spreadArray([void 0], args, false)))();
            case 3:
                return new (B58STRPayload.bind.apply(B58STRPayload, __spreadArray([void 0], args, false)))();
            case 4:
                return new (B64STRPayload.bind.apply(B64STRPayload, __spreadArray([void 0], args, false)))();
            case 5:
                return new (BIGNUMPayload.bind.apply(BIGNUMPayload, __spreadArray([void 0], args, false)))();
            case 6:
                return new (XCHAINADDRPayload.bind.apply(XCHAINADDRPayload, __spreadArray([void 0], args, false)))();
            case 7:
                return new (PCHAINADDRPayload.bind.apply(PCHAINADDRPayload, __spreadArray([void 0], args, false)))();
            case 8:
                return new (CCHAINADDRPayload.bind.apply(CCHAINADDRPayload, __spreadArray([void 0], args, false)))();
            case 9:
                return new (TXIDPayload.bind.apply(TXIDPayload, __spreadArray([void 0], args, false)))();
            case 10:
                return new (ASSETIDPayload.bind.apply(ASSETIDPayload, __spreadArray([void 0], args, false)))();
            case 11:
                return new (UTXOIDPayload.bind.apply(UTXOIDPayload, __spreadArray([void 0], args, false)))();
            case 12:
                return new (NFTIDPayload.bind.apply(NFTIDPayload, __spreadArray([void 0], args, false)))();
            case 13:
                return new (SUBNETIDPayload.bind.apply(SUBNETIDPayload, __spreadArray([void 0], args, false)))();
            case 14:
                return new (CHAINIDPayload.bind.apply(CHAINIDPayload, __spreadArray([void 0], args, false)))();
            case 15:
                return new (NODEIDPayload.bind.apply(NODEIDPayload, __spreadArray([void 0], args, false)))();
            case 16:
                return new (SECPSIGPayload.bind.apply(SECPSIGPayload, __spreadArray([void 0], args, false)))();
            case 17:
                return new (SECPENCPayload.bind.apply(SECPENCPayload, __spreadArray([void 0], args, false)))();
            case 18:
                return new (JPEGPayload.bind.apply(JPEGPayload, __spreadArray([void 0], args, false)))();
            case 19:
                return new (PNGPayload.bind.apply(PNGPayload, __spreadArray([void 0], args, false)))();
            case 20:
                return new (BMPPayload.bind.apply(BMPPayload, __spreadArray([void 0], args, false)))();
            case 21:
                return new (ICOPayload.bind.apply(ICOPayload, __spreadArray([void 0], args, false)))();
            case 22:
                return new (SVGPayload.bind.apply(SVGPayload, __spreadArray([void 0], args, false)))();
            case 23:
                return new (CSVPayload.bind.apply(CSVPayload, __spreadArray([void 0], args, false)))();
            case 24:
                return new (JSONPayload.bind.apply(JSONPayload, __spreadArray([void 0], args, false)))();
            case 25:
                return new (YAMLPayload.bind.apply(YAMLPayload, __spreadArray([void 0], args, false)))();
            case 26:
                return new (EMAILPayload.bind.apply(EMAILPayload, __spreadArray([void 0], args, false)))();
            case 27:
                return new (URLPayload.bind.apply(URLPayload, __spreadArray([void 0], args, false)))();
            case 28:
                return new (IPFSPayload.bind.apply(IPFSPayload, __spreadArray([void 0], args, false)))();
            case 29:
                return new (ONIONPayload.bind.apply(ONIONPayload, __spreadArray([void 0], args, false)))();
            case 30:
                return new (MAGNETPayload.bind.apply(MAGNETPayload, __spreadArray([void 0], args, false)))();
        }
        throw new errors_1.TypeIdError("Error - PayloadTypes.select: unknown typeid ".concat(typeID));
    };
    /**
     * Given a [[PayloadBase]] which may not be cast properly, returns a properly cast [[PayloadBase]].
     */
    PayloadTypes.prototype.recast = function (unknowPayload) {
        return this.select(unknowPayload.typeID(), unknowPayload.returnType());
    };
    /**
     * Returns the [[PayloadTypes]] singleton.
     */
    PayloadTypes.getInstance = function () {
        if (!PayloadTypes.instance) {
            PayloadTypes.instance = new PayloadTypes();
        }
        return PayloadTypes.instance;
    };
    return PayloadTypes;
}());
exports.PayloadTypes = PayloadTypes;
/**
 * Base class for payloads.
 */
var PayloadBase = /** @class */ (function () {
    function PayloadBase() {
        this.payload = buffer_1.Buffer.alloc(0);
        this.typeid = undefined;
    }
    /**
     * Returns the TypeID for the payload.
     */
    PayloadBase.prototype.typeID = function () {
        return this.typeid;
    };
    /**
     * Returns the string name for the payload's type.
     */
    PayloadBase.prototype.typeName = function () {
        return PayloadTypes.getInstance().lookupType(this.typeid);
    };
    /**
     * Returns the payload content (minus typeID).
     */
    PayloadBase.prototype.getContent = function () {
        var pl = bintools.copyFrom(this.payload);
        return pl;
    };
    /**
     * Returns the payload (with typeID).
     */
    PayloadBase.prototype.getPayload = function () {
        var typeID = buffer_1.Buffer.alloc(1);
        typeID.writeUInt8(this.typeid, 0);
        var pl = buffer_1.Buffer.concat([typeID, bintools.copyFrom(this.payload)]);
        return pl;
    };
    /**
     * Decodes the payload as a {@link https://github.com/feross/buffer|Buffer} including 4 bytes for the length and TypeID.
     */
    PayloadBase.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        var size = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.typeid = bintools.copyFrom(bytes, offset, offset + 1).readUInt8(0);
        offset += 1;
        this.payload = bintools.copyFrom(bytes, offset, offset + size - 1);
        offset += size - 1;
        return offset;
    };
    /**
     * Encodes the payload as a {@link https://github.com/feross/buffer|Buffer} including 4 bytes for the length and TypeID.
     */
    PayloadBase.prototype.toBuffer = function () {
        var sizebuff = buffer_1.Buffer.alloc(4);
        sizebuff.writeUInt32BE(this.payload.length + 1, 0);
        var typebuff = buffer_1.Buffer.alloc(1);
        typebuff.writeUInt8(this.typeid, 0);
        return buffer_1.Buffer.concat([sizebuff, typebuff, this.payload]);
    };
    return PayloadBase;
}());
exports.PayloadBase = PayloadBase;
/**
 * Class for payloads representing simple binary blobs.
 */
var BINPayload = /** @class */ (function (_super) {
    __extends(BINPayload, _super);
    /**
     * @param payload Buffer only
     */
    function BINPayload(payload) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        _this.typeid = 0;
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (typeof payload === "string") {
            _this.payload = bintools.b58ToBuffer(payload);
        }
        return _this;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the payload.
     */
    BINPayload.prototype.returnType = function () {
        return this.payload;
    };
    return BINPayload;
}(PayloadBase));
exports.BINPayload = BINPayload;
/**
 * Class for payloads representing UTF8 encoding.
 */
var UTF8Payload = /** @class */ (function (_super) {
    __extends(UTF8Payload, _super);
    /**
     * @param payload Buffer utf8 string
     */
    function UTF8Payload(payload) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        _this.typeid = 1;
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (typeof payload === "string") {
            _this.payload = buffer_1.Buffer.from(payload, "utf8");
        }
        return _this;
    }
    /**
     * Returns a string for the payload.
     */
    UTF8Payload.prototype.returnType = function () {
        return this.payload.toString("utf8");
    };
    return UTF8Payload;
}(PayloadBase));
exports.UTF8Payload = UTF8Payload;
/**
 * Class for payloads representing Hexadecimal encoding.
 */
var HEXSTRPayload = /** @class */ (function (_super) {
    __extends(HEXSTRPayload, _super);
    /**
     * @param payload Buffer or hex string
     */
    function HEXSTRPayload(payload) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        _this.typeid = 2;
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (typeof payload === "string") {
            if (payload.startsWith("0x") || !payload.match(/^[0-9A-Fa-f]+$/)) {
                throw new errors_1.HexError("HEXSTRPayload.constructor -- hex string may not start with 0x and must be in /^[0-9A-Fa-f]+$/: " +
                    payload);
            }
            _this.payload = buffer_1.Buffer.from(payload, "hex");
        }
        return _this;
    }
    /**
     * Returns a hex string for the payload.
     */
    HEXSTRPayload.prototype.returnType = function () {
        return this.payload.toString("hex");
    };
    return HEXSTRPayload;
}(PayloadBase));
exports.HEXSTRPayload = HEXSTRPayload;
/**
 * Class for payloads representing Base58 encoding.
 */
var B58STRPayload = /** @class */ (function (_super) {
    __extends(B58STRPayload, _super);
    /**
     * @param payload Buffer or cb58 encoded string
     */
    function B58STRPayload(payload) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        _this.typeid = 3;
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (typeof payload === "string") {
            _this.payload = bintools.b58ToBuffer(payload);
        }
        return _this;
    }
    /**
     * Returns a base58 string for the payload.
     */
    B58STRPayload.prototype.returnType = function () {
        return bintools.bufferToB58(this.payload);
    };
    return B58STRPayload;
}(PayloadBase));
exports.B58STRPayload = B58STRPayload;
/**
 * Class for payloads representing Base64 encoding.
 */
var B64STRPayload = /** @class */ (function (_super) {
    __extends(B64STRPayload, _super);
    /**
     * @param payload Buffer of base64 string
     */
    function B64STRPayload(payload) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        _this.typeid = 4;
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (typeof payload === "string") {
            _this.payload = buffer_1.Buffer.from(payload, "base64");
        }
        return _this;
    }
    /**
     * Returns a base64 string for the payload.
     */
    B64STRPayload.prototype.returnType = function () {
        return this.payload.toString("base64");
    };
    return B64STRPayload;
}(PayloadBase));
exports.B64STRPayload = B64STRPayload;
/**
 * Class for payloads representing Big Numbers.
 *
 * @param payload Accepts a Buffer, BN, or base64 string
 */
var BIGNUMPayload = /** @class */ (function (_super) {
    __extends(BIGNUMPayload, _super);
    /**
     * @param payload Buffer, BN, or base64 string
     */
    function BIGNUMPayload(payload) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        _this.typeid = 5;
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (payload instanceof bn_js_1.default) {
            _this.payload = bintools.fromBNToBuffer(payload);
        }
        else if (typeof payload === "string") {
            _this.payload = buffer_1.Buffer.from(payload, "hex");
        }
        return _this;
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the payload.
     */
    BIGNUMPayload.prototype.returnType = function () {
        return bintools.fromBufferToBN(this.payload);
    };
    return BIGNUMPayload;
}(PayloadBase));
exports.BIGNUMPayload = BIGNUMPayload;
/**
 * Class for payloads representing chain addresses.
 *
 */
var ChainAddressPayload = /** @class */ (function (_super) {
    __extends(ChainAddressPayload, _super);
    /**
     * @param payload Buffer or address string
     */
    function ChainAddressPayload(payload, hrp) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        _this.typeid = 6;
        _this.chainid = "";
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (typeof payload === "string") {
            if (hrp != undefined) {
                _this.payload = bintools.stringToAddress(payload, hrp);
            }
            else {
                _this.payload = bintools.stringToAddress(payload);
            }
        }
        return _this;
    }
    /**
     * Returns the chainid.
     */
    ChainAddressPayload.prototype.returnChainID = function () {
        return this.chainid;
    };
    /**
     * Returns an address string for the payload.
     */
    ChainAddressPayload.prototype.returnType = function (hrp) {
        var type = "bech32";
        return serialization.bufferToType(this.payload, type, hrp, this.chainid);
    };
    return ChainAddressPayload;
}(PayloadBase));
exports.ChainAddressPayload = ChainAddressPayload;
/**
 * Class for payloads representing X-Chin addresses.
 */
var XCHAINADDRPayload = /** @class */ (function (_super) {
    __extends(XCHAINADDRPayload, _super);
    function XCHAINADDRPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 6;
        _this.chainid = "X";
        return _this;
    }
    return XCHAINADDRPayload;
}(ChainAddressPayload));
exports.XCHAINADDRPayload = XCHAINADDRPayload;
/**
 * Class for payloads representing P-Chain addresses.
 */
var PCHAINADDRPayload = /** @class */ (function (_super) {
    __extends(PCHAINADDRPayload, _super);
    function PCHAINADDRPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 7;
        _this.chainid = "P";
        return _this;
    }
    return PCHAINADDRPayload;
}(ChainAddressPayload));
exports.PCHAINADDRPayload = PCHAINADDRPayload;
/**
 * Class for payloads representing C-Chain addresses.
 */
var CCHAINADDRPayload = /** @class */ (function (_super) {
    __extends(CCHAINADDRPayload, _super);
    function CCHAINADDRPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 8;
        _this.chainid = "C";
        return _this;
    }
    return CCHAINADDRPayload;
}(ChainAddressPayload));
exports.CCHAINADDRPayload = CCHAINADDRPayload;
/**
 * Class for payloads representing data serialized by bintools.cb58Encode().
 */
var cb58EncodedPayload = /** @class */ (function (_super) {
    __extends(cb58EncodedPayload, _super);
    /**
     * @param payload Buffer or cb58 encoded string
     */
    function cb58EncodedPayload(payload) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (typeof payload === "string") {
            _this.payload = bintools.cb58Decode(payload);
        }
        return _this;
    }
    /**
     * Returns a bintools.cb58Encoded string for the payload.
     */
    cb58EncodedPayload.prototype.returnType = function () {
        return bintools.cb58Encode(this.payload);
    };
    return cb58EncodedPayload;
}(PayloadBase));
exports.cb58EncodedPayload = cb58EncodedPayload;
/**
 * Class for payloads representing TxIDs.
 */
var TXIDPayload = /** @class */ (function (_super) {
    __extends(TXIDPayload, _super);
    function TXIDPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 9;
        return _this;
    }
    return TXIDPayload;
}(cb58EncodedPayload));
exports.TXIDPayload = TXIDPayload;
/**
 * Class for payloads representing AssetIDs.
 */
var ASSETIDPayload = /** @class */ (function (_super) {
    __extends(ASSETIDPayload, _super);
    function ASSETIDPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 10;
        return _this;
    }
    return ASSETIDPayload;
}(cb58EncodedPayload));
exports.ASSETIDPayload = ASSETIDPayload;
/**
 * Class for payloads representing NODEIDs.
 */
var UTXOIDPayload = /** @class */ (function (_super) {
    __extends(UTXOIDPayload, _super);
    function UTXOIDPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 11;
        return _this;
    }
    return UTXOIDPayload;
}(cb58EncodedPayload));
exports.UTXOIDPayload = UTXOIDPayload;
/**
 * Class for payloads representing NFTIDs (UTXOIDs in an NFT context).
 */
var NFTIDPayload = /** @class */ (function (_super) {
    __extends(NFTIDPayload, _super);
    function NFTIDPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 12;
        return _this;
    }
    return NFTIDPayload;
}(UTXOIDPayload));
exports.NFTIDPayload = NFTIDPayload;
/**
 * Class for payloads representing SubnetIDs.
 */
var SUBNETIDPayload = /** @class */ (function (_super) {
    __extends(SUBNETIDPayload, _super);
    function SUBNETIDPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 13;
        return _this;
    }
    return SUBNETIDPayload;
}(cb58EncodedPayload));
exports.SUBNETIDPayload = SUBNETIDPayload;
/**
 * Class for payloads representing ChainIDs.
 */
var CHAINIDPayload = /** @class */ (function (_super) {
    __extends(CHAINIDPayload, _super);
    function CHAINIDPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 14;
        return _this;
    }
    return CHAINIDPayload;
}(cb58EncodedPayload));
exports.CHAINIDPayload = CHAINIDPayload;
/**
 * Class for payloads representing NodeIDs.
 */
var NODEIDPayload = /** @class */ (function (_super) {
    __extends(NODEIDPayload, _super);
    function NODEIDPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 15;
        return _this;
    }
    return NODEIDPayload;
}(cb58EncodedPayload));
exports.NODEIDPayload = NODEIDPayload;
/**
 * Class for payloads representing secp256k1 signatures.
 * convention: secp256k1 signature (130 bytes)
 */
var SECPSIGPayload = /** @class */ (function (_super) {
    __extends(SECPSIGPayload, _super);
    function SECPSIGPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 16;
        return _this;
    }
    return SECPSIGPayload;
}(B58STRPayload));
exports.SECPSIGPayload = SECPSIGPayload;
/**
 * Class for payloads representing secp256k1 encrypted messages.
 * convention: public key (65 bytes) + secp256k1 encrypted message for that public key
 */
var SECPENCPayload = /** @class */ (function (_super) {
    __extends(SECPENCPayload, _super);
    function SECPENCPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 17;
        return _this;
    }
    return SECPENCPayload;
}(B58STRPayload));
exports.SECPENCPayload = SECPENCPayload;
/**
 * Class for payloads representing JPEG images.
 */
var JPEGPayload = /** @class */ (function (_super) {
    __extends(JPEGPayload, _super);
    function JPEGPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 18;
        return _this;
    }
    return JPEGPayload;
}(BINPayload));
exports.JPEGPayload = JPEGPayload;
var PNGPayload = /** @class */ (function (_super) {
    __extends(PNGPayload, _super);
    function PNGPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 19;
        return _this;
    }
    return PNGPayload;
}(BINPayload));
exports.PNGPayload = PNGPayload;
/**
 * Class for payloads representing BMP images.
 */
var BMPPayload = /** @class */ (function (_super) {
    __extends(BMPPayload, _super);
    function BMPPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 20;
        return _this;
    }
    return BMPPayload;
}(BINPayload));
exports.BMPPayload = BMPPayload;
/**
 * Class for payloads representing ICO images.
 */
var ICOPayload = /** @class */ (function (_super) {
    __extends(ICOPayload, _super);
    function ICOPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 21;
        return _this;
    }
    return ICOPayload;
}(BINPayload));
exports.ICOPayload = ICOPayload;
/**
 * Class for payloads representing SVG images.
 */
var SVGPayload = /** @class */ (function (_super) {
    __extends(SVGPayload, _super);
    function SVGPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 22;
        return _this;
    }
    return SVGPayload;
}(UTF8Payload));
exports.SVGPayload = SVGPayload;
/**
 * Class for payloads representing CSV files.
 */
var CSVPayload = /** @class */ (function (_super) {
    __extends(CSVPayload, _super);
    function CSVPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 23;
        return _this;
    }
    return CSVPayload;
}(UTF8Payload));
exports.CSVPayload = CSVPayload;
/**
 * Class for payloads representing JSON strings.
 */
var JSONPayload = /** @class */ (function (_super) {
    __extends(JSONPayload, _super);
    function JSONPayload(payload) {
        if (payload === void 0) { payload = undefined; }
        var _this = _super.call(this) || this;
        _this.typeid = 24;
        if (payload instanceof buffer_1.Buffer) {
            _this.payload = payload;
        }
        else if (typeof payload === "string") {
            _this.payload = buffer_1.Buffer.from(payload, "utf8");
        }
        else if (payload) {
            var jsonstr = JSON.stringify(payload);
            _this.payload = buffer_1.Buffer.from(jsonstr, "utf8");
        }
        return _this;
    }
    /**
     * Returns a JSON-decoded object for the payload.
     */
    JSONPayload.prototype.returnType = function () {
        return JSON.parse(this.payload.toString("utf8"));
    };
    return JSONPayload;
}(PayloadBase));
exports.JSONPayload = JSONPayload;
/**
 * Class for payloads representing YAML definitions.
 */
var YAMLPayload = /** @class */ (function (_super) {
    __extends(YAMLPayload, _super);
    function YAMLPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 25;
        return _this;
    }
    return YAMLPayload;
}(UTF8Payload));
exports.YAMLPayload = YAMLPayload;
/**
 * Class for payloads representing email addresses.
 */
var EMAILPayload = /** @class */ (function (_super) {
    __extends(EMAILPayload, _super);
    function EMAILPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 26;
        return _this;
    }
    return EMAILPayload;
}(UTF8Payload));
exports.EMAILPayload = EMAILPayload;
/**
 * Class for payloads representing URL strings.
 */
var URLPayload = /** @class */ (function (_super) {
    __extends(URLPayload, _super);
    function URLPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 27;
        return _this;
    }
    return URLPayload;
}(UTF8Payload));
exports.URLPayload = URLPayload;
/**
 * Class for payloads representing IPFS addresses.
 */
var IPFSPayload = /** @class */ (function (_super) {
    __extends(IPFSPayload, _super);
    function IPFSPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 28;
        return _this;
    }
    return IPFSPayload;
}(B58STRPayload));
exports.IPFSPayload = IPFSPayload;
/**
 * Class for payloads representing onion URLs.
 */
var ONIONPayload = /** @class */ (function (_super) {
    __extends(ONIONPayload, _super);
    function ONIONPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 29;
        return _this;
    }
    return ONIONPayload;
}(UTF8Payload));
exports.ONIONPayload = ONIONPayload;
/**
 * Class for payloads representing torrent magnet links.
 */
var MAGNETPayload = /** @class */ (function (_super) {
    __extends(MAGNETPayload, _super);
    function MAGNETPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeid = 30;
        return _this;
    }
    return MAGNETPayload;
}(UTF8Payload));
exports.MAGNETPayload = MAGNETPayload;
