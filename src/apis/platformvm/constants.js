"use strict";
/**
 * @packageDocumentation
 * @module API-PlatformVM-Constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformVMConstants = void 0;
var PlatformVMConstants = /** @class */ (function () {
    function PlatformVMConstants() {
    }
    PlatformVMConstants.LATESTCODEC = 0;
    PlatformVMConstants.SECPFXID = 0;
    PlatformVMConstants.SECPXFEROUTPUTID = 7;
    PlatformVMConstants.SUBNETAUTHID = 10;
    PlatformVMConstants.SECPOWNEROUTPUTID = 11;
    PlatformVMConstants.STAKEABLELOCKOUTID = 22;
    PlatformVMConstants.SECPINPUTID = 5;
    PlatformVMConstants.STAKEABLELOCKINID = 21;
    PlatformVMConstants.LOCKEDSTAKEABLES = [
        PlatformVMConstants.STAKEABLELOCKINID,
        PlatformVMConstants.STAKEABLELOCKOUTID
    ];
    PlatformVMConstants.BASETX = 0;
    PlatformVMConstants.SUBNETAUTH = 10;
    PlatformVMConstants.ADDVALIDATORTX = 12;
    PlatformVMConstants.ADDSUBNETVALIDATORTX = 13;
    PlatformVMConstants.ADDDELEGATORTX = 14;
    PlatformVMConstants.CREATECHAINTX = 15;
    PlatformVMConstants.CREATESUBNETTX = 16;
    PlatformVMConstants.IMPORTTX = 17;
    PlatformVMConstants.EXPORTTX = 18;
    PlatformVMConstants.ADVANCETIMETX = 19;
    PlatformVMConstants.REWARDVALIDATORTX = 20;
    PlatformVMConstants.REMOVESUBNETVALIDATORTX = 23;
    PlatformVMConstants.SECPCREDENTIAL = 9;
    PlatformVMConstants.ASSETIDLEN = 32;
    PlatformVMConstants.BLOCKCHAINIDLEN = 32;
    PlatformVMConstants.SYMBOLMAXLEN = 4;
    PlatformVMConstants.ASSETNAMELEN = 128;
    PlatformVMConstants.ADDRESSLENGTH = 20;
    return PlatformVMConstants;
}());
exports.PlatformVMConstants = PlatformVMConstants;
