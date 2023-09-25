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
exports.PlatformVMAPI = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM
 */
var buffer_1 = require("buffer/");
var bn_js_1 = require("bn.js");
var jrpcapi_1 = require("../../common/jrpcapi");
var bintools_1 = require("../../utils/bintools");
var keychain_1 = require("./keychain");
var constants_1 = require("../../utils/constants");
var constants_2 = require("./constants");
var tx_1 = require("./tx");
var payload_1 = require("../../utils/payload");
var helperfunctions_1 = require("../../utils/helperfunctions");
var utxos_1 = require("../platformvm/utxos");
var errors_1 = require("../../utils/errors");
var outputs_1 = require("./outputs");
var utils_1 = require("../../utils");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
var serialization = utils_1.Serialization.getInstance();
/**
 * Class for interacting with a node's PlatformVMAPI
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Avalanche.addAPI]] function to register this interface with Avalanche.
 */
var PlatformVMAPI = /** @class */ (function (_super) {
    __extends(PlatformVMAPI, _super);
    /**
     * This class should not be instantiated directly.
     * Instead use the [[Avalanche.addAPI]] method.
     *
     * @param core A reference to the Avalanche class
     * @param baseURL Defaults to the string "/ext/P" as the path to blockchain's baseURL
     */
    function PlatformVMAPI(core, baseURL) {
        if (baseURL === void 0) { baseURL = "/ext/bc/P"; }
        var _this = _super.call(this, core, baseURL) || this;
        /**
         * @ignore
         */
        _this.keychain = new keychain_1.KeyChain("", "");
        _this.blockchainID = constants_1.PlatformChainID;
        _this.blockchainAlias = undefined;
        _this.AVAXAssetID = undefined;
        _this.txFee = undefined;
        _this.creationTxFee = undefined;
        _this.minValidatorStake = undefined;
        _this.minDelegatorStake = undefined;
        /**
         * Gets the alias for the blockchainID if it exists, otherwise returns `undefined`.
         *
         * @returns The alias for the blockchainID
         */
        _this.getBlockchainAlias = function () {
            if (typeof _this.blockchainAlias === "undefined") {
                var netid = _this.core.getNetworkID();
                if (netid in constants_1.Defaults.network &&
                    _this.blockchainID in constants_1.Defaults.network["".concat(netid)]) {
                    _this.blockchainAlias =
                        constants_1.Defaults.network["".concat(netid)][_this.blockchainID]["alias"];
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
                typeof constants_1.Defaults.network["".concat(netid)] !== "undefined") {
                _this.blockchainID = constants_1.PlatformChainID; //default to P-Chain
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
            return bintools.parseAddress(addr, blockchainID, alias, constants_2.PlatformVMConstants.ADDRESSLENGTH);
        };
        _this.addressFromBuffer = function (address) {
            var chainid = _this.getBlockchainAlias()
                ? _this.getBlockchainAlias()
                : _this.getBlockchainID();
            var type = "bech32";
            return serialization.bufferToType(address, type, _this.core.getHRP(), chainid);
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
                var assetID;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(typeof this.AVAXAssetID === "undefined" || refresh)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getStakingAssetID()];
                        case 1:
                            assetID = _a.sent();
                            this.AVAXAssetID = bintools.cb58Decode(assetID);
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
                ? new bn_js_1.default(constants_1.Defaults.network[_this.core.getNetworkID()]["P"]["txFee"])
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
         * Gets the CreateSubnetTx fee.
         *
         * @returns The CreateSubnetTx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.getCreateSubnetTxFee = function () {
            return _this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[_this.core.getNetworkID()]["P"]["createSubnetTx"])
                : new bn_js_1.default(0);
        };
        /**
         * Gets the CreateChainTx fee.
         *
         * @returns The CreateChainTx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        _this.getCreateChainTxFee = function () {
            return _this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[_this.core.getNetworkID()]["P"]["createChainTx"])
                : new bn_js_1.default(0);
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
            return _this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[_this.core.getNetworkID()]["P"]["creationTxFee"])
                : new bn_js_1.default(0);
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
         * @returns The instance of [[]] for this class
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
                            if (fee.lte(constants_1.ONEAVAX.mul(new bn_js_1.default(10))) || fee.lte(outputTotal)) {
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
         * Retrieves an assetID for a subnet"s staking assset.
         *
         * @returns Returns a Promise string with cb58 encoded value of the assetID.
         */
        _this.getStakingAssetID = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("platform.getStakingAssetID")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.assetID];
                }
            });
        }); };
        /**
         * Creates a new blockchain.
         *
         * @param username The username of the Keystore user that controls the new account
         * @param password The password of the Keystore user that controls the new account
         * @param subnetID Optional. Either a {@link https://github.com/feross/buffer|Buffer} or an cb58 serialized string for the SubnetID or its alias.
         * @param vmID The ID of the Virtual Machine the blockchain runs. Can also be an alias of the Virtual Machine.
         * @param fxIDs The ids of the FXs the VM is running.
         * @param name A human-readable name for the new blockchain
         * @param genesis The base 58 (with checksum) representation of the genesis state of the new blockchain. Virtual Machines should have a static API method named buildGenesis that can be used to generate genesisData.
         *
         * @returns Promise for the unsigned transaction to create this blockchain. Must be signed by a sufficient number of the Subnet’s control keys and by the account paying the transaction fee.
         */
        _this.createBlockchain = function (username, password, subnetID, vmID, fxIDs, name, genesis) {
            if (subnetID === void 0) { subnetID = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                username: username,
                                password: password,
                                fxIDs: fxIDs,
                                vmID: vmID,
                                name: name,
                                genesisData: genesis
                            };
                            if (typeof subnetID === "string") {
                                params.subnetID = subnetID;
                            }
                            else if (typeof subnetID !== "undefined") {
                                params.subnetID = bintools.cb58Encode(subnetID);
                            }
                            return [4 /*yield*/, this.callMethod("platform.createBlockchain", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.txID];
                    }
                });
            });
        };
        /**
         * Gets the status of a blockchain.
         *
         * @param blockchainID The blockchainID requesting a status update
         *
         * @returns Promise for a string of one of: "Validating", "Created", "Preferred", "Unknown".
         */
        _this.getBlockchainStatus = function (blockchainID) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            blockchainID: blockchainID
                        };
                        return [4 /*yield*/, this.callMethod("platform.getBlockchainStatus", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.status];
                }
            });
        }); };
        /**
         * Get the validators and their weights of a subnet or the Primary Network at a given P-Chain height.
         *
         * @param height The P-Chain height to get the validator set at.
         * @param subnetID Optional. A cb58 serialized string for the SubnetID or its alias.
         *
         * @returns Promise GetValidatorsAtResponse
         */
        _this.getValidatorsAt = function (height, subnetID) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            height: height
                        };
                        if (typeof subnetID !== "undefined") {
                            params.subnetID = subnetID;
                        }
                        return [4 /*yield*/, this.callMethod("platform.getValidatorsAt", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        /**
         * Create an address in the node's keystore.
         *
         * @param username The username of the Keystore user that controls the new account
         * @param password The password of the Keystore user that controls the new account
         *
         * @returns Promise for a string of the newly created account address.
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
                        return [4 /*yield*/, this.callMethod("platform.createAddress", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.address];
                }
            });
        }); };
        /**
         * Gets the balance of a particular asset.
         *
         * @param addresses The addresses to pull the asset balance from
         *
         * @returns Promise with the balance as a {@link https://github.com/indutny/bn.js/|BN} on the provided address.
         */
        _this.getBalance = function (addresses) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addresses.forEach(function (address) {
                            if (typeof _this.parseAddress(address) === "undefined") {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - PlatformVMAPI.getBalance: Invalid address format");
                            }
                        });
                        params = {
                            addresses: addresses
                        };
                        return [4 /*yield*/, this.callMethod("platform.getBalance", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        /**
         * List the addresses controlled by the user.
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         *
         * @returns Promise for an array of addresses.
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
                        return [4 /*yield*/, this.callMethod("platform.listAddresses", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.addresses];
                }
            });
        }); };
        /**
         * Lists the set of current validators.
         *
         * @param subnetID Optional. Either a {@link https://github.com/feross/buffer|Buffer} or an
         * cb58 serialized string for the SubnetID or its alias.
         * @param nodeIDs Optional. An array of strings
         *
         * @returns Promise for an array of validators that are currently staking, see: {@link https://docs.avax.network/v1.0/en/api/platform/#platformgetcurrentvalidators|platform.getCurrentValidators documentation}.
         *
         */
        _this.getCurrentValidators = function (subnetID, nodeIDs) {
            if (subnetID === void 0) { subnetID = undefined; }
            if (nodeIDs === void 0) { nodeIDs = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {};
                            if (typeof subnetID === "string") {
                                params.subnetID = subnetID;
                            }
                            else if (typeof subnetID !== "undefined") {
                                params.subnetID = bintools.cb58Encode(subnetID);
                            }
                            if (typeof nodeIDs != "undefined" && nodeIDs.length > 0) {
                                params.nodeIDs = nodeIDs;
                            }
                            return [4 /*yield*/, this.callMethod("platform.getCurrentValidators", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                    }
                });
            });
        };
        /**
         * Lists the set of pending validators.
         *
         * @param subnetID Optional. Either a {@link https://github.com/feross/buffer|Buffer}
         * or a cb58 serialized string for the SubnetID or its alias.
         * @param nodeIDs Optional. An array of strings
         *
         * @returns Promise for an array of validators that are pending staking, see: {@link https://docs.avax.network/v1.0/en/api/platform/#platformgetpendingvalidators|platform.getPendingValidators documentation}.
         *
         */
        _this.getPendingValidators = function (subnetID, nodeIDs) {
            if (subnetID === void 0) { subnetID = undefined; }
            if (nodeIDs === void 0) { nodeIDs = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {};
                            if (typeof subnetID === "string") {
                                params.subnetID = subnetID;
                            }
                            else if (typeof subnetID !== "undefined") {
                                params.subnetID = bintools.cb58Encode(subnetID);
                            }
                            if (typeof nodeIDs != "undefined" && nodeIDs.length > 0) {
                                params.nodeIDs = nodeIDs;
                            }
                            return [4 /*yield*/, this.callMethod("platform.getPendingValidators", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                    }
                });
            });
        };
        /**
         * Samples `Size` validators from the current validator set.
         *
         * @param sampleSize Of the total universe of validators, select this many at random
         * @param subnetID Optional. Either a {@link https://github.com/feross/buffer|Buffer} or an
         * cb58 serialized string for the SubnetID or its alias.
         *
         * @returns Promise for an array of validator"s stakingIDs.
         */
        _this.sampleValidators = function (sampleSize, subnetID) {
            if (subnetID === void 0) { subnetID = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                size: sampleSize.toString()
                            };
                            if (typeof subnetID === "string") {
                                params.subnetID = subnetID;
                            }
                            else if (typeof subnetID !== "undefined") {
                                params.subnetID = bintools.cb58Encode(subnetID);
                            }
                            return [4 /*yield*/, this.callMethod("platform.sampleValidators", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.validators];
                    }
                });
            });
        };
        /**
         * Add a validator to the Primary Network.
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         * @param nodeID The node ID of the validator
         * @param startTime Javascript Date object for the start time to validate
         * @param endTime Javascript Date object for the end time to validate
         * @param stakeAmount The amount of nAVAX the validator is staking as
         * a {@link https://github.com/indutny/bn.js/|BN}
         * @param rewardAddress The address the validator reward will go to, if there is one.
         * @param delegationFeeRate Optional. A {@link https://github.com/indutny/bn.js/|BN} for the percent fee this validator
         * charges when others delegate stake to them. Up to 4 decimal places allowed additional decimal places are ignored.
         * Must be between 0 and 100, inclusive. For example, if delegationFeeRate is 1.2345 and someone delegates to this
         * validator, then when the delegation period is over, 1.2345% of the reward goes to the validator and the rest goes
         * to the delegator.
         *
         * @returns Promise for a base58 string of the unsigned transaction.
         */
        _this.addValidator = function (username, password, nodeID, startTime, endTime, stakeAmount, rewardAddress, delegationFeeRate) {
            if (delegationFeeRate === void 0) { delegationFeeRate = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                username: username,
                                password: password,
                                nodeID: nodeID,
                                startTime: startTime.getTime() / 1000,
                                endTime: endTime.getTime() / 1000,
                                stakeAmount: stakeAmount.toString(10),
                                rewardAddress: rewardAddress
                            };
                            if (typeof delegationFeeRate !== "undefined") {
                                params.delegationFeeRate = delegationFeeRate.toString(10);
                            }
                            return [4 /*yield*/, this.callMethod("platform.addValidator", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.txID];
                    }
                });
            });
        };
        /**
         * Add a validator to a Subnet other than the Primary Network. The validator must validate the Primary Network for the entire duration they validate this Subnet.
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         * @param nodeID The node ID of the validator
         * @param subnetID Either a {@link https://github.com/feross/buffer|Buffer} or a cb58 serialized string for the SubnetID or its alias.
         * @param startTime Javascript Date object for the start time to validate
         * @param endTime Javascript Date object for the end time to validate
         * @param weight The validator’s weight used for sampling
         *
         * @returns Promise for the unsigned transaction. It must be signed (using sign) by the proper number of the Subnet’s control keys and by the key of the account paying the transaction fee before it can be issued.
         */
        _this.addSubnetValidator = function (username, password, nodeID, subnetID, startTime, endTime, weight) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password,
                            nodeID: nodeID,
                            startTime: startTime.getTime() / 1000,
                            endTime: endTime.getTime() / 1000,
                            weight: weight
                        };
                        if (typeof subnetID === "string") {
                            params.subnetID = subnetID;
                        }
                        else if (typeof subnetID !== "undefined") {
                            params.subnetID = bintools.cb58Encode(subnetID);
                        }
                        return [4 /*yield*/, this.callMethod("platform.addSubnetValidator", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID];
                }
            });
        }); };
        /**
         * Add a delegator to the Primary Network.
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         * @param nodeID The node ID of the delegatee
         * @param startTime Javascript Date object for when the delegator starts delegating
         * @param endTime Javascript Date object for when the delegator starts delegating
         * @param stakeAmount The amount of nAVAX the delegator is staking as
         * a {@link https://github.com/indutny/bn.js/|BN}
         * @param rewardAddress The address of the account the staked AVAX and validation reward
         * (if applicable) are sent to at endTime
         *
         * @returns Promise for an array of validator"s stakingIDs.
         */
        _this.addDelegator = function (username, password, nodeID, startTime, endTime, stakeAmount, rewardAddress) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password,
                            nodeID: nodeID,
                            startTime: startTime.getTime() / 1000,
                            endTime: endTime.getTime() / 1000,
                            stakeAmount: stakeAmount.toString(10),
                            rewardAddress: rewardAddress
                        };
                        return [4 /*yield*/, this.callMethod("platform.addDelegator", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID];
                }
            });
        }); };
        /**
         * Create an unsigned transaction to create a new Subnet. The unsigned transaction must be
         * signed with the key of the account paying the transaction fee. The Subnet’s ID is the ID of the transaction that creates it (ie the response from issueTx when issuing the signed transaction).
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         * @param controlKeys Array of platform addresses as strings
         * @param threshold To add a validator to this Subnet, a transaction must have threshold
         * signatures, where each signature is from a key whose address is an element of `controlKeys`
         *
         * @returns Promise for a string with the unsigned transaction encoded as base58.
         */
        _this.createSubnet = function (username, password, controlKeys, threshold) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password,
                            controlKeys: controlKeys,
                            threshold: threshold
                        };
                        return [4 /*yield*/, this.callMethod("platform.createSubnet", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID
                                ? response.data.result.txID
                                : response.data.result];
                }
            });
        }); };
        /**
         * Get the Subnet that validates a given blockchain.
         *
         * @param blockchainID Either a {@link https://github.com/feross/buffer|Buffer} or a cb58
         * encoded string for the blockchainID or its alias.
         *
         * @returns Promise for a string of the subnetID that validates the blockchain.
         */
        _this.validatedBy = function (blockchainID) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            blockchainID: blockchainID
                        };
                        return [4 /*yield*/, this.callMethod("platform.validatedBy", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.subnetID];
                }
            });
        }); };
        /**
         * Get the IDs of the blockchains a Subnet validates.
         *
         * @param subnetID Either a {@link https://github.com/feross/buffer|Buffer} or an AVAX
         * serialized string for the SubnetID or its alias.
         *
         * @returns Promise for an array of blockchainIDs the subnet validates.
         */
        _this.validates = function (subnetID) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            subnetID: subnetID
                        };
                        if (typeof subnetID === "string") {
                            params.subnetID = subnetID;
                        }
                        else if (typeof subnetID !== "undefined") {
                            params.subnetID = bintools.cb58Encode(subnetID);
                        }
                        return [4 /*yield*/, this.callMethod("platform.validates", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.blockchainIDs];
                }
            });
        }); };
        /**
         * Get all the blockchains that exist (excluding the P-Chain).
         *
         * @returns Promise for an array of objects containing fields "id", "subnetID", and "vmID".
         */
        _this.getBlockchains = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("platform.getBlockchains")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.blockchains];
                }
            });
        }); };
        /**
         * Send AVAX from an account on the P-Chain to an address on the X-Chain. This transaction
         * must be signed with the key of the account that the AVAX is sent from and which pays the
         * transaction fee. After issuing this transaction, you must call the X-Chain’s importAVAX
         * method to complete the transfer.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address on the X-Chain to send the AVAX to. Do not include X- in the address
         * @param amount Amount of AVAX to export as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns Promise for an unsigned transaction to be signed by the account the the AVAX is
         * sent from and pays the transaction fee.
         */
        _this.exportAVAX = function (username, password, amount, to) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            username: username,
                            password: password,
                            to: to,
                            amount: amount.toString(10)
                        };
                        return [4 /*yield*/, this.callMethod("platform.exportAVAX", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID
                                ? response.data.result.txID
                                : response.data.result];
                }
            });
        }); };
        /**
         * Send AVAX from an account on the P-Chain to an address on the X-Chain. This transaction
         * must be signed with the key of the account that the AVAX is sent from and which pays
         * the transaction fee. After issuing this transaction, you must call the X-Chain’s
         * importAVAX method to complete the transfer.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The ID of the account the AVAX is sent to. This must be the same as the to
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
                        return [4 /*yield*/, this.callMethod("platform.importAVAX", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID
                                ? response.data.result.txID
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
                            throw new errors_1.TransactionError("Error - platform.issueTx: provided tx is not expected type of string, Buffer, or Tx");
                        }
                        params = {
                            tx: Transaction.toString(),
                            encoding: "hex"
                        };
                        return [4 /*yield*/, this.callMethod("platform.issueTx", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.txID];
                }
            });
        }); };
        /**
         * Returns an upper bound on the amount of tokens that exist. Not monotonically increasing because this number can go down if a staker"s reward is denied.
         */
        _this.getCurrentSupply = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("platform.getCurrentSupply")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new bn_js_1.default(response.data.result.supply, 10)];
                }
            });
        }); };
        /**
         * Returns the height of the platform chain.
         */
        _this.getHeight = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("platform.getHeight")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new bn_js_1.default(response.data.result.height, 10)];
                }
            });
        }); };
        /**
         * Gets the minimum staking amount.
         *
         * @param refresh A boolean to bypass the local cached value of Minimum Stake Amount, polling the node instead.
         */
        _this.getMinStake = function (refresh) {
            if (refresh === void 0) { refresh = false; }
            return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (refresh !== true &&
                                typeof this.minValidatorStake !== "undefined" &&
                                typeof this.minDelegatorStake !== "undefined") {
                                return [2 /*return*/, {
                                        minValidatorStake: this.minValidatorStake,
                                        minDelegatorStake: this.minDelegatorStake
                                    }];
                            }
                            return [4 /*yield*/, this.callMethod("platform.getMinStake")];
                        case 1:
                            response = _a.sent();
                            this.minValidatorStake = new bn_js_1.default(response.data.result.minValidatorStake, 10);
                            this.minDelegatorStake = new bn_js_1.default(response.data.result.minDelegatorStake, 10);
                            return [2 /*return*/, {
                                    minValidatorStake: this.minValidatorStake,
                                    minDelegatorStake: this.minDelegatorStake
                                }];
                    }
                });
            });
        };
        /**
         * getTotalStake() returns the total amount staked on the Primary Network
         *
         * @returns A big number representing total staked by validators on the primary network
         */
        _this.getTotalStake = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("platform.getTotalStake")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new bn_js_1.default(response.data.result.stake, 10)];
                }
            });
        }); };
        /**
         * getMaxStakeAmount() returns the maximum amount of nAVAX staking to the named node during the time period.
         *
         * @param subnetID A Buffer or cb58 string representing subnet
         * @param nodeID A string representing ID of the node whose stake amount is required during the given duration
         * @param startTime A big number denoting start time of the duration during which stake amount of the node is required.
         * @param endTime A big number denoting end time of the duration during which stake amount of the node is required.
         * @returns A big number representing total staked by validators on the primary network
         */
        _this.getMaxStakeAmount = function (subnetID, nodeID, startTime, endTime) { return __awaiter(_this, void 0, void 0, function () {
            var now, params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = (0, helperfunctions_1.UnixNow)();
                        if (startTime.gt(now) || endTime.lte(startTime)) {
                            throw new errors_1.TimeError("PlatformVMAPI.getMaxStakeAmount -- startTime must be in the past and endTime must come after startTime");
                        }
                        params = {
                            nodeID: nodeID,
                            startTime: startTime,
                            endTime: endTime
                        };
                        if (typeof subnetID === "string") {
                            params.subnetID = subnetID;
                        }
                        else if (typeof subnetID !== "undefined") {
                            params.subnetID = bintools.cb58Encode(subnetID);
                        }
                        return [4 /*yield*/, this.callMethod("platform.getMaxStakeAmount", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new bn_js_1.default(response.data.result.amount, 10)];
                }
            });
        }); };
        /**
         * Sets the minimum stake cached in this class.
         * @param minValidatorStake A {@link https://github.com/indutny/bn.js/|BN} to set the minimum stake amount cached in this class.
         * @param minDelegatorStake A {@link https://github.com/indutny/bn.js/|BN} to set the minimum delegation amount cached in this class.
         */
        _this.setMinStake = function (minValidatorStake, minDelegatorStake) {
            if (minValidatorStake === void 0) { minValidatorStake = undefined; }
            if (minDelegatorStake === void 0) { minDelegatorStake = undefined; }
            if (typeof minValidatorStake !== "undefined") {
                _this.minValidatorStake = minValidatorStake;
            }
            if (typeof minDelegatorStake !== "undefined") {
                _this.minDelegatorStake = minDelegatorStake;
            }
        };
        /**
         * Gets the total amount staked for an array of addresses.
         */
        _this.getStake = function (addresses, encoding) {
            if (encoding === void 0) { encoding = "hex"; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                addresses: addresses,
                                encoding: encoding
                            };
                            return [4 /*yield*/, this.callMethod("platform.getStake", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, {
                                    staked: new bn_js_1.default(response.data.result.staked, 10),
                                    stakedOutputs: response.data.result.stakedOutputs.map(function (stakedOutput) {
                                        var transferableOutput = new outputs_1.TransferableOutput();
                                        var buf;
                                        if (encoding === "cb58") {
                                            buf = bintools.cb58Decode(stakedOutput);
                                        }
                                        else {
                                            buf = buffer_1.Buffer.from(stakedOutput.replace(/0x/g, ""), "hex");
                                        }
                                        transferableOutput.fromBuffer(buf, 2);
                                        return transferableOutput;
                                    })
                                }];
                    }
                });
            });
        };
        /**
         * Get all the subnets that exist.
         *
         * @param ids IDs of the subnets to retrieve information about. If omitted, gets all subnets
         *
         * @returns Promise for an array of objects containing fields "id",
         * "controlKeys", and "threshold".
         */
        _this.getSubnets = function (ids) {
            if (ids === void 0) { ids = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {};
                            if (typeof ids !== undefined) {
                                params.ids = ids;
                            }
                            return [4 /*yield*/, this.callMethod("platform.getSubnets", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.subnets];
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
                        params = {
                            username: username,
                            password: password,
                            address: address
                        };
                        return [4 /*yield*/, this.callMethod("platform.exportKey", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.privateKey
                                ? response.data.result.privateKey
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
                        return [4 /*yield*/, this.callMethod("platform.importKey", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.address
                                ? response.data.result.address
                                : response.data.result];
                }
            });
        }); };
        /**
         * Returns the treansaction data of a provided transaction ID by calling the node's `getTx` method.
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
                            return [4 /*yield*/, this.callMethod("platform.getTx", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result.tx
                                    ? response.data.result.tx
                                    : response.data.result];
                    }
                });
            });
        };
        /**
         * Returns the status of a provided transaction ID by calling the node's `getTxStatus` method.
         *
         * @param txid The string representation of the transaction ID
         * @param includeReason Return the reason tx was dropped, if applicable. Defaults to true
         *
         * @returns Returns a Promise string containing the status retrieved from the node and the reason a tx was dropped, if applicable.
         */
        _this.getTxStatus = function (txid, includeReason) {
            if (includeReason === void 0) { includeReason = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var params, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                txID: txid,
                                includeReason: includeReason
                            };
                            return [4 /*yield*/, this.callMethod("platform.getTxStatus", params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.result];
                    }
                });
            });
        };
        /**
         * Retrieves the UTXOs related to the addresses provided from the node's `getUTXOs` method.
         *
         * @param addresses An array of addresses as cb58 strings or addresses as {@link https://github.com/feross/buffer|Buffer}s
         * @param sourceChain A string for the chain to look for the UTXO"s. Default is to use this chain, but if exported UTXOs exist from other chains, this can used to pull them instead.
         * @param limit Optional. Returns at most [limit] addresses. If [limit] == 0 or > [maxUTXOsToFetch], fetches up to [maxUTXOsToFetch].
         * @param startIndex Optional. [StartIndex] defines where to start fetching UTXOs (for pagination.)
         * UTXOs fetched are from addresses equal to or greater than [StartIndex.Address]
         * For address [StartIndex.Address], only UTXOs with IDs greater than [StartIndex.Utxo] will be returned.
         * @param persistOpts Options available to persist these UTXOs in local storage
         * @param encoding Optional.  is the encoding format to use for the payload argument. Can be either "cb58" or "hex". Defaults to "hex".
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
                var params, response, utxos, data, selfArray, self_1, cb58Strs_1;
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
                            return [4 /*yield*/, this.callMethod("platform.getUTXOs", params)];
                        case 1:
                            response = _a.sent();
                            utxos = new utxos_1.UTXOSet();
                            data = response.data.result.utxos;
                            if (persistOpts && typeof persistOpts === "object") {
                                if (this.db.has(persistOpts.getName())) {
                                    selfArray = this.db.get(persistOpts.getName());
                                    if (Array.isArray(selfArray)) {
                                        utxos.addArray(data);
                                        self_1 = new utxos_1.UTXOSet();
                                        self_1.addArray(selfArray);
                                        self_1.mergeByRule(utxos, persistOpts.getMergeRule());
                                        data = self_1.getAllUTXOStrings();
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
                            response.data.result.numFetched = parseInt(response.data.result.numFetched);
                            return [2 /*return*/, response.data.result];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned Import Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param ownerAddresses The addresses being used to import
         * @param sourceChain The chainid for where the import is coming from.
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
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
                var to, from, change, srcChain, atomicUTXOs, avaxAssetID, atomics, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            to = this._cleanAddressArray(toAddresses, "buildImportTx").map(function (a) { return bintools.stringToAddress(a); });
                            from = this._cleanAddressArray(fromAddresses, "buildImportTx").map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, "buildImportTx").map(function (a) { return bintools.stringToAddress(a); });
                            srcChain = undefined;
                            if (typeof sourceChain === "undefined") {
                                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildImportTx: Source ChainID is undefined.");
                            }
                            else if (typeof sourceChain === "string") {
                                srcChain = sourceChain;
                                sourceChain = bintools.cb58Decode(sourceChain);
                            }
                            else if (!(sourceChain instanceof buffer_1.Buffer)) {
                                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildImportTx: Invalid destinationChain type: " +
                                    typeof sourceChain);
                            }
                            return [4 /*yield*/, this.getUTXOs(ownerAddresses, srcChain, 0, undefined)];
                        case 1: return [4 /*yield*/, (_a.sent()).utxos];
                        case 2:
                            atomicUTXOs = _a.sent();
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 3:
                            avaxAssetID = _a.sent();
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            atomics = atomicUTXOs.getAllUTXOs();
                            builtUnsignedTx = utxoset.buildImportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), to, from, change, atomics, sourceChain, this.getTxFee(), avaxAssetID, memo, asOf, locktime, threshold);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 4:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
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
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[ExportTx]].
         */
        _this.buildExportTx = function (utxoset, amount, destinationChain, toAddresses, fromAddresses, changeAddresses, memo, asOf, locktime, threshold) {
            if (changeAddresses === void 0) { changeAddresses = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (locktime === void 0) { locktime = new bn_js_1.default(0); }
            if (threshold === void 0) { threshold = 1; }
            return __awaiter(_this, void 0, void 0, function () {
                var prefixes, to, from, change, avaxAssetID, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prefixes = {};
                            toAddresses.map(function (a) {
                                prefixes[a.split("-")[0]] = true;
                            });
                            if (Object.keys(prefixes).length !== 1) {
                                throw new errors_1.AddressError("Error - PlatformVMAPI.buildExportTx: To addresses must have the same chainID prefix.");
                            }
                            if (typeof destinationChain === "undefined") {
                                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildExportTx: Destination ChainID is undefined.");
                            }
                            else if (typeof destinationChain === "string") {
                                destinationChain = bintools.cb58Decode(destinationChain); //
                            }
                            else if (!(destinationChain instanceof buffer_1.Buffer)) {
                                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildExportTx: Invalid destinationChain type: " +
                                    typeof destinationChain);
                            }
                            if (destinationChain.length !== 32) {
                                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildExportTx: Destination ChainID must be 32 bytes in length.");
                            }
                            to = [];
                            toAddresses.map(function (a) {
                                to.push(bintools.stringToAddress(a));
                            });
                            from = this._cleanAddressArray(fromAddresses, "buildExportTx").map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, "buildExportTx").map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            builtUnsignedTx = utxoset.buildExportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), amount, avaxAssetID, to, from, change, destinationChain, this.getTxFee(), avaxAssetID, memo, asOf, locktime, threshold);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned [[AddSubnetValidatorTx]]. For more granular control, you may create your own
         * [[UnsignedTx]] manually and import the [[AddSubnetValidatorTx]] class directly.
         *
         * @param utxoset A set of UTXOs that the transaction is built on.
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees in AVAX
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
         * @param weight The amount of weight for this subnet validator.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param subnetAuthCredentials Optional. An array of index and address to sign for each SubnetAuth.
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildAddSubnetValidatorTx = function (utxoset, fromAddresses, changeAddresses, nodeID, startTime, endTime, weight, subnetID, memo, asOf, subnetAuthCredentials) {
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (subnetAuthCredentials === void 0) { subnetAuthCredentials = []; }
            return __awaiter(_this, void 0, void 0, function () {
                var from, change, avaxAssetID, now, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            from = this._cleanAddressArray(fromAddresses, "buildAddSubnetValidatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, "buildAddSubnetValidatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            now = (0, helperfunctions_1.UnixNow)();
                            if (startTime.lt(now) || endTime.lte(startTime)) {
                                throw new Error("PlatformVMAPI.buildAddSubnetValidatorTx -- startTime must be in the future and endTime must come after startTime");
                            }
                            builtUnsignedTx = utxoset.buildAddSubnetValidatorTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), from, change, (0, helperfunctions_1.NodeIDStringToBuffer)(nodeID), startTime, endTime, weight, subnetID, this.getDefaultTxFee(), avaxAssetID, memo, asOf, subnetAuthCredentials);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new Error("Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned [[AddDelegatorTx]]. For more granular control, you may create your own
         * [[UnsignedTx]] manually and import the [[AddDelegatorTx]] class directly.
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who received the staked tokens at the end of the staking period
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who own the staking UTXOs the fees in AVAX
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
         * @param stakeAmount The amount being delegated as a {@link https://github.com/indutny/bn.js/|BN}
         * @param rewardAddresses The addresses which will recieve the rewards from the delegated stake.
         * @param rewardLocktime Optional. The locktime field created in the resulting reward outputs
         * @param rewardThreshold Opional. The number of signatures required to spend the funds in the resultant reward UTXO. Default 1.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildAddDelegatorTx = function (utxoset, toAddresses, fromAddresses, changeAddresses, nodeID, startTime, endTime, stakeAmount, rewardAddresses, rewardLocktime, rewardThreshold, memo, asOf) {
            if (rewardLocktime === void 0) { rewardLocktime = new bn_js_1.default(0); }
            if (rewardThreshold === void 0) { rewardThreshold = 1; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            return __awaiter(_this, void 0, void 0, function () {
                var to, from, change, rewards, minStake, avaxAssetID, now, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            to = this._cleanAddressArray(toAddresses, "buildAddDelegatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            from = this._cleanAddressArray(fromAddresses, "buildAddDelegatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, "buildAddDelegatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            rewards = this._cleanAddressArray(rewardAddresses, "buildAddDelegatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            return [4 /*yield*/, this.getMinStake()];
                        case 1:
                            minStake = (_a.sent())["minDelegatorStake"];
                            if (stakeAmount.lt(minStake)) {
                                throw new errors_1.StakeError("PlatformVMAPI.buildAddDelegatorTx -- stake amount must be at least " +
                                    minStake.toString(10));
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 2:
                            avaxAssetID = _a.sent();
                            now = (0, helperfunctions_1.UnixNow)();
                            if (startTime.lt(now) || endTime.lte(startTime)) {
                                throw new errors_1.TimeError("PlatformVMAPI.buildAddDelegatorTx -- startTime must be in the future and endTime must come after startTime");
                            }
                            builtUnsignedTx = utxoset.buildAddDelegatorTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), avaxAssetID, to, from, change, (0, helperfunctions_1.NodeIDStringToBuffer)(nodeID), startTime, endTime, stakeAmount, rewardLocktime, rewardThreshold, rewards, new bn_js_1.default(0), avaxAssetID, memo, asOf);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 3:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Helper function which creates an unsigned [[AddValidatorTx]]. For more granular control, you may create your own
         * [[UnsignedTx]] manually and import the [[AddValidatorTx]] class directly.
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who received the staked tokens at the end of the staking period
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who own the staking UTXOs the fees in AVAX
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
         * @param stakeAmount The amount being delegated as a {@link https://github.com/indutny/bn.js/|BN}
         * @param rewardAddresses The addresses which will recieve the rewards from the delegated stake.
         * @param delegationFee A number for the percentage of reward to be given to the validator when someone delegates to them. Must be between 0 and 100.
         * @param rewardLocktime Optional. The locktime field created in the resulting reward outputs
         * @param rewardThreshold Opional. The number of signatures required to spend the funds in the resultant reward UTXO. Default 1.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildAddValidatorTx = function (utxoset, toAddresses, fromAddresses, changeAddresses, nodeID, startTime, endTime, stakeAmount, rewardAddresses, delegationFee, rewardLocktime, rewardThreshold, memo, asOf) {
            if (rewardLocktime === void 0) { rewardLocktime = new bn_js_1.default(0); }
            if (rewardThreshold === void 0) { rewardThreshold = 1; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            return __awaiter(_this, void 0, void 0, function () {
                var to, from, change, rewards, minStake, avaxAssetID, now, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            to = this._cleanAddressArray(toAddresses, "buildAddValidatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            from = this._cleanAddressArray(fromAddresses, "buildAddValidatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, "buildAddValidatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            rewards = this._cleanAddressArray(rewardAddresses, "buildAddValidatorTx").map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            return [4 /*yield*/, this.getMinStake()];
                        case 1:
                            minStake = (_a.sent())["minValidatorStake"];
                            if (stakeAmount.lt(minStake)) {
                                throw new errors_1.StakeError("PlatformVMAPI.buildAddValidatorTx -- stake amount must be at least " +
                                    minStake.toString(10));
                            }
                            if (typeof delegationFee !== "number" ||
                                delegationFee > 100 ||
                                delegationFee < 0) {
                                throw new errors_1.DelegationFeeError("PlatformVMAPI.buildAddValidatorTx -- delegationFee must be a number between 0 and 100");
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 2:
                            avaxAssetID = _a.sent();
                            now = (0, helperfunctions_1.UnixNow)();
                            if (startTime.lt(now) || endTime.lte(startTime)) {
                                throw new errors_1.TimeError("PlatformVMAPI.buildAddValidatorTx -- startTime must be in the future and endTime must come after startTime");
                            }
                            builtUnsignedTx = utxoset.buildAddValidatorTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), avaxAssetID, to, from, change, (0, helperfunctions_1.NodeIDStringToBuffer)(nodeID), startTime, endTime, stakeAmount, rewardLocktime, rewardThreshold, rewards, delegationFee, new bn_js_1.default(0), avaxAssetID, memo, asOf);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx)];
                        case 3:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Class representing an unsigned [[CreateSubnetTx]] transaction.
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param subnetOwnerAddresses An array of addresses for owners of the new subnet
         * @param subnetOwnerThreshold A number indicating the amount of signatures required to add validators to a subnet
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildCreateSubnetTx = function (utxoset, fromAddresses, changeAddresses, subnetOwnerAddresses, subnetOwnerThreshold, memo, asOf) {
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            return __awaiter(_this, void 0, void 0, function () {
                var from, change, owners, avaxAssetID, networkID, blockchainID, fee, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            from = this._cleanAddressArray(fromAddresses, "buildCreateSubnetTx").map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, "buildCreateSubnetTx").map(function (a) { return bintools.stringToAddress(a); });
                            owners = this._cleanAddressArray(subnetOwnerAddresses, "buildCreateSubnetTx").map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            networkID = this.core.getNetworkID();
                            blockchainID = bintools.cb58Decode(this.blockchainID);
                            fee = this.getCreateSubnetTxFee();
                            builtUnsignedTx = utxoset.buildCreateSubnetTx(networkID, blockchainID, from, change, owners, subnetOwnerThreshold, fee, avaxAssetID, memo, asOf);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx, this.getCreationTxFee())];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * Build an unsigned [[CreateChainTx]].
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param subnetID Optional ID of the Subnet that validates this blockchain
         * @param chainName Optional A human readable name for the chain; need not be unique
         * @param vmID Optional ID of the VM running on the new chain
         * @param fxIDs Optional IDs of the feature extensions running on the new chain
         * @param genesisData Optional Byte representation of genesis state of the new chain
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param subnetAuthCredentials Optional. An array of index and address to sign for each SubnetAuth.
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        _this.buildCreateChainTx = function (utxoset, fromAddresses, changeAddresses, subnetID, chainName, vmID, fxIDs, genesisData, memo, asOf, subnetAuthCredentials) {
            if (subnetID === void 0) { subnetID = undefined; }
            if (chainName === void 0) { chainName = undefined; }
            if (vmID === void 0) { vmID = undefined; }
            if (fxIDs === void 0) { fxIDs = undefined; }
            if (genesisData === void 0) { genesisData = undefined; }
            if (memo === void 0) { memo = undefined; }
            if (asOf === void 0) { asOf = (0, helperfunctions_1.UnixNow)(); }
            if (subnetAuthCredentials === void 0) { subnetAuthCredentials = []; }
            return __awaiter(_this, void 0, void 0, function () {
                var from, change, avaxAssetID, networkID, blockchainID, fee, builtUnsignedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            from = this._cleanAddressArray(fromAddresses, "buildCreateChainTx").map(function (a) { return bintools.stringToAddress(a); });
                            change = this._cleanAddressArray(changeAddresses, "buildCreateChainTx").map(function (a) { return bintools.stringToAddress(a); });
                            if (memo instanceof payload_1.PayloadBase) {
                                memo = memo.getPayload();
                            }
                            return [4 /*yield*/, this.getAVAXAssetID()];
                        case 1:
                            avaxAssetID = _a.sent();
                            fxIDs = fxIDs.sort();
                            networkID = this.core.getNetworkID();
                            blockchainID = bintools.cb58Decode(this.blockchainID);
                            fee = this.getCreateChainTxFee();
                            builtUnsignedTx = utxoset.buildCreateChainTx(networkID, blockchainID, from, change, subnetID, chainName, vmID, fxIDs, genesisData, fee, avaxAssetID, memo, asOf, subnetAuthCredentials);
                            return [4 /*yield*/, this.checkGooseEgg(builtUnsignedTx, this.getCreationTxFee())];
                        case 2:
                            if (!(_a.sent())) {
                                /* istanbul ignore next */
                                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
                            }
                            return [2 /*return*/, builtUnsignedTx];
                    }
                });
            });
        };
        /**
         * @returns the current timestamp on chain.
         */
        _this.getTimestamp = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("platform.getTimestamp")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result.timestamp];
                }
            });
        }); };
        /**
         * @returns the UTXOs that were rewarded after the provided transaction"s staking or delegation period ended.
         */
        _this.getRewardUTXOs = function (txID, encoding) { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            txID: txID,
                            encoding: encoding
                        };
                        return [4 /*yield*/, this.callMethod("platform.getRewardUTXOs", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.result];
                }
            });
        }); };
        _this.blockchainID = constants_1.PlatformChainID;
        var netID = core.getNetworkID();
        if (netID in constants_1.Defaults.network &&
            _this.blockchainID in constants_1.Defaults.network["".concat(netID)]) {
            var alias = constants_1.Defaults.network["".concat(netID)][_this.blockchainID]["alias"];
            _this.keychain = new keychain_1.KeyChain(_this.core.getHRP(), alias);
        }
        else {
            _this.keychain = new keychain_1.KeyChain(_this.core.getHRP(), _this.blockchainID);
        }
        return _this;
    }
    /**
     * @ignore
     */
    PlatformVMAPI.prototype._cleanAddressArray = function (addresses, caller) {
        var addrs = [];
        var chainid = this.getBlockchainAlias()
            ? this.getBlockchainAlias()
            : this.getBlockchainID();
        if (addresses && addresses.length > 0) {
            for (var i = 0; i < addresses.length; i++) {
                if (typeof addresses["".concat(i)] === "string") {
                    if (typeof this.parseAddress(addresses["".concat(i)]) ===
                        "undefined") {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - Invalid address format");
                    }
                    addrs.push(addresses["".concat(i)]);
                }
                else {
                    var bech32 = "bech32";
                    addrs.push(serialization.bufferToType(addresses["".concat(i)], bech32, this.core.getHRP(), chainid));
                }
            }
        }
        return addrs;
    };
    return PlatformVMAPI;
}(jrpcapi_1.JRPCAPI));
exports.PlatformVMAPI = PlatformVMAPI;
