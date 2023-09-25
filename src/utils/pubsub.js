"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PubSub = /** @class */ (function () {
    function PubSub() {
    }
    PubSub.prototype.newSet = function () {
        return JSON.stringify({ newSet: {} });
    };
    PubSub.prototype.newBloom = function (maxElements, collisionProb) {
        if (maxElements === void 0) { maxElements = 1000; }
        if (collisionProb === void 0) { collisionProb = 0.01; }
        return JSON.stringify({
            newBloom: {
                maxElements: maxElements,
                collisionProb: collisionProb
            }
        });
    };
    PubSub.prototype.addAddresses = function (addresses) {
        return JSON.stringify({
            addAddresses: {
                addresses: addresses
            }
        });
    };
    return PubSub;
}());
exports.default = PubSub;
