"use strict";
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
exports.fetchAdapter = void 0;
function createRequest(config) {
    var headers = new Headers(config.headers);
    if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password
            ? encodeURIComponent(config.auth.password)
            : "";
        headers.set("Authorization", "Basic ".concat(Buffer.from("".concat(username, ":").concat(password)).toString("base64")));
    }
    var method = config.method.toUpperCase();
    var options = {
        headers: headers,
        method: method
    };
    if (method !== "GET" && method !== "HEAD") {
        options.body = config.data;
    }
    if (!!config.withCredentials) {
        options.credentials = config.withCredentials ? "include" : "omit";
    }
    var fullPath = new URL(config.url, config.baseURL);
    var params = new URLSearchParams(config.params);
    var url = "".concat(fullPath).concat(params);
    return new Request(url, options);
}
function getResponse(request, config) {
    return __awaiter(this, void 0, void 0, function () {
        var stageOne, e_1, error_1, response, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch(request)];
                case 1:
                    stageOne = _g.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _g.sent();
                    error_1 = __assign(__assign({}, new Error("Network Error")), { config: config, request: request, isAxiosError: true, toJSON: function () { return error_1; } });
                    return [2 /*return*/, Promise.reject(error_1)];
                case 3:
                    response = {
                        status: stageOne.status,
                        statusText: stageOne.statusText,
                        headers: __assign({}, stageOne.headers),
                        config: config,
                        request: request,
                        data: undefined // we set it below
                    };
                    if (!(stageOne.status >= 200 && stageOne.status !== 204)) return [3 /*break*/, 14];
                    _a = config.responseType;
                    switch (_a) {
                        case "arraybuffer": return [3 /*break*/, 4];
                        case "blob": return [3 /*break*/, 6];
                        case "json": return [3 /*break*/, 8];
                        case "formData": return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 12];
                case 4:
                    _b = response;
                    return [4 /*yield*/, stageOne.arrayBuffer()];
                case 5:
                    _b.data = _g.sent();
                    return [3 /*break*/, 14];
                case 6:
                    _c = response;
                    return [4 /*yield*/, stageOne.blob()];
                case 7:
                    _c.data = _g.sent();
                    return [3 /*break*/, 14];
                case 8:
                    _d = response;
                    return [4 /*yield*/, stageOne.json()];
                case 9:
                    _d.data = _g.sent();
                    return [3 /*break*/, 14];
                case 10:
                    _e = response;
                    return [4 /*yield*/, stageOne.formData()];
                case 11:
                    _e.data = _g.sent();
                    return [3 /*break*/, 14];
                case 12:
                    _f = response;
                    return [4 /*yield*/, stageOne.text()];
                case 13:
                    _f.data = _g.sent();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/, Promise.resolve(response)];
            }
        });
    });
}
function fetchAdapter(config) {
    return __awaiter(this, void 0, void 0, function () {
        var request, promiseChain, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = createRequest(config);
                    promiseChain = [getResponse(request, config)];
                    if (config.timeout && config.timeout > 0) {
                        promiseChain.push(new Promise(function (res, reject) {
                            setTimeout(function () {
                                var message = config.timeoutErrorMessage
                                    ? config.timeoutErrorMessage
                                    : "timeout of " + config.timeout + "ms exceeded";
                                var error = __assign(__assign({}, new Error(message)), { config: config, request: request, code: "ECONNABORTED", isAxiosError: true, toJSON: function () { return error; } });
                                reject(error);
                            }, config.timeout);
                        }));
                    }
                    return [4 /*yield*/, Promise.race(promiseChain)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (response instanceof Error) {
                                reject(response);
                            }
                            else {
                                if (!response.status ||
                                    !response.config.validateStatus ||
                                    response.config.validateStatus(response.status)) {
                                    resolve(response);
                                }
                                else {
                                    var error_2 = __assign(__assign({}, new Error("Request failed with status code " + response.status)), { config: config, request: request, code: response.status >= 500 ? "ERR_BAD_RESPONSE" : "ERR_BAD_REQUEST", isAxiosError: true, toJSON: function () { return error_2; } });
                                    reject(error_2);
                                }
                            }
                        })];
            }
        });
    });
}
exports.fetchAdapter = fetchAdapter;
