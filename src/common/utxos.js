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
exports.StandardUTXOSet = exports.StandardUTXO = void 0;
/**
 * @packageDocumentation
 * @module Common-UTXOs
 */
var buffer_1 = require("buffer/");
var bintools_1 = require("../utils/bintools");
var bn_js_1 = require("bn.js");
var output_1 = require("./output");
var helperfunctions_1 = require("../utils/helperfunctions");
var serialization_1 = require("../utils/serialization");
var errors_1 = require("../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = serialization_1.Serialization.getInstance();
/**
 * Class for representing a single StandardUTXO.
 */
var StandardUTXO = /** @class */ (function (_super) {
    __extends(StandardUTXO, _super);
    /**
     * Class for representing a single StandardUTXO.
     *
     * @param codecID Optional number which specifies the codeID of the UTXO. Default 0
     * @param txID Optional {@link https://github.com/feross/buffer|Buffer} of transaction ID for the StandardUTXO
     * @param txidx Optional {@link https://github.com/feross/buffer|Buffer} or number for the index of the transaction's [[Output]]
     * @param assetID Optional {@link https://github.com/feross/buffer|Buffer} of the asset ID for the StandardUTXO
     * @param outputid Optional {@link https://github.com/feross/buffer|Buffer} or number of the output ID for the StandardUTXO
     */
    function StandardUTXO(codecID, txID, outputidx, assetID, output) {
        if (codecID === void 0) { codecID = 0; }
        if (txID === void 0) { txID = undefined; }
        if (outputidx === void 0) { outputidx = undefined; }
        if (assetID === void 0) { assetID = undefined; }
        if (output === void 0) { output = undefined; }
        var _this = _super.call(this) || this;
        _this._typeName = "StandardUTXO";
        _this._typeID = undefined;
        _this.codecID = buffer_1.Buffer.alloc(2);
        _this.txid = buffer_1.Buffer.alloc(32);
        _this.outputidx = buffer_1.Buffer.alloc(4);
        _this.assetID = buffer_1.Buffer.alloc(32);
        _this.output = undefined;
        /**
         * Returns the numeric representation of the CodecID.
         */
        _this.getCodecID = function () {
            return _this.codecID.readUInt8(0);
        };
        /**
         * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the CodecID
         */
        _this.getCodecIDBuffer = function () { return _this.codecID; };
        /**
         * Returns a {@link https://github.com/feross/buffer|Buffer} of the TxID.
         */
        _this.getTxID = function () { return _this.txid; };
        /**
         * Returns a {@link https://github.com/feross/buffer|Buffer}  of the OutputIdx.
         */
        _this.getOutputIdx = function () { return _this.outputidx; };
        /**
         * Returns the assetID as a {@link https://github.com/feross/buffer|Buffer}.
         */
        _this.getAssetID = function () { return _this.assetID; };
        /**
         * Returns the UTXOID as a base-58 string (UTXOID is a string )
         */
        _this.getUTXOID = function () {
            return bintools.bufferToB58(buffer_1.Buffer.concat([_this.getTxID(), _this.getOutputIdx()]));
        };
        /**
         * Returns a reference to the output
         */
        _this.getOutput = function () { return _this.output; };
        if (typeof codecID !== "undefined") {
            _this.codecID.writeUInt8(codecID, 0);
        }
        if (typeof txID !== "undefined") {
            _this.txid = txID;
        }
        if (typeof outputidx === "number") {
            _this.outputidx.writeUInt32BE(outputidx, 0);
        }
        else if (outputidx instanceof buffer_1.Buffer) {
            _this.outputidx = outputidx;
        }
        if (typeof assetID !== "undefined") {
            _this.assetID = assetID;
        }
        if (typeof output !== "undefined") {
            _this.output = output;
        }
        return _this;
    }
    StandardUTXO.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        return __assign(__assign({}, fields), { codecID: serialization.encoder(this.codecID, encoding, "Buffer", "decimalString"), txid: serialization.encoder(this.txid, encoding, "Buffer", "cb58"), outputidx: serialization.encoder(this.outputidx, encoding, "Buffer", "decimalString"), assetID: serialization.encoder(this.assetID, encoding, "Buffer", "cb58"), output: this.output.serialize(encoding) });
    };
    StandardUTXO.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.codecID = serialization.decoder(fields["codecID"], encoding, "decimalString", "Buffer", 2);
        this.txid = serialization.decoder(fields["txid"], encoding, "cb58", "Buffer", 32);
        this.outputidx = serialization.decoder(fields["outputidx"], encoding, "decimalString", "Buffer", 4);
        this.assetID = serialization.decoder(fields["assetID"], encoding, "cb58", "Buffer", 32);
    };
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardUTXO]].
     */
    StandardUTXO.prototype.toBuffer = function () {
        var outbuff = this.output.toBuffer();
        var outputidbuffer = buffer_1.Buffer.alloc(4);
        outputidbuffer.writeUInt32BE(this.output.getOutputID(), 0);
        var barr = [
            this.codecID,
            this.txid,
            this.outputidx,
            this.assetID,
            outputidbuffer,
            outbuff
        ];
        return buffer_1.Buffer.concat(barr, this.codecID.length +
            this.txid.length +
            this.outputidx.length +
            this.assetID.length +
            outputidbuffer.length +
            outbuff.length);
    };
    return StandardUTXO;
}(serialization_1.Serializable));
exports.StandardUTXO = StandardUTXO;
/**
 * Class representing a set of [[StandardUTXO]]s.
 */
