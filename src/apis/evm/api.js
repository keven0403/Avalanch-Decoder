"use strict";
/**
 * @packageDocumentation
 * @module API-EVM
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
exports.EVMAPI = void 0;
var buffer_1 = require("buffer/");
var bn_js_1 = require("bn.js");
var jrpcapi_1 = require("../../common/jrpcapi");
var bintools_1 = require("../../utils/bintools");
var utxos_1 = require("./utxos");
var keychain_1 = require("./keychain");
var constants_1 = require("../../utils/constants");
var tx_1 = require("./tx");
var constants_2 = require("./constants");
var inputs_1 = require("./inputs");
var outputs_1 = require("./outputs");
var exporttx_1 = require("./exporttx");
var errors_1 = require("../../utils/errors");
var utils_1 = require("../../utils");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = utils_1.Serialization.getInstance();
/**
 * Class for interacting with a node's EVMAPI
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Avalanche.addAPI]] function to register this interface with Avalanche.
 */
var EVMAPI = /** @class */ (function (_super) {
    __extends(EVMAPI, _super);
    /**
     * This class should not be instantiated directly.
     * Instead use the [[Avalanche.addAPI]] method.
     *
     * @param core A reference to the Avalanche class
     * @param baseURL Defaults to the string "/ext/bc/C/avax" as the path to blockchain's baseURL
     * @param blockchainID The Blockchain's ID. Defaults to an empty string: ""
     */
    function EVMAPI(core, baseURL, blockchainID) {
        if (baseURL === void 0) { baseURL = "/ext/bc/C/avax"; }
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
        /**
         * Gets the alias for the blockchainID if it exists, otherwise returns `undefined`.
         *
         * @returns The alias for the blockchainID
         */
        _this.getBlockchainAlias = function () {
            if (typeof _this.blockchainAlias === "undefined") {
                var netID = _this.core.getNetworkID();
                if (netID in constants_1.Defaults.network &&
                    _this.blockchainID in constants_1.Defaults.network["".concat(netID)]) {
                    _this.blockchainAlias =
                        constants_1.Defaults.network["".concat(netID)][_this.blockchainID]["alias"];
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
         * @returns A boolean if the blockchainID was successfully refreshed.
         */
        _this.refreshBlockchainID = function (blockchainID) {
            if (blockchainID === void 0) { blockchainID = undefined; }
            var netID = _this.core.getNetworkID();
            if (typeof blockchainID === "undefined" &&
                typeof constants_1.Defaults.network["".concat(netID)] !== "undefined") {
                _this.blockchainID = constants_1.Defaults.network["".concat(netID)].C.blockchainID; //default to C-Chain
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
            return bintools.parseAddress(addr, blockchainID, alias, constants_2.EVMConstants.ADDRESSLENGTH);
        };
        _this.addressFromBuffer = function (address) {
            var chainID = _this.getBlockchainAlias()
                ? _this.getBlockchainAlias()
                : _this.getBlockchainID();
            var type = "bech32";
            return serialization.bufferToType(address, type, _this.core.getHRP(), chainID);
        };
        /**
         * Retrieves an assets name and symbol.
         *
         * @param assetID Either a {@link https://github.com/feross/buffer|Buffer} or an b58 serialized string for the AssetID or its alias.
         *
         * @returns Returns a Promise Asset with keys "name", "symbol", "assetID" and "denomination".
         */
        _this.getAssetDescription = function (assetID) { return __awaiter(_this, void 0, void 0, function () {
            var asset, params, tmpBaseURL, response;
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
                        tmpBaseURL = this.getBaseURL();
                        // set base url to get asset description
                        this.setBaseURL("/ext/bc/X");
                        return [4 /*yield*/, this.callMethod("avm.getAssetDescription", params)
                            // set base url back what it originally was
                        ];
                    case 1:
                        response = _a.sent();
                        // set base url back what it originally was
                        this.setBaseURL(tmpBaseURL);
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
                            return [4 /*yield*/, this.getAssetDescription(constants_1.PrimaryAssetAlias)];
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
            return _this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[_this.core.getNetworkID()]["C"]["txFee"])
                : new bn_js_1.default(0);
        };
        /**
         * returns the amount of [assetID] for the given address in the state of the given block number.
         * "latest", "pending", and "accepted" meta block numbers are also allowed.
         *
         * @param hexAddress The hex representation of the address
         * @param blockHeight The block height
         * @param assetID The asset ID
         *
         * @returns Returns a Promise object containing the balance
         */
        _this.getAssetBalance = function (hexAddress, blockHeight, assetID) { return __awaiter(_this, void 0, void 0, function () {
            var params, method, path, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [hexAddress, blockHeight, assetID];
                        method = "eth_getAssetBalance";
                        path = "ext/bc/C/rpc";
                        return [4 /*yield*/, this.callMethod(method, params, path)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        }); };
        /**
         * Returns the status of a provided atomic transaction ID by calling the node's `getAtomicTxStatus` method.
         *
         * @param txID The string representation of the transaction ID
         *
         * @returns Returns a Promise string containing the status retrieved from the node
         */
        _this.getAtomicTxStatus = function (txID) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            txID: txID
                        };
                        return [4 /*yield*/, this.callMethod("avax.getAtomicTxStatus", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.status
                                ? response.data.result.status
                                : response.data.result];
                }
            });
        }); };
        /**
         * Returns the transaction data of a provided transaction ID by calling the node's `getAtomicTx` method.
         *
         * @param txID The string representation of the transaction ID
         *
         * @returns Returns a Promise string containing the bytes retrieved from the node
         */
        _this.getAtomicTx = function (txID) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            txID: txID
                        };
                        return [4 /*yield*/, this.callMethod("avax.getAtomicTx", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.tx];
                }
            });
        }); };
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
         * Send ANT (Avalanche Native Token) assets including AVAX from the C-Chain to an account on the X-Chain.
         *
         * After calling this method, you must call the X-Chain’s import method to complete the transfer.
         *
         * @param username The Keystore user that controls the X-Chain account specified in `to`
         * @param password The password of the Keystore user
         * @param to The account on the X-Chain to send the AVAX to.
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
                            to: to,
                            amount: amount.toString(10),
                            username: username,
                            password: password,
                            assetID: assetID
                        };
                        return [4 /*yield*/, this.callMethod("avax.export", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID
                                ? response.data.result.txID
                                : response.data.result];
                }
            });
        }); };
        /**
         * Send AVAX from the C-Chain to an account on the X-Chain.
         *
         * After calling this method, you must call the X-Chain’s importAVAX method to complete the transfer.
         *
         * @param username The Keystore user that controls the X-Chain account specified in `to`
         * @param password The password of the Keystore user
         * @param to The account on the X-Chain to send the AVAX to.
         * @param amount Amount of AVAX to export as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns String representing the transaction id
         */
        _this.exportAVAX = function (username, password, to, amount) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            to: to,
                            amount: amount.toString(10),
                            username: username,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("avax.exportAVAX", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID
                                ? response.data.result.txID
                                : response.data.result];
                }
            });
        }); };
        /**
         * Retrieves the UTXOs related to the addresses provided from the node's `getUTXOs` method.
         *
         * @param addresses An array of addresses as cb58 strings or addresses as {@link https://github.com/feross/buffer|Buffer}s
         * @param sourceChain A string for the chain to look for the UTXO's. Default is to use this chain, but if exported UTXOs exist
         * from other chains, this can used to pull them instead.
         * @param limit Optional. Returns at most [limit] addresses. If [limit] == 0 or > [maxUTXOsToFetch], fetches up to [maxUTXOsToFetch].
         * @param startIndex Optional. [StartIndex] defines where to start fetching UTXOs (for pagination.)
         * UTXOs fetched are from addresses equal to or greater than [StartIndex.Address]
         * For address [StartIndex.Address], only UTXOs with IDs greater than [StartIndex.Utxo] will be returned.
         */
        _this.getUTXOs = function (addresses, sourceChain, limit, startIndex, encoding) {
            if (sourceChain === void 0) { sourceChain = undefined; }
            if (limit === void 0) { limit = 0; }
            if (startIndex === void 0) { startIndex = undefined; }
            if (encoding === void 0) { encoding = "hex"; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response, utxos, data, cb58Strs_1;
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
                            return [4 /*yield*/, this.callMethod("avax.getUTXOs", params)];
                        case 1:
                            response = _a.sent();
                            utxos = new utxos_1.UTXOSet();
                            data = response.data.result.utxos;
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
         * Send ANT (Avalanche Native Token) assets including AVAX from an account on the X-Chain to an address on the C-Chain. This transaction
         * must be signed with the key of the account that the asset is sent from and which pays
         * the transaction fee.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address of the account the asset is sent to.
         * @param sourceChain The chainID where the funds are coming from. Ex: "X"
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
                            to: to,
                            sourceChain: sourceChain,
                            username: username,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("avax.import", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID
                                ? response.data.result.txID
                                : response.data.result];
                }
            });
        }); };
        /**
         * Send AVAX from an account on the X-Chain to an address on the C-Chain. This transaction
         * must be signed with the key of the account that the AVAX is sent from and which pays
         * the transaction fee.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address of the account the AVAX is sent to. This must be the same as the to
         * argument in the corresponding call to the X-Chain’s exportAVAX
         * @param sourceChain The chainID where the funds are coming from.
         *
         * @returns Promise for a string for the transaction, which should be sent to the network
         * by calling issueTx.
         */
        _this.importAVAX = function (username, password, to, sourceChain) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            to: to,
                            sourceChain: sourceChain,
                            username: username,
                            password: password
                        };
                        return [4 /*yield*/, this.callMethod("avax.importAVAX", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID
                                ? response.data.result.txID
                                : response.data.result];
                }
            });
        }); };
        /**
         * Give a user control over an address by providing the private key that controls the address.
         *
         * @param username The name of the user to store the private key
         * @param password The password that unlocks the user
         * @param privateKey A string representing the private key in the vm"s format
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
                        return [4 /*yield*/, this.callMethod("avax.importKey", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.address
                                ? response.data.result.address
                                : response.data.result];
                }
            });
        }); };
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
                            throw new errors_1.TransactionError("Error - avax.issueTx: provided tx is not expected type of string, Buffer, or Tx");
                        }
                        params = {
                            tx: Transaction.toString(),
                            encoding: "hex"
                        };
                        return [4 /*yield*/, this.callMethod("avax.issueTx", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID
                                ? response.data.result.txID
                                : response.data.result];
                }
            });
        }); };
        /**
         * Exports the private key for an address.
         *
         * @param username The name of the user with the private key
         * @param password The password used to decrypt the private key
         * @param address The address whose private key should be exported
         *
         * @returns Promise with the decrypted private key and private key hex as store in the database
         */
        _this.exportKey = function (username, password, address) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password,
                            address: address
                        };
                        return [4 /*yield*/, this.callMethod("avax.exportKey", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        /**
         * Helper function which creates an unsigned Import Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param toAddress The address to send the funds
         * @param ownerAddresses The addresses being used to import
         * @param sourceChain The chainid for where the import is coming from
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[ImportTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        _this.buildImportTx = function (utxoset, toAddress, ownerAddresses, sourceChain, fromAddresses, fee) {
            if (fee === void 0) { fee = new bn_js_1.default(0); }
            return __awaiter(_this, void 0, void 0, function () {
                var from, srcChain, utxoResponse, atomicUTXOs, networkID, avaxAssetID, avaxAssetIDBuf, atomics, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            from = this._cleanAddressArray(fromAddresses, "buildImportTx").map(function (a) { return bintools.stringToAddress(a); });
                            srcChain = undefined;
                            if (typeof sourceChain === "string") {
                                // if there is a sourceChain passed in and it's a string then save the string value and cast the original
                                // variable from a string to a Buffer
                                srcChain = sourceChain;
                                sourceChain = bintools.cb58Decode(sourceChain);
                            }
                            else if (typeof sourceChain === "undefined" ||
                                !(sourceChain instanceof buffer_1.Buffer)) {
                                // if there is no sourceChain passed in or the sourceChain is any data type other than a Buffer then throw an error
                                throw new errors_1.ChainIdError("Error - EVMAPI.buildImportTx: sourceChain is undefined or invalid sourceChain type.");
                            }
                            return [4 /*yield*/, this.getUTXOs(ownerAddresses, srcChain, 0, undefined)];
                        case 1:
                            utxoResponse = _a.sent();
                            atomicUTXOs = utxoResponse.utxos;
                            networkID = this.core.getNetworkID();
                            avaxAssetID = constants_1.Defaults.network["".concat(networkID)].X.avaxAssetID;
                            avaxAssetIDBuf = bintools.cb58Decode(avaxAssetID);
                            atomics = atomicUTXOs.getAllUTXOs();
                            if (atomics.length === 0) {
                                throw new errors_1.NoAtomicUTXOsError("Error - EVMAPI.buildImportTx: no atomic utxos to import");
                            }
                            builtUnsignedTx = utxoset.buildImportTx(networkID, bintools.cb58Decode(this.blockchainID), toAddress, atomics, sourceChain, fee, avaxAssetIDBuf);
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned Export Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param assetID The asset id which is being sent
         * @param destinationChain The chainid for where the assets will be sent.
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[ExportTx]].
         */
        _this.buildExportTx = function (amount, assetID, destinationChain, fromAddressHex, fromAddressBech, toAddresses, nonce, locktime, threshold, fee) {
            if (nonce === void 0) { nonce = 0; }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            if (fee === void 0) { fee = new bn_js_1.default(0); }
            return __awaiter(_this, void 0, void 0, function () {
                var prefixes, assetDescription, evmInputs, evmInput, evmAVAXInput, evmANTInput, to, exportedOuts, secpTransferOutput, transferableOutput, exportTx, unsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prefixes = {};
                            toAddresses.map(function (address) {
                                prefixes[address.split("-")[0]] = true;
                            });
                            if (Object.keys(prefixes).length !== 1) {
                                throw new errors_1.AddressError("Error - EVMAPI.buildExportTx: To addresses must have the same chainID prefix.");
                            }
                            if (typeof destinationChain === "undefined") {
                                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Destination ChainID is undefined.");
                            }
                            else if (typeof destinationChain === "string") {
                                destinationChain = bintools.cb58Decode(destinationChain);
                            }
                            else if (!(destinationChain instanceof buffer_1.Buffer)) {
                                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Invalid destinationChain type");
                            }
                            if (destinationChain.length !== 32) {
                                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Destination ChainID must be 32 bytes in length.");
                            }
                            return [4 /*yield*/, this.getAssetDescription("AVAX")];
                        case 1:
                            assetDescription = _a.sent();
                            evmInputs = [];
                            if (bintools.cb58Encode(assetDescription.assetID) === assetID) {
                                evmInput = new inputs_1.EVMInput(fromAddressHex, amount.add(fee), assetID, nonce);
                                evmInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                                evmInputs.push(evmInput);
                            }
                            else {
                                evmAVAXInput = new inputs_1.EVMInput(fromAddressHex, fee, assetDescription.assetID, nonce);
                                evmAVAXInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                                evmInputs.push(evmAVAXInput);
                                evmANTInput = new inputs_1.EVMInput(fromAddressHex, amount, assetID, nonce);
                                evmANTInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                                evmInputs.push(evmANTInput);
                            }
                            to = [];
                            toAddresses.map(function (address) {
                                to.push(bintools.stringToAddress(address));
                            });
                            exportedOuts = [];
                            secpTransferOutput = new outputs_1.SECPTransferOutput(amount, to, locktime, threshold);
                            transferableOutput = new outputs_1.TransferableOutput(bintools.cb58Decode(assetID), secpTransferOutput);
                            exportedOuts.push(transferableOutput);
                            // lexicographically sort ins and outs
                            evmInputs = evmInputs.sort(inputs_1.EVMInput.comparator());
                            exportedOuts = exportedOuts.sort(outputs_1.TransferableOutput.comparator());
                            exportTx = new exporttx_1.ExportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), destinationChain, evmInputs, exportedOuts);
                            unsignedTx = new tx_1.UnsignedTx(exportTx);
                            return [2 /*return*/, unsignedTx];
                    }
                });
            });
        };
        /**
         * Gets a reference to the keychain for this class.
         *
         * @returns The instance of [[KeyChain]] for this class
         */
        _this.keyChain = function () { return _this.keychain; };
        /**
         *
         * @returns new instance of [[KeyChain]]
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
         * @returns a Promise string containing the base fee for the next block.
         */
        _this.getBaseFee = function () { return __awaiter(_this, void 0, void 0, function () {
            var params, method, path, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        method = "eth_baseFee";
                        path = "ext/bc/C/rpc";
                        return [4 /*yield*/, this.callMethod(method, params, path)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        /**
         * returns the priority fee needed to be included in a block.
         *
         * @returns Returns a Promise string containing the priority fee needed to be included in a block.
         */
        _this.getMaxPriorityFeePerGas = function () { return __awaiter(_this, void 0, void 0, function () {
            var params, method, path, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        method = "eth_maxPriorityFeePerGas";
                        path = "ext/bc/C/rpc";
                        return [4 /*yield*/, this.callMethod(method, params, path)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        _this.blockchainID = blockchainID;
        var netID = core.getNetworkID();
        if (netID in constants_1.Defaults.network &&
            blockchainID in constants_1.Defaults.network["".concat(netID)]) {
            var alias = constants_1.Defaults.network["".concat(netID)]["".concat(blockchainID)]["alias"];
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
    EVMAPI.prototype._cleanAddressArray = function (addresses, caller) {
        var _this = this;
        var addrs = [];
        var chainid = this.getBlockchainAlias()
            ? this.getBlockchainAlias()
            : this.getBlockchainID();
        if (addresses && addresses.length > 0) {
            addresses.forEach(function (address) {
                if (typeof address === "string") {
                    if (typeof _this.parseAddress(address) === "undefined") {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - Invalid address format");
                    }
                    addrs.push(address);
                }
                else {
                    var type = "bech32";
                    addrs.push(serialization.bufferToType(address, type, _this.core.getHRP(), chainid));
                }
            });
        }
        return addrs;
    };
    return EVMAPI;
}(jrpcapi_1.JRPCAPI));
exports.EVMAPI = EVMAPI;
