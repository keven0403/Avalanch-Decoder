"use strict";
/**
 * @packageDocumentation
 * @module Utils-Mnemonic
 */
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
var buffer_1 = require("buffer/");
var errors_1 = require("./errors");
var bip39 = require("bip39");
var randomBytes = require("randombytes");
/**
 * BIP39 Mnemonic code for generating deterministic keys.
 *
 */
var Mnemonic = /** @class */ (function () {
    function Mnemonic() {
        this.wordlists = bip39.wordlists;
    }
    /**
     * Retrieves the Mnemonic singleton.
     */
    Mnemonic.getInstance = function () {
        if (!Mnemonic.instance) {
            Mnemonic.instance = new Mnemonic();
        }
        return Mnemonic.instance;
    };
    /**
     * Return wordlists
     *
     * @param language a string specifying the language
     *
     * @returns A [[Wordlist]] object or array of strings
     */
    Mnemonic.prototype.getWordlists = function (language) {
        if (language !== undefined) {
            return this.wordlists["".concat(language)];
        }
        else {
            return this.wordlists;
        }
    };
    /**
     * Synchronously takes mnemonic and password and returns {@link https://github.com/feross/buffer|Buffer}
     *
     * @param mnemonic the mnemonic as a string
     * @param password the password as a string
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer}
     */
    Mnemonic.prototype.mnemonicToSeedSync = function (mnemonic, password) {
        if (password === void 0) { password = ""; }
        var seed = bip39.mnemonicToSeedSync(mnemonic, password);
        return buffer_1.Buffer.from(seed);
    };
    /**
     * Asynchronously takes mnemonic and password and returns Promise {@link https://github.com/feross/buffer|Buffer}
     *
     * @param mnemonic the mnemonic as a string
     * @param password the password as a string
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer}
     */
    Mnemonic.prototype.mnemonicToSeed = function (mnemonic, password) {
        if (password === void 0) { password = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var seed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bip39.mnemonicToSeed(mnemonic, password)];
                    case 1:
                        seed = _a.sent();
                        return [2 /*return*/, buffer_1.Buffer.from(seed)];
                }
            });
        });
    };
    /**
     * Takes mnemonic and wordlist and returns buffer
     *
     * @param mnemonic the mnemonic as a string
     * @param wordlist Optional the wordlist as an array of strings
     *
     * @returns A string
     */
    Mnemonic.prototype.mnemonicToEntropy = function (mnemonic, wordlist) {
        return bip39.mnemonicToEntropy(mnemonic, wordlist);
    };
    /**
     * Takes mnemonic and wordlist and returns buffer
     *
     * @param entropy the entropy as a {@link https://github.com/feross/buffer|Buffer} or as a string
     * @param wordlist Optional, the wordlist as an array of strings
     *
     * @returns A string
     */
    Mnemonic.prototype.entropyToMnemonic = function (entropy, wordlist) {
        return bip39.entropyToMnemonic(entropy, wordlist);
    };
    /**
     * Validates a mnemonic
     11*
     * @param mnemonic the mnemonic as a string
     * @param wordlist Optional the wordlist as an array of strings
     *
     * @returns A string
     */
    Mnemonic.prototype.validateMnemonic = function (mnemonic, wordlist) {
        return bip39.validateMnemonic(mnemonic, wordlist);
    };
    /**
     * Sets the default word list
     *
     * @param language the language as a string
     *
     */
    Mnemonic.prototype.setDefaultWordlist = function (language) {
        bip39.setDefaultWordlist(language);
    };
    /**
     * Returns the language of the default word list
     *
     * @returns A string
     */
    Mnemonic.prototype.getDefaultWordlist = function () {
        return bip39.getDefaultWordlist();
    };
    /**
     * Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 256-bits of entropy
     *
     * @param strength Optional the strength as a number
     * @param rng Optional the random number generator. Defaults to crypto.randomBytes
     * @param wordlist Optional
     *
     */
    Mnemonic.prototype.generateMnemonic = function (strength, rng, wordlist) {
        strength = strength || 256;
        if (strength % 32 !== 0) {
            throw new errors_1.InvalidEntropy("Error - Invalid entropy");
        }
        rng = rng || randomBytes;
        return bip39.generateMnemonic(strength, rng, wordlist);
    };
    return Mnemonic;
}());
exports.default = Mnemonic;
