"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module Utils-DB
 */
var store2_1 = require("store2");
/**
 * A class for interacting with the {@link https://github.com/nbubna/store| store2 module}
 *
 * This class should never be instantiated directly. Instead, invoke the "DB.getInstance()" static
 * function to grab the singleton instance of the database.
 *
 * ```js
 * const db = DB.getInstance();
 * const blockchaindb = db.getNamespace("mychain");
 * ```
 */
var DB = /** @class */ (function () {
    function DB() {
    }
    /**
     * Retrieves the database singleton.
     */
    DB.getInstance = function () {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    };
    /**
     * Gets a namespace from the database singleton.
     *
     * @param ns Namespace to retrieve.
     */
    DB.getNamespace = function (ns) {
        return this.store.namespace(ns);
    };
    DB.store = store2_1.default;
    return DB;
}());
exports.default = DB;
