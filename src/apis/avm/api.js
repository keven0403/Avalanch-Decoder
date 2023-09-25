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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVMAPI = void 0;
/**
 * @packageDocumentation
 * @module API-AVM
 */
var bn_js_1 = require("bn.js");
var buffer_1 = require("buffer/");
var bintools_1 = require("../../utils/bintools");
var utxos_1 = require("./utxos");
var constants_1 = require("./constants");
var keychain_1 = require("./keychain");
var tx_1 = require("./tx");
var payload_1 = require("../../utils/payload");
var helperfunctions_1 = require("../../utils/helperfunctions");
var jrpcapi_1 = require("../../common/jrpcapi");
var constants_2 = require("../../utils/constants");
var output_1 = require("../../common/output");
var errors_1 = require("../../utils/errors");
var utils_1 = require("../../utils");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = utils_1.Serialization.getInstance();
/**
 * Class for interacting with a node endpoint that is using the AVM.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Avalanche.addAPI]] function to register this interface with Avalanche.
 */
var AVMAPI = /** @class */ (function (_super) {
    __extends(AVMAPI, _super);
    /**
     * This class should not be instantiated directly. Instead use the [[Avalanche.addAP`${I}`]] method.
     *
     * @param core A reference to the Avalanche class
     * @param baseURL Defaults to the string "/ext/bc/X" as the path to blockchain's baseURL
     * @param blockchainID The Blockchain"s ID. Defaults to an empty string: ""
     */
    function AVMAPI(core, baseURL, blockchainID) {
        if (baseURL === void 0) { baseURL = "/ext/bc/X"; }
        if (blockchainID === void 0) { blockchainID = ""; }
        var _this = _super.call(this, core, baseURL) || this;
        /**
         * @ignore
         */
        _this.keychain = new keychain_1.KeyChain("", "");
        _this.blockchainID = "";
        _this.blockchainAlias = undefined;
        _this.AVAXAssetID = undefined;
        _this.txFee = undefined;
        _this.creationTxFee = undefined;
        _this.mintTxFee = undefined;
        /**
         * Gets the alias for the blockchainID if it exists, otherwise returns `undefined`.
         *
         * @returns The alias for the blockchainID
         */
        _this.getBlockchainAlias = function () {
            if (typeof _this.blockchainAlias === "undefined") {
                var netid = _this.core.getNetworkID();
                if (netid in constants_2.Defaults.network &&
                    _this.blockchainID in constants_2.Defaults.network["".concat(netid)]) {
                    _this.blockchainAlias =
                        constants_2.Defaults.network["".concat(netid)][_this.blockchainID]["alias"];
                    return _this.blockchainAlias;
                }
                else {
                    /* istanbul ignore next */
                    return undefined;
                }
            }
            return _this.blockchainAlias;
        };
        /**
         * Sets the alias for the blockchainID.
         *
         * @param alias The alias for the blockchainID.
         *
         */
        _this.setBlockchainAlias = function (alias) {
            _this.blockchainAlias = alias;
            /* istanbul ignore next */
            return undefined;
        };
        /**
         * Gets the blockchainID and returns it.
         *
         * @returns The blockchainID
         */
        _this.getBlockchainID = function () { return _this.blockchainID; };
        /**
         * Refresh blockchainID, and if a blockchainID is passed in, use that.
         *
         * @param Optional. BlockchainID to assign, if none, uses the default based on networkID.
         *
         * @returns The blockchainID
         */
        _this.refreshBlockchainID = function (blockchainID) {
            if (blockchainID === void 0) { blockchainID = undefined; }
            var netid = _this.core.getNetworkID();
            if (typeof blockchainID === "undefined" &&
                typeof constants_2.Defaults.network["".concat(netid)] !== "undefined") {
                _this.blockchainID = constants_2.Defaults.network["".concat(netid)].X.blockchainID; //default to X-Chain
                return true;
            }
            if (typeof blockchainID === "string") {
                _this.blockchainID = blockchainID;
                return true;
            }
            return false;
        };
        /**
         * Takes an address string and returns its {@link https://github.com/feross/buffer|Buffer} representation if valid.
         *
         * @returns A {@link https://github.com/feross/buffer|Buffer} for the address if valid, undefined if not valid.
         */
        _this.parseAddress = function (addr) {
            var alias = _this.getBlockchainAlias();
            var blockchainID = _this.getBlockchainID();
            return bintools.parseAddress(addr, blockchainID, alias, constants_1.AVMConstants.ADDRESSLENGTH);
        };
        _this.addressFromBuffer = function (address) {
            var chainID = _this.getBlockchainAlias()
                ? _this.getBlockchainAlias()
                : _this.getBlockchainID();
            var type = "bech32";
            var hrp = _this.core.getHRP();
            return serialization.bufferToType(address, type, hrp, chainID);
        };
        /**
         * Fetches the AVAX AssetID and returns it in a Promise.
         *
         * @param refresh This function caches the response. Refresh = true will bust the cache.
         *
         * @returns The the provided string representing the AVAX AssetID
         */
        _this.getAVAXAssetID = function (refresh) {
            if (refresh === void 0) { refresh = false; }
            return __awaiter(_this, void 0, void 0, function () {
                var asset;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(typeof this.AVAXAssetID === "undefined" || refresh)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getAssetDescription(constants_2.PrimaryAssetAlias)];
                        case 1:
                            asset = _a.sent();
                            this.AVAXAssetID = asset.assetID;
                            _a.label = 2;
                        case 2: return [2 /*return*/, this.AVAXAssetID];
                    }
                });
            });
        };
        /**
         * Overrides the defaults and sets the cache to a specific AVAX AssetID
         *
         * @param avaxAssetID A cb58 string or Buffer representing the AVAX AssetID
         *
         * @returns The the provided string representing the AVAX AssetID
         */
        _this.setAVAXAssetID = function (avaxAssetID) {
            if (typeof avaxAssetID === "string") {
                avaxAssetID = bintools.cb58Decode(avaxAssetID);
            }
            _this.AVAXAssetID = avaxAssetID;
        };
        /**
         * Gets the default tx fee for this chain.
         *
         * @returns The default tx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.getDefaultTxFee = function () {
            return _this.core.getNetworkID() in constants_2.Defaults.network
                ? new bn_js_1.default(constants_2.Defaults.network[_this.core.getNetworkID()]["X"]["txFee"])
                : new bn_js_1.default(0);
        };
        /**
         * Gets the tx fee for this chain.
         *
         * @returns The tx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.getTxFee = function () {
            if (typeof _this.txFee === "undefined") {
                _this.txFee = _this.getDefaultTxFee();
            }
            return _this.txFee;
        };
        /**
         * Sets the tx fee for this chain.
         *
         * @param fee The tx fee amount to set as {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.setTxFee = function (fee) {
            _this.txFee = fee;
        };
        /**
         * Gets the default creation fee for this chain.
         *
         * @returns The default creation fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.getDefaultCreationTxFee = function () {
            return _this.core.getNetworkID() in constants_2.Defaults.network
                ? new bn_js_1.default(constants_2.Defaults.network[_this.core.getNetworkID()]["X"]["creationTxFee"])
                : new bn_js_1.default(0);
        };
        /**
         * Gets the default mint fee for this chain.
         *
         * @returns The default mint fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.getDefaultMintTxFee = function () {
            return _this.core.getNetworkID() in constants_2.Defaults.network
                ? new bn_js_1.default(constants_2.Defaults.network[_this.core.getNetworkID()]["X"]["mintTxFee"])
                : new bn_js_1.default(0);
        };
        /**
         * Gets the mint fee for this chain.
         *
         * @returns The mint fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.getMintTxFee = function () {
            if (typeof _this.mintTxFee === "undefined") {
                _this.mintTxFee = _this.getDefaultMintTxFee();
            }
            return _this.mintTxFee;
        };
        /**
         * Gets the creation fee for this chain.
         *
         * @returns The creation fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.getCreationTxFee = function () {
            if (typeof _this.creationTxFee === "undefined") {
                _this.creationTxFee = _this.getDefaultCreationTxFee();
            }
            return _this.creationTxFee;
        };
        /**
         * Sets the mint fee for this chain.
         *
         * @param fee The mint fee amount to set as {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.setMintTxFee = function (fee) {
            _this.mintTxFee = fee;
        };
        /**
         * Sets the creation fee for this chain.
         *
         * @param fee The creation fee amount to set as {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.setCreationTxFee = function (fee) {
            _this.creationTxFee = fee;
        };
        /**
         * Gets a reference to the keychain for this class.
         *
         * @returns The instance of [[KeyChain]] for this class
         */
        _this.keyChain = function () { return _this.keychain; };
        /**
         * @ignore
         */
        _this.newKeyChain = function () {
            // warning, overwrites the old keychain
            var alias = _this.getBlockchainAlias();
            if (alias) {
                _this.keychain = new keychain_1.KeyChain(_this.core.getHRP(), alias);
            }
            else {
                _this.keychain = new keychain_1.KeyChain(_this.core.getHRP(), _this.blockchainID);
            }
            return _this.keychain;
        };
        /**
         * Helper function which determines if a tx is a goose egg transaction.
         *
         * @param utx An UnsignedTx
         *
         * @returns boolean true if passes goose egg test and false if fails.
         *
         * @remarks
         * A "Goose Egg Transaction" is when the fee far exceeds a reasonable amount
         */
        _this.checkGooseEgg = function (utx, outTotal) {
            if (outTotal === void 0) { outTotal = new bn_js_1.default(0); }
            return __awaiter(_this, void 0, void 0, function () {
                var avaxAssetID, outputTotal, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            outputTotal = outTotal.gt(new bn_js_1.default(0))
                                ? outTotal
                                : utx.getOutputTotal(avaxAssetID);
                            fee = utx.getBurn(avaxAssetID);
                            if (fee.lte(constants_2.ONEAVAX.mul(new bn_js_1.default(10))) || fee.lte(outputTotal)) {
                                return [2 /*return*/, true];
                            }
                            else {
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Gets the balance of a particular asset on a blockchain.
         *
         * @param address The address to pull the asset balance from
         * @param assetID The assetID to pull the balance from
         * @param includePartial If includePartial=false, returns only the balance held solely
         *
         * @returns Promise with the balance of the assetID as a {@link https://github.com/indutny/bn.js/|BN} on the provided address for the blockchain.
         */
        _this.getBalance = function (address, assetID, includePartial) {
            if (includePartial === void 0) { includePartial = false; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof this.parseAddress(address) === "undefined") {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - AVMAPI.getBalance: Invalid address format");
                            }
                            params = {
                                address: address,
                                assetID: assetID,
                                includePartial: includePartial
                            };
                            return [4 /*yield*/, this.callMethod("avm.getBalance", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                    }
                });
            });
        };
        /**
         * Creates an address (and associated private keys) on a user on a blockchain.
         *
         * @param username Name of the user to create the address under
         * @param password Password to unlock the user and encrypt the private key
         *
         * @returns Promise for a string representing the address created by the vm.
         */
        _this.createAddress = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("avm.createAddress", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.address];
                }
            });
        }); };
        /**
         * Create a new fixed-cap, fungible asset. A quantity of it is created at initialization and there no more is ever created.
         *
         * @param username The user paying the transaction fee (in $AVAX) for asset creation
         * @param password The password for the user paying the transaction fee (in $AVAX) for asset creation
         * @param name The human-readable name for the asset
         * @param symbol Optional. The shorthand symbol for the asset. Between 0 and 4 characters
         * @param denomination Optional. Determines how balances of this asset are displayed by user interfaces. Default is 0
         * @param initialHolders An array of objects containing the field "address" and "amount" to establish the genesis values for the new asset
         *
         * ```js
         * Example initialHolders:
         * [
         *   {
         *     "address": "X-avax1kj06lhgx84h39snsljcey3tpc046ze68mek3g5",
         *     "amount": 10000
         *   },
         *   {
         *     "address": "X-avax1am4w6hfrvmh3akduzkjthrtgtqafalce6an8cr",
         *     "amount": 50000
         *   }
         * ]
         * ```
         *
         * @returns Returns a Promise string containing the base 58 string representation of the ID of the newly created asset.
         */
        _this.createFixedCapAsset = function (username, password, name, symbol, denomination, initialHolders) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            name: name,
                            symbol: symbol,
                            denomination: denomination,
                            username: username,
                            password: password,
                            initialHolders: initialHolders
                        };
                        return [4 /*yield*/, this.callMethod("avm.createFixedCapAsset", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.assetID];
                }
            });
        }); };
        /**
         * Create a new variable-cap, fungible asset. No units of the asset exist at initialization. Minters can mint units of this asset using createMintTx, signMintTx and sendMintTx.
         *
         * @param username The user paying the transaction fee (in $AVAX) for asset creation
         * @param password The password for the user paying the transaction fee (in $AVAX) for asset creation
         * @param name The human-readable name for the asset
         * @param symbol Optional. The shorthand symbol for the asset -- between 0 and 4 characters
         * @param denomination Optional. Determines how balances of this asset are displayed by user interfaces. Default is 0
         * @param minterSets is a list where each element specifies that threshold of the addresses in minters may together mint more of the asset by signing a minting transaction
         *
         * ```js
         * Example minterSets:
         * [
         *    {
         *      "minters":[
         *        "X-avax1am4w6hfrvmh3akduzkjthrtgtqafalce6an8cr"
         *      ],
         *      "threshold": 1
         *     },
         *     {
         *      "minters": [
         *        "X-avax1am4w6hfrvmh3akduzkjthrtgtqafalce6an8cr",
         *        "X-avax1kj06lhgx84h39snsljcey3tpc046ze68mek3g5",
         *        "X-avax1yell3e4nln0m39cfpdhgqprsd87jkh4qnakklx"
         *      ],
         *      "threshold": 2
         *     }
         * ]
         * ```
         *
         * @returns Returns a Promise string containing the base 58 string representation of the ID of the newly created asset.
         */
        _this.createVariableCapAsset = function (username, password, name, symbol, denomination, minterSets) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            name: name,
                            symbol: symbol,
                            denomination: denomination,
                            username: username,
                            password: password,
                            minterSets: minterSets
                        };
                        return [4 /*yield*/, this.callMethod("avm.createVariableCapAsset", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.assetID];
                }
            });
        }); };
        /**
         * Creates a family of NFT Asset. No units of the asset exist at initialization. Minters can mint units of this asset using createMintTx, signMintTx and sendMintTx.
         *
         * @param username The user paying the transaction fee (in $AVAX) for asset creation
         * @param password The password for the user paying the transaction fee (in $AVAX) for asset creation
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param name The human-readable name for the asset
         * @param symbol Optional. The shorthand symbol for the asset -- between 0 and 4 characters
         * @param minterSets is a list where each element specifies that threshold of the addresses in minters may together mint more of the asset by signing a minting transaction
         *
         * @returns Returns a Promise string containing the base 58 string representation of the ID of the newly created asset.
         */
        _this.createNFTAsset = function (username, password, from, changeAddr, name, symbol, minterSet) {
            if (from === void 0) { from = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, caller, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                username: username,
                                password: password,
                                name: name,
                                symbol: symbol,
                                minterSet: minterSet
                            };
                            caller = "createNFTAsset";
                            from = this._cleanAddressArray(from, caller);
                            if (typeof from !== "undefined") {
                                params["from"] = from;
                            }
                            if (typeof changeAddr !== "undefined") {
                                if (typeof this.parseAddress(changeAddr) === "undefined") {
                                    /* istanbul ignore next */
                                    throw new errors_1.AddressError("Error - AVMAPI.createNFTAsset: Invalid address format");
                                }
                                params["changeAddr"] = changeAddr;
                            }
                            return [4 /*yield*/, this.callMethod("avm.createNFTAsset", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.assetID];
                    }
                });
            });
        };
        /**
         * Create an unsigned transaction to mint more of an asset.
         *
         * @param amount The units of the asset to mint
         * @param assetID The ID of the asset to mint
         * @param to The address to assign the units of the minted asset
         * @param minters Addresses of the minters responsible for signing the transaction
         *
         * @returns Returns a Promise string containing the base 58 string representation of the unsigned transaction.
         */
        _this.mint = function (username, password, amount, assetID, to, minters) { return __awaiter(_this, void 0, void 0, function () {
            var asset, amnt, params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof assetID !== "string") {
                            asset = bintools.cb58Encode(assetID);
                        }
                        else {
                            asset = assetID;
                        }
                        if (typeof amount === "number") {
                            amnt = new bn_js_1.default(amount);
                        }
                        else {
                            amnt = amount;
                        }
                        params = {
                            username: username,
                            password: password,
                            amount: amnt,
                            assetID: asset,
                            to: to,
                            minters: minters
                        };
                        return [4 /*yield*/, this.callMethod("avm.mint", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID];
                }
            });
        }); };
        /**
         * Mint non-fungible tokens which were created with AVMAPI.createNFTAsset
         *
         * @param username The user paying the transaction fee (in $AVAX) for asset creation
         * @param password The password for the user paying the transaction fee (in $AVAX) for asset creation
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param assetID The asset id which is being sent
         * @param to Address on X-Chain of the account to which this NFT is being sent
         * @param encoding Optional.  is the encoding format to use for the payload argument. Can be either "cb58" or "hex". Defaults to "hex".
         *
         * @returns ID of the transaction
         */
        _this.mintNFT = function (username, password, from, changeAddr, payload, assetID, to, encoding) {
            if (from === void 0) { from = undefined; }
            if (changeAddr === void 0) { changeAddr = undefined; }
            if (encoding === void 0) { encoding = "hex"; }
            return __awaiter(_this, void 0, void 0, function () {
                var asset, params, caller, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof this.parseAddress(to) === "undefined") {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - AVMAPI.mintNFT: Invalid address format");
                            }
                            if (typeof assetID !== "string") {
                                asset = bintools.cb58Encode(assetID);
                            }
                            else {
                                asset = assetID;
                            }
                            params = {
                                username: username,
                                password: password,
                                assetID: asset,
                                payload: payload,
                                to: to,
                                encoding: encoding
                            };
                            caller = "mintNFT";
                            from = this._cleanAddressArray(from, caller);
                            if (typeof from !== "undefined") {
                                params["from"] = from;
                            }
                            if (typeof changeAddr !== "undefined") {
                                if (typeof this.parseAddress(changeAddr) === "undefined") {
                                    /* istanbul ignore next */
                                    throw new errors_1.AddressError("Error - AVMAPI.mintNFT: Invalid address format");
                                }
                                params["changeAddr"] = changeAddr;
                            }
                            return [4 /*yield*/, this.callMethod("avm.mintNFT", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.txID];
                    }
                });
            });
        };
        /**
         * Send NFT from one account to another on X-Chain
         *
         * @param username The user paying the transaction fee (in $AVAX) for asset creation
         * @param password The password for the user paying the transaction fee (in $AVAX) for asset creation
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param assetID The asset id which is being sent
         * @param groupID The group this NFT is issued to.
         * @param to Address on X-Chain of the account to which this NFT is being sent
         *
         * @returns ID of the transaction
         */
        _this.sendNFT = function (username, password, from, changeAddr, assetID, groupID, to) {
            if (from === void 0) { from = undefined; }
            if (changeAddr === void 0) { changeAddr = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var asset, params, caller, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof this.parseAddress(to) === "undefined") {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - AVMAPI.sendNFT: Invalid address format");
                            }
                            if (typeof assetID !== "string") {
                                asset = bintools.cb58Encode(assetID);
                            }
                            else {
                                asset = assetID;
                            }
                            params = {
                                username: username,
                                password: password,
                                assetID: asset,
                                groupID: groupID,
                                to: to
                            };
                            caller = "sendNFT";
                            from = this._cleanAddressArray(from, caller);
                            if (typeof from !== "undefined") {
                                params["from"] = from;
                            }
                            if (typeof changeAddr !== "undefined") {
                                if (typeof this.parseAddress(changeAddr) === "undefined") {
                                    /* istanbul ignore next */
                                    throw new errors_1.AddressError("Error - AVMAPI.sendNFT: Invalid address format");
                                }
                                params["changeAddr"] = changeAddr;
                            }
                            return [4 /*yield*/, this.callMethod("avm.sendNFT", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.txID];
                    }
                });
            });
        };
        /**
         * Exports the private key for an address.
         *
         * @param username The name of the user with the private key
         * @param password The password used to decrypt the private key
         * @param address The address whose private key should be exported
         *
         * @returns Promise with the decrypted private key as store in the database
         */
        _this.exportKey = function (username, password, address) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof this.parseAddress(address) === "undefined") {
                            /* istanbul ignore next */
                            throw new errors_1.AddressError("Error - AVMAPI.exportKey: Invalid address format");
                        }
                        params = {
                            username: username,
                            password: password,
                            address: address
                        };
                        return [4 /*yield*/, this.callMethod("avm.exportKey", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.privateKey];
                }
            });
        }); };
        /**
         * Imports a private key into the node's keystore under an user and for a blockchain.
         *
         * @param username The name of the user to store the private key
         * @param password The password that unlocks the user
         * @param privateKey A string representing the private key in the vm's format
         *
         * @returns The address for the imported private key.
         */
        _this.importKey = function (username, password, privateKey) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password,
                            privateKey: privateKey
                        };
                        return [4 /*yield*/, this.callMethod("avm.importKey", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.address];
                }
            });
        }); };
        /**
         * Send ANT (Avalanche Native Token) assets including AVAX from the X-Chain to an account on the P-Chain or C-Chain.
         *
         * After calling this method, you must call the P-Chain's `import` or the C-Chain’s `import` method to complete the transfer.
         *
         * @param username The Keystore user that controls the P-Chain or C-Chain account specified in `to`
         * @param password The password of the Keystore user
         * @param to The account on the P-Chain or C-Chain to send the asset to.
         * @param amount Amount of asset to export as a {@link https://github.com/indutny/bn.js/|BN}
         * @param assetID The asset id which is being sent
         *
         * @returns String representing the transaction id
         */
        _this.export = function (username, password, to, amount, assetID) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password,
                            to: to,
                            amount: amount,
                            assetID: assetID
                        };
                        return [4 /*yield*/, this.callMethod("avm.export", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID];
                }
            });
        }); };
        /**
         * Send ANT (Avalanche Native Token) assets including AVAX from an account on the P-Chain or C-Chain to an address on the X-Chain. This transaction
         * must be signed with the key of the account that the asset is sent from and which pays
         * the transaction fee.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address of the account the asset is sent to.
         * @param sourceChain The chainID where the funds are coming from. Ex: "C"
         *
         * @returns Promise for a string for the transaction, which should be sent to the network
         * by calling issueTx.
         */
        _this.import = function (username, password, to, sourceChain) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password,
                            to: to,
                            sourceChain: sourceChain
                        };
                        return [4 /*yield*/, this.callMethod("avm.import", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID];
                }
            });
        }); };
        /**
         * Lists all the addresses under a user.
         *
         * @param username The user to list addresses
         * @param password The password of the user to list the addresses
         *
         * @returns Promise of an array of address strings in the format specified by the blockchain.
         */
        _this.listAddresses = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("avm.listAddresses", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.addresses];
                }
            });
        }); };
        /**
         * Retrieves all assets for an address on a server and their associated balances.
         *
         * @param address The address to get a list of assets
         *
         * @returns Promise of an object mapping assetID strings with {@link https://github.com/indutny/bn.js/|BN} balance for the address on the blockchain.
         */
        _this.getAllBalances = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof this.parseAddress(address) === "undefined") {
                            /* istanbul ignore next */
                            throw new errors_1.AddressError("Error - AVMAPI.getAllBalances: Invalid address format");
                        }
                        params = {
                            address: address
                        };
                        return [4 /*yield*/, this.callMethod("avm.getAllBalances", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.balances];
                }
            });
        }); };
        /**
         * Retrieves an assets name and symbol.
         *
         * @param assetID Either a {@link https://github.com/feross/buffer|Buffer} or an b58 serialized string for the AssetID or its alias.
         *
         * @returns Returns a Promise object with keys "name" and "symbol".
         */
        _this.getAssetDescription = function (assetID) { return __awaiter(_this, void 0, void 0, function () {
            var asset, params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof assetID !== "string") {
                            asset = bintools.cb58Encode(assetID);
                        }
                        else {
                            asset = assetID;
                        }
                        params = {
                            assetID: asset
                        };
                        return [4 /*yield*/, this.callMethod("avm.getAssetDescription", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                name: response.data.result.name,
                                symbol: response.data.result.symbol,
                                assetID: bintools.cb58Decode(response.data.result.assetID),
                                denomination: parseInt(response.data.result.denomination, 10)
                            }];
                }
            });
        }); };
        /**
         * Returns the transaction data of a provided transaction ID by calling the node's `getTx` method.
         *
         * @param txID The string representation of the transaction ID
         * @param encoding sets the format of the returned transaction. Can be, "cb58", "hex" or "json". Defaults to "cb58".
         *
         * @returns Returns a Promise string or object containing the bytes retrieved from the node
         */
        _this.getTx = function (txID, encoding) {
            if (encoding === void 0) { encoding = "hex"; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                txID: txID,
                                encoding: encoding
                            };
                            return [4 /*yield*/, this.callMethod("avm.getTx", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.tx];
                    }
                });
            });
        };
        /**
         * Returns the status of a provided transaction ID by calling the node's `getTxStatus` method.
         *
         * @param txID The string representation of the transaction ID
         *
         * @returns Returns a Promise string containing the status retrieved from the node
         */
        _this.getTxStatus = function (txID) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            txID: txID
                        };
                        return [4 /*yield*/, this.callMethod("avm.getTxStatus", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.status];
                }
            });
        }); };
        /**
         * Retrieves the UTXOs related to the addresses provided from the node's `getUTXOs` method.
         *
         * @param addresses An array of addresses as cb58 strings or addresses as {@link https://github.com/feross/buffer|Buffer}s
         * @param sourceChain A string for the chain to look for the UTXO's. Default is to use this chain, but if exported UTXOs exist from other chains, this can used to pull them instead.
         * @param limit Optional. Returns at most [limit] addresses. If [limit] == 0 or > [maxUTXOsToFetch], fetches up to [maxUTXOsToFetch].
         * @param startIndex Optional. [StartIndex] defines where to start fetching UTXOs (for pagination.)
         * UTXOs fetched are from addresses equal to or greater than [StartIndex.Address]
         * For address [StartIndex.Address], only UTXOs with IDs greater than [StartIndex.Utxo] will be returned.
         * @param persistOpts Options available to persist these UTXOs in local storage
         *
         * @remarks
         * persistOpts is optional and must be of type [[PersistanceOptions]]
         *
         */
        _this.getUTXOs = function (addresses, sourceChain, limit, startIndex, persistOpts, encoding) {
            if (sourceChain === void 0) { sourceChain = undefined; }
            if (limit === void 0) { limit = 0; }
            if (startIndex === void 0) { startIndex = undefined; }
            if (persistOpts === void 0) { persistOpts = undefined; }
            if (encoding === void 0) { encoding = "hex"; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response, utxos, data, selfArray, utxoSet, cb58Strs_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof addresses === "string") {
                                addresses = [addresses];
                            }
                            params = {
                                addresses: addresses,
                                limit: limit,
                                encoding: encoding
                            };
                            if (typeof startIndex !== "undefined" && startIndex) {
                                params.startIndex = startIndex;
                            }
                            if (typeof sourceChain !== "undefined") {
                                params.sourceChain = sourceChain;
                            }
                            return [4 /*yield*/, this.callMethod("avm.getUTXOs", params)];
                        case 1:
                            response = _a.sent();
                            utxos = new utxos_1.UTXOSet();
                            data = response.data.result.utxos;
                            if (persistOpts && typeof persistOpts === "object") {
                                if (this.db.has(persistOpts.getName())) {
                                    selfArray = this.db.get(persistOpts.getName());
                                    if (Array.isArray(selfArray)) {
                                        utxos.addArray(data);
                                        utxoSet = new utxos_1.UTXOSet();
                                        utxoSet.addArray(selfArray);
                                        utxoSet.mergeByRule(utxos, persistOpts.getMergeRule());
                                        data = utxoSet.getAllUTXOStrings();
                                    }
                                }
                                this.db.set(persistOpts.getName(), data, persistOpts.getOverwrite());
                            }
                            if (data.length > 0 && data[0].substring(0, 2) === "0x") {
                                cb58Strs_1 = [];
                                data.forEach(function (str) {
                                    cb58Strs_1.push(bintools.cb58Encode(new buffer_1.Buffer(str.slice(2), "hex")));
                                });
                                utxos.addArray(cb58Strs_1, false);
                            }
                            else {
                                utxos.addArray(data, false);
                            }
                            response.data.result.utxos = utxos;
                            return [2 /*return*/, response.data.result];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned transaction. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param amount The amount of AssetID to be spent in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}.
         * @param assetID The assetID of the value being sent
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[BaseTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        _this.buildBaseTx = function (utxoset, amount, assetID, toAddresses, fromAddresses, changeAddresses, memo, asOf, locktime, threshold) {
            if (assetID === void 0) { assetID = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            return __awaiter(_this, void 0, void 0, function () {
                var caller, to, from, change, networkID, blockchainIDBuf, fee, feeAssetID, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            caller = "buildBaseTx";
                            to = this._cleanAddressArray(toAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            from = this._cleanAddressArray(fromAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            if (typeof assetID === "string") {
                                assetID = bintools.cb58Decode(assetID);
                            }
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            networkID = this.core.getNetworkID();
                            blockchainIDBuf = bintools.cb58Decode(this.blockchainID);
                            fee = this.getTxFee();
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            feeAssetID = _a.sent();
                            builtUnsignedTx = utxoset.buildBaseTx(networkID, blockchainIDBuf, amount, assetID, to, from, change, fee, feeAssetID, memo, asOf, locktime, threshold);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildBaseTx:Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned NFT Transfer. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset  A set of UTXOs that the transaction is built on
         * @param toAddresses The addresses to send the NFT
         * @param fromAddresses The addresses being used to send the NFT from the utxoID provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param utxoid A base58 utxoID or an array of base58 utxoIDs for the nfts this transaction is sending
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[NFTTransferTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        _this.buildNFTTransferTx = function (utxoset, toAddresses, fromAddresses, changeAddresses, utxoid, memo, asOf, locktime, threshold) {
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            return __awaiter(_this, void 0, void 0, function () {
                var caller, to, from, change, avaxAssetID, utxoidArray, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            caller = "buildNFTTransferTx";
                            to = this._cleanAddressArray(toAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            from = this._cleanAddressArray(fromAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            utxoidArray = [];
                            if (typeof utxoid === "string") {
                                utxoidArray = [utxoid];
                            }
                            else if (Array.isArray(utxoid)) {
                                utxoidArray = utxoid;
                            }
                            builtUnsignedTx = utxoset.buildNFTTransferTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), to, from, change, utxoidArray, this.getTxFee(), avaxAssetID, memo, asOf, locktime, threshold);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildNFTTransferTx:Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned Import Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset  A set of UTXOs that the transaction is built on
         * @param ownerAddresses The addresses being used to import
         * @param sourceChain The chainid for where the import is coming from
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[ImportTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        _this.buildImportTx = function (utxoset, ownerAddresses, sourceChain, toAddresses, fromAddresses, changeAddresses, memo, asOf, locktime, threshold) {
            if (changeAddresses === void 0) { changeAddresses = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            return __awaiter(_this, void 0, void 0, function () {
                var caller, to, from, change, srcChain, atomicUTXOs, avaxAssetID, atomics, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            caller = "buildImportTx";
                            to = this._cleanAddressArray(toAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            from = this._cleanAddressArray(fromAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            srcChain = undefined;
                            if (typeof sourceChain === "undefined") {
                                throw new errors_1.ChainIdError("Error - AVMAPI.buildImportTx: Source ChainID is undefined.");
                            }
                            else if (typeof sourceChain === "string") {
                                srcChain = sourceChain;
                                sourceChain = bintools.cb58Decode(sourceChain);
                            }
                            else if (!(sourceChain instanceof buffer_1.Buffer)) {
                                throw new errors_1.ChainIdError("Error - AVMAPI.buildImportTx: Invalid destinationChain type: " +
                                    typeof sourceChain);
                            }
                            return [4 /*yield*/, this.getUTXOs(ownerAddresses, srcChain, 0, undefined)];
                        case 1:
                            atomicUTXOs = (_a.sent()).utxos;
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 2:
                            avaxAssetID = _a.sent();
                            atomics = atomicUTXOs.getAllUTXOs();
                            if (atomics.length === 0) {
                                throw new errors_1.NoAtomicUTXOsError("Error - AVMAPI.buildImportTx: No atomic UTXOs to import from " +
                                    srcChain +
                                    " using addresses: " +
                                    ownerAddresses.join(", "));
                            }
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            builtUnsignedTx = utxoset.buildImportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), to, from, change, atomics, sourceChain, this.getTxFee(), avaxAssetID, memo, asOf, locktime, threshold);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 3:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildImportTx:Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned Export Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param destinationChain The chainid for where the assets will be sent.
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         * @param assetID Optional. The assetID of the asset to send. Defaults to AVAX assetID.
         * Regardless of the asset which you"re exporting, all fees are paid in AVAX.
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[ExportTx]].
         */
        _this.buildExportTx = function (utxoset, amount, destinationChain, toAddresses, fromAddresses, changeAddresses, memo, asOf, locktime, threshold, assetID) {
            if (changeAddresses === void 0) { changeAddresses = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            if (assetID === void 0) { assetID = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var prefixes, to, caller, from, change, avaxAssetID, networkID, blockchainID, assetIDBuf, fee, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prefixes = {};
                            toAddresses.map(function (a) {
                                prefixes[a.split("-")[0]] = true;
                            });
                            if (Object.keys(prefixes).length !== 1) {
                                throw new errors_1.AddressError("Error - AVMAPI.buildExportTx: To addresses must have the same chainID prefix.");
                            }
                            if (typeof destinationChain === "undefined") {
                                throw new errors_1.ChainIdError("Error - AVMAPI.buildExportTx: Destination ChainID is undefined.");
                            }
                            else if (typeof destinationChain === "string") {
                                destinationChain = bintools.cb58Decode(destinationChain); //
                            }
                            else if (!(destinationChain instanceof buffer_1.Buffer)) {
                                throw new errors_1.ChainIdError("Error - AVMAPI.buildExportTx: Invalid destinationChain type: " +
                                    typeof destinationChain);
                            }
                            if (destinationChain.length !== 32) {
                                throw new errors_1.ChainIdError("Error - AVMAPI.buildExportTx: Destination ChainID must be 32 bytes in length.");
                            }
                            to = [];
                            toAddresses.map(function (a) {
                                to.push(bintools.stringToAddress(a));
                            });
                            caller = "buildExportTx";
                            from = this._cleanAddressArray(fromAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            if (typeof assetID === "undefined") {
                                assetID = bintools.cb58Encode(avaxAssetID);
                            }
                            networkID = this.core.getNetworkID();
                            blockchainID = bintools.cb58Decode(this.blockchainID);
                            assetIDBuf = bintools.cb58Decode(assetID);
                            fee = this.getTxFee();
                            builtUnsignedTx = utxoset.buildExportTx(networkID, blockchainID, amount, assetIDBuf, to, from, change, destinationChain, fee, avaxAssetID, memo, asOf, locktime, threshold);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildExportTx:Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Creates an unsigned transaction. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param initialState The [[InitialStates]] that represent the intial state of a created asset
         * @param name String for the descriptive name of the asset
         * @param symbol String for the ticker symbol of the asset
         * @param denomination Number for the denomination which is 10^D. D must be >= 0 and <= 32. Ex: $1 AVAX = 10^9 $nAVAX
         * @param mintOutputs Optional. Array of [[SECPMintOutput]]s to be included in the transaction. These outputs can be spent to mint more tokens.
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[CreateAssetTx]].
         *
         */
        _this.buildCreateAssetTx = function (utxoset, fromAddresses, changeAddresses, initialStates, name, symbol, denomination, mintOutputs, memo, asOf) {
            if (mintOutputs === void 0) { mintOutputs = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            return __awaiter(_this, void 0, void 0, function () {
                var caller, from, change, networkID, blockchainID, avaxAssetID, fee, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            caller = "buildCreateAssetTx";
                            from = this._cleanAddressArray(fromAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            if (symbol.length > constants_1.AVMConstants.SYMBOLMAXLEN) {
                                throw new errors_1.SymbolError("Error - AVMAPI.buildCreateAssetTx: Symbols may not exceed length of " +
                                    constants_1.AVMConstants.SYMBOLMAXLEN);
                            }
                            if (name.length > constants_1.AVMConstants.ASSETNAMELEN) {
                                throw new errors_1.NameError("Error - AVMAPI.buildCreateAssetTx: Names may not exceed length of " +
                                    constants_1.AVMConstants.ASSETNAMELEN);
                            }
                            networkID = this.core.getNetworkID();
                            blockchainID = bintools.cb58Decode(this.blockchainID);
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            fee = this.getDefaultCreationTxFee();
                            builtUnsignedTx = utxoset.buildCreateAssetTx(networkID, blockchainID, from, change, initialStates, name, symbol, denomination, mintOutputs, fee, avaxAssetID, memo, asOf);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx, fee)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildCreateAssetTx:Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        _this.buildSECPMintTx = function (utxoset, mintOwner, transferOwner, fromAddresses, changeAddresses, mintUTXOID, memo, asOf) {
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            return __awaiter(_this, void 0, void 0, function () {
                var caller, from, change, networkID, blockchainID, avaxAssetID, fee, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            caller = "buildSECPMintTx";
                            from = this._cleanAddressArray(fromAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            networkID = this.core.getNetworkID();
                            blockchainID = bintools.cb58Decode(this.blockchainID);
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            fee = this.getMintTxFee();
                            builtUnsignedTx = utxoset.buildSECPMintTx(networkID, blockchainID, mintOwner, transferOwner, from, change, mintUTXOID, fee, avaxAssetID, memo, asOf);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildSECPMintTx:Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Creates an unsigned transaction. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param minterSets is a list where each element specifies that threshold of the addresses in minters may together mint more of the asset by signing a minting transaction
         * @param name String for the descriptive name of the asset
         * @param symbol String for the ticker symbol of the asset
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting mint output
         *
         * ```js
         * Example minterSets:
         * [
         *      {
         *          "minters":[
         *              "X-avax1ghstjukrtw8935lryqtnh643xe9a94u3tc75c7"
         *          ],
         *          "threshold": 1
         *      },
         *      {
         *          "minters": [
         *              "X-avax1yell3e4nln0m39cfpdhgqprsd87jkh4qnakklx",
         *              "X-avax1k4nr26c80jaquzm9369j5a4shmwcjn0vmemcjz",
         *              "X-avax1ztkzsrjnkn0cek5ryvhqswdtcg23nhge3nnr5e"
         *          ],
         *          "threshold": 2
         *      }
         * ]
         * ```
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[CreateAssetTx]].
         *
         */
        _this.buildCreateNFTAssetTx = function (utxoset, fromAddresses, changeAddresses, minterSets, name, symbol, memo, asOf, locktime) {
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            return __awaiter(_this, void 0, void 0, function () {
                var caller, from, change, networkID, blockchainID, creationTxFee, avaxAssetID, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            caller = "buildCreateNFTAssetTx";
                            from = this._cleanAddressArray(fromAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            if (name.length > constants_1.AVMConstants.ASSETNAMELEN) {
                                /* istanbul ignore next */
                                throw new errors_1.NameError("Error - AVMAPI.buildCreateNFTAssetTx: Names may not exceed length of " +
                                    constants_1.AVMConstants.ASSETNAMELEN);
                            }
                            if (symbol.length > constants_1.AVMConstants.SYMBOLMAXLEN) {
                                /* istanbul ignore next */
                                throw new errors_1.SymbolError("Error - AVMAPI.buildCreateNFTAssetTx: Symbols may not exceed length of " +
                                    constants_1.AVMConstants.SYMBOLMAXLEN);
                            }
                            networkID = this.core.getNetworkID();
                            blockchainID = bintools.cb58Decode(this.blockchainID);
                            creationTxFee = this.getCreationTxFee();
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            builtUnsignedTx = utxoset.buildCreateNFTAssetTx(networkID, blockchainID, from, change, minterSets, name, symbol, creationTxFee, avaxAssetID, memo, asOf, locktime);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx, creationTxFee)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildCreateNFTAssetTx:Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Creates an unsigned transaction. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset  A set of UTXOs that the transaction is built on
         * @param owners Either a single or an array of [[OutputOwners]] to send the nft output
         * @param fromAddresses The addresses being used to send the NFT from the utxoID provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param utxoid A base58 utxoID or an array of base58 utxoIDs for the nft mint output this transaction is sending
         * @param groupID Optional. The group this NFT is issued to.
         * @param payload Optional. Data for NFT Payload as either a [[PayloadBase]] or a {@link https://github.com/feross/buffer|Buffer}
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[OperationTx]].
         *
         */
        _this.buildCreateNFTMintTx = function (utxoset, owners, fromAddresses, changeAddresses, utxoid, groupID, payload, memo, asOf) {
            if (groupID === void 0) { groupID = 0; }
            if (payload === void 0) { payload = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            return __awaiter(_this, void 0, void 0, function () {
                var caller, from, change, avaxAssetID, networkID, blockchainID, txFee, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            caller = "buildCreateNFTMintTx";
                            from = this._cleanAddressArray(fromAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, caller).map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            if (payload instanceof payload_1.PayloadBase) {
                                payload = payload.getPayload();
                            }
                            if (typeof utxoid === "string") {
                                utxoid = [utxoid];
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            if (owners instanceof output_1.OutputOwners) {
                                owners = [owners];
                            }
                            networkID = this.core.getNetworkID();
                            blockchainID = bintools.cb58Decode(this.blockchainID);
                            txFee = this.getTxFee();
                            builtUnsignedTx = utxoset.buildCreateNFTMintTx(networkID, blockchainID, owners, from, change, utxoid, groupID, payload, txFee, avaxAssetID, memo, asOf);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildCreateNFTMintTx:Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Helper function which takes an unsigned transaction and signs it, returning the resulting [[Tx]].
         *
         * @param utx The unsigned transaction of type [[UnsignedTx]]
         *
         * @returns A signed transaction of type [[Tx]]
         */
        _this.signTx = function (utx) { return utx.sign(_this.keychain); };
        /**
         * Calls the node's issueTx method from the API and returns the resulting transaction ID as a string.
         *
         * @param tx A string, {@link https://github.com/feross/buffer|Buffer}, or [[Tx]] representing a transaction
         *
         * @returns A Promise string representing the transaction ID of the posted transaction.
         */
        _this.issueTx = function (tx) { return __awaiter(_this, void 0, void 0, function () {
            var Transaction, txobj, params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Transaction = "";
                        if (typeof tx === "string") {
                            Transaction = tx;
                        }
                        else if (tx instanceof buffer_1.Buffer) {
                            txobj = new tx_1.Tx();
                            txobj.fromBuffer(tx);
                            Transaction = txobj.toStringHex();
                        }
                        else if (tx instanceof tx_1.Tx) {
                            Transaction = tx.toStringHex();
                        }
                        else {
                            /* istanbul ignore next */
                            throw new errors_1.TransactionError("Error - AVMAPI.issueTx: provided tx is not expected type of string, Buffer, or Tx");
                        }
                        params = {
                            tx: Transaction.toString(),
                            encoding: "hex"
                        };
                        return [4 /*yield*/, this.callMethod("avm.issueTx", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID];
                }
            });
        }); };
        /**
         * Calls the node's getAddressTxs method from the API and returns transactions corresponding to the provided address and assetID
         *
         * @param address The address for which we're fetching related transactions.
         * @param cursor Page number or offset.
         * @param pageSize  Number of items to return per page. Optional. Defaults to 1024. If [pageSize] == 0 or [pageSize] > [maxPageSize], then it fetches at max [maxPageSize] transactions
         * @param assetID Only return transactions that changed the balance of this asset. Must be an ID or an alias for an asset.
         *
         * @returns A promise object representing the array of transaction IDs and page offset
         */
        _this.getAddressTxs = function (address, cursor, pageSize, assetID) { return __awaiter(_this, void 0, void 0, function () {
            var asset, pageSizeNum, params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof assetID !== "string") {
                            asset = bintools.cb58Encode(assetID);
                        }
                        else {
                            asset = assetID;
                        }
                        if (typeof pageSize !== "number") {
                            pageSizeNum = 0;
                        }
                        else {
                            pageSizeNum = pageSize;
                        }
                        params = {
                            address: address,
                            cursor: cursor,
                            pageSize: pageSizeNum,
                            assetID: asset
                        };
                        return [4 /*yield*/, this.callMethod("avm.getAddressTxs", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        /**
         * Sends an amount of assetID to the specified address from a list of owned of addresses.
         *
         * @param username The user that owns the private keys associated with the `from` addresses
         * @param password The password unlocking the user
         * @param assetID The assetID of the asset to send
         * @param amount The amount of the asset to be sent
         * @param to The address of the recipient
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param memo Optional. CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         *
         * @returns Promise for the string representing the transaction's ID.
         */
        _this.send = function (username, password, assetID, amount, to, from, changeAddr, memo) {
            if (from === void 0) { from = undefined; }
            if (changeAddr === void 0) { changeAddr = undefined; }
            if (memo === void 0) { memo = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var asset, amnt, params, caller, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof this.parseAddress(to) === "undefined") {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - AVMAPI.send: Invalid address format");
                            }
                            if (typeof assetID !== "string") {
                                asset = bintools.cb58Encode(assetID);
                            }
                            else {
                                asset = assetID;
                            }
                            if (typeof amount === "number") {
                                amnt = new bn_js_1.default(amount);
                            }
                            else {
                                amnt = amount;
                            }
                            params = {
                                username: username,
                                password: password,
                                assetID: asset,
                                amount: amnt.toString(10),
                                to: to
                            };
                            caller = "send";
                            from = this._cleanAddressArray(from, caller);
                            if (typeof from !== "undefined") {
                                params["from"] = from;
                            }
                            if (typeof changeAddr !== "undefined") {
                                if (typeof this.parseAddress(changeAddr) === "undefined") {
                                    /* istanbul ignore next */
                                    throw new errors_1.AddressError("Error - AVMAPI.send: Invalid address format");
                                }
                                params["changeAddr"] = changeAddr;
                            }
                            if (typeof memo !== "undefined") {
                                if (typeof memo !== "string") {
                                    params["memo"] = bintools.cb58Encode(memo);
                                }
                                else {
                                    params["memo"] = memo;
                                }
                            }
                            return [4 /*yield*/, this.callMethod("avm.send", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                    }
                });
            });
        };
        /**
         * Sends an amount of assetID to an array of specified addresses from a list of owned of addresses.
         *
         * @param username The user that owns the private keys associated with the `from` addresses
         * @param password The password unlocking the user
         * @param sendOutputs The array of SendOutputs. A SendOutput is an object literal which contains an assetID, amount, and to.
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param memo Optional. CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         *
         * @returns Promise for the string representing the transaction"s ID.
         */
        _this.sendMultiple = function (username, password, sendOutputs, from, changeAddr, memo) {
            if (from === void 0) { from = undefined; }
            if (changeAddr === void 0) { changeAddr = undefined; }
            if (memo === void 0) { memo = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var asset, amnt, sOutputs, params, caller, response;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sOutputs = [];
                            sendOutputs.forEach(function (output) {
                                if (typeof _this.parseAddress(output.to) === "undefined") {
                                    /* istanbul ignore next */
                                    throw new errors_1.AddressError("Error - AVMAPI.sendMultiple: Invalid address format");
                                }
                                if (typeof output.assetID !== "string") {
                                    asset = bintools.cb58Encode(output.assetID);
                                }
                                else {
                                    asset = output.assetID;
                                }
                                if (typeof output.amount === "number") {
                                    amnt = new bn_js_1.default(output.amount);
                                }
                                else {
                                    amnt = output.amount;
                                }
                                sOutputs.push({
                                    to: output.to,
                                    assetID: asset,
                                    amount: amnt.toString(10)
                                });
                            });
                            params = {
                                username: username,
                                password: password,
                                outputs: sOutputs
                            };
                            caller = "send";
                            from = this._cleanAddressArray(from, caller);
                            if (typeof from !== "undefined") {
                                params.from = from;
                            }
                            if (typeof changeAddr !== "undefined") {
                                if (typeof this.parseAddress(changeAddr) === "undefined") {
                                    /* istanbul ignore next */
                                    throw new errors_1.AddressError("Error - AVMAPI.send: Invalid address format");
                                }
                                params.changeAddr = changeAddr;
                            }
                            if (typeof memo !== "undefined") {
                                if (typeof memo !== "string") {
                                    params.memo = bintools.cb58Encode(memo);
                                }
                                else {
                                    params.memo = memo;
                                }
                            }
                            return [4 /*yield*/, this.callMethod("avm.sendMultiple", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                    }
                });
            });
        };
        /**
         * Given a JSON representation of this Virtual Machine’s genesis state, create the byte representation of that state.
         *
         * @param genesisData The blockchain's genesis data object
         *
         * @returns Promise of a string of bytes
         */
        _this.buildGenesis = function (genesisData) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            genesisData: genesisData
                        };
                        return [4 /*yield*/, this.callMethod("avm.buildGenesis", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.bytes];
                }
            });
        }); };
        _this.blockchainID = blockchainID;
        var netID = core.getNetworkID();
        if (netID in constants_2.Defaults.network &&
            blockchainID in constants_2.Defaults.network["".concat(netID)]) {
            var alias = constants_2.Defaults.network["".concat(netID)]["".concat(blockchainID)]["alias"];
            _this.keychain = new keychain_1.KeyChain(_this.core.getHRP(), alias);
        }
        else {
            _this.keychain = new keychain_1.KeyChain(_this.core.getHRP(), blockchainID);
        }
        return _this;
    }
    /**
     * @ignore
     */
    AVMAPI.prototype._cleanAddressArray = function (addresses, caller) {
        var addrs = [];
        var chainID = this.getBlockchainAlias()
            ? this.getBlockchainAlias()
            : this.getBlockchainID();
        if (addresses && addresses.length > 0) {
            for (var i = 0; i < addresses.length; i++) {
                if (typeof addresses["".concat(i)] === "string") {
                    if (typeof this.parseAddress(addresses["".concat(i)]) ===
                        "undefined") {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - AVMAPI.${caller}: Invalid address format");
                    }
                    addrs.push(addresses["".concat(i)]);
                }
                else {
                    var type = "bech32";
                    addrs.push(serialization.bufferToType(addresses["".concat(i)], type, this.core.getHRP(), chainID));
                }
            }
        }
        return addrs;
    };
    return AVMAPI;
}(jrpcapi_1.JRPCAPI));
exports.AVMAPI = AVMAPI;