var StandardUTXOSet = /** @class */ (function (_super) {
    __extends(StandardUTXOSet, _super);
    function StandardUTXOSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._typeName = "StandardUTXOSet";
        _this._typeID = undefined;
        _this.utxos = {};
        _this.addressUTXOs = {}; // maps address to utxoids:locktime
        /**
         * Returns true if the [[StandardUTXO]] is in the StandardUTXOSet.
         *
         * @param utxo Either a [[StandardUTXO]] a cb58 serialized string representing a StandardUTXO
         */
        _this.includes = function (utxo) {
            var utxoX = undefined;
            var utxoid = undefined;
            try {
                utxoX = _this.parseUTXO(utxo);
                utxoid = utxoX.getUTXOID();
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
                else {
                    console.log(e);
                }
                return false;
            }
            return utxoid in _this.utxos;
        };
        /**
         * Removes a [[StandardUTXO]] from the [[StandardUTXOSet]] if it exists.
         *
         * @param utxo Either a [[StandardUTXO]] an cb58 serialized string representing a StandardUTXO
         *
         * @returns A [[StandardUTXO]] if it was removed and undefined if nothing was removed.
         */
        _this.remove = function (utxo) {
            var utxovar = undefined;
            try {
                utxovar = _this.parseUTXO(utxo);
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
                else {
                    console.log(e);
                }
                return undefined;
            }
            var utxoid = utxovar.getUTXOID();
            if (!(utxoid in _this.utxos)) {
                return undefined;
            }
            delete _this.utxos["".concat(utxoid)];
            var addresses = Object.keys(_this.addressUTXOs);
            for (var i = 0; i < addresses.length; i++) {
                if (utxoid in _this.addressUTXOs[addresses["".concat(i)]]) {
                    delete _this.addressUTXOs[addresses["".concat(i)]]["".concat(utxoid)];
                }
            }
            return utxovar;
        };
        /**
         * Removes an array of [[StandardUTXO]]s to the [[StandardUTXOSet]].
         *
         * @param utxo Either a [[StandardUTXO]] an cb58 serialized string representing a StandardUTXO
         * @param overwrite If true, if the UTXOID already exists, overwrite it... default false
         *
         * @returns An array of UTXOs which were removed.
         */
        _this.removeArray = function (utxos) {
            var removed = [];
            for (var i = 0; i < utxos.length; i++) {
                var result = _this.remove(utxos["".concat(i)]);
                if (typeof result !== "undefined") {
                    removed.push(result);
                }
            }
            return removed;
        };
        /**
         * Gets a [[StandardUTXO]] from the [[StandardUTXOSet]] by its UTXOID.
         *
         * @param utxoid String representing the UTXOID
         *
         * @returns A [[StandardUTXO]] if it exists in the set.
         */
        _this.getUTXO = function (utxoid) { return _this.utxos["".concat(utxoid)]; };
        /**
         * Gets all the [[StandardUTXO]]s, optionally that match with UTXOIDs in an array
         *
         * @param utxoids An optional array of UTXOIDs, returns all [[StandardUTXO]]s if not provided
         *
         * @returns An array of [[StandardUTXO]]s.
         */
        _this.getAllUTXOs = function (utxoids) {
            if (utxoids === void 0) { utxoids = undefined; }
            var results = [];
            if (typeof utxoids !== "undefined" && Array.isArray(utxoids)) {
                results = utxoids
                    .filter(function (utxoid) { return _this.utxos["".concat(utxoid)]; })
                    .map(function (utxoid) { return _this.utxos["".concat(utxoid)]; });
            }
            else {
                results = Object.values(_this.utxos);
            }
            return results;
        };
        /**
         * Gets all the [[StandardUTXO]]s as strings, optionally that match with UTXOIDs in an array.
         *
         * @param utxoids An optional array of UTXOIDs, returns all [[StandardUTXO]]s if not provided
         *
         * @returns An array of [[StandardUTXO]]s as cb58 serialized strings.
         */
        _this.getAllUTXOStrings = function (utxoids) {
            if (utxoids === void 0) { utxoids = undefined; }
            var results = [];
            var utxos = Object.keys(_this.utxos);
            if (typeof utxoids !== "undefined" && Array.isArray(utxoids)) {
                for (var i = 0; i < utxoids.length; i++) {
                    if (utxoids["".concat(i)] in _this.utxos) {
                        results.push(_this.utxos[utxoids["".concat(i)]].toString());
                    }
                }
            }
            else {
                for (var _i = 0, utxos_1 = utxos; _i < utxos_1.length; _i++) {
                    var u = utxos_1[_i];
                    results.push(_this.utxos["".concat(u)].toString());
                }
            }
            return results;
        };
        /**
         * Given an address or array of addresses, returns all the UTXOIDs for those addresses
         *
         * @param address An array of address {@link https://github.com/feross/buffer|Buffer}s
         * @param spendable If true, only retrieves UTXOIDs whose locktime has passed
         *
         * @returns An array of addresses.
         */
        _this.getUTXOIDs = function (addresses, spendable) {
            if (addresses === void 0) { addresses = undefined; }
            if (spendable === void 0) { spendable = true; }
            if (typeof addresses !== "undefined") {
                var results = [];
                var now = (0, helperfunctions_1.UnixNow)();
                for (var i = 0; i < addresses.length; i++) {
                    if (addresses["".concat(i)].toString("hex") in _this.addressUTXOs) {
                        var entries = Object.entries(_this.addressUTXOs[addresses["".concat(i)].toString("hex")]);
                        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                            var _a = entries_1[_i], utxoid = _a[0], locktime = _a[1];
                            if ((results.indexOf(utxoid) === -1 &&
                                spendable &&
                                locktime.lte(now)) ||
                                !spendable) {
                                results.push(utxoid);
                            }
                        }
                    }
                }
                return results;
            }
            return Object.keys(_this.utxos);
        };
        /**
         * Gets the addresses in the [[StandardUTXOSet]] and returns an array of {@link https://github.com/feross/buffer|Buffer}.
         */
        _this.getAddresses = function () {
            return Object.keys(_this.addressUTXOs).map(function (k) { return buffer_1.Buffer.from(k, "hex"); });
        };
        /**
         * Returns the balance of a set of addresses in the StandardUTXOSet.
         *
         * @param addresses An array of addresses
         * @param assetID Either a {@link https://github.com/feross/buffer|Buffer} or an cb58 serialized representation of an AssetID
         * @param asOf The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns Returns the total balance as a {@link https://github.com/indutny/bn.js/|BN}.
         */
        _this.getBalance = function (addresses, assetID, asOf) {
            if (asOf === void 0) { asOf = undefined; }
            var utxoids = _this.getUTXOIDs(addresses);
            var utxos = _this.getAllUTXOs(utxoids);
            var spend = new bn_js_1.default(0);
            var asset;
            if (typeof assetID === "string") {
                asset = bintools.cb58Decode(assetID);
            }
            else {
                asset = assetID;
            }
            for (var i = 0; i < utxos.length; i++) {
                if (utxos["".concat(i)].getOutput() instanceof output_1.StandardAmountOutput &&
                    utxos["".concat(i)].getAssetID().toString("hex") === asset.toString("hex") &&
                    utxos["".concat(i)].getOutput().meetsThreshold(addresses, asOf)) {
                    spend = spend.add(utxos["".concat(i)].getOutput().getAmount());
                }
            }
            return spend;
        };
        /**
         * Gets all the Asset IDs, optionally that match with Asset IDs in an array
         *
         * @param utxoids An optional array of Addresses as string or Buffer, returns all Asset IDs if not provided
         *
         * @returns An array of {@link https://github.com/feross/buffer|Buffer} representing the Asset IDs.
         */
        _this.getAssetIDs = function (addresses) {
            if (addresses === void 0) { addresses = undefined; }
            var results = new Set();
            var utxoids = [];
            if (typeof addresses !== "undefined") {
                utxoids = _this.getUTXOIDs(addresses);
            }
            else {
                utxoids = _this.getUTXOIDs();
            }
            for (var i = 0; i < utxoids.length; i++) {
                if (utxoids["".concat(i)] in _this.utxos && !(utxoids["".concat(i)] in results)) {
                    results.add(_this.utxos[utxoids["".concat(i)]].getAssetID());
                }
            }
            return __spreadArray([], results, true);
        };
        /**
         * Returns a new set with copy of UTXOs in this and set parameter.
         *
         * @param utxoset The [[StandardUTXOSet]] to merge with this one
         * @param hasUTXOIDs Will subselect a set of [[StandardUTXO]]s which have the UTXOIDs provided in this array, defults to all UTXOs
         *
         * @returns A new StandardUTXOSet that contains all the filtered elements.
         */
        _this.merge = function (utxoset, hasUTXOIDs) {
            if (hasUTXOIDs === void 0) { hasUTXOIDs = undefined; }
            var results = _this.create();
            var utxos1 = _this.getAllUTXOs(hasUTXOIDs);
            var utxos2 = utxoset.getAllUTXOs(hasUTXOIDs);
            var process = function (utxo) {
                results.add(utxo);
            };
            utxos1.forEach(process);
            utxos2.forEach(process);
            return results;
        };
        /**
         * Set intersetion between this set and a parameter.
         *
         * @param utxoset The set to intersect
         *
         * @returns A new StandardUTXOSet containing the intersection
         */
        _this.intersection = function (utxoset) {
            var us1 = _this.getUTXOIDs();
            var us2 = utxoset.getUTXOIDs();
            var results = us1.filter(function (utxoid) { return us2.includes(utxoid); });
            return _this.merge(utxoset, results);
        };
        /**
         * Set difference between this set and a parameter.
         *
         * @param utxoset The set to difference
         *
         * @returns A new StandardUTXOSet containing the difference
         */
        _this.difference = function (utxoset) {
            var us1 = _this.getUTXOIDs();
            var us2 = utxoset.getUTXOIDs();
            var results = us1.filter(function (utxoid) { return !us2.includes(utxoid); });
            return _this.merge(utxoset, results);
        };
        /**
         * Set symmetrical difference between this set and a parameter.
         *
         * @param utxoset The set to symmetrical difference
         *
         * @returns A new StandardUTXOSet containing the symmetrical difference
         */
        _this.symDifference = function (utxoset) {
            var us1 = _this.getUTXOIDs();
            var us2 = utxoset.getUTXOIDs();
            var results = us1
                .filter(function (utxoid) { return !us2.includes(utxoid); })
                .concat(us2.filter(function (utxoid) { return !us1.includes(utxoid); }));
            return _this.merge(utxoset, results);
        };
        /**
         * Set union between this set and a parameter.
         *
         * @param utxoset The set to union
         *
         * @returns A new StandardUTXOSet containing the union
         */
        _this.union = function (utxoset) { return _this.merge(utxoset); };
        /**
         * Merges a set by the rule provided.
         *
         * @param utxoset The set to merge by the MergeRule
         * @param mergeRule The [[MergeRule]] to apply
         *
         * @returns A new StandardUTXOSet containing the merged data
         *
         * @remarks
         * The merge rules are as follows:
         *   * "intersection" - the intersection of the set
         *   * "differenceSelf" - the difference between the existing data and new set
         *   * "differenceNew" - the difference between the new data and the existing set
         *   * "symDifference" - the union of the differences between both sets of data
         *   * "union" - the unique set of all elements contained in both sets
         *   * "unionMinusNew" - the unique set of all elements contained in both sets, excluding values only found in the new set
         *   * "unionMinusSelf" - the unique set of all elements contained in both sets, excluding values only found in the existing set
         */
        _this.mergeByRule = function (utxoset, mergeRule) {
            var uSet;
            switch (mergeRule) {
                case "intersection":
                    return _this.intersection(utxoset);
                case "differenceSelf":
                    return _this.difference(utxoset);
                case "differenceNew":
                    return utxoset.difference(_this);
                case "symDifference":
                    return _this.symDifference(utxoset);
                case "union":
                    return _this.union(utxoset);
                case "unionMinusNew":
                    uSet = _this.union(utxoset);
                    return uSet.difference(utxoset);
                case "unionMinusSelf":
                    uSet = _this.union(utxoset);
                    return uSet.difference(_this);
                default:
                    throw new errors_1.MergeRuleError("Error - StandardUTXOSet.mergeByRule: bad MergeRule");
            }
        };
        return _this;
    }
    StandardUTXOSet.prototype.serialize = function (encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        var fields = _super.prototype.serialize.call(this, encoding);
        var utxos = {};
        for (var utxoid in this.utxos) {
            var utxoidCleaned = serialization.encoder(utxoid, encoding, "base58", "base58");
            utxos["".concat(utxoidCleaned)] = this.utxos["".concat(utxoid)].serialize(encoding);
        }
        var addressUTXOs = {};
        for (var address in this.addressUTXOs) {
            var addressCleaned = serialization.encoder(address, encoding, "hex", "cb58");
            var utxobalance = {};
            for (var utxoid in this.addressUTXOs["".concat(address)]) {
                var utxoidCleaned = serialization.encoder(utxoid, encoding, "base58", "base58");
                utxobalance["".concat(utxoidCleaned)] = serialization.encoder(this.addressUTXOs["".concat(address)]["".concat(utxoid)], encoding, "BN", "decimalString");
            }
            addressUTXOs["".concat(addressCleaned)] = utxobalance;
        }
        return __assign(__assign({}, fields), { utxos: utxos, addressUTXOs: addressUTXOs });
    };
    /**
     * Adds a [[StandardUTXO]] to the StandardUTXOSet.
     *
     * @param utxo Either a [[StandardUTXO]] an cb58 serialized string representing a StandardUTXO
     * @param overwrite If true, if the UTXOID already exists, overwrite it... default false
     *
     * @returns A [[StandardUTXO]] if one was added and undefined if nothing was added.
     */
    StandardUTXOSet.prototype.add = function (utxo, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        var utxovar = undefined;
        try {
            utxovar = this.parseUTXO(utxo);
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            }
            else {
                console.log(e);
            }
            return undefined;
        }
        var utxoid = utxovar.getUTXOID();
        if (!(utxoid in this.utxos) || overwrite === true) {
            this.utxos["".concat(utxoid)] = utxovar;
            var addresses = utxovar.getOutput().getAddresses();
            var locktime = utxovar.getOutput().getLocktime();
            for (var i = 0; i < addresses.length; i++) {
                var address = addresses["".concat(i)].toString("hex");
                if (!(address in this.addressUTXOs)) {
                    this.addressUTXOs["".concat(address)] = {};
                }
                this.addressUTXOs["".concat(address)]["".concat(utxoid)] = locktime;
            }
            return utxovar;
        }
        return undefined;
    };
    /**
     * Adds an array of [[StandardUTXO]]s to the [[StandardUTXOSet]].
     *
     * @param utxo Either a [[StandardUTXO]] an cb58 serialized string representing a StandardUTXO
     * @param overwrite If true, if the UTXOID already exists, overwrite it... default false
     *
     * @returns An array of StandardUTXOs which were added.
     */
    StandardUTXOSet.prototype.addArray = function (utxos, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        var added = [];
        for (var i = 0; i < utxos.length; i++) {
            var result = this.add(utxos["".concat(i)], overwrite);
            if (typeof result !== "undefined") {
                added.push(result);
            }
        }
        return added;
    };
    StandardUTXOSet.prototype.filter = function (args, lambda) {
        var newset = this.clone();
        var utxos = this.getAllUTXOs();
        for (var i = 0; i < utxos.length; i++) {
            if (lambda.apply(void 0, __spreadArray([utxos["".concat(i)]], args, false)) === false) {
                newset.remove(utxos["".concat(i)]);
            }
        }
        return newset;
    };
    return StandardUTXOSet;
}(serialization_1.Serializable));
exports.StandardUTXOSet = StandardUTXOSet;
