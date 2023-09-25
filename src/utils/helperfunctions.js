"use strict";
/**
 * @packageDocumentation
 * @module Utils-HelperFunctions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.costExportTx = exports.calcBytesCost = exports.costImportTx = exports.NodeIDStringToBuffer = exports.bufferToNodeIDString = exports.privateKeyStringToBuffer = exports.bufferToPrivateKeyString = exports.UnixNow = exports.MaxWeightFormula = exports.getPreferredHRP = void 0;
var constants_1 = require("./constants");
var bn_js_1 = require("bn.js");
var bintools_1 = require("../utils/bintools");
var errors_1 = require("../utils/errors");
/**
 * @ignore
 */
var bintools = bintools_1.default.getInstance();
function getPreferredHRP(networkID) {
    if (networkID === void 0) { networkID = undefined; }
    if (networkID in constants_1.NetworkIDToHRP) {
        return constants_1.NetworkIDToHRP["".concat(networkID)];
    }
    else if (typeof networkID === "undefined") {
        return constants_1.NetworkIDToHRP["".concat(constants_1.DefaultNetworkID)];
    }
    return constants_1.FallbackHRP;
}
exports.getPreferredHRP = getPreferredHRP;
function MaxWeightFormula(staked, cap) {
    return bn_js_1.default.min(staked.mul(new bn_js_1.default(5)), cap);
}
exports.MaxWeightFormula = MaxWeightFormula;
/**
 * Function providing the current UNIX time using a {@link https://github.com/indutny/bn.js/|BN}.
 */
function UnixNow() {
    return new bn_js_1.default(Math.round(new Date().getTime() / 1000));
}
exports.UnixNow = UnixNow;
/**
 * Takes a private key buffer and produces a private key string with prefix.
 *
 * @param pk A {@link https://github.com/feross/buffer|Buffer} for the private key.
 */
function bufferToPrivateKeyString(pk) {
    return "PrivateKey-".concat(bintools.cb58Encode(pk));
}
exports.bufferToPrivateKeyString = bufferToPrivateKeyString;
/**
 * Takes a private key string and produces a private key {@link https://github.com/feross/buffer|Buffer}.
 *
 * @param pk A string for the private key.
 */
function privateKeyStringToBuffer(pk) {
    if (!pk.startsWith("PrivateKey-")) {
        throw new errors_1.PrivateKeyError("Error - privateKeyStringToBuffer: private keys must start with 'PrivateKey-'");
    }
    var pksplit = pk.split("-");
    return bintools.cb58Decode(pksplit[pksplit.length - 1]);
}
exports.privateKeyStringToBuffer = privateKeyStringToBuffer;
/**
 * Takes a nodeID buffer and produces a nodeID string with prefix.
 *
 * @param pk A {@link https://github.com/feross/buffer|Buffer} for the nodeID.
 */
function bufferToNodeIDString(pk) {
    return "NodeID-".concat(bintools.cb58Encode(pk));
}
exports.bufferToNodeIDString = bufferToNodeIDString;
/**
 * Takes a nodeID string and produces a nodeID {@link https://github.com/feross/buffer|Buffer}.
 *
 * @param pk A string for the nodeID.
 */
function NodeIDStringToBuffer(pk) {
    if (!pk.startsWith("NodeID-")) {
        throw new errors_1.NodeIdError("Error - privateNodeIDToBuffer: nodeID must start with 'NodeID-'");
    }
    var pksplit = pk.split("-");
    return bintools.cb58Decode(pksplit[pksplit.length - 1]);
}
exports.NodeIDStringToBuffer = NodeIDStringToBuffer;
function costImportTx(tx) {
    var bytesCost = calcBytesCost(tx.toBuffer().byteLength);
    var importTx = tx.getTransaction();
    importTx.getImportInputs().forEach(function (input) {
        var inCost = input.getCost();
        bytesCost += inCost;
    });
    var fixedFee = 10000;
    return bytesCost + fixedFee;
}
exports.costImportTx = costImportTx;
function calcBytesCost(len) {
    return len * constants_1.Defaults.network[1].C.txBytesGas;
}
exports.calcBytesCost = calcBytesCost;
function costExportTx(tx) {
    var bytesCost = calcBytesCost(tx.toBuffer().byteLength);
    var exportTx = tx.getTransaction();
    var numSigs = exportTx.getInputs().length;
    var sigCost = numSigs * constants_1.Defaults.network[1].C.costPerSignature;
    var fixedFee = 10000;
    return bytesCost + sigCost + fixedFee;
}
exports.costExportTx = costExportTx;
