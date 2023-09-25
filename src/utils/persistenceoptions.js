"use strict";
/**
 * @packageDocumentation
 * @module Utils-PersistanceOptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistanceOptions = void 0;
/**
 * A class for defining the persistance behavior of this an API call.
 *
 */
var PersistanceOptions = /** @class */ (function () {
    /**
     *
     * @param name The namespace of the database the data
     * @param overwrite True if the data should be completey overwritten
     * @param MergeRule The type of process used to merge with existing data: "intersection", "differenceSelf", "differenceNew", "symDifference", "union", "unionMinusNew", "unionMinusSelf"
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
    function PersistanceOptions(name, overwrite, mergeRule) {
        var _this = this;
        if (overwrite === void 0) { overwrite = false; }
        this.name = undefined;
        this.overwrite = false;
        this.mergeRule = "union";
        /**
         * Returns the namespace of the instance
         */
        this.getName = function () { return _this.name; };
        /**
         * Returns the overwrite rule of the instance
         */
        this.getOverwrite = function () { return _this.overwrite; };
        /**
         * Returns the [[MergeRule]] of the instance
         */
        this.getMergeRule = function () { return _this.mergeRule; };
        this.name = name;
        this.overwrite = overwrite;
        this.mergeRule = mergeRule;
    }
    return PersistanceOptions;
}());
exports.PersistanceOptions = PersistanceOptions;
