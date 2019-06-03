(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tick42-glue-core", [], factory);
	else if(typeof exports === 'object')
		exports["tick42-glue-core"] = factory();
	else
		root["tick42-glue-core"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 76);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    DEFAULT: 0,
    STRING: 1,
    NUMBER: 2,
    COUNT: 3,
    RATE: 4,
    STATISTICS: 6,
    TIMESTAMP: 7,
    ADDRESS: 8,
    TIMESPAN: 10,
    OBJECT: 11
};
//# sourceMappingURL=metric-types.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function createRegistry(options) {
    if (options && options.errorHandling
        && typeof options.errorHandling !== "function"
        && options.errorHandling !== "log"
        && options.errorHandling !== "silent"
        && options.errorHandling !== "throw") {
        throw new Error("Invalid options passed to createRegistry. Prop errorHandling should be [\"log\" | \"silent\" | \"throw\" | (err) => void], but " + typeof options.errorHandling + " was passed");
    }
    var _userErrorHandler = options && typeof options.errorHandling === "function" && options.errorHandling;
    var callbacks = {};
    function add(key, callback) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            callbacksForKey = [];
            callbacks[key] = callbacksForKey;
        }
        callbacksForKey.push(callback);
        return function () {
            var allForKey = callbacks[key];
            if (!allForKey) {
                return;
            }
            allForKey = allForKey.reduce(function (acc, element, index) {
                if (!(element === callback && acc.length === index)) {
                    acc.push(element);
                }
                return acc;
            }, []);
            callbacks[key] = allForKey;
        };
    }
    function execute(key) {
        var argumentsArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argumentsArr[_i - 1] = arguments[_i];
        }
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey || callbacksForKey.length === 0) {
            return [];
        }
        var results = [];
        callbacksForKey.forEach(function (callback) {
            try {
                var result = callback.apply(undefined, argumentsArr);
                results.push(result);
            }
            catch (err) {
                results.push(undefined);
                _handleError(err, key);
            }
        });
        return results;
    }
    function _handleError(exceptionArtifact, key) {
        var errParam = exceptionArtifact instanceof Error ? exceptionArtifact : new Error(exceptionArtifact);
        if (_userErrorHandler) {
            _userErrorHandler(errParam);
            return;
        }
        var msg = "[ERROR] callback-registry: User callback for key \"" + key + "\" failed: " + errParam.stack;
        if (options) {
            switch (options.errorHandling) {
                case "log":
                    return console.error(msg);
                case "silent":
                    return;
                case "throw":
                    throw new Error(msg);
            }
        }
        console.error(msg);
    }
    function clear() {
        callbacks = {};
    }
    return {
        add: add,
        execute: execute,
        clear: clear
    };
}
;
createRegistry.default = createRegistry;
module.exports = createRegistry;
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    validate: function (definition, parent, transport) {
        if (definition === null || typeof definition !== "object") {
            throw new Error("Missing definition");
        }
        if (parent === null || typeof parent !== "object") {
            throw new Error("Missing parent");
        }
        if (transport === null || typeof transport !== "object") {
            throw new Error("Missing transport");
        }
    },
};
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shortid = __webpack_require__(6);
exports.default = shortid;
//# sourceMappingURL=random.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(25);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

module.exports = {
    get: get,
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function convertInfoToInstance(info) {
    if (typeof info !== "object") {
        info = {};
    }
    return {
        application: info.ApplicationName,
        environment: info.Environment,
        machine: info.MachineName,
        pid: info.ProcessId,
        region: info.Region,
        service: info.ServiceName,
        user: info.UserName,
        started: info.ProcessStartTime,
    };
}
exports.convertInfoToInstance = convertInfoToInstance;
function isStreamingFlagSet(flags) {
    if (typeof flags !== "number" || isNaN(flags)) {
        return false;
    }
    var mask = 32;
    var result = flags & mask;
    return result === mask;
}
exports.isStreamingFlagSet = isStreamingFlagSet;
function convertInstance(instance) {
    return {
        ApplicationName: instance.application,
        ProcessId: instance.pid,
        MachineName: instance.machine,
        UserName: instance.user,
        Environment: instance.environment,
        Region: instance.region,
    };
}
exports.convertInstance = convertInstance;
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(22);


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1(promise, successCallback, errorCallback) {
    if (typeof successCallback !== "function" && typeof errorCallback !== "function") {
        return promise;
    }
    if (typeof successCallback !== "function") {
        successCallback = function () { };
    }
    else if (typeof errorCallback !== "function") {
        errorCallback = function () { };
    }
    promise.then(successCallback, errorCallback);
}
exports.default = default_1;
//# sourceMappingURL=promisify.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ServerSubscription = (function () {
    function ServerSubscription(protocol, repoMethod, subscription) {
        this.protocol = protocol;
        this.repoMethod = repoMethod;
        this.subscription = subscription;
    }
    Object.defineProperty(ServerSubscription.prototype, "stream", {
        get: function () { return this.repoMethod.stream; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerSubscription.prototype, "arguments", {
        get: function () { return this.subscription.arguments || {}; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerSubscription.prototype, "branchKey", {
        get: function () { return this.subscription.branchKey; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerSubscription.prototype, "instance", {
        get: function () { return this.subscription.instance; },
        enumerable: true,
        configurable: true
    });
    ServerSubscription.prototype.close = function () {
        this.protocol.server.closeSingleSubscription(this.repoMethod, this.subscription);
    };
    ServerSubscription.prototype.push = function (data) {
        this.protocol.server.pushDataToSingle(this.repoMethod, this.subscription, data);
    };
    return ServerSubscription;
}());
exports.default = ServerSubscription;
//# sourceMappingURL=subscription.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var msg = __webpack_require__(15);
exports.ContextMessageReplaySpec = {
    get name() {
        return "context";
    },
    get types() {
        return [
            msg.GW_MESSAGE_CREATE_CONTEXT,
            msg.GW_MESSAGE_ACTIVITY_CREATED,
            msg.GW_MESSAGE_ACTIVITY_DESTROYED,
            msg.GW_MESSAGE_CONTEXT_CREATED,
            msg.GW_MESSAGE_CONTEXT_ADDED,
            msg.GW_MESSAGE_SUBSCRIBE_CONTEXT,
            msg.GW_MESSAGE_SUBSCRIBED_CONTEXT,
            msg.GW_MESSAGE_UNSUBSCRIBE_CONTEXT,
            msg.GW_MESSAGE_DESTROY_CONTEXT,
            msg.GW_MESSAGE_CONTEXT_DESTROYED,
            msg.GW_MESSAGE_UPDATE_CONTEXT,
            msg.GW_MESSAGE_CONTEXT_UPDATED,
            msg.GW_MESSAGE_JOINED_ACTIVITY
        ];
    }
};
//# sourceMappingURL=contextMessageReplaySpec.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = (function () {
    function Utils() {
    }
    Utils.getGDMajorVersion = function () {
        if (typeof window === "undefined") {
            return -1;
        }
        if (!window.glueDesktop) {
            return -1;
        }
        if (!window.glueDesktop.version) {
            return -1;
        }
        var ver = Number(window.glueDesktop.version.substr(0, 1));
        return isNaN(ver) ? -1 : ver;
    };
    Utils.isNode = function () {
        try {
            return Object.prototype.toString.call(global.process) === "[object process]";
        }
        catch (e) {
            return false;
        }
    };
    return Utils;
}());
exports.default = Utils;
//# sourceMappingURL=utils.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = {"name":"tick42-glue-core","version":"4.3.7","description":"Glue42 core library including logger, connection, agm and metrics","main":"./dist/node/tick42-glue-core.js","types":"./glue.d.ts","browser":"./dist/web/tick42-glue-core.js","scripts":{"init-dev-mode":"node ./build/scripts/init-dev-mode.js","remove-installed-dependencies":"node ./build/scripts/remove-installed-dependencies.js","clean":"node ./build/scripts/clean.js","pre:build":"npm run clean && npm run tslint && tsc && set NODE_ENV=development","file-versionify":"node ./build/scripts/file-versionify.js","tslint":"tslint -t codeFrame ./src/**/*.ts","tslint:fix":"tslint -t codeFrame --fix ./src/**/*.ts","watch":"onchange ./src/**/*.ts -- npm run build:dev","build:dev":"npm run pre:build && set NODE_ENV=development && webpack && npm run file-versionify","build:prod":"npm run pre:build && set NODE_ENV=development && webpack && set NODE_ENV=production && webpack && npm run file-versionify","docs":"typedoc --options typedoc.json ./src","prepublish":"npm run build:prod && npm run test:only","test":"npm run build:dev && npm run test:only","test:only":"mocha ./tests/ --recursive","test:core":"mocha ./tests/core","test:agm":"mocha ./tests/agm","test:bus":"mocha ./tests/bus"},"repository":{"type":"git","url":"https://stash.tick42.com/scm/tg/js-glue-core.git"},"author":{"name":"Tick42","url":"http://www.glue42.com"},"license":"ISC","dependencies":{"callback-registry":"^2.4.0","es6-promise":"^4.1.0","shortid":"^2.2.6","util-deprecate":"^1.0.2","ws":"^0.7.2"},"devDependencies":{"@types/node":"^10.7.0","@types/shortid":"0.0.29","archiver":"^1.3.0","babel-core":"^6.25.0","babel-loader":"^6.4.1","babel-plugin-add-module-exports":"^0.2.1","babel-preset-es2015":"^6.16.0","babel-preset-stage-2":"^6.22.0","chai":"^4.0.2","deep-equal":"^1.0.1","mocha":"^2.5.3","onchange":"3.*","pre-commit":"^1.1.3","readline-sync":"^1.4.5","shelljs":"^0.6.0","tick42-gateway":"0.2.7","tick42-webpack-config":"4.1.6","tslint":"^5.11.0","typescript":"^3.0.1","webpack":"2.3.3"}}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var invoke_1 = __webpack_require__(29);
var promisify_1 = __webpack_require__(8);
var random_1 = __webpack_require__(3);
var promiseHelpers_1 = __webpack_require__(34);
var InvokeStatus;
(function (InvokeStatus) {
    InvokeStatus[InvokeStatus["Success"] = 1] = "Success";
    InvokeStatus[InvokeStatus["Error"] = 0] = "Error";
})(InvokeStatus = exports.InvokeStatus || (exports.InvokeStatus = {}));
var Client = (function () {
    function Client(protocol, repo, instance, configuration) {
        this.protocol = protocol;
        this.repo = repo;
        this.instance = instance;
        this.configuration = configuration;
        this.clientInvocations = new invoke_1.default(protocol);
    }
    Client.prototype.subscribe = function (method, options, successCallback, errorCallback) {
        var _this = this;
        var callProtocolSubscribe = function (targetServers, stream, successProxy, errorProxy) {
            _this.protocol.client.subscribe(stream, options.arguments, targetServers, { methodResponseTimeout: options.waitTimeoutMs }, successProxy, errorProxy);
        };
        var promise = new Promise(function (resolve, reject) {
            var successProxy = function (sub) {
                resolve(sub);
            };
            var errorProxy = function (err) {
                reject(err);
            };
            var methodDef;
            if (typeof method === "string") {
                methodDef = { name: method };
            }
            else {
                methodDef = method;
            }
            if (options === undefined) {
                options = {};
            }
            var target = options.target;
            if (target === undefined) {
                target = "best";
            }
            if (typeof target === "string" && target !== "all" && target !== "best") {
                reject({ message: '"' + target + '" is not a valid target. Valid targets are "all", "best", or an instance.' });
            }
            if (options.methodResponseTimeout === undefined) {
                options.methodResponseTimeout = options.method_response_timeout;
                if (options.methodResponseTimeout === undefined) {
                    options.methodResponseTimeout = _this.configuration.methodResponseTimeout;
                }
            }
            if (options.waitTimeoutMs === undefined) {
                options.waitTimeoutMs = options.wait_for_method_timeout;
                if (options.waitTimeoutMs === undefined) {
                    options.waitTimeoutMs = _this.configuration.waitTimeoutMs;
                }
            }
            var delayStep = 500;
            var delayTillNow = 0;
            var currentServers = _this.getServerMethodsByFilterAndTarget(methodDef, target);
            if (currentServers.length > 0) {
                callProtocolSubscribe(currentServers, currentServers[0].methods[0], successProxy, errorProxy);
            }
            else {
                var retry_1 = function () {
                    delayTillNow += delayStep;
                    currentServers = _this.getServerMethodsByFilterAndTarget(methodDef, target);
                    if (currentServers.length > 0) {
                        var streamInfo = currentServers[0].methods[0];
                        callProtocolSubscribe(currentServers, streamInfo, successProxy, errorProxy);
                    }
                    else if (delayTillNow >= options.waitTimeoutMs) {
                        var def = typeof method === "string" ? { name: method } : method;
                        var info = {
                            id: undefined,
                            info: def,
                            getInfoForUser: function () {
                                return methodDef;
                            },
                            protocolState: undefined,
                        };
                        callProtocolSubscribe(currentServers, info, successProxy, errorProxy);
                    }
                    else {
                        setTimeout(retry_1, delayStep);
                    }
                };
                setTimeout(retry_1, delayStep);
            }
        });
        return promisify_1.default(promise, successCallback, errorCallback);
    };
    Client.prototype.servers = function (methodFilter) {
        var filterCopy = methodFilter === undefined
            ? undefined
            : __assign({}, methodFilter);
        return this.getServers(filterCopy).map(function (serverMethodMap) {
            return serverMethodMap.server.getInfoForUser();
        });
    };
    Client.prototype.methods = function (methodFilter) {
        var filterCopy = __assign({}, methodFilter);
        return this.getMethods(filterCopy).map(function (m) {
            return m.getInfoForUser();
        });
    };
    Client.prototype.methodsForInstance = function (instance) {
        return this.getMethodsForInstance(instance).map(function (m) {
            return m.getInfoForUser();
        });
    };
    Client.prototype.methodAdded = function (callback) {
        return this.repo.onMethodAdded(function (method) {
            callback(method.getInfoForUser());
        });
    };
    Client.prototype.methodRemoved = function (callback) {
        return this.repo.onMethodRemoved(function (method) {
            callback(method.getInfoForUser());
        });
    };
    Client.prototype.serverAdded = function (callback) {
        return this.repo.onServerAdded(function (server) {
            callback(server.getInfoForUser());
        });
    };
    Client.prototype.serverRemoved = function (callback) {
        return this.repo.onServerRemoved(function (server, reason) {
            callback(server.getInfoForUser(), reason);
        });
    };
    Client.prototype.serverMethodAdded = function (callback) {
        return this.repo.onServerMethodAdded(function (server, method) {
            callback({ server: server.getInfoForUser(), method: method.getInfoForUser() });
        });
    };
    Client.prototype.serverMethodRemoved = function (callback) {
        return this.repo.onServerMethodRemoved(function (server, method) {
            callback({ server: server.getInfoForUser(), method: method.getInfoForUser() });
        });
    };
    Client.prototype.invoke = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
        return __awaiter(this, void 0, void 0, function () {
            var getInvokePromise;
            var _this = this;
            return __generator(this, function (_a) {
                getInvokePromise = function () { return __awaiter(_this, void 0, void 0, function () {
                    var methodDefinition, serversMethodMap, err_1, errorObj, timeout_1, invokePromises, invocationMessages, results, allRejected;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (typeof methodFilter === "string") {
                                    methodDefinition = { name: methodFilter };
                                }
                                else {
                                    methodDefinition = __assign({}, methodFilter);
                                }
                                if (!methodDefinition.name) {
                                    return [2, Promise.reject("Please supply either a string of the name or an object with property 'name'")];
                                }
                                if (!argumentObj) {
                                    argumentObj = {};
                                }
                                if (!target) {
                                    target = "best";
                                }
                                if (typeof target === "string" && target !== "all" && target !== "best") {
                                    return [2, Promise.reject({ message: '"' + target + '" is not a valid target. Valid targets are "all" and "best".' })];
                                }
                                if (!additionalOptions) {
                                    additionalOptions = {};
                                }
                                if (additionalOptions.methodResponseTimeoutMs === undefined) {
                                    additionalOptions.methodResponseTimeoutMs = additionalOptions.method_response_timeout;
                                    if (additionalOptions.methodResponseTimeoutMs === undefined) {
                                        additionalOptions.methodResponseTimeoutMs = this.configuration.methodResponseTimeout;
                                    }
                                }
                                if (additionalOptions.waitTimeoutMs === undefined) {
                                    additionalOptions.waitTimeoutMs = additionalOptions.wait_for_method_timeout;
                                    if (additionalOptions.waitTimeoutMs === undefined) {
                                        additionalOptions.waitTimeoutMs = this.configuration.waitTimeoutMs;
                                    }
                                }
                                if (additionalOptions.waitTimeoutMs !== undefined && typeof additionalOptions.waitTimeoutMs !== "number") {
                                    return [2, Promise.reject({ message: '"' + additionalOptions.waitTimeoutMs + '" is not a valid number for \'waitTimeoutMs\'' })];
                                }
                                if (typeof argumentObj !== "object") {
                                    return [2, Promise.reject({ message: "The method arguments must be an object." })];
                                }
                                serversMethodMap = this.getServerMethodsByFilterAndTarget(methodDefinition, target);
                                if (!(serversMethodMap.length === 0)) return [3, 5];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, this.tryToAwaitForMethods(methodDefinition, target, additionalOptions)];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                err_1 = _a.sent();
                                errorObj = {
                                    method: methodDefinition,
                                    called_with: argumentObj,
                                    message: "Can not find a method matching " + JSON.stringify(methodFilter) + " with server filter " + JSON.stringify(target) + ". Is the object a valid instance ?",
                                    executed_by: undefined,
                                    returned: undefined,
                                    status: undefined,
                                };
                                return [2, Promise.reject(errorObj)];
                            case 4: return [3, 7];
                            case 5:
                                timeout_1 = additionalOptions.methodResponseTimeoutMs;
                                invokePromises = serversMethodMap.map(function (serversMethodPair) {
                                    var invId = random_1.default();
                                    return Promise.race([
                                        promiseHelpers_1.rejectAfter(timeout_1, {
                                            invocationId: invId,
                                            message: "Invocation timeout (" + timeout_1 + " ms) reached",
                                            status: InvokeStatus.Error,
                                        }),
                                        _this.protocol.client.invoke(invId, serversMethodPair.methods[0], argumentObj, serversMethodPair.server, additionalOptions)
                                    ]);
                                });
                                return [4, Promise.all(invokePromises)];
                            case 6:
                                invocationMessages = _a.sent();
                                results = this.getInvocationResultObj(invocationMessages, methodDefinition, argumentObj);
                                allRejected = invocationMessages.every(function (result) { return result.status === InvokeStatus.Error; });
                                if (allRejected) {
                                    return [2, Promise.reject(results)];
                                }
                                return [2, results];
                            case 7: return [2];
                        }
                    });
                }); };
                return [2, promisify_1.default(getInvokePromise(), success, error)];
            });
        });
    };
    Client.prototype.invokeOld = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var successProxy = function (args) {
                resolve(args);
            };
            var errorProxy = function (err) {
                reject(err);
            };
            if (!argumentObj) {
                argumentObj = {};
            }
            if (!target) {
                target = "best";
            }
            if (typeof target === "string" && target !== "all" && target !== "best") {
                reject({ message: '"' + target + '" is not a valid target. Valid targets are "all" and "best".' });
            }
            if (!additionalOptions) {
                additionalOptions = {};
            }
            if (additionalOptions.methodResponseTimeoutMs === undefined) {
                additionalOptions.methodResponseTimeoutMs = additionalOptions.method_response_timeout;
                if (additionalOptions.methodResponseTimeoutMs === undefined) {
                    additionalOptions.methodResponseTimeoutMs = _this.configuration.methodResponseTimeout;
                }
            }
            if (additionalOptions.waitTimeoutMs === undefined) {
                additionalOptions.waitTimeoutMs = additionalOptions.wait_for_method_timeout;
                if (additionalOptions.waitTimeoutMs === undefined) {
                    additionalOptions.waitTimeoutMs = _this.configuration.waitTimeoutMs;
                }
            }
            if (additionalOptions.waitTimeoutMs !== undefined && typeof additionalOptions.waitTimeoutMs !== "number") {
                reject({ message: '"' + additionalOptions.waitTimeoutMs + '" is not a valid number for \'waitTimeoutMs\'' });
                return;
            }
            if (typeof argumentObj !== "object") {
                reject({ message: "The method arguments must be an object." });
                return;
            }
            if (typeof methodFilter === "string") {
                methodFilter = { name: methodFilter };
            }
            var serversMethodMap = _this.getServerMethodsByFilterAndTarget(methodFilter, target);
            if (serversMethodMap.length === 0) {
                _this.invokeUnExisting(methodFilter, argumentObj, target, additionalOptions, successProxy, errorProxy);
            }
            else {
                _this.invokeOnAll(serversMethodMap, argumentObj, additionalOptions, successProxy, errorProxy);
            }
        });
        return promisify_1.default(promise, success, error);
    };
    Client.prototype.getInvocationResultObj = function (invocationResults, method, calledWith) {
        var all_return_values = invocationResults
            .filter(function (invokeMessage) { return invokeMessage.status === InvokeStatus.Success; })
            .reduce(function (allValues, currentValue) {
            allValues = allValues.concat([
                {
                    executed_by: currentValue.instance,
                    returned: currentValue.result,
                    called_with: calledWith,
                    method: method,
                    message: currentValue.message,
                    status: currentValue.status,
                }
            ]);
            return allValues;
        }, []);
        var all_errors = invocationResults
            .filter(function (invokeMessage) { return invokeMessage.status === InvokeStatus.Error; })
            .reduce(function (allErrors, currError) {
            allErrors = allErrors.concat([
                {
                    executed_by: currError.instance,
                    called_with: calledWith,
                    name: method.name,
                    message: currError.message,
                }
            ]);
            return allErrors;
        }, []);
        var invResult = invocationResults[0];
        var result = {
            method: method,
            called_with: calledWith,
            returned: invResult.result,
            executed_by: invResult.instance,
            all_return_values: all_return_values,
            all_errors: all_errors,
            message: invResult.message,
            status: invResult.status
        };
        return result;
    };
    Client.prototype.tryToAwaitForMethods = function (methodDefinition, target, additionalOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (additionalOptions.waitTimeoutMs === 0) {
                reject();
            }
            var delayStep = 500;
            var delayTillNow = 0;
            var retry = function () {
                delayTillNow += delayStep;
                var serversMethodMap = _this.getServerMethodsByFilterAndTarget(methodDefinition, target);
                if (serversMethodMap.length > 0) {
                    clearInterval(interval);
                    resolve();
                }
                else if (delayTillNow >= additionalOptions.waitTimeoutMs) {
                    clearInterval(interval);
                    reject();
                }
            };
            var interval = setInterval(retry, delayStep);
        });
    };
    Client.prototype.invokeUnExisting = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
        var _this = this;
        var callError = function () {
            error({
                method: methodFilter,
                called_with: argumentObj,
                message: "Can not find a method matching " + JSON.stringify(methodFilter) + " with server filter " + JSON.stringify(target),
                executed_by: undefined,
                returned: undefined,
                status: undefined,
            });
        };
        if (additionalOptions.waitTimeoutMs === 0) {
            callError();
        }
        else {
            var delayStep_1 = 500;
            var delayTillNow_1 = 0;
            var retry_2 = function () {
                delayTillNow_1 += delayStep_1;
                var serversMethodMap = _this.getServerMethodsByFilterAndTarget(methodFilter, target);
                if (serversMethodMap.length > 0) {
                    _this.invoke(methodFilter, argumentObj, target, additionalOptions, success, error);
                }
                else if (delayTillNow_1 >= additionalOptions.waitTimeoutMs) {
                    callError();
                }
                else {
                    setTimeout(retry_2, delayStep_1);
                }
            };
            setTimeout(retry_2, delayStep_1);
        }
    };
    Client.prototype.invokeOnAll = function (serverMethodsMap, argumentObj, additionalOptions, success, error) {
        var _this = this;
        var successes = [];
        var errors = [];
        var successCallback = function (result) {
            successes.push(result);
            sendResponse();
        };
        var errorCallback = function (err) {
            errors.push(err);
            sendResponse();
        };
        var sendResponse = function () {
            if (successes.length + errors.length < serverMethodsMap.length) {
                return;
            }
            if (successes.length !== 0) {
                var all_return_values = successes.reduce(function (allValues, currentValue) {
                    allValues = allValues.concat([
                        {
                            executed_by: currentValue.executed_by,
                            returned: currentValue.returned,
                            called_with: currentValue.called_with,
                            method: currentValue.method,
                            message: currentValue.message,
                            status: currentValue.status,
                        }
                    ]);
                    return allValues;
                }, []);
                var all_errors = errors.reduce(function (allErrors, currError) {
                    allErrors = allErrors.concat([
                        {
                            executed_by: currError.executed_by,
                            called_with: currError.called_with,
                            name: currError.method.name,
                            message: currError.message,
                        }
                    ]);
                    return allErrors;
                }, []);
                var invResult = successes[0];
                var result = {
                    method: invResult.method,
                    called_with: invResult.called_with,
                    returned: invResult.returned,
                    executed_by: invResult.executed_by,
                    all_return_values: all_return_values,
                    all_errors: all_errors,
                    message: invResult.message,
                    status: invResult.status
                };
                success(result);
            }
            else if (errors.length !== 0) {
                error(errors.reduce(function (obj, currentError) {
                    obj.method = currentError.method;
                    obj.called_with = currentError.called_with;
                    obj.message = currentError.message;
                    obj.all_errors.push({
                        executed_by: currentError.executed_by,
                        message: currentError.message,
                    });
                    return obj;
                }, { all_errors: [] }));
            }
        };
        serverMethodsMap.forEach(function (serverMethodsPair) {
            _this.clientInvocations.invoke(serverMethodsPair.methods[0], argumentObj, serverMethodsPair.server, additionalOptions, successCallback, errorCallback);
        });
    };
    Client.prototype.filterByTarget = function (target, serverMethodMap) {
        var _this = this;
        var targetServerMethod = [];
        if (typeof target === "string") {
            if (target === "all") {
                targetServerMethod = serverMethodMap;
            }
            else if (target === "best") {
                var matchingMachine = serverMethodMap.filter(function (serverMethodPair) {
                    var serverInfo = serverMethodPair.server.info;
                    return serverInfo.machine === _this.instance.machine;
                })[0];
                if (matchingMachine) {
                    return [matchingMachine];
                }
                targetServerMethod = serverMethodMap[0] !== undefined ? [serverMethodMap[0]] : [];
            }
        }
        else {
            if (!Array.isArray(target)) {
                target = [target];
            }
            if (Array.isArray(target)) {
                targetServerMethod = target.reduce(function (matches, filter) {
                    var myMatches = serverMethodMap.filter(function (serverMethodPair) {
                        return _this.instanceMatch(filter, serverMethodPair.server.info);
                    });
                    return matches.concat(myMatches);
                }, []);
            }
        }
        return targetServerMethod;
    };
    Client.prototype.instanceMatch = function (instanceFilter, instanceDefinition) {
        return this.containsProps(instanceFilter, instanceDefinition);
    };
    Client.prototype.methodMatch = function (methodFilter, methodDefinition) {
        return this.containsProps(methodFilter, methodDefinition);
    };
    Client.prototype.containsProps = function (filter, repoMethod) {
        var filterProps = Object.keys(filter)
            .filter(function (prop) {
            return filter[prop] !== undefined
                && typeof filter[prop] !== "function"
                && prop !== "object_types"
                && prop !== "display_name";
        });
        return filterProps.reduce(function (isMatch, prop) {
            var filterValue = filter[prop];
            var repoMethodValue = repoMethod[prop];
            if (prop === "objectTypes") {
                var containsAllFromFilter = function (filterObjTypes, repoObjectTypes) {
                    var objTypeToContains = filterObjTypes.reduce(function (object, objType) {
                        object[objType] = false;
                        return object;
                    }, {});
                    repoObjectTypes.forEach(function (repoObjType) {
                        if (objTypeToContains[repoObjType] !== undefined) {
                            objTypeToContains[repoObjType] = true;
                        }
                    });
                    var filterIsFullfilled = function () { return Object.keys(objTypeToContains).reduce(function (isFullfiled, objType) {
                        if (!objTypeToContains[objType]) {
                            isFullfiled = false;
                        }
                        return isFullfiled;
                    }, true); };
                    return filterIsFullfilled();
                };
                if (filterValue.length > repoMethodValue.length
                    || containsAllFromFilter(filterValue, repoMethodValue) === false) {
                    isMatch = false;
                }
            }
            else if (String(filterValue).toLowerCase() !== String(repoMethodValue).toLowerCase()) {
                isMatch = false;
            }
            return isMatch;
        }, true);
    };
    Client.prototype.getMethods = function (methodFilter) {
        var _this = this;
        if (methodFilter === undefined) {
            return this.repo.getMethods();
        }
        if (typeof methodFilter === "string") {
            methodFilter = { name: methodFilter };
        }
        var methods = this.repo.getMethods().filter(function (method) {
            return _this.methodMatch(methodFilter, method.info);
        });
        return methods;
    };
    Client.prototype.getMethodsForInstance = function (instanceFilter) {
        var _this = this;
        var allServers = this.repo.getServers();
        var matchingServers = allServers.filter(function (server) {
            return _this.instanceMatch(instanceFilter, server.info);
        });
        if (matchingServers.length === 0) {
            return [];
        }
        var resultMethodsObject = {};
        if (matchingServers.length === 1) {
            resultMethodsObject = matchingServers[0].methods;
        }
        else {
            matchingServers.forEach(function (server) {
                Object.keys(server.methods).forEach(function (methodKey) {
                    var method = server.methods[methodKey];
                    resultMethodsObject[method.id] = method;
                });
            });
        }
        return Object.keys(resultMethodsObject)
            .map(function (key) {
            return resultMethodsObject[key];
        });
    };
    Client.prototype.getServers = function (methodFilter) {
        var _this = this;
        var servers = this.repo.getServers();
        if (methodFilter === undefined) {
            return servers.map(function (server) {
                return { server: server };
            });
        }
        return servers.reduce(function (prev, current) {
            var methodsForServer = _this.repo.getServerMethodsById(current.id);
            var matchingMethods = methodsForServer.filter(function (method) {
                return _this.methodMatch(methodFilter, method.info);
            });
            if (matchingMethods.length > 0) {
                prev.push({ server: current, methods: matchingMethods });
            }
            return prev;
        }, []);
    };
    Client.prototype.getServerMethodsByFilterAndTarget = function (methodFilter, target) {
        var serversMethodMap = this.getServers(methodFilter);
        return this.filterByTarget(target, serversMethodMap);
    };
    return Client;
}());
exports.default = Client;
//# sourceMappingURL=client.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var ConnectionImpl = (function () {
    function ConnectionImpl(settings) {
        this.messageHandlers = {};
        this.ids = 1;
        this.registry = callback_registry_1.default();
        this._connected = false;
        this._settings = settings;
        this._logger = settings.logger;
    }
    ConnectionImpl.prototype.init = function (transport, protocol) {
        this._protocol = protocol;
        this._transport = transport;
        this._transport.onConnectedChanged(this.handleConnectionChanged.bind(this));
        this._transport.onMessage(this.handleTransportMessage.bind(this));
    };
    ConnectionImpl.prototype.send = function (product, type, message, id, options) {
        if (this._transport.isObjectBasedTransport) {
            var msg = this._protocol.createObjectMessage(product, type, message, id);
            return this._transport.sendObject(msg, product, type, options);
        }
        else {
            var strMessage = this._protocol.createStringMessage(product, type, message, id);
            return this._transport.send(strMessage, product, type, options);
        }
    };
    ConnectionImpl.prototype.on = function (product, type, messageHandler) {
        type = type.toLowerCase();
        if (this.messageHandlers[type] === undefined) {
            this.messageHandlers[type] = {};
        }
        var id = this.ids++;
        this.messageHandlers[type][id] = messageHandler;
        return {
            type: type,
            id: id,
        };
    };
    ConnectionImpl.prototype.off = function (info) {
        delete this.messageHandlers[info.type.toLowerCase()][info.id];
    };
    Object.defineProperty(ConnectionImpl.prototype, "isConnected", {
        get: function () {
            return this._connected;
        },
        enumerable: true,
        configurable: true
    });
    ConnectionImpl.prototype.connected = function (callback) {
        if (this._connected) {
            callback(this._settings.ws || this._settings.http);
        }
        return this.registry.add("connected", callback);
    };
    ConnectionImpl.prototype.disconnected = function (callback) {
        return this.registry.add("disconnected", callback);
    };
    ConnectionImpl.prototype.login = function (authRequest) {
        this._transport.open();
        return this._protocol.login(authRequest);
    };
    ConnectionImpl.prototype.logout = function () {
        this._protocol.logout();
        this._transport.close();
    };
    ConnectionImpl.prototype.loggedIn = function (callback) {
        return this._protocol.loggedIn(callback);
    };
    Object.defineProperty(ConnectionImpl.prototype, "protocolVersion", {
        get: function () {
            return this._settings.protocolVersion || 1;
        },
        enumerable: true,
        configurable: true
    });
    ConnectionImpl.prototype.toAPI = function () {
        var that = this;
        return {
            send: that.send.bind(that),
            on: that.on.bind(that),
            off: that.off.bind(that),
            login: that.login.bind(that),
            logout: that.logout.bind(that),
            loggedIn: that.loggedIn.bind(that),
            connected: that.connected.bind(that),
            disconnected: that.disconnected.bind(that),
            get protocolVersion() {
                return that.protocolVersion;
            }
        };
    };
    ConnectionImpl.prototype.distributeMessage = function (message, type) {
        var _this = this;
        var handlers = this.messageHandlers[type.toLowerCase()];
        if (handlers !== undefined) {
            Object.keys(handlers).forEach(function (handlerId) {
                var handler = handlers[handlerId];
                if (handler !== undefined) {
                    try {
                        handler(message);
                    }
                    catch (error) {
                        _this._logger.error("Message handler failed with " + error.stack);
                    }
                }
            });
        }
    };
    ConnectionImpl.prototype.handleConnectionChanged = function (connected) {
        if (this._connected === connected) {
            return;
        }
        this._connected = connected;
        if (connected) {
            this.registry.execute("connected");
        }
        else {
            this.registry.execute("disconnected");
        }
    };
    ConnectionImpl.prototype.handleTransportMessage = function (msg) {
        var msgObj;
        if (typeof msg === "string") {
            msgObj = this._protocol.processStringMessage(msg);
        }
        else {
            msgObj = this._protocol.processObjectMessage(msg);
        }
        this.distributeMessage(msgObj.msg, msgObj.msgType);
    };
    return ConnectionImpl;
}());
exports.default = ConnectionImpl;
//# sourceMappingURL=connection.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GW_MESSAGE_CREATE_CONTEXT = "create-context";
exports.GW_MESSAGE_ACTIVITY_CREATED = "created";
exports.GW_MESSAGE_ACTIVITY_DESTROYED = "destroyed";
exports.GW_MESSAGE_CONTEXT_CREATED = "context-created";
exports.GW_MESSAGE_CONTEXT_ADDED = "context-added";
exports.GW_MESSAGE_SUBSCRIBE_CONTEXT = "subscribe-context";
exports.GW_MESSAGE_SUBSCRIBED_CONTEXT = "subscribed-context";
exports.GW_MESSAGE_UNSUBSCRIBE_CONTEXT = "unsubscribe-context";
exports.GW_MESSAGE_DESTROY_CONTEXT = "destroy-context";
exports.GW_MESSAGE_CONTEXT_DESTROYED = "context-destroyed";
exports.GW_MESSAGE_UPDATE_CONTEXT = "update-context";
exports.GW_MESSAGE_CONTEXT_UPDATED = "context-updated";
exports.GW_MESSAGE_JOINED_ACTIVITY = "joined";
//# sourceMappingURL=gw3Messages.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var connection = {
    protocolVersion: -1,
    send: function (product, type, message, id, options) {
        return Promise.resolve(undefined);
    },
    on: function (product, type, messageHandler) {
        return { type: "1", id: 1 };
    },
    off: function (info) {
    },
    login: function (message) {
        return undefined;
    },
    logout: function () {
    },
    loggedIn: function (callback) {
        return undefined;
    },
    connected: function (callback) {
        return undefined;
    },
    disconnected: function (callback) {
        return undefined;
    },
};
exports.default = connection;
//# sourceMappingURL=dummyConnection.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = __webpack_require__(90);
var main_2 = __webpack_require__(58);
var main_3 = __webpack_require__(75);
var main_4 = __webpack_require__(36);
var main_5 = __webpack_require__(53);
var config_1 = __webpack_require__(56);
var dummyConnection_1 = __webpack_require__(16);
var timer_1 = __webpack_require__(93);
var utils_1 = __webpack_require__(11);
var dummyConnection_2 = __webpack_require__(16);
var main_6 = __webpack_require__(72);
var contextMessageReplaySpec_1 = __webpack_require__(10);
var GlueCore = function (userConfig, ext) {
    var gdVersion = -1;
    var hc;
    var glue42gd;
    if (typeof window !== "undefined") {
        gdVersion = utils_1.default.getGDMajorVersion();
        if (gdVersion === 2) {
            hc = window.htmlContainer;
        }
        else if (gdVersion >= 3) {
            glue42gd = window.glue42gd;
        }
    }
    var glueInitTimer = timer_1.default();
    userConfig = userConfig || {};
    ext = ext || {};
    var internalConfig = config_1.default(userConfig, ext, hc, glue42gd, gdVersion);
    var _connection;
    var _agm;
    var _logger;
    var _rootMetrics;
    var _metrics;
    var _contexts;
    var _bus;
    var libs = {};
    function registerLib(name, inner, t) {
        inner.initStartTime = t.startTime;
        if (inner.ready) {
            inner.ready().then(function () {
                inner.initTime = t.stop();
                inner.initEndTime = t.endTime;
            });
        }
        else {
            inner.initTime = t.stop();
            inner.initEndTime = t.endTime;
        }
        libs[name] = inner;
        GlueCore[name] = inner;
    }
    function setupConnection() {
        var initTimer = timer_1.default();
        internalConfig.connection.logger = _logger.subLogger("connection");
        _connection = main_2.default(internalConfig.connection);
        var authPromise = Promise.resolve(internalConfig.auth);
        if (internalConfig.connection && !internalConfig.auth) {
            var protocolVersion = internalConfig.connection.protocolVersion;
            if (!protocolVersion || protocolVersion === 1) {
                registerLib("connection", _connection, initTimer);
                return Promise.resolve({});
            }
            if (protocolVersion === 2) {
                return Promise.reject("You need to provide auth information");
            }
            if (protocolVersion === 3) {
                if (glue42gd) {
                    authPromise = glue42gd.getGWToken().then(function (token) {
                        return {
                            gatewayToken: token
                        };
                    });
                }
                else {
                    authPromise = Promise.reject("You need to provide auth information");
                }
            }
        }
        return authPromise
            .then(function (authConfig) {
            var authRequest;
            if (typeof authConfig === "string" || typeof authConfig === "number") {
                authRequest = {
                    token: authConfig
                };
            }
            else if (Object.prototype.toString.call(authConfig) === "[object Object]") {
                authRequest = authConfig;
            }
            else {
                throw new Error("Invalid auth object - " + JSON.stringify(authConfig));
            }
            return authRequest;
        })
            .then(function (authRequest) {
            return _connection.login(authRequest);
        })
            .then(function (identity) {
            if (identity) {
                if (identity.machine) {
                    internalConfig.agm.instance.machine = identity.machine;
                }
                if (identity.user) {
                    internalConfig.agm.instance.user = identity.user;
                }
            }
            registerLib("connection", _connection, initTimer);
            return internalConfig;
        })
            .catch(function (e) {
            if (_connection) {
                _connection.logout();
            }
            throw e;
        });
    }
    function setupLogger() {
        var initTimer = timer_1.default();
        var loggerConfig = {
            identity: internalConfig.identity,
            getConnection: function () {
                return _connection || dummyConnection_1.default;
            },
            publish: internalConfig.logger.publish || "off",
            console: internalConfig.logger.console || "info",
            metrics: (internalConfig.metrics && internalConfig.logger.metrics) || "off"
        };
        _logger = main_3.default(loggerConfig);
        registerLib("logger", _logger, initTimer);
        return Promise.resolve(undefined);
    }
    function setupMetrics() {
        if (internalConfig.metrics) {
            var initTimer = timer_1.default();
            _rootMetrics = main_1.default({
                identity: internalConfig.metrics.identity,
                connection: internalConfig.metrics ? _connection : dummyConnection_1.default,
                logger: _logger.subLogger("metrics")
            });
            _metrics = _rootMetrics.subSystem("App");
            var reportingSystem_1 = _metrics.subSystem("reporting");
            var def_1 = {
                name: "features",
                conflation: 1,
            };
            var _featureMetric_1;
            _metrics.featureMetric = function (name, action, payload) {
                if (typeof name === "undefined" || name === "") {
                    throw new Error("name is mandatory");
                }
                else if (typeof action === "undefined" || action === "") {
                    throw new Error("action is mandatory");
                }
                else if (typeof payload === "undefined" || payload === "") {
                    throw new Error("payload is mandatory");
                }
                if (!_featureMetric_1) {
                    _featureMetric_1 = reportingSystem_1.objectMetric(def_1, { name: name, action: action, payload: payload });
                }
                else {
                    _featureMetric_1.update({
                        name: name,
                        action: action,
                        payload: payload
                    });
                }
            };
            _logger.metricsLevel("warn", _metrics.parent.subSystem("LogEvents"));
            registerLib("metrics", _metrics, initTimer);
        }
        return Promise.resolve(undefined);
    }
    function setupAGM() {
        var initTimer = timer_1.default();
        var agmConfig = {
            instance: internalConfig.agm.instance,
            connection: _connection,
            logger: _logger.subLogger("agm"),
            forceGW: internalConfig.connection && internalConfig.connection.force,
            gdVersion: gdVersion,
        };
        return new Promise(function (resolve, reject) {
            main_4.default(agmConfig)
                .then(function (agmLib) {
                _agm = agmLib;
                registerLib("agm", _agm, initTimer);
                resolve(internalConfig);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    }
    function setupContexts() {
        var hasActivities = (internalConfig.activities && dummyConnection_2.default.protocolVersion === 3);
        var needsContexts = internalConfig.contexts || hasActivities;
        if (needsContexts) {
            var initTimer = timer_1.default();
            _contexts = new main_6.ContextsModule({
                connection: _connection,
                logger: _logger.subLogger("contexts"),
                gdMajorVersion: gdVersion
            });
            registerLib("contexts", _contexts, initTimer);
            return _contexts;
        }
        else {
            var replayer = dummyConnection_2.default.replayer;
            if (replayer) {
                replayer.drain(contextMessageReplaySpec_1.ContextMessageReplaySpec.name, null);
            }
        }
    }
    function setupExternalLibs(externalLibs) {
        try {
            externalLibs.forEach(function (lib) {
                setupExternalLib(lib.name, lib.create);
            });
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    function setupExternalLib(name, createCallback) {
        var initTimer = timer_1.default();
        var lib = createCallback(libs);
        if (lib) {
            registerLib(name, lib, initTimer);
        }
    }
    function waitForLibs() {
        var libsReadyPromises = Object.keys(libs).map(function (key) {
            var lib = libs[key];
            return lib.ready ?
                lib.ready() : Promise.resolve();
        });
        return Promise.all(libsReadyPromises);
    }
    function constructGlueObject() {
        var feedbackFunc = function () {
            if (!_agm) {
                return;
            }
            _agm.invoke("T42.ACS.Feedback", {}, "best");
        };
        var info = { glueVersion: internalConfig.version };
        glueInitTimer.stop();
        var glue = {
            feedback: feedbackFunc,
            info: info,
            version: internalConfig.version,
            userConfig: userConfig,
            done: function () {
                _connection.logout();
                return Promise.resolve();
            }
        };
        glue.performance = {
            get browser() {
                return window.performance.timing.toJSON();
            },
            get memory() {
                return window.performance.memory;
            },
            get initTimes() {
                var result = Object.keys(glue)
                    .filter(function (key) {
                    if (key === "initTimes") {
                        return false;
                    }
                    return glue[key].initTime;
                })
                    .map(function (key) {
                    return {
                        name: key,
                        time: glue[key].initTime,
                        startTime: glue[key].initStartTime,
                        endTime: glue[key].initEndTime
                    };
                });
                result.push({
                    name: "glue",
                    startTime: glueInitTimer.startTime,
                    endTime: glueInitTimer.endTime,
                    time: glueInitTimer.period
                });
                return result;
            }
        };
        Object.keys(libs).forEach(function (key) {
            var lib = libs[key];
            glue[key] = lib;
            info[key] = lib.version;
        });
        if (hc && hc.perfDataNeeded && hc.updatePerfData) {
            var delay = hc.perfDataDelay || 100;
            setTimeout(function () {
                hc.updatePerfData(glue.performance);
            }, delay);
        }
        if (glue42gd && glue42gd.updatePerfData) {
            glue42gd.updatePerfData(glue.performance);
        }
        glue.config = {};
        if (ext.enrichGlue) {
            ext.enrichGlue(glue);
        }
        Object.keys(internalConfig).forEach(function (k) {
            glue.config[k] = internalConfig[k];
        });
        if (ext.extOptions) {
            Object.keys(ext.extOptions).forEach(function (k) {
                glue.config[k] = ext.extOptions[k];
            });
        }
        return glue;
    }
    function setupBus() {
        if (!internalConfig.bus) {
            return Promise.resolve(undefined);
        }
        var initTimer = timer_1.default();
        var busSettings = {
            connection: _connection,
            logger: _logger.subLogger("bus")
        };
        return new Promise(function (resolve, reject) {
            main_5.default(busSettings)
                .then(function (busLib) {
                _bus = busLib;
                registerLib("bus", _bus, initTimer);
                resolve();
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    }
    return setupLogger()
        .then(setupConnection)
        .then(function () { return Promise.all([setupMetrics(), setupAGM(), setupContexts(), setupBus()]); })
        .then(function () {
        return setupExternalLibs(internalConfig.libs || []);
    })
        .then(waitForLibs)
        .then(constructGlueObject)
        .catch(function (err) {
        return Promise.reject({
            err: err,
            libs: libs
        });
    });
};
exports.default = GlueCore;
//# sourceMappingURL=glue.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {generator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * const format = require('nanoid/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 * @function
 */
module.exports = function (random, alphabet, size) {
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  var step = Math.ceil(1.6 * mask * size / alphabet.length)

  var id = ''
  while (true) {
    var bytes = random(step)
    for (var i = 0; i < step; i++) {
      var byte = bytes[i] & mask
      if (alphabet[byte]) {
        id += alphabet[byte]
        if (id.length === size) return id
      }
    }
  }
}

/**
 * @callback generator
 * @param {number} bytes The number of bytes to generate.
 * @return {number[]} Random bytes.
 */


/***/ }),
/* 19 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var generate = __webpack_require__(21);
var alphabet = __webpack_require__(4);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate(version);
    str = str + generate(clusterWorkerId);
    if (counter > 0) {
        str = str + generate(counter);
    }
    str = str + generate(seconds);
    return str;
}

module.exports = build;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(4);
var random = __webpack_require__(24);
var format = __webpack_require__(18);

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(random, alphabet.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = generate;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(4);
var build = __webpack_require__(20);
var isValid = __webpack_require__(23);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(26) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(4);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

module.exports = isShortId;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

var randomByte;

if (!crypto || !crypto.getRandomValues) {
    randomByte = function(size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(Math.floor(Math.random() * 256));
        }
        return bytes;
    };
} else {
    randomByte = function(size) {
        return crypto.getRandomValues(new Uint8Array(size));
    };
}

module.exports = randomByte;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ }),
/* 27 */
/***/ (function(module, exports) {


/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __webpack_require__(13);
var server_1 = __webpack_require__(50);
var AGMImpl = (function () {
    function AGMImpl(protocol, clientRepository, serverRepository, instance, configuration) {
        var _this = this;
        this.protocol = protocol;
        this.clientRepository = clientRepository;
        this.serverRepository = serverRepository;
        this.instance = instance;
        this.configuration = configuration;
        if (!instance.getMethods) {
            instance.getMethods = function () { return _this.methodsForInstance(instance).filter(function (m) { return !m.supportsStreaming; }); };
        }
        if (!instance.getStreams) {
            instance.getStreams = function () { return _this.methodsForInstance(instance).filter(function (m) { return m.supportsStreaming; }); };
        }
        this.client = new client_1.default(protocol, clientRepository, instance, configuration);
        this.server = new server_1.default(protocol, serverRepository, instance, configuration);
    }
    AGMImpl.prototype.serverRemoved = function (callback) {
        return this.client.serverRemoved(callback);
    };
    AGMImpl.prototype.serverAdded = function (callback) {
        return this.client.serverAdded(callback);
    };
    AGMImpl.prototype.serverMethodRemoved = function (callback) {
        return this.client.serverMethodRemoved(callback);
    };
    AGMImpl.prototype.serverMethodAdded = function (callback) {
        return this.client.serverMethodAdded(callback);
    };
    AGMImpl.prototype.methodRemoved = function (callback) {
        return this.client.methodRemoved(callback);
    };
    AGMImpl.prototype.methodAdded = function (callback) {
        return this.client.methodAdded(callback);
    };
    AGMImpl.prototype.methodsForInstance = function (instance) {
        return this.client.methodsForInstance(instance);
    };
    AGMImpl.prototype.methods = function (methodFilter) {
        return this.client.methods(methodFilter);
    };
    AGMImpl.prototype.servers = function (methodFilter) {
        return this.client.servers(methodFilter);
    };
    AGMImpl.prototype.subscribe = function (method, options, successCallback, errorCallback) {
        return this.client.subscribe(method, options, successCallback, errorCallback);
    };
    AGMImpl.prototype.createStream = function (streamDef, callbacks, successCallback, errorCallback) {
        return this.server.createStream(streamDef, callbacks, successCallback, errorCallback);
    };
    AGMImpl.prototype.unregister = function (methodFilter) {
        return this.server.unregister(methodFilter);
    };
    AGMImpl.prototype.registerAsync = function (methodDefinition, callback) {
        return this.server.registerAsync(methodDefinition, callback);
    };
    AGMImpl.prototype.register = function (methodDefinition, callback) {
        return this.server.register(methodDefinition, callback);
    };
    AGMImpl.prototype.invoke = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
        return this.client.invoke(methodFilter, argumentObj, target, additionalOptions, success, error);
    };
    AGMImpl.prototype.updateInstance = function (newInstance) {
        if (this.instance.machine === undefined) {
            this.instance.machine = newInstance.MachineName || newInstance.machine;
        }
        if (this.instance.user === undefined) {
            this.instance.user = newInstance.UserName || newInstance.user;
        }
        if (this.instance.environment === undefined) {
            this.instance.environment = newInstance.Environment || newInstance.environment;
        }
        if (this.instance.region === undefined) {
            this.instance.region = newInstance.Region || newInstance.region;
        }
    };
    return AGMImpl;
}());
exports.default = AGMImpl;
//# sourceMappingURL=agm.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(3);
var ClientInvocations = (function () {
    function ClientInvocations(_protocol) {
        var _this = this;
        this._protocol = _protocol;
        this._pendingCallbacks = {};
        _protocol.client.onInvocationResult(function (invocationId, executedBy, status, result, resultMessage) {
            return _this.processInvocationResult(invocationId, executedBy, status, result, resultMessage);
        });
    }
    ClientInvocations.prototype.invoke = function (method, argumentsObj, target, stuff, success, error) {
        var invocationId = random_1.default();
        this.registerInvocation(invocationId, {
            method: method,
            calledWith: argumentsObj,
        }, success, error, stuff.methodResponseTimeoutMs);
        this._protocol.client.invoke(invocationId, method, argumentsObj, target, stuff);
    };
    ClientInvocations.prototype.registerInvocation = function (invocationId, invocationInfo, success, error, timeout) {
        var _this = this;
        this._pendingCallbacks[invocationId] = { invocationInfo: invocationInfo, success: success, error: error };
        setTimeout(function () {
            if (_this._pendingCallbacks[invocationId] === undefined) {
                return;
            }
            error({
                method: invocationInfo.method.getInfoForUser(),
                called_with: invocationInfo.calledWith,
                executed_by: undefined,
                status: undefined,
                returned: undefined,
                message: "Invocation timeout (" + timeout + " ms) reached",
            });
            delete _this._pendingCallbacks[invocationId];
        }, timeout);
    };
    ClientInvocations.prototype.processInvocationResult = function (invocationId, executedBy, status, result, resultMessage) {
        var callback = this._pendingCallbacks[invocationId];
        if (callback === undefined) {
            return;
        }
        if (status === 0 && typeof callback.success === "function") {
            callback.success({
                method: callback.invocationInfo.method.getInfoForUser(),
                called_with: callback.invocationInfo.calledWith,
                executed_by: executedBy,
                returned: result,
                message: resultMessage,
                status: status,
            });
        }
        else if (typeof callback.error === "function") {
            callback.error({
                method: callback.invocationInfo.method.getInfoForUser(),
                called_with: callback.invocationInfo.calledWith,
                executed_by: executedBy,
                message: resultMessage,
                status: status,
                returned: result,
            });
        }
        delete this._pendingCallbacks[invocationId];
    };
    return ClientInvocations;
}());
exports.default = ClientInvocations;
//# sourceMappingURL=invoke.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var ClientRepository = (function () {
    function ClientRepository() {
        this.servers = {};
        this.methodsCount = {};
        this.callbacks = callback_registry_1.default();
    }
    ClientRepository.prototype.addServer = function (info, serverId) {
        var _this = this;
        var current = this.servers[serverId];
        if (current) {
            return current.id;
        }
        var serverEntry = {
            id: serverId,
            info: info,
            methods: {},
            getInfoForUser: function () {
                var serverInfo = _this.createUserServerInfo(serverEntry.info);
                serverInfo.getMethods = function () {
                    return _this.getServerMethodsById(serverEntry.id)
                        .map(function (m) { return m.getInfoForUser(); });
                };
                serverInfo.getStreams = function () {
                    return _this.getServerMethodsById(serverEntry.id)
                        .filter(function (method) { return method.info.supportsStreaming; })
                        .map(function (m) { return m.getInfoForUser(); });
                };
                return serverInfo;
            },
        };
        this.servers[serverId] = serverEntry;
        this.callbacks.execute("onServerAdded", serverEntry);
        return serverId;
    };
    ClientRepository.prototype.removeServerById = function (id, reason) {
        var _this = this;
        var server = this.servers[id];
        Object.keys(server.methods).forEach(function (methodId) {
            _this.removeServerMethod(id, methodId);
        });
        delete this.servers[id];
        this.callbacks.execute("onServerRemoved", server, reason);
    };
    ClientRepository.prototype.addServerMethod = function (serverId, method, protocolState) {
        if (!protocolState) {
            protocolState = {};
        }
        var server = this.servers[serverId];
        if (!server) {
            throw new Error("server does not exists");
        }
        var methodId = this.createMethodId(method);
        if (server.methods[methodId]) {
            return;
        }
        var that = this;
        var methodEntity = {
            id: methodId,
            info: method,
            getInfoForUser: function () {
                var result = that.createUserMethodInfo(methodEntity.info);
                result.getServers = function () {
                    return that.getServersByMethod(methodId);
                };
                return result;
            },
            protocolState: protocolState,
        };
        server.methods[methodId] = methodEntity;
        if (!this.methodsCount[methodId]) {
            this.methodsCount[methodId] = 0;
            this.callbacks.execute("onMethodAdded", methodEntity);
        }
        this.methodsCount[methodId] = this.methodsCount[methodId] + 1;
        this.callbacks.execute("onServerMethodAdded", server, methodEntity);
    };
    ClientRepository.prototype.createMethodId = function (methodInfo) {
        var accepts = methodInfo.accepts !== undefined ? methodInfo.accepts : "";
        var returns = methodInfo.returns !== undefined ? methodInfo.returns : "";
        return (methodInfo.name + accepts + returns).toLowerCase();
    };
    ClientRepository.prototype.removeServerMethod = function (serverId, methodId) {
        var server = this.servers[serverId];
        if (!server) {
            throw new Error("server does not exists");
        }
        var method = server.methods[methodId];
        delete server.methods[methodId];
        this.methodsCount[methodId] = this.methodsCount[methodId] - 1;
        if (this.methodsCount[methodId] === 0) {
            this.callbacks.execute("onMethodRemoved", method);
        }
        this.callbacks.execute("onServerMethodRemoved", server, method);
    };
    ClientRepository.prototype.getMethods = function () {
        var _this = this;
        var allMethods = {};
        Object.keys(this.servers).forEach(function (serverId) {
            var server = _this.servers[serverId];
            Object.keys(server.methods).forEach(function (methodId) {
                var method = server.methods[methodId];
                allMethods[method.id] = method;
            });
        });
        var methodsAsArray = Object.keys(allMethods).map(function (id) {
            return allMethods[id];
        });
        return methodsAsArray;
    };
    ClientRepository.prototype.getServers = function () {
        var _this = this;
        var allServers = [];
        Object.keys(this.servers).forEach(function (serverId) {
            var server = _this.servers[serverId];
            allServers.push(server);
        });
        return allServers;
    };
    ClientRepository.prototype.getServerMethodsById = function (serverId) {
        var server = this.servers[serverId];
        return Object.keys(server.methods).map(function (id) {
            return server.methods[id];
        });
    };
    ClientRepository.prototype.onServerAdded = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onServerAdded", callback);
        var serversWithMethodsToReplay = this.getServers();
        return this.returnUnsubWithDelayedReplay(unsubscribeFunc, serversWithMethodsToReplay, callback);
    };
    ClientRepository.prototype.onMethodAdded = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onMethodAdded", callback);
        var methodsToReplay = this.getMethods();
        return this.returnUnsubWithDelayedReplay(unsubscribeFunc, methodsToReplay, callback);
    };
    ClientRepository.prototype.onServerMethodAdded = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onServerMethodAdded", callback);
        var unsubCalled = false;
        var servers = this.getServers();
        setTimeout(function () {
            servers.forEach(function (server) {
                var methods = server.methods;
                Object.keys(methods).forEach(function (methodId) {
                    if (!unsubCalled) {
                        callback(server, methods[methodId]);
                    }
                });
            });
        }, 0);
        return function () {
            unsubCalled = true;
            unsubscribeFunc();
        };
    };
    ClientRepository.prototype.onMethodRemoved = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onMethodRemoved", callback);
        return unsubscribeFunc;
    };
    ClientRepository.prototype.onServerRemoved = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onServerRemoved", callback);
        return unsubscribeFunc;
    };
    ClientRepository.prototype.onServerMethodRemoved = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onServerMethodRemoved", callback);
        return unsubscribeFunc;
    };
    ClientRepository.prototype.getServerById = function (id) {
        return this.servers[id];
    };
    ClientRepository.prototype.reset = function () {
        this.servers = {};
        this.methodsCount = {};
    };
    ClientRepository.prototype.createUserServerInfo = function (serverInfo) {
        return {
            machine: serverInfo.machine,
            pid: serverInfo.pid,
            user: serverInfo.user,
            application: serverInfo.application,
            environment: serverInfo.environment,
            region: serverInfo.region,
            instance: serverInfo.instance,
            windowId: serverInfo.windowId,
            peerId: serverInfo.peerId,
        };
    };
    ClientRepository.prototype.createUserMethodInfo = function (methodInfo) {
        var result = {
            name: methodInfo.name,
            accepts: methodInfo.accepts,
            returns: methodInfo.returns,
            description: methodInfo.description,
            displayName: methodInfo.displayName,
            objectTypes: methodInfo.objectTypes,
            supportsStreaming: methodInfo.supportsStreaming,
        };
        result.object_types = methodInfo.objectTypes;
        result.display_name = methodInfo.displayName;
        result.version = methodInfo.version;
        return result;
    };
    ClientRepository.prototype.getServersByMethod = function (id) {
        var _this = this;
        var allServers = [];
        Object.keys(this.servers).forEach(function (serverId) {
            var server = _this.servers[serverId];
            Object.keys(server.methods).forEach(function (methodId) {
                if (methodId === id) {
                    allServers.push(server.getInfoForUser());
                }
            });
        });
        return allServers;
    };
    ClientRepository.prototype.returnUnsubWithDelayedReplay = function (unsubscribeFunc, collectionToReplay, callback) {
        var unsubCalled = false;
        setTimeout(function () {
            collectionToReplay.forEach(function (item) {
                if (!unsubCalled) {
                    callback(item);
                }
            });
        }, 0);
        return function () {
            unsubCalled = true;
            unsubscribeFunc();
        };
    };
    return ClientRepository;
}());
exports.default = ClientRepository;
//# sourceMappingURL=repository.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var promisify_1 = __webpack_require__(8);
var NativeAGM = (function () {
    function NativeAGM(instance, helpers, agmFacade) {
        this.instance = instance;
        this.helpers = helpers;
        this.agmFacade = agmFacade;
        this.protocolVersion = this.agmFacade.protocolVersion;
    }
    NativeAGM.prototype.register = function (name, handler) {
        var methodInfoAsObject = this.helpers.stringToObject(name, "name");
        this.helpers.validateMethodInfo(methodInfoAsObject);
        if (this.protocolVersion && this.protocolVersion >= 3) {
            this.agmFacade.register(JSON.stringify(methodInfoAsObject), handler, true);
        }
        else {
            this.agmFacade.register(JSON.stringify(methodInfoAsObject), function (arg, caller) {
                var methodResult = handler(JSON.parse(arg), caller);
                return JSON.stringify(methodResult);
            });
        }
    };
    NativeAGM.prototype.registerAsync = function (name, handler) {
        if (!this.agmFacade.registerAsync) {
            throw new Error("not supported in that version of HtmlContainer");
        }
        var methodInfoAsObject = this.helpers.stringToObject(name, "name");
        this.helpers.validateMethodInfo(methodInfoAsObject);
        this.agmFacade.registerAsync(methodInfoAsObject, function (args, instance, tracker) {
            handler(args, instance, function (successArgs) {
                tracker.success(successArgs);
            }, function (error) {
                tracker.error(error);
            });
        });
    };
    NativeAGM.prototype.unregister = function (definition) {
        this.agmFacade.unregister(JSON.stringify(this.helpers.stringToObject(definition, "name")));
    };
    NativeAGM.prototype.invoke = function (method, argumentObj, target, options, success, error) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (argumentObj === undefined) {
                argumentObj = {};
            }
            if (typeof argumentObj !== "object") {
                reject({ message: "The method arguments must be an object." });
            }
            if (options === undefined) {
                options = {};
            }
            target = _this.helpers.targetArgToObject(target);
            if (_this.agmFacade.invoke2) {
                _this.agmFacade.invoke2(JSON.stringify(_this.helpers.stringToObject(method, "name")), argumentObj, JSON.stringify(target), JSON.stringify(options), function (a) {
                    resolve(a);
                }, function (err) {
                    reject(err);
                });
            }
            else {
                var successProxy = void 0;
                var errorProxy = void 0;
                successProxy = function (args) {
                    var parsed = JSON.parse(args);
                    resolve(parsed);
                };
                errorProxy = function (args) {
                    var parsed = JSON.parse(args);
                    reject(parsed);
                };
                _this.agmFacade.invoke(JSON.stringify(_this.helpers.stringToObject(method, "name")), JSON.stringify(argumentObj), JSON.stringify(target), JSON.stringify(options), successProxy, errorProxy);
            }
        });
        return promisify_1.default(promise, success, error);
    };
    NativeAGM.prototype.createStream = function (methodDefinition, options, successCallback, errorCallback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (typeof methodDefinition === "string") {
                methodDefinition = {
                    name: methodDefinition,
                    getServers: function () { return []; },
                };
            }
            if (!options) {
                options = {
                    subscriptionRequestHandler: undefined,
                    subscriptionAddedHandler: undefined,
                    subscriptionRemovedHandler: undefined,
                };
            }
            _this.agmFacade.createStream2(JSON.stringify(methodDefinition), options.subscriptionRequestHandler, options.subscriptionAddedHandler, options.subscriptionRemovedHandler, function (stream) {
                resolve(stream);
            }, function (error) {
                reject(error);
            });
        });
        return promisify_1.default(promise, successCallback, errorCallback);
    };
    NativeAGM.prototype.subscribe = function (methodDefinition, parameters, successCallback, errorCallback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (typeof methodDefinition === "undefined") {
                reject("method definition param is required");
            }
            if (parameters === undefined) {
                parameters = {};
            }
            parameters.args = JSON.stringify(parameters.arguments || {});
            parameters.target = _this.helpers.targetArgToObject(parameters.target);
            var name;
            if (typeof methodDefinition === "string") {
                name = methodDefinition;
            }
            else {
                name = methodDefinition.name;
            }
            _this.agmFacade.subscribe2(name, JSON.stringify(parameters), function (sub) {
                resolve(sub);
            }, function (error) {
                reject(error);
            });
        });
        return promisify_1.default(promise, successCallback, errorCallback);
    };
    NativeAGM.prototype.servers = function (filter) {
        var _this = this;
        var jsonResult = this.agmFacade.servers(JSON.stringify(this.helpers.stringToObject(filter, "name")));
        var parsedResult = this.helpers.agmParse(jsonResult);
        return parsedResult.map(function (server) {
            return _this.transformServerObject(server);
        });
    };
    NativeAGM.prototype.methods = function (filter) {
        var _this = this;
        var jsonResult = this.agmFacade.methods(JSON.stringify(this.helpers.stringToObject(filter, "name")));
        var parsedResult = this.helpers.agmParse(jsonResult);
        return parsedResult.map(function (method) {
            return _this.transformMethodObject(method);
        });
    };
    NativeAGM.prototype.methodAdded = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.methodAdded(function (method) {
            if (subscribed) {
                callback(_this.transformMethodObject(method));
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.methodRemoved = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.methodRemoved(function (method) {
            if (subscribed) {
                callback(_this.transformMethodObject(method));
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.serverAdded = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.serverAdded(function (server) {
            if (subscribed) {
                callback(_this.transformServerObject(server));
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.serverRemoved = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.serverRemoved(function (server) {
            if (subscribed) {
                callback(_this.transformServerObject(server));
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.serverMethodAdded = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.serverMethodAdded(function (info) {
            if (subscribed) {
                callback({
                    server: _this.transformServerObject(info.server),
                    method: _this.transformMethodObject(info.method),
                });
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.serverMethodRemoved = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.serverMethodRemoved(function (info) {
            if (subscribed) {
                callback({
                    server: _this.transformServerObject(info.server),
                    method: _this.transformMethodObject(info.method),
                });
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.methodsForInstance = function (server) {
        var jsonResult = this.agmFacade.methodsForInstance(JSON.stringify(server));
        var methods = this.helpers.agmParse(jsonResult);
        return methods.map(this.transformMethodObject);
    };
    NativeAGM.prototype.transformMethodObject = function (method) {
        var _this = this;
        if (!method) {
            return undefined;
        }
        if (!method.displayName) {
            method.displayName = method.display_name;
        }
        if (!method.objectTypes) {
            method.objectTypes = method.object_types;
        }
        method.getServers = function () {
            return _this.servers(method.name);
        };
        return method;
    };
    NativeAGM.prototype.transformServerObject = function (server) {
        var _this = this;
        if (!server) {
            return undefined;
        }
        server.getMethods = function () {
            return _this.methodsForInstance(server);
        };
        server.getStreams = function () {
            return _this.methodsForInstance(server).filter(function (method) {
                return method.supportsStreaming;
            });
        };
        return server;
    };
    return NativeAGM;
}());
exports.NativeAGM = NativeAGM;
//# sourceMappingURL=agm.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Helpers = (function () {
    function Helpers(facade) {
        this.facade = facade;
        this.dateTimeIdentifier = facade.jsonValueDatePrefix;
        this.lenOfIdentifier = this.dateTimeIdentifier.length;
    }
    Helpers.prototype.agmParse = function (str) {
        var _this = this;
        return JSON.parse(str, function (k, v) {
            if (typeof v !== "string") {
                return v;
            }
            if (v[0] !== _this.dateTimeIdentifier[0]) {
                return v;
            }
            if (v.indexOf(_this.dateTimeIdentifier) !== 0) {
                return v;
            }
            var unixTimestampMs = v.substr(_this.lenOfIdentifier);
            return new Date(parseFloat(unixTimestampMs));
        });
    };
    Helpers.prototype.targetArgToObject = function (target) {
        var _this = this;
        target = target || "best";
        if (typeof target === "string") {
            if (target !== "all" && target !== "best") {
                throw new Error(target + " is not a valid target. Valid targets are 'all' and 'best'");
            }
            return { target: target };
        }
        else {
            if (!Array.isArray(target)) {
                target = [target];
            }
            target = target.map(function (e) {
                return _this.convertInstanceToRegex(e);
            });
            return { serverFilter: target };
        }
    };
    Helpers.prototype.convertInstanceToRegex = function (instance) {
        var instanceConverted = {};
        Object.keys(instance).forEach(function (key) {
            var propValue = instance[key];
            instanceConverted[key] = propValue;
            if (typeof propValue === "undefined" || propValue === null) {
                return;
            }
            if (typeof propValue === "string" && propValue !== "") {
                instanceConverted[key] = "^" + instance[key] + "$";
            }
            else if (instance[key].constructor === RegExp) {
                instanceConverted[key] = instance[key].source;
            }
            else {
                instanceConverted[key] = instance[key];
            }
        });
        return instanceConverted;
    };
    Helpers.prototype.validateMethodInfo = function (methodInfo) {
        if (typeof methodInfo === "undefined") {
            throw Error("methodInfo is required argument");
        }
        if (!methodInfo.name) {
            throw Error("methodInfo object must contain name property");
        }
        if (methodInfo.objectTypes) {
            methodInfo.object_types = methodInfo.objectTypes;
        }
        if (methodInfo.displayName) {
            methodInfo.display_name = methodInfo.displayName;
        }
    };
    Helpers.prototype.stringToObject = function (param, stringPropName) {
        if (typeof param === "string") {
            var obj = {};
            obj[stringPropName] = param;
            return obj;
        }
        return param;
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var agm_1 = __webpack_require__(31);
var helpers_1 = __webpack_require__(32);
function default_1(configuration) {
    var facade = window.htmlContainer.jsAgmFacade;
    var cfgAsString = createConfig(configuration);
    return new Promise(function (resolve, reject) {
        var successInit = function (instance) {
            var nativeAGM = new agm_1.NativeAGM(instance, new helpers_1.Helpers(facade), facade);
            nativeAGM.create_stream = nativeAGM.createStream;
            nativeAGM.methods_for_instance = nativeAGM.methodsForInstance;
            nativeAGM.method_added = nativeAGM.methodAdded;
            nativeAGM.method_removed = nativeAGM.methodRemoved;
            nativeAGM.server_added = nativeAGM.serverAdded;
            nativeAGM.server_removed = nativeAGM.serverRemoved;
            nativeAGM.server_method_added = nativeAGM.serverMethodAdded;
            nativeAGM.server_method_removed = nativeAGM.serverMethodRemoved;
            resolve(nativeAGM);
        };
        if (facade.protocolVersion && facade.protocolVersion >= 5 && facade.initAsync) {
            facade.initAsync(cfgAsString, successInit, function (err) {
                reject(err);
            });
        }
        else {
            var instance = facade.init(cfgAsString);
            successInit(instance);
        }
    });
}
exports.default = default_1;
var createConfig = function (configuration) {
    if (configuration !== undefined && configuration.metrics !== undefined) {
        configuration.metrics.metricsIdentity = configuration.metrics.identity;
        var metricsConfig = {
            metricsIdentity: configuration.metrics.metricsIdentity,
            path: configuration.metrics.path,
        };
        configuration.metrics = metricsConfig;
    }
    delete configuration.logger;
    return JSON.stringify(configuration);
};
//# sourceMappingURL=native.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor = function (ms, callback) {
    if (ms === void 0) { ms = 0; }
    return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, resolveAfter(ms)];
                case 1:
                    _a.sent();
                    callback();
                    return [2];
            }
        });
    });
};
function resolveAfter(ms, result) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(result); }, ms); });
}
exports.resolveAfter = resolveAfter;
function rejectAfter(ms, error) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve, reject) { return setTimeout(function () { return reject(error); }, ms); });
}
exports.rejectAfter = rejectAfter;
//# sourceMappingURL=promiseHelpers.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(3);
function createOwnInstance(userSubmittedProperties, resolvedIdentity, peerId) {
    var document = global.document || global.process;
    var instance = {
        application: document.title + random_1.default(),
        pid: Math.floor(Math.random() * 10000000000),
    };
    instance.peerId = peerId;
    if (typeof userSubmittedProperties === "object") {
        if (userSubmittedProperties.application !== undefined) {
            instance.application = userSubmittedProperties.application;
        }
        instance.machine = userSubmittedProperties.machine;
        instance.user = userSubmittedProperties.user;
        instance.environment = userSubmittedProperties.environment;
        instance.region = userSubmittedProperties.region;
    }
    if (typeof resolvedIdentity !== "undefined") {
        instance.user = resolvedIdentity.user;
        instance.instance = resolvedIdentity.instance;
        instance.application = resolvedIdentity.application;
        instance.pid = resolvedIdentity.process;
        instance.machine = resolvedIdentity.machine;
        instance.environment = resolvedIdentity.environment;
        instance.region = resolvedIdentity.region;
        instance.windowId = resolvedIdentity.windowId;
    }
    return instance;
}
exports.createOwnInstance = createOwnInstance;
//# sourceMappingURL=instance.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var instance_1 = __webpack_require__(35);
var native_1 = __webpack_require__(33);
var factory_1 = __webpack_require__(39);
var factory_2 = __webpack_require__(44);
var agm_1 = __webpack_require__(28);
var repository_1 = __webpack_require__(30);
var repository_2 = __webpack_require__(48);
exports.default = (function (configuration) {
    if (!configuration.forceGW && configuration.gdVersion === 2) {
        return native_1.default(configuration);
    }
    if (typeof configuration === "undefined") {
        throw new Error("configuration is required");
    }
    if (typeof configuration.connection === "undefined") {
        throw new Error("configuration.connections is required");
    }
    var connection = configuration.connection;
    if (typeof configuration.methodResponseTimeout !== "number") {
        configuration.methodResponseTimeout = 3000;
    }
    if (typeof configuration.waitTimeoutMs !== "number") {
        configuration.waitTimeoutMs = 3000;
    }
    var myIdentity = connection.resolvedIdentity;
    var myInstance = instance_1.createOwnInstance(configuration.instance, myIdentity, connection.peerId);
    var clientRepository = new repository_1.default();
    var serverRepository = new repository_2.default();
    var protocolPromise;
    var agmImpl;
    if (connection.protocolVersion === 3) {
        protocolPromise = factory_2.default(myInstance, connection, clientRepository, serverRepository, configuration, function () { return agmImpl; });
    }
    else {
        protocolPromise = factory_1.default(myInstance, connection, clientRepository, serverRepository, configuration, function () { return agmImpl; });
    }
    return new Promise(function (resolve, reject) {
        protocolPromise.then(function (protocol) {
            agmImpl = new agm_1.default(protocol, clientRepository, serverRepository, myInstance, configuration);
            resolve(agmImpl);
        }).catch(function (err) {
            reject(err);
        });
    });
});
//# sourceMappingURL=main.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(3);
var helpers_1 = __webpack_require__(5);
var STATUS_AWAITING_ACCEPT = "awaitingAccept";
var STATUS_SUBSCRIBED = "subscribed";
var ERR_MSG_SUB_FAILED = "Subscription failed.";
var ERR_MSG_SUB_REJECTED = "Subscription rejected.";
var ON_CLOSE_MSG_SERVER_INIT = "ServerInitiated";
var ON_CLOSE_MSG_CLIENT_INIT = "ClientInitiated";
var ClientStreaming = (function () {
    function ClientStreaming(configuration, instance, sendRequest, nextResponseSubject) {
        this.configuration = configuration;
        this.instance = instance;
        this.sendRequest = sendRequest;
        this.nextResponseSubject = nextResponseSubject;
        this.subscriptionsList = {};
    }
    ClientStreaming.prototype.subscribe = function (stream, args, targetServers, options, success, error) {
        var _this = this;
        if (targetServers.length === 0) {
            error({
                method: stream.getInfoForUser(),
                message: ERR_MSG_SUB_FAILED + " No available servers matched the target params.",
                called_with: args,
            });
            return;
        }
        var subscriptionId = "subscriptionId_" + random_1.default();
        var pendingSub = this.registerSubscription(subscriptionId, stream, args, success, error, options.methodResponseTimeout);
        if (typeof pendingSub !== "object") {
            error({
                method: stream.getInfoForUser(),
                message: ERR_MSG_SUB_FAILED + " Unable to register the user callbacks.",
                called_with: args,
            });
            return;
        }
        targetServers.forEach(function (target) {
            var responseSubject = _this.nextResponseSubject();
            var requestSubject = stream.info.requestSubject;
            pendingSub.trackedServers.push({
                server: undefined,
                streamId: undefined,
                streamSubjects: {
                    global: undefined,
                    private: undefined,
                },
                methodRequestSubject: requestSubject,
                methodResponseSubject: responseSubject,
            });
            var message = {
                EventStreamAction: 1,
                MethodRequestSubject: requestSubject,
                MethodResponseSubject: responseSubject,
                Client: helpers_1.convertInstance(_this.instance),
                Context: {
                    ArgumentsJson: args,
                    InvocationId: subscriptionId,
                    MethodName: stream.info.name,
                    ExecutionServer: target.server.info,
                    Timeout: options.methodResponseTimeout,
                },
            };
            _this.sendRequest(message);
        });
    };
    ClientStreaming.prototype.processPublisherMsg = function (msg) {
        if (!(msg && msg.EventStreamAction && msg.EventStreamAction !== 0)) {
            return;
        }
        if (msg.EventStreamAction === 2) {
            this.serverIsKickingASubscriber(msg);
        }
        else if (msg.EventStreamAction === 3) {
            this.serverAcknowledgesGoodSubscription(msg);
        }
        else if (msg.EventStreamAction === 5) {
            this.serverHasPushedSomeDataIntoTheStream(msg);
        }
    };
    ClientStreaming.prototype.registerSubscription = function (subscriptionId, method, args, success, error, timeout) {
        var _this = this;
        this.subscriptionsList[subscriptionId] = {
            status: STATUS_AWAITING_ACCEPT,
            method: method,
            arguments: args,
            success: success,
            error: error,
            trackedServers: [],
            handlers: {
                onData: [],
                onClosed: [],
            },
            queued: {
                data: [],
                closers: [],
            },
            timeoutId: undefined,
        };
        this.subscriptionsList[subscriptionId].timeoutId = setTimeout(function () {
            if (_this.subscriptionsList[subscriptionId] === undefined) {
                return;
            }
            var subscription = _this.subscriptionsList[subscriptionId];
            if (subscription.status === STATUS_AWAITING_ACCEPT) {
                error({
                    method: method,
                    called_with: args,
                    message: ERR_MSG_SUB_FAILED + " Subscription attempt timed out after " + timeout + "ms.",
                });
                delete _this.subscriptionsList[subscriptionId];
            }
            else if (subscription.status === STATUS_SUBSCRIBED &&
                subscription.trackedServers.length > 0) {
                subscription.trackedServers = subscription.trackedServers.filter(function (server) {
                    return (typeof server.streamId === "string" && server.streamId !== "");
                });
                subscription.timeoutId = undefined;
                if (subscription.trackedServers.length === 0) {
                    var closersCount = subscription.queued.closers.length;
                    var closingServer_1 = (closersCount > 0) ? subscription.queued.closers[closersCount - 1] : null;
                    subscription.handlers.onClosed.forEach(function (callback) {
                        if (typeof callback === "function") {
                            callback({
                                message: ON_CLOSE_MSG_SERVER_INIT,
                                requestArguments: subscription.arguments,
                                server: closingServer_1,
                                stream: subscription.method,
                            });
                        }
                    });
                    delete _this.subscriptionsList[subscriptionId];
                }
            }
        }, timeout);
        return this.subscriptionsList[subscriptionId];
    };
    ClientStreaming.prototype.serverIsKickingASubscriber = function (msg) {
        var _this = this;
        var keys = Object.keys(this.subscriptionsList);
        if (typeof msg.InvocationId === "string" && msg.InvocationId !== "") {
            keys = keys.filter(function (k) { return k === msg.InvocationId; });
        }
        var deletionsList = [];
        keys.forEach(function (key) {
            if (typeof _this.subscriptionsList[key] !== "object") {
                return;
            }
            _this.subscriptionsList[key].trackedServers = _this.subscriptionsList[key].trackedServers.filter(function (server) {
                var isRejecting = (server.methodRequestSubject === msg.MethodRequestSubject && server.methodResponseSubject === msg.MethodResponseSubject);
                var isKicking = (server.streamId === msg.StreamId &&
                    (server.streamSubjects.global === msg.EventStreamSubject || server.streamSubjects.private === msg.EventStreamSubject));
                var isRejectingOrKicking = isRejecting || isKicking;
                return !isRejectingOrKicking;
            });
            if (_this.subscriptionsList[key].trackedServers.length === 0) {
                deletionsList.push(key);
            }
        });
        deletionsList.forEach(function (key) {
            if (typeof _this.subscriptionsList[key] !== "object") {
                return;
            }
            if (_this.subscriptionsList[key].status === STATUS_AWAITING_ACCEPT &&
                typeof _this.subscriptionsList[key].timeoutId === "number") {
                var reason = (typeof msg.ResultMessage === "string" && msg.ResultMessage !== "") ?
                    ' Publisher said "' + msg.ResultMessage + '".' :
                    " No reason given.";
                var callArgs = typeof _this.subscriptionsList[key].arguments === "object" ?
                    JSON.stringify(_this.subscriptionsList[key].arguments) :
                    "{}";
                _this.subscriptionsList[key].error(ERR_MSG_SUB_REJECTED + reason + " Called with:" + callArgs);
                clearTimeout(_this.subscriptionsList[key].timeoutId);
            }
            else {
                _this.subscriptionsList[key].handlers.onClosed.forEach(function (callback) {
                    if (typeof callback !== "function") {
                        return;
                    }
                    callback({
                        message: ON_CLOSE_MSG_SERVER_INIT,
                        requestArguments: _this.subscriptionsList[key].arguments,
                        server: helpers_1.convertInfoToInstance(msg.Server),
                        stream: _this.subscriptionsList[key].method,
                    });
                });
            }
            delete _this.subscriptionsList[key];
        });
    };
    ClientStreaming.prototype.serverAcknowledgesGoodSubscription = function (msg) {
        var _this = this;
        var subscriptionId = msg.InvocationId;
        var subscription = this.subscriptionsList[subscriptionId];
        if (typeof subscription !== "object") {
            return;
        }
        var acceptingServer = subscription.trackedServers.filter(function (server) {
            return (server.methodRequestSubject === msg.MethodRequestSubject &&
                server.methodResponseSubject === msg.MethodResponseSubject);
        })[0];
        if (typeof acceptingServer !== "object") {
            return;
        }
        var isFirstResponse = (subscription.status === STATUS_AWAITING_ACCEPT);
        subscription.status = STATUS_SUBSCRIBED;
        var privateStreamSubject = this.generatePrivateStreamSubject(subscription.method.name);
        if (typeof acceptingServer.streamId === "string" && acceptingServer.streamId !== "") {
            return;
        }
        acceptingServer.server = helpers_1.convertInfoToInstance(msg.Server);
        acceptingServer.streamId = msg.StreamId;
        acceptingServer.streamSubjects.global = msg.EventStreamSubject;
        acceptingServer.streamSubjects.private = privateStreamSubject;
        var confirmatoryRequest = {
            EventStreamAction: 3,
            EventStreamSubject: privateStreamSubject,
            StreamId: msg.StreamId,
            MethodRequestSubject: msg.MethodRequestSubject,
            MethodResponseSubject: acceptingServer.methodResponseSubject,
            Client: helpers_1.convertInstance(this.instance),
            Context: {
                ArgumentsJson: subscription.arguments,
                MethodName: subscription.method.name,
            },
        };
        this.sendRequest(confirmatoryRequest);
        if (isFirstResponse) {
            subscription.success({
                onData: function (dataCallback) {
                    if (typeof dataCallback !== "function") {
                        throw new TypeError("The data callback must be a function.");
                    }
                    this.handlers.onData.push(dataCallback);
                    if (this.handlers.onData.length === 1 && this.queued.data.length > 0) {
                        this.queued.data.forEach(function (dataItem) {
                            dataCallback(dataItem);
                        });
                    }
                }.bind(subscription),
                onClosed: function (closedCallback) {
                    if (typeof closedCallback !== "function") {
                        throw new TypeError("The callback must be a function.");
                    }
                    this.handlers.onClosed.push(closedCallback);
                }.bind(subscription),
                onFailed: function () { },
                close: function () { return _this.closeSubscription(subscription, subscriptionId); },
                requestArguments: subscription.arguments,
                serverInstance: helpers_1.convertInfoToInstance(msg.Server),
                stream: subscription.method,
            });
        }
    };
    ClientStreaming.prototype.serverHasPushedSomeDataIntoTheStream = function (msg) {
        var _loop_1 = function (key) {
            if (this_1.subscriptionsList.hasOwnProperty(key) && typeof this_1.subscriptionsList[key] === "object") {
                var isPrivateData = void 0;
                var trackedServersFound = this_1.subscriptionsList[key].trackedServers.filter(function (ls) {
                    return (ls.streamId === msg.StreamId &&
                        (ls.streamSubjects.global === msg.EventStreamSubject ||
                            ls.streamSubjects.private === msg.EventStreamSubject));
                });
                if (trackedServersFound.length === 0) {
                    isPrivateData = undefined;
                }
                else if (trackedServersFound[0].streamSubjects.global === msg.EventStreamSubject) {
                    isPrivateData = false;
                }
                else if (trackedServersFound[0].streamSubjects.private === msg.EventStreamSubject) {
                    isPrivateData = true;
                }
                if (isPrivateData !== undefined) {
                    var receivedStreamData_1 = {
                        data: msg.ResultContextJson,
                        server: helpers_1.convertInfoToInstance(msg.Server),
                        requestArguments: this_1.subscriptionsList[key].arguments || {},
                        message: msg.ResultMessage,
                        private: isPrivateData,
                    };
                    var onDataHandlers = this_1.subscriptionsList[key].handlers.onData;
                    var queuedData = this_1.subscriptionsList[key].queued.data;
                    if (Array.isArray(onDataHandlers)) {
                        if (onDataHandlers.length > 0) {
                            onDataHandlers.forEach(function (callback) {
                                if (typeof callback === "function") {
                                    callback(receivedStreamData_1);
                                }
                            });
                        }
                        else {
                            queuedData.push(receivedStreamData_1);
                        }
                    }
                }
            }
        };
        var this_1 = this;
        for (var key in this.subscriptionsList) {
            _loop_1(key);
        }
    };
    ClientStreaming.prototype.closeSubscription = function (sub, subId) {
        var _this = this;
        var responseSubject = this.nextResponseSubject();
        sub.trackedServers.forEach(function (server) {
            _this.sendRequest({
                EventStreamAction: 2,
                Client: helpers_1.convertInstance(_this.instance),
                MethodRequestSubject: server.methodRequestSubject,
                MethodResponseSubject: responseSubject,
                StreamId: server.streamId,
                EventStreamSubject: server.streamSubjects.private,
            });
        });
        sub.handlers.onClosed.forEach(function (callback) {
            if (typeof callback === "function") {
                callback({
                    message: ON_CLOSE_MSG_CLIENT_INIT,
                    requestArguments: sub.arguments || {},
                    server: sub.trackedServers[sub.trackedServers.length - 1].server,
                    stream: sub.method,
                });
            }
        });
        delete this.subscriptionsList[subId];
    };
    ClientStreaming.prototype.generatePrivateStreamSubject = function (methodName) {
        var appInfo = helpers_1.convertInstance(this.instance);
        return "ESSpriv-jsb_" +
            appInfo.ApplicationName +
            "_on_" +
            methodName +
            "_" +
            random_1.default();
    };
    return ClientStreaming;
}());
exports.default = ClientStreaming;
//# sourceMappingURL=client-streaming.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(3);
var callback_registry_1 = __webpack_require__(1);
var client_streaming_1 = __webpack_require__(37);
var helpers_1 = __webpack_require__(5);
var numberMissingHeartbeatsToRemove = 3;
var ClientProtocol = (function () {
    function ClientProtocol(connection, instance, configuration, repository) {
        var _this = this;
        this.connection = connection;
        this.instance = instance;
        this.configuration = configuration;
        this.repository = repository;
        this.respCounter = 0;
        this.callbacks = callback_registry_1.default();
        this.timers = {};
        this.timers = {};
        this.streaming = new client_streaming_1.default(configuration, instance, function (msg) {
            connection.send("agm", "MethodInvocationRequestMessage", msg);
        }, function () { return _this.nextResponseSubject(); });
        this.listenForEvents();
    }
    ClientProtocol.prototype.subscribe = function (stream, args, targetServers, options, success, error) {
        this.streaming.subscribe(stream, args, targetServers, options, success, error);
    };
    ClientProtocol.prototype.onInvocationResult = function (callback) {
        this.callbacks.add("onResult", callback);
    };
    ClientProtocol.prototype.invoke = function (id, method, args, target, stuff) {
        var methodInfo = method.info;
        var message = {
            MethodRequestSubject: methodInfo.requestSubject,
            MethodResponseSubject: this.nextResponseSubject(),
            Client: helpers_1.convertInstance(this.instance),
            Context: {
                ArgumentsJson: args,
                InvocationId: id,
                MethodName: methodInfo.name,
                ExecutionServer: target.info,
                Timeout: stuff.methodResponseTimeoutMs,
            },
        };
        this.connection.send("agm", "MethodInvocationRequestMessage", message);
        return Promise.resolve({
            invocationId: "test",
            result: {},
            instance: {},
            status: 1,
            message: "not implemented"
        });
    };
    ClientProtocol.prototype.nextResponseSubject = function () {
        return "resp_" + (this.respCounter++) + "_" + random_1.default();
    };
    ClientProtocol.prototype.createServerInfo = function (instance) {
        return {
            machine: instance.MachineName,
            pid: instance.ProcessId,
            user: instance.UserName,
            application: instance.ApplicationName,
            environment: instance.Environment,
            region: instance.Region,
        };
    };
    ClientProtocol.prototype.createMethod = function (methodInfo) {
        var method = methodInfo.Method;
        return {
            name: method.Name,
            accepts: method.InputSignature,
            returns: method.ResultSignature,
            requestSubject: methodInfo.MethodRequestSubject,
            description: method.Description,
            displayName: method.DisplayName,
            version: method.Version,
            objectTypes: method.ObjectTypeRestrictions,
            supportsStreaming: helpers_1.isStreamingFlagSet(method.Flags),
        };
    };
    ClientProtocol.prototype.createServerId = function (serverInfo) {
        if (serverInfo === undefined) {
            return undefined;
        }
        return [serverInfo.application,
            serverInfo.user,
            serverInfo.machine,
            serverInfo.started,
            serverInfo.pid].join("/").toLowerCase();
    };
    ClientProtocol.prototype.processServerPresence = function (presence, isPresence) {
        var instance = presence.Instance;
        var serverInfo = this.createServerInfo(instance);
        var serverId = this.createServerId(serverInfo);
        if (isPresence) {
            serverId = this.repository.addServer(serverInfo, serverId);
            if (presence.PublishingInterval) {
                this.scheduleTimeout(serverId, presence.PublishingInterval);
            }
        }
        else if (presence.PublishingInterval === 0) {
            var server = this.repository.getServerById(serverId);
            if (typeof server !== "undefined") {
                this.repository.removeServerById(serverId);
            }
        }
        if (presence.MethodDefinitions !== undefined) {
            this.updateServerMethods(serverId, presence.MethodDefinitions);
        }
    };
    ClientProtocol.prototype.scheduleTimeout = function (serverId, duration) {
        var _this = this;
        if (duration === -1) {
            return;
        }
        var timer = this.timers[serverId];
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        this.timers[serverId] = setTimeout(function () {
            _this.repository.removeServerById(serverId);
        }, duration * (numberMissingHeartbeatsToRemove + 1));
    };
    ClientProtocol.prototype.updateServerMethods = function (serverId, newMethods) {
        var _this = this;
        var oldMethods = this.repository.getServerMethodsById(serverId);
        var newMethodsReduced = newMethods
            .map(function (nm) { return _this.createMethod(nm); })
            .reduce(function (obj, method) {
            var methodId = _this.repository.createMethodId(method);
            obj[methodId] = method;
            return obj;
        }, {});
        oldMethods.forEach(function (method) {
            if (newMethodsReduced[method.id] === undefined) {
                _this.repository.removeServerMethod(serverId, method.id);
            }
            else {
                delete newMethodsReduced[method.id];
            }
        });
        Object.keys(newMethodsReduced).forEach(function (key) {
            var method = newMethodsReduced[key];
            _this.repository.addServerMethod(serverId, method);
        });
    };
    ClientProtocol.prototype.handleInvokeResultMessage = function (message) {
        if (message && message.EventStreamAction && message.EventStreamAction !== 0) {
            this.streaming.processPublisherMsg(message);
            return;
        }
        var server = message.Server ? this.createServerInfo(message.Server) : undefined;
        var result = message.ResultContextJson;
        if (result && Object.keys(result).length === 0) {
            result = undefined;
        }
        this.callbacks.execute("onResult", message.InvocationId, server, message.Status, result, message.ResultMessage);
    };
    ClientProtocol.prototype.listenForEvents = function () {
        var _this = this;
        this.connection.on("agm", "ServerPresenceMessage", function (msg) {
            _this.processServerPresence(msg, true);
        });
        this.connection.on("agm", "ServerHeartbeatMessage", function (msg) {
            _this.processServerPresence(msg, false);
        });
        this.connection.on("agm", "MethodInvocationResultMessage", function (msg) {
            _this.handleInvokeResultMessage(msg);
        });
    };
    return ClientProtocol;
}());
exports.default = ClientProtocol;
//# sourceMappingURL=client.js.map

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __webpack_require__(41);
var client_1 = __webpack_require__(38);
function default_1(instance, connection, clientRepository, serverRepository, configuration, getAGM) {
    var unsubscribe = connection.on("agm", "Instance", function (newInstance) {
        getAGM().updateInstance(newInstance);
        connection.off(unsubscribe);
    });
    var server = new server_1.default(connection, instance, configuration, serverRepository);
    var client = new client_1.default(connection, instance, configuration, clientRepository);
    return new Promise(function (resolve) {
        resolve({
            server: server,
            client: client,
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=factory.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(3);
var helpers_1 = __webpack_require__(5);
var ServerStreaming = (function () {
    function ServerStreaming(connection, instance) {
        this.connection = connection;
        this.instance = instance;
    }
    ServerStreaming.prototype.isStreamMsg = function (msg, method) {
        return (msg &&
            msg.EventStreamAction &&
            msg.EventStreamAction !== 0 &&
            typeof method === "object" &&
            method.definition.supportsStreaming === true);
    };
    ServerStreaming.prototype.pushData = function (streamingMethod, data, branches) {
        var _this = this;
        if (typeof streamingMethod !== "object" || !Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            return;
        }
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        if (typeof branches === "string") {
            branches = [branches];
        }
        else if (!Array.isArray(branches) || branches.length <= 0) {
            branches = null;
        }
        var streamIdList = streamingMethod.protocolState.branchKeyToStreamIdMap
            .filter(function (br) {
            return (branches === null || (Boolean(br) && typeof br.key === "string" && branches.indexOf(br.key) >= 0));
        }).map(function (br) {
            return br.streamId;
        });
        var server = helpers_1.convertInstance(this.instance);
        streamIdList.forEach(function (streamId) {
            _this.sendResult({
                EventStreamAction: 5,
                EventStreamSubject: streamingMethod.protocolState.globalEventStreamSubject,
                MethodName: streamingMethod.protocolState.method.Method.Name,
                MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
                ResultContextJson: data,
                Server: server,
                StreamId: streamId,
            });
        });
    };
    ServerStreaming.prototype.closeAllSubscriptions = function (streamingMethod, branchKey) {
        var _this = this;
        if (typeof streamingMethod !== "object" || !Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            return;
        }
        var streamList = streamingMethod.protocolState.branchKeyToStreamIdMap;
        if (typeof branchKey === "string") {
            streamList = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (br) {
                return (typeof br === "object" && br.key === branchKey);
            });
        }
        streamList.forEach(function (br) {
            var streamId = br.streamId;
            _this.sendResult({
                EventStreamAction: 2,
                EventStreamSubject: streamingMethod.protocolState.globalEventStreamSubject,
                MethodName: streamingMethod.protocolState.method.Method.Name,
                MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
                Server: helpers_1.convertInstance(_this.instance),
                StreamId: streamId,
                Status: 0,
            });
        });
    };
    ServerStreaming.prototype.getBranchList = function (streamingMethod) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        return this.getUniqueBranchNames(streamingMethod);
    };
    ServerStreaming.prototype.getSubscriptionList = function (streamingMethod, branchKey) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        var subscriptions = [];
        if (typeof branchKey !== "string") {
            subscriptions = streamingMethod.protocolState.subscriptions;
        }
        else {
            subscriptions = streamingMethod.protocolState.subscriptions.filter(function (sub) {
                return sub.branchKey === branchKey;
            });
        }
        return subscriptions;
    };
    ServerStreaming.prototype.onSubAdded = function (handlerFunc) {
        if (typeof handlerFunc !== "function") {
            return;
        }
        this.subAddedHandler = handlerFunc;
    };
    ServerStreaming.prototype.onSubRemoved = function (handlerFunc) {
        if (typeof handlerFunc !== "function") {
            return;
        }
        this.subRemovedHandler = handlerFunc;
    };
    ServerStreaming.prototype.onSubRequest = function (handlerFunc) {
        if (typeof handlerFunc !== "function") {
            return;
        }
        this.requestHandler = handlerFunc;
    };
    ServerStreaming.prototype.generateNewStreamId = function (streamingMethodName) {
        var appInfo = helpers_1.convertInstance(this.instance);
        return "streamId-jsb_of_" +
            streamingMethodName +
            "__by_" +
            appInfo.ApplicationName +
            "_" +
            random_1.default();
    };
    ServerStreaming.prototype.rejectRequest = function (requestContext, streamingMethod, reason) {
        if (typeof reason !== "string") {
            reason = "";
        }
        var msg = requestContext.msg;
        this.sendResult({
            EventStreamAction: 2,
            EventStreamSubject: streamingMethod.protocolState.globalEventStreamSubject,
            MethodName: streamingMethod.protocolState.method.Method.Name,
            MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
            MethodResponseSubject: msg.MethodResponseSubject,
            MethodVersion: streamingMethod.protocolState.method.Method.Version,
            ResultMessage: reason,
            Server: helpers_1.convertInstance(this.instance),
            StreamId: "default_rejection_streamId",
        });
    };
    ServerStreaming.prototype.pushDataToSingle = function (streamingMethod, subscription, data) {
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        this.sendResult({
            EventStreamAction: 5,
            EventStreamSubject: subscription.privateEventStreamSubject,
            MethodName: streamingMethod.protocolState.method.Method.Name,
            MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
            ResultContextJson: data,
            Server: helpers_1.convertInstance(this.instance),
            StreamId: subscription.streamId,
        });
    };
    ServerStreaming.prototype.closeSingleSubscription = function (streamingMethod, subscription) {
        this.closeIndividualSubscription(streamingMethod, subscription.streamId, subscription.privateEventStreamSubject, true);
    };
    ServerStreaming.prototype.acceptRequestOnBranch = function (requestContext, streamingMethod, branch) {
        if (typeof branch !== "string") {
            branch = "";
        }
        var streamId = this.getStreamId(streamingMethod, branch);
        var msg = requestContext.msg;
        this.sendResult({
            EventStreamAction: 3,
            EventStreamSubject: streamingMethod.protocolState.globalEventStreamSubject,
            InvocationId: msg.Context.InvocationId,
            MethodName: streamingMethod.protocolState.method.Method.Name,
            MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
            MethodResponseSubject: msg.MethodResponseSubject,
            MethodVersion: streamingMethod.protocolState.method.Method.Version,
            ResultMessage: "Accepted",
            Server: helpers_1.convertInstance(this.instance),
            StreamId: streamId,
        });
    };
    ServerStreaming.prototype.processSubscriberMsg = function (msg, streamingMethod) {
        if (!(msg && msg.EventStreamAction && msg.EventStreamAction !== 0)) {
            return;
        }
        if (msg.EventStreamAction === 1) {
            this.clientWishesToSubscribe(msg, streamingMethod);
        }
        else if (msg.EventStreamAction === 2) {
            this.clientWishesToUnsubscribe(msg, streamingMethod);
        }
        else if (msg.EventStreamAction === 3) {
            this.clientAcknowledgesItDidSubscribe(msg, streamingMethod);
        }
        else if (msg.EventStreamAction === 4) {
            this.clientPerSubHeartbeat(msg);
        }
    };
    ServerStreaming.prototype.sendResult = function (message) {
        if (typeof message !== "object") {
            throw new Error("Invalid message.");
        }
        if (typeof message.Status !== "number") {
            message.Status = 0;
        }
        this.connection.send("agm", "MethodInvocationResultMessage", message);
    };
    ServerStreaming.prototype.clientWishesToSubscribe = function (msg, streamingMethod) {
        var requestContext = {
            msg: msg,
            arguments: msg.Context.ArgumentsJson || {},
            instance: helpers_1.convertInfoToInstance(msg.Client),
        };
        if (typeof this.requestHandler === "function") {
            this.requestHandler(requestContext, streamingMethod);
        }
    };
    ServerStreaming.prototype.clientWishesToUnsubscribe = function (msg, streamingMethod) {
        if (!(streamingMethod &&
            Array.isArray(streamingMethod.protocolState.subscriptions) &&
            streamingMethod.protocolState.subscriptions.length > 0)) {
            return;
        }
        this.closeIndividualSubscription(streamingMethod, msg.StreamId, msg.EventStreamSubject, false);
    };
    ServerStreaming.prototype.clientAcknowledgesItDidSubscribe = function (msg, streamingMethod) {
        if (typeof msg.StreamId !== "string" || msg.StreamId === "") {
            return;
        }
        var branchKey = this.getBranchKey(streamingMethod, msg.StreamId);
        if (typeof branchKey !== "string") {
            return;
        }
        if (!Array.isArray(streamingMethod.protocolState.subscriptions)) {
            return;
        }
        var subscription = {
            branchKey: branchKey,
            instance: helpers_1.convertInfoToInstance(msg.Client),
            arguments: msg.Context.ArgumentsJson,
            streamId: msg.StreamId,
            privateEventStreamSubject: msg.EventStreamSubject,
            methodResponseSubject: msg.MethodResponseSubject,
        };
        streamingMethod.protocolState.subscriptions.push(subscription);
        if (typeof this.subAddedHandler === "function") {
            this.subAddedHandler(subscription, streamingMethod);
        }
    };
    ServerStreaming.prototype.clientPerSubHeartbeat = function (msg) {
    };
    ServerStreaming.prototype.getBranchKey = function (streamingMethod, streamId) {
        if (typeof streamId !== "string" || typeof streamingMethod !== "object") {
            return;
        }
        var needle = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (branch) {
            return branch.streamId === streamId;
        })[0];
        if (typeof needle !== "object" || typeof needle.key !== "string") {
            return;
        }
        return needle.key;
    };
    ServerStreaming.prototype.getStreamId = function (streamingMethod, branchKey) {
        if (typeof branchKey !== "string") {
            branchKey = "";
        }
        var needleBranch = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (branch) {
            return branch.key === branchKey;
        })[0];
        var streamId = (needleBranch ? needleBranch.streamId : undefined);
        if (typeof streamId !== "string" || streamId === "") {
            streamId = this.generateNewStreamId(streamingMethod.protocolState.method.Method.Name);
            streamingMethod.protocolState.branchKeyToStreamIdMap.push({ key: branchKey, streamId: streamId });
        }
        return streamId;
    };
    ServerStreaming.prototype.closeIndividualSubscription = function (streamingMethod, streamId, privateEventStreamSubject, sendKickMessage) {
        var subscription = streamingMethod.protocolState.subscriptions.filter(function (subItem) {
            return (subItem.privateEventStreamSubject === privateEventStreamSubject &&
                subItem.streamId === streamId);
        })[0];
        if (typeof subscription !== "object") {
            return;
        }
        var initialLength = streamingMethod.protocolState.subscriptions.length;
        streamingMethod.protocolState.subscriptions = streamingMethod.protocolState.subscriptions.filter(function (subItem) {
            return !(subItem.privateEventStreamSubject === subscription.privateEventStreamSubject &&
                subItem.streamId === subscription.streamId);
        });
        var filteredLength = streamingMethod.protocolState.subscriptions.length;
        if (filteredLength !== (initialLength - 1)) {
            return;
        }
        if (sendKickMessage === true) {
            this.sendResult({
                EventStreamAction: 2,
                EventStreamSubject: privateEventStreamSubject,
                MethodName: streamingMethod.protocolState.method.Method.Name,
                MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
                MethodResponseSubject: subscription.methodResponseSubject,
                MethodVersion: streamingMethod.protocolState.method.Method.Version,
                ResponseContextJson: {},
                Server: helpers_1.convertInstance(this.instance),
                StreamId: subscription.streamId,
                Status: 0,
            });
        }
        if (typeof this.subRemovedHandler === "function") {
            this.subRemovedHandler(subscription, streamingMethod);
        }
    };
    ServerStreaming.prototype.getUniqueBranchNames = function (streamingMethod) {
        var keysWithDuplicates = streamingMethod.protocolState.subscriptions.map(function (sub) {
            var result = null;
            if (typeof sub === "object" && typeof sub.branchKey === "string") {
                result = sub.branchKey;
            }
            return result;
        });
        var seen = [];
        var branchArray = keysWithDuplicates.filter(function (bKey) {
            if (bKey === null || seen.indexOf(bKey) >= 0) {
                return false;
            }
            seen.push(bKey);
            return true;
        });
        return branchArray;
    };
    return ServerStreaming;
}());
exports.default = ServerStreaming;
//# sourceMappingURL=server-streaming.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(3);
var server_streaming_1 = __webpack_require__(40);
var callback_registry_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
var HeartbeatInterval = 5000;
var PresenceInterval = 10000;
var ServerProtocol = (function () {
    function ServerProtocol(connection, instance, configuration, serverRepository) {
        var _this = this;
        this.connection = connection;
        this.instance = instance;
        this.serverRepository = serverRepository;
        this.invocationMessagesMap = {};
        this.reqCounter = 0;
        this.callbacks = callback_registry_1.default();
        this.streaming = new server_streaming_1.default(connection, instance);
        connection.on("agm", "MethodInvocationRequestMessage", function (msg) { return _this.handleMethodInvocationMessage(msg); });
        connection.disconnected(this.stopTimers.bind(this));
        this.sendHeartbeat();
        if (this.heartbeatTimer === undefined) {
            this.heartbeatTimer = setInterval(function () { return _this.sendHeartbeat(); }, HeartbeatInterval);
        }
        this.getBranchList = this.streaming.getBranchList;
        this.getSubscriptionList = this.streaming.getSubscriptionList;
        this.closeAllSubscriptions = this.streaming.closeAllSubscriptions;
        this.closeSingleSubscription = this.streaming.closeSingleSubscription;
        this.pushDataToSingle = this.streaming.pushDataToSingle;
        this.pushData = this.streaming.pushData;
        this.onSubRequest = this.streaming.onSubRequest;
        this.acceptRequestOnBranch = this.streaming.acceptRequestOnBranch;
        this.rejectRequest = this.streaming.rejectRequest;
        this.onSubAdded = this.streaming.onSubAdded;
        this.onSubRemoved = this.streaming.onSubRemoved;
    }
    ServerProtocol.prototype.stopTimers = function () {
        clearInterval(this.presenceTimer);
        clearInterval(this.heartbeatTimer);
    };
    ServerProtocol.prototype.unregister = function (info) {
        this.sendPresence();
        return Promise.resolve();
    };
    ServerProtocol.prototype.register = function (repoMethod) {
        var reqSubj = this.nextRequestSubject();
        repoMethod.protocolState.method = this.createNewMethodMessage(repoMethod.definition, reqSubj, false);
        this.announceNewMethod();
        return Promise.resolve();
    };
    ServerProtocol.prototype.createStream = function (repoMethod) {
        var reqSubj = this.nextRequestSubject();
        var streamConverted = this.createNewMethodMessage(repoMethod.definition, reqSubj, true);
        repoMethod.protocolState.method = streamConverted;
        repoMethod.protocolState.globalEventStreamSubject = repoMethod.definition.name + ".jsStream." + random_1.default();
        repoMethod.protocolState.subscriptions = [];
        repoMethod.protocolState.branchKeyToStreamIdMap = [];
        this.announceNewMethod();
        return Promise.resolve();
    };
    ServerProtocol.prototype.onInvoked = function (callback) {
        this.callbacks.add("onInvoked", callback);
    };
    ServerProtocol.prototype.methodInvocationResult = function (executedMethod, invocationId, err, result) {
        var message = this.invocationMessagesMap[invocationId];
        if (!message) {
            return;
        }
        if (message.MethodResponseSubject === "null") {
            return;
        }
        if (executedMethod === undefined) {
            return;
        }
        var resultMessage = {
            MethodRequestSubject: message.MethodRequestSubject,
            MethodResponseSubject: message.MethodResponseSubject,
            MethodName: executedMethod.protocolState.method.Method.Name,
            InvocationId: invocationId,
            ResultContextJson: result,
            Server: helpers_1.convertInstance(this.instance),
            ResultMessage: err,
            Status: err ? 1 : 0,
        };
        this.connection.send("agm", "MethodInvocationResultMessage", resultMessage);
        delete this.invocationMessagesMap[invocationId];
    };
    ServerProtocol.prototype.nextRequestSubject = function () {
        return "req_" + (this.reqCounter++) + "_" + random_1.default();
    };
    ServerProtocol.prototype.sendHeartbeat = function () {
        this.connection.send("agm", "ServerHeartbeatMessage", this.constructHeartbeat());
    };
    ServerProtocol.prototype.constructHeartbeat = function () {
        return {
            PublishingInterval: HeartbeatInterval,
            Instance: helpers_1.convertInstance(this.instance),
        };
    };
    ServerProtocol.prototype.constructPresence = function () {
        var methods = this.serverRepository.getList();
        return {
            PublishingInterval: PresenceInterval,
            Instance: helpers_1.convertInstance(this.instance),
            MethodDefinitions: methods.map(function (m) { return m.protocolState.method; }),
        };
    };
    ServerProtocol.prototype.sendPresence = function () {
        this.connection.send("agm", "ServerPresenceMessage", this.constructPresence());
    };
    ServerProtocol.prototype.announceNewMethod = function () {
        var _this = this;
        this.sendPresence();
        if (this.presenceTimer === undefined) {
            this.presenceTimer = setInterval(function () { return _this.sendPresence(); }, PresenceInterval);
        }
    };
    ServerProtocol.prototype.handleMethodInvocationMessage = function (message) {
        var subject = message.MethodRequestSubject;
        var methodList = this.serverRepository.getList();
        var method = methodList.filter(function (m) {
            return m.protocolState.method.MethodRequestSubject === subject;
        })[0];
        if (method === undefined) {
            return;
        }
        if (this.streaming.isStreamMsg(message, method)) {
            this.streaming.processSubscriberMsg(message, method);
            return;
        }
        var invocationId = message.Context.InvocationId;
        this.invocationMessagesMap[invocationId] = message;
        var invocationArgs = {
            args: message.Context.ArgumentsJson,
            instance: helpers_1.convertInfoToInstance(message.Client),
        };
        this.callbacks.execute("onInvoked", method, invocationId, invocationArgs);
    };
    ServerProtocol.prototype.createNewMethodMessage = function (methodIdentifier, subject, stream) {
        if (typeof methodIdentifier === "string") {
            methodIdentifier = { name: methodIdentifier };
        }
        if (typeof methodIdentifier.version !== "number") {
            methodIdentifier.version = 0;
        }
        return {
            Method: {
                Name: methodIdentifier.name,
                InputSignature: methodIdentifier.accepts,
                ResultSignature: methodIdentifier.returns,
                Description: methodIdentifier.description,
                DisplayName: methodIdentifier.displayName,
                Version: methodIdentifier.version,
                ObjectTypeRestrictions: methodIdentifier.objectTypes,
                Flags: stream ? 32 : undefined,
            },
            MethodRequestSubject: subject,
        };
    };
    return ServerProtocol;
}());
exports.default = ServerProtocol;
//# sourceMappingURL=server.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var STATUS_AWAITING_ACCEPT = "awaitingAccept";
var STATUS_SUBSCRIBED = "subscribed";
var ERR_MSG_SUB_FAILED = "Subscription failed.";
var ERR_MSG_SUB_REJECTED = "Subscription rejected.";
var ON_CLOSE_MSG_SERVER_INIT = "ServerInitiated";
var ON_CLOSE_MSG_CLIENT_INIT = "ClientInitiated";
var ClientStreaming = (function () {
    function ClientStreaming(instance, session, repository, logger) {
        var _this = this;
        this.instance = instance;
        this.session = session;
        this.repository = repository;
        this.logger = logger;
        this.subscriptionsList = {};
        this.subscriptionIdToLocalKeyMap = {};
        this.nextSubLocalKey = 0;
        this.handleErrorSubscribing = function (errorResponse) {
            var tag = errorResponse._tag;
            var subLocalKey = tag.subLocalKey;
            var pendingSub = _this.subscriptionsList[subLocalKey];
            if (typeof pendingSub !== "object") {
                return;
            }
            pendingSub.trackedServers = pendingSub.trackedServers.filter(function (server) {
                return server.serverId !== tag.serverId;
            });
            if (pendingSub.trackedServers.length <= 0) {
                clearTimeout(pendingSub.timeoutId);
                if (pendingSub.status === STATUS_AWAITING_ACCEPT) {
                    var reason = (typeof errorResponse.reason === "string" && errorResponse.reason !== "") ?
                        ' Publisher said "' + errorResponse.reason + '".' :
                        " No reason given.";
                    var callArgs = typeof pendingSub.arguments === "object" ?
                        JSON.stringify(pendingSub.arguments) :
                        "{}";
                    pendingSub.error({
                        message: ERR_MSG_SUB_REJECTED + reason + " Called with:" + callArgs,
                        called_with: pendingSub.arguments,
                        method: pendingSub.method.getInfoForUser(),
                    });
                }
                else if (pendingSub.status === STATUS_SUBSCRIBED) {
                    _this.callOnClosedHandlers(pendingSub);
                }
                delete _this.subscriptionsList[subLocalKey];
            }
        };
        this.handleSubscribed = function (msg) {
            var subLocalKey = msg._tag.subLocalKey;
            var pendingSub = _this.subscriptionsList[subLocalKey];
            if (typeof pendingSub !== "object") {
                return;
            }
            var serverId = msg._tag.serverId;
            var acceptingServer = pendingSub.trackedServers
                .filter(function (server) {
                return server.serverId === serverId;
            })[0];
            if (typeof acceptingServer !== "object") {
                return;
            }
            acceptingServer.subscriptionId = msg.subscription_id;
            _this.subscriptionIdToLocalKeyMap[msg.subscription_id] = subLocalKey;
            var isFirstResponse = (pendingSub.status === STATUS_AWAITING_ACCEPT);
            pendingSub.status = STATUS_SUBSCRIBED;
            var that = _this;
            if (isFirstResponse) {
                pendingSub.success({
                    onData: function (dataCallback) {
                        if (typeof dataCallback !== "function") {
                            throw new TypeError("The data callback must be a function.");
                        }
                        pendingSub.handlers.onData.push(dataCallback);
                        if (pendingSub.handlers.onData.length === 1 && pendingSub.queued.data.length > 0) {
                            pendingSub.queued.data.forEach(function (dataItem) {
                                dataCallback(dataItem);
                            });
                        }
                    },
                    onClosed: function (closedCallback) {
                        if (typeof closedCallback !== "function") {
                            throw new TypeError("The callback must be a function.");
                        }
                        pendingSub.handlers.onClosed.push(closedCallback);
                    },
                    onFailed: function () {
                    },
                    close: function () { return that.closeSubscription(subLocalKey); },
                    requestArguments: pendingSub.arguments,
                    serverInstance: that.repository.getServerById(serverId).getInfoForUser(),
                    stream: pendingSub.method.info,
                });
            }
        };
        this.handleEventData = function (msg) {
            var subLocalKey = _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
            if (typeof subLocalKey === "undefined") {
                return;
            }
            var subscription = _this.subscriptionsList[subLocalKey];
            if (typeof subscription !== "object") {
                return;
            }
            var trackedServersFound = subscription.trackedServers.filter(function (server) {
                return server.subscriptionId === msg.subscription_id;
            });
            if (trackedServersFound.length !== 1) {
                return;
            }
            var isPrivateData = msg.oob && msg.snapshot;
            var sendingServerId = trackedServersFound[0].serverId;
            var receivedStreamData = function () {
                return {
                    data: msg.data,
                    server: _this.repository.getServerById(sendingServerId).getInfoForUser(),
                    requestArguments: subscription.arguments || {},
                    message: null,
                    private: isPrivateData,
                };
            };
            var onDataHandlers = subscription.handlers.onData;
            var queuedData = subscription.queued.data;
            if (onDataHandlers.length > 0) {
                onDataHandlers.forEach(function (callback) {
                    if (typeof callback === "function") {
                        callback(receivedStreamData());
                    }
                });
            }
            else {
                queuedData.push(receivedStreamData());
            }
        };
        this.handleSubscriptionCancelled = function (msg) {
            var subLocalKey = _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
            if (typeof subLocalKey === "undefined") {
                return;
            }
            var subscription = _this.subscriptionsList[subLocalKey];
            if (typeof subscription !== "object") {
                return;
            }
            var expectedNewLength = subscription.trackedServers.length - 1;
            subscription.trackedServers = subscription.trackedServers.filter(function (server) {
                if (server.subscriptionId === msg.subscription_id) {
                    subscription.queued.closers.push(server.serverId);
                    return false;
                }
                else {
                    return true;
                }
            });
            if (subscription.trackedServers.length !== expectedNewLength) {
                return;
            }
            if (subscription.trackedServers.length <= 0) {
                clearTimeout(subscription.timeoutId);
                _this.callOnClosedHandlers(subscription);
                delete _this.subscriptionsList[subLocalKey];
            }
            delete _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
        };
        session.on("subscribed", this.handleSubscribed);
        session.on("event", this.handleEventData);
        session.on("subscription-cancelled", this.handleSubscriptionCancelled);
    }
    ClientStreaming.prototype.subscribe = function (streamingMethod, argumentObj, targetServers, stuff, success, error) {
        var _this = this;
        if (targetServers.length === 0) {
            error({
                method: streamingMethod.getInfoForUser(),
                called_with: argumentObj,
                message: ERR_MSG_SUB_FAILED + " No available servers matched the target params.",
            });
            return;
        }
        var subLocalKey = this.getNextSubscriptionLocalKey();
        var pendingSub = this.registerSubscription(subLocalKey, streamingMethod, argumentObj, success, error, stuff.methodResponseTimeout);
        if (typeof pendingSub !== "object") {
            error({
                method: streamingMethod.getInfoForUser(),
                called_with: argumentObj,
                message: ERR_MSG_SUB_FAILED + " Unable to register the user callbacks.",
            });
            return;
        }
        targetServers.forEach(function (target) {
            var serverId = target.server.id;
            pendingSub.trackedServers.push({
                serverId: serverId,
                subscriptionId: undefined,
            });
            var msg = {
                type: "subscribe",
                server_id: serverId,
                method_id: streamingMethod.protocolState.id,
                arguments_kv: argumentObj,
            };
            _this.session.send(msg, { serverId: serverId, subLocalKey: subLocalKey })
                .then(function (m) { return _this.handleSubscribed(m); })
                .catch(function (err) { return _this.handleErrorSubscribing(err); });
        });
    };
    ClientStreaming.prototype.getNextSubscriptionLocalKey = function () {
        var current = this.nextSubLocalKey;
        this.nextSubLocalKey += 1;
        return current;
    };
    ClientStreaming.prototype.registerSubscription = function (subLocalKey, method, args, success, error, timeout) {
        var _this = this;
        this.subscriptionsList[subLocalKey] = {
            status: STATUS_AWAITING_ACCEPT,
            method: method,
            arguments: args,
            success: success,
            error: error,
            trackedServers: [],
            handlers: {
                onData: [],
                onClosed: [],
            },
            queued: {
                data: [],
                closers: [],
            },
            timeoutId: undefined,
        };
        this.subscriptionsList[subLocalKey].timeoutId = setTimeout(function () {
            if (_this.subscriptionsList[subLocalKey] === undefined) {
                return;
            }
            var pendingSub = _this.subscriptionsList[subLocalKey];
            if (pendingSub.status === STATUS_AWAITING_ACCEPT) {
                error({
                    method: method.getInfoForUser(),
                    called_with: args,
                    message: ERR_MSG_SUB_FAILED + " Subscription attempt timed out after " + timeout + " ms.",
                });
                delete _this.subscriptionsList[subLocalKey];
            }
            else if (pendingSub.status === STATUS_SUBSCRIBED && pendingSub.trackedServers.length > 0) {
                pendingSub.trackedServers = pendingSub.trackedServers.filter(function (server) {
                    return (typeof server.subscriptionId !== "undefined");
                });
                delete pendingSub.timeoutId;
                if (pendingSub.trackedServers.length <= 0) {
                    _this.callOnClosedHandlers(pendingSub);
                    delete _this.subscriptionsList[subLocalKey];
                }
            }
        }, timeout);
        return this.subscriptionsList[subLocalKey];
    };
    ClientStreaming.prototype.callOnClosedHandlers = function (subscription, reason) {
        var closersCount = subscription.queued.closers.length;
        var closingServerId = (closersCount > 0) ? subscription.queued.closers[closersCount - 1] : null;
        var closingServer = null;
        if (typeof closingServerId === "number") {
            closingServer = this.repository.getServerById(closingServerId).getInfoForUser();
        }
        subscription.handlers.onClosed.forEach(function (callback) {
            if (typeof callback !== "function") {
                return;
            }
            callback({
                message: reason || ON_CLOSE_MSG_SERVER_INIT,
                requestArguments: subscription.arguments,
                server: closingServer,
                stream: subscription.method,
            });
        });
    };
    ClientStreaming.prototype.closeSubscription = function (subLocalKey) {
        var _this = this;
        var subscription = this.subscriptionsList[subLocalKey];
        if (typeof subscription !== "object") {
            return;
        }
        subscription.trackedServers.forEach(function (server) {
            if (typeof server.subscriptionId === "undefined") {
                return;
            }
            _this.session.sendFireAndForget({
                type: "unsubscribe",
                subscription_id: server.subscriptionId,
                reason_uri: "",
                reason: ON_CLOSE_MSG_CLIENT_INIT,
            });
            delete _this.subscriptionIdToLocalKeyMap[server.subscriptionId];
        });
        subscription.trackedServers = [];
        this.callOnClosedHandlers(subscription, ON_CLOSE_MSG_CLIENT_INIT);
        delete this.subscriptionsList[subLocalKey];
    };
    return ClientStreaming;
}());
exports.default = ClientStreaming;
//# sourceMappingURL=client-streaming.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var client_streaming_1 = __webpack_require__(42);
var client_1 = __webpack_require__(13);
var ClientProtocol = (function () {
    function ClientProtocol(instance, session, repository, logger) {
        var _this = this;
        this.instance = instance;
        this.session = session;
        this.repository = repository;
        this.logger = logger;
        this.callbacks = callback_registry_1.default();
        session.on("peer-added", function (msg) { return _this.handlePeerAdded(msg); });
        session.on("peer-removed", function (msg) { return _this.handlePeerRemoved(msg); });
        session.on("methods-added", function (msg) { return _this.handleMethodsAddedMessage(msg); });
        session.on("methods-removed", function (msg) { return _this.handleMethodsRemovedMessage(msg); });
        this.streaming = new client_streaming_1.default(instance, session, repository, logger);
    }
    ClientProtocol.prototype.subscribe = function (stream, args, targetServers, options, success, error) {
        this.streaming.subscribe(stream, args, targetServers, options, success, error);
    };
    ClientProtocol.prototype.invoke = function (id, method, args, target) {
        var _this = this;
        var serverId = target.id;
        var methodId = method.protocolState.id;
        var msg = {
            type: "call",
            server_id: serverId,
            method_id: methodId,
            arguments_kv: args,
        };
        return this.session.send(msg, { invocationId: id, serverId: serverId })
            .then(function (m) { return _this.handleResultMessage(m); })
            .catch(function (err) { return _this.handleInvocationError(err); });
    };
    ClientProtocol.prototype.onInvocationResult = function (callback) {
        this.callbacks.add("onResult", callback);
    };
    ClientProtocol.prototype.handlePeerAdded = function (msg) {
        var newPeerId = msg.new_peer_id;
        var remoteId = msg.identity;
        var pid = Number(remoteId.process);
        var serverInfo = {
            machine: remoteId.machine,
            pid: isNaN(pid) ? remoteId.process : pid,
            instance: remoteId.instance,
            application: remoteId.application,
            environment: remoteId.environment,
            region: remoteId.region,
            user: remoteId.user,
            windowId: remoteId.windowId,
            peerId: newPeerId,
        };
        this.repository.addServer(serverInfo, newPeerId);
    };
    ClientProtocol.prototype.handlePeerRemoved = function (msg) {
        var removedPeerId = msg.removed_id;
        var reason = msg.reason;
        this.repository.removeServerById(removedPeerId, reason);
    };
    ClientProtocol.prototype.handleMethodsAddedMessage = function (msg) {
        var _this = this;
        var serverId = msg.server_id;
        var methods = msg.methods;
        methods.forEach(function (method) {
            var methodInfo = {
                name: method.name,
                displayName: method.display_name,
                description: method.description,
                version: method.version,
                objectTypes: method.object_types || [],
                accepts: method.input_signature,
                returns: method.result_signature,
                supportsStreaming: typeof method.flags !== "undefined" ? method.flags.streaming : false,
            };
            _this.repository.addServerMethod(serverId, methodInfo, { id: method.id });
        });
    };
    ClientProtocol.prototype.handleMethodsRemovedMessage = function (msg) {
        var _this = this;
        var serverId = msg.server_id;
        var methodIdList = msg.methods;
        var server = this.repository.getServerById(serverId);
        var serverMethodKeys = Object.keys(server.methods);
        serverMethodKeys.forEach(function (methodKey) {
            var method = server.methods[methodKey];
            if (methodIdList.indexOf(method.protocolState.id) > -1) {
                _this.repository.removeServerMethod(serverId, methodKey);
            }
        });
    };
    ClientProtocol.prototype.handleResultMessage = function (msg) {
        var invocationId = msg._tag.invocationId;
        var result = msg.result;
        var serverId = msg._tag.serverId;
        var server = this.repository.getServerById(serverId);
        return {
            invocationId: invocationId,
            result: result,
            instance: server.getInfoForUser(),
            status: client_1.InvokeStatus.Success,
            message: ""
        };
    };
    ClientProtocol.prototype.handleInvocationError = function (msg) {
        this.logger.debug("handle invocation error " + JSON.stringify(msg));
        var invocationId = msg._tag.invocationId;
        var serverId = msg._tag.serverId;
        var server = this.repository.getServerById(serverId);
        var message = msg.reason;
        var context = msg.context;
        return {
            invocationId: invocationId,
            result: context,
            instance: server.getInfoForUser(),
            status: client_1.InvokeStatus.Error,
            message: message
        };
    };
    return ClientProtocol;
}());
exports.default = ClientProtocol;
//# sourceMappingURL=client.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __webpack_require__(46);
var client_1 = __webpack_require__(43);
function default_1(instance, connection, clientRepository, serverRepository, libConfig, getAGM) {
    var logger = libConfig.logger.subLogger("gw3-protocol");
    var resolveReadyPromise;
    var readyPromise = new Promise(function (resolve) {
        resolveReadyPromise = resolve;
    });
    var session = connection.domain("agm", logger.subLogger("domain"), ["subscribed"]);
    var server = new server_1.default(instance, session, clientRepository, serverRepository, logger.subLogger("server"));
    var client = new client_1.default(instance, session, clientRepository, logger.subLogger("client"));
    function handleReconnect() {
        logger.info("reconnected - will replay registered methods and subscriptions");
        clientRepository.reset();
        clientRepository.addServer(instance, connection.peerId);
        var registeredMethods = serverRepository.getList();
        serverRepository.reset();
        registeredMethods.forEach(function (method) {
            var def = method.definition;
            if (method.theFunction.userCallback) {
                getAGM().register(def, method.theFunction.userCallback);
            }
            else if (method.theFunction.userCallbackAsync) {
                getAGM().registerAsync(def, method.theFunction.userCallbackAsync);
            }
        });
    }
    function handleInitialJoin() {
        clientRepository.addServer(instance, connection.peerId);
        resolveReadyPromise({
            client: client,
            server: server,
        });
        resolveReadyPromise = undefined;
    }
    session.onJoined(function (reconnect) {
        if (reconnect) {
            handleReconnect();
        }
        else {
            handleInitialJoin();
        }
    });
    session.join();
    return readyPromise;
}
exports.default = default_1;
//# sourceMappingURL=factory.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var SUBSCRIPTION_REQUEST = "onSubscriptionRequest";
var SUBSCRIPTION_ADDED = "onSubscriptionAdded";
var SUBSCRIPTION_REMOVED = "onSubscriptionRemoved";
var ServerStreaming = (function () {
    function ServerStreaming(instance, session, repository, serverRepository, logger) {
        var _this = this;
        this.instance = instance;
        this.session = session;
        this.repository = repository;
        this.serverRepository = serverRepository;
        this.logger = logger;
        this.ERR_URI_SUBSCRIPTION_FAILED = "com.tick42.agm.errors.subscription.failure";
        this.callbacks = callback_registry_1.default();
        this.nextStreamId = 0;
        session.on("add-interest", function (msg) { _this.handleAddInterest(msg); });
        session.on("remove-interest", function (msg) { _this.handleRemoveInterest(msg); });
    }
    ServerStreaming.prototype.acceptRequestOnBranch = function (requestContext, streamingMethod, branch) {
        if (typeof branch !== "string") {
            branch = "";
        }
        if (typeof streamingMethod.protocolState.subscriptionsMap !== "object") {
            throw new TypeError("The streaming method is missing its subscriptions.");
        }
        if (!Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            throw new TypeError("The streaming method is missing its branches.");
        }
        var streamId = this.getStreamId(streamingMethod, branch);
        var key = requestContext.msg.subscription_id;
        var subscription = {
            id: key,
            arguments: requestContext.arguments,
            instance: requestContext.instance,
            branchKey: branch,
            streamId: streamId,
            subscribeMsg: requestContext.msg,
        };
        streamingMethod.protocolState.subscriptionsMap[key] = subscription;
        this.session.sendFireAndForget({
            type: "accepted",
            subscription_id: key,
            stream_id: streamId,
        });
        this.callbacks.execute(SUBSCRIPTION_ADDED, subscription, streamingMethod);
    };
    ServerStreaming.prototype.rejectRequest = function (requestContext, streamingMethod, reason) {
        if (typeof reason !== "string") {
            reason = "";
        }
        this.sendSubscriptionFailed("Subscription rejected by user. " + reason, requestContext.msg.subscription_id);
    };
    ServerStreaming.prototype.pushData = function (streamingMethod, data, branches) {
        var _this = this;
        if (typeof streamingMethod !== "object" || !Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            return;
        }
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        if (typeof branches === "string") {
            branches = [branches];
        }
        else if (!Array.isArray(branches) || branches.length <= 0) {
            branches = null;
        }
        var streamIdList = streamingMethod.protocolState.branchKeyToStreamIdMap
            .filter(function (br) {
            return (branches === null || (Boolean(br) && typeof br.key === "string" && branches.indexOf(br.key) >= 0));
        }).map(function (br) {
            return br.streamId;
        });
        streamIdList.forEach(function (streamId) {
            var publishMessage = {
                type: "publish",
                stream_id: streamId,
                data: data,
            };
            _this.session.sendFireAndForget(publishMessage);
        });
    };
    ServerStreaming.prototype.pushDataToSingle = function (method, subscription, data) {
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        var postMessage = {
            type: "post",
            subscription_id: subscription.id,
            data: data,
        };
        this.session.sendFireAndForget(postMessage);
    };
    ServerStreaming.prototype.closeSingleSubscription = function (streamingMethod, subscription) {
        delete streamingMethod.protocolState.subscriptionsMap[subscription.id];
        var dropSubscriptionMessage = {
            type: "drop-subscription",
            subscription_id: subscription.id,
            reason: "Server dropping a single subscription",
        };
        this.session.sendFireAndForget(dropSubscriptionMessage);
        var subscriber = subscription.instance;
        this.callbacks.execute(SUBSCRIPTION_REMOVED, subscription, streamingMethod);
    };
    ServerStreaming.prototype.closeMultipleSubscriptions = function (streamingMethod, branchKey) {
        var _this = this;
        if (typeof streamingMethod !== "object" || typeof streamingMethod.protocolState.subscriptionsMap !== "object") {
            return;
        }
        var subscriptionsToClose = Object.keys(streamingMethod.protocolState.subscriptionsMap)
            .map(function (key) {
            return streamingMethod.protocolState.subscriptionsMap[key];
        });
        if (typeof branchKey === "string") {
            subscriptionsToClose = subscriptionsToClose.filter(function (sub) {
                return sub.branchKey === branchKey;
            });
        }
        subscriptionsToClose.forEach(function (subscription) {
            delete streamingMethod.protocolState.subscriptionsMap[subscription.id];
            var drop = {
                type: "drop-subscription",
                subscription_id: subscription.id,
                reason: "Server dropping all subscriptions on stream_id: " + subscription.streamId,
            };
            _this.session.sendFireAndForget(drop);
        });
    };
    ServerStreaming.prototype.getSubscriptionList = function (streamingMethod, branchKey) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        var subscriptions = [];
        var allSubscriptions = Object.keys(streamingMethod.protocolState.subscriptionsMap)
            .map(function (key) {
            return streamingMethod.protocolState.subscriptionsMap[key];
        });
        if (typeof branchKey !== "string") {
            subscriptions = allSubscriptions;
        }
        else {
            subscriptions = allSubscriptions.filter(function (sub) {
                return sub.branchKey === branchKey;
            });
        }
        return subscriptions;
    };
    ServerStreaming.prototype.getBranchList = function (streamingMethod) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        var allSubscriptions = Object.keys(streamingMethod.protocolState.subscriptionsMap)
            .map(function (key) {
            return streamingMethod.protocolState.subscriptionsMap[key];
        });
        var keysWithDuplicates = allSubscriptions.map(function (sub) {
            var result = null;
            if (typeof sub === "object" && typeof sub.branchKey === "string") {
                result = sub.branchKey;
            }
            return result;
        });
        var seen = [];
        var branchArray = keysWithDuplicates.filter(function (bKey) {
            if (bKey === null || seen.indexOf(bKey) >= 0) {
                return false;
            }
            seen.push(bKey);
            return true;
        });
        return branchArray;
    };
    ServerStreaming.prototype.onSubAdded = function (callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_ADDED, callback);
    };
    ServerStreaming.prototype.onSubRequest = function (callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_REQUEST, callback);
    };
    ServerStreaming.prototype.onSubRemoved = function (callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_REMOVED, callback);
    };
    ServerStreaming.prototype.handleRemoveInterest = function (msg) {
        var streamingMethod = this.serverRepository.getById(msg.method_id);
        if (typeof msg.subscription_id !== "string" ||
            typeof streamingMethod !== "object" ||
            typeof streamingMethod.protocolState.subscriptionsMap[msg.subscription_id] !== "object") {
            return;
        }
        var subscription = streamingMethod.protocolState.subscriptionsMap[msg.subscription_id];
        delete streamingMethod.protocolState.subscriptionsMap[msg.subscription_id];
        this.callbacks.execute(SUBSCRIPTION_REMOVED, subscription, streamingMethod);
    };
    ServerStreaming.prototype.onSubscriptionLifetimeEvent = function (eventName, handlerFunc) {
        this.callbacks.add(eventName, handlerFunc);
    };
    ServerStreaming.prototype.getNextStreamId = function () {
        return this.nextStreamId++ + "";
    };
    ServerStreaming.prototype.handleAddInterest = function (msg) {
        var caller = this.repository.getServerById(msg.caller_id);
        var instance = (typeof caller.getInfoForUser === "function") ? caller.getInfoForUser() : null;
        var requestContext = {
            msg: msg,
            arguments: msg.arguments_kv || {},
            instance: instance,
        };
        var streamingMethod = this.serverRepository.getById(msg.method_id);
        if (streamingMethod === undefined) {
            var errorMsg = "No method with id " + msg.method_id + " on this server.";
            this.sendSubscriptionFailed(errorMsg, msg.subscription_id);
            return;
        }
        if (streamingMethod.protocolState.subscriptionsMap &&
            streamingMethod.protocolState.subscriptionsMap[msg.subscription_id]) {
            this.sendSubscriptionFailed("A subscription with id " + msg.subscription_id + " already exists.", msg.subscription_id);
            return;
        }
        this.callbacks.execute(SUBSCRIPTION_REQUEST, requestContext, streamingMethod);
    };
    ServerStreaming.prototype.sendSubscriptionFailed = function (reason, subscriptionId) {
        var errorMessage = {
            type: "error",
            reason_uri: this.ERR_URI_SUBSCRIPTION_FAILED,
            reason: reason,
            request_id: subscriptionId,
        };
        this.session.sendFireAndForget(errorMessage);
    };
    ServerStreaming.prototype.getStreamId = function (streamingMethod, branchKey) {
        if (typeof branchKey !== "string") {
            branchKey = "";
        }
        var needleBranch = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (branch) {
            return branch.key === branchKey;
        })[0];
        var streamId = (needleBranch ? needleBranch.streamId : undefined);
        if (typeof streamId !== "string" || streamId === "") {
            streamId = this.getNextStreamId();
            streamingMethod.protocolState.branchKeyToStreamIdMap.push({ key: branchKey, streamId: streamId });
        }
        return streamId;
    };
    return ServerStreaming;
}());
exports.default = ServerStreaming;
//# sourceMappingURL=server-streaming.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var callback_registry_1 = __webpack_require__(1);
var server_streaming_1 = __webpack_require__(45);
var ServerProtocol = (function () {
    function ServerProtocol(instance, session, clientRepository, serverRepository, logger) {
        var _this = this;
        this.session = session;
        this.clientRepository = clientRepository;
        this.serverRepository = serverRepository;
        this.logger = logger;
        this.callbacks = callback_registry_1.default();
        this.streaming = new server_streaming_1.default(instance, session, clientRepository, serverRepository, logger);
        this.session.on("invoke", function (msg) { return _this.handleInvokeMessage(msg); });
    }
    ServerProtocol.prototype.createStream = function (repoMethod) {
        var isStreaming = true;
        repoMethod.protocolState.subscriptionsMap = {};
        repoMethod.protocolState.branchKeyToStreamIdMap = [];
        return this.register(repoMethod, isStreaming);
    };
    ServerProtocol.prototype.register = function (repoMethod, isStreaming) {
        var _this = this;
        var methodDef = repoMethod.definition;
        var flags = { streaming: isStreaming || false };
        this.logger.debug('registering method "' + methodDef.name + '"');
        var registerMsg = {
            type: "register",
            methods: [{
                    id: repoMethod.repoId,
                    name: methodDef.name,
                    display_name: methodDef.displayName,
                    description: methodDef.description,
                    version: methodDef.version,
                    flags: flags,
                    object_types: methodDef.objectTypes || methodDef.object_types,
                    input_signature: methodDef.accepts,
                    result_signature: methodDef.returns,
                    restrictions: undefined,
                }],
        };
        return this.session.send(registerMsg, { methodId: repoMethod.repoId })
            .then(function () {
            _this.logger.debug("registered method " + repoMethod.definition.name + " with id " + repoMethod.repoId);
        })
            .catch(function (msg) {
            _this.logger.warn(JSON.stringify(msg));
            _this.logger.debug("failed to register method " + repoMethod.definition.name + " with id " + repoMethod.repoId);
            throw msg;
        });
    };
    ServerProtocol.prototype.onInvoked = function (callback) {
        this.callbacks.add("onInvoked", callback);
    };
    ServerProtocol.prototype.methodInvocationResult = function (method, invocationId, err, result) {
        var msg;
        if (err) {
            msg = {
                type: "error",
                request_id: invocationId,
                reason_uri: "agm.errors.client_error",
                reason: err,
                context: result,
                peer_id: undefined,
            };
        }
        else {
            msg = {
                type: "yield",
                invocation_id: invocationId,
                peer_id: this.session.peerId,
                result: result,
                request_id: undefined,
            };
        }
        this.session.sendFireAndForget(msg);
    };
    ServerProtocol.prototype.unregister = function (method) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msg = {
                            type: "unregister",
                            methods: [method.repoId],
                        };
                        return [4, this.session.send(msg)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ServerProtocol.prototype.getBranchList = function (method) {
        return this.streaming.getBranchList(method);
    };
    ServerProtocol.prototype.getSubscriptionList = function (method, branchKey) {
        return this.streaming.getSubscriptionList(method, branchKey);
    };
    ServerProtocol.prototype.closeAllSubscriptions = function (method, branchKey) {
        this.streaming.closeMultipleSubscriptions(method, branchKey);
    };
    ServerProtocol.prototype.pushData = function (method, data, branches) {
        this.streaming.pushData(method, data, branches);
    };
    ServerProtocol.prototype.pushDataToSingle = function (method, subscription, data) {
        this.streaming.pushDataToSingle(method, subscription, data);
    };
    ServerProtocol.prototype.closeSingleSubscription = function (method, subscription) {
        this.streaming.closeSingleSubscription(method, subscription);
    };
    ServerProtocol.prototype.acceptRequestOnBranch = function (requestContext, method, branch) {
        this.streaming.acceptRequestOnBranch(requestContext, method, branch);
    };
    ServerProtocol.prototype.rejectRequest = function (requestContext, method, reason) {
        this.streaming.rejectRequest(requestContext, method, reason);
    };
    ServerProtocol.prototype.onSubRequest = function (callback) {
        this.streaming.onSubRequest(callback);
    };
    ServerProtocol.prototype.onSubAdded = function (callback) {
        this.streaming.onSubAdded(callback);
    };
    ServerProtocol.prototype.onSubRemoved = function (callback) {
        this.streaming.onSubRemoved(callback);
    };
    ServerProtocol.prototype.handleInvokeMessage = function (msg) {
        var invocationId = msg.invocation_id;
        var callerId = msg.caller_id;
        var methodId = msg.method_id;
        var args = msg.arguments_kv;
        this.logger.debug('received invocation for method id "' + methodId + '" from peer ' + callerId);
        var methodList = this.serverRepository.getList();
        var method = methodList.filter(function (m) {
            return m.repoId === methodId;
        })[0];
        if (method === undefined) {
            return;
        }
        var client = this.clientRepository.getServerById(callerId);
        var invocationArgs = { args: args, instance: client.getInfoForUser() };
        this.callbacks.execute("onInvoked", method, invocationId, invocationArgs);
    };
    return ServerProtocol;
}());
exports.default = ServerProtocol;
//# sourceMappingURL=server.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var subscription_1 = __webpack_require__(9);
var ServerBranch = (function () {
    function ServerBranch(key, protocol, repoMethod) {
        this.key = key;
        this.protocol = protocol;
        this.repoMethod = repoMethod;
    }
    ServerBranch.prototype.subscriptions = function () {
        var _this = this;
        var subList = this.protocol.server.getSubscriptionList(this.repoMethod, this.key);
        return subList.map(function (sub) {
            return new subscription_1.default(_this.protocol, _this.repoMethod, sub);
        });
    };
    ServerBranch.prototype.close = function () {
        this.protocol.server.closeAllSubscriptions(this.repoMethod, this.key);
    };
    ServerBranch.prototype.push = function (data) {
        this.protocol.server.pushData(this.repoMethod, data, [this.key]);
    };
    return ServerBranch;
}());
exports.default = ServerBranch;
//# sourceMappingURL=branch.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ServerRepository = (function () {
    function ServerRepository() {
        this.nextId = 0;
        this.methods = [];
    }
    ServerRepository.prototype.add = function (method) {
        if (typeof method !== "object") {
            return;
        }
        if (method.repoId !== undefined) {
            return;
        }
        method.repoId = String(this.nextId);
        this.nextId += 1;
        this.methods.push(method);
        return method;
    };
    ServerRepository.prototype.remove = function (repoId) {
        if (typeof repoId !== "string") {
            return new TypeError("Expecting a string");
        }
        this.methods = this.methods.filter(function (m) {
            return m.repoId !== repoId;
        });
    };
    ServerRepository.prototype.getById = function (id) {
        if (typeof id !== "string") {
            return undefined;
        }
        return this.methods.filter(function (m) {
            return m.repoId === id;
        })[0];
    };
    ServerRepository.prototype.getList = function () {
        return this.methods.map(function (m) { return m; });
    };
    ServerRepository.prototype.length = function () {
        return this.methods.length;
    };
    ServerRepository.prototype.reset = function () {
        this.methods = [];
    };
    return ServerRepository;
}());
exports.default = ServerRepository;
//# sourceMappingURL=repository.js.map

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Request = (function () {
    function Request(protocol, repoMethod, requestContext) {
        this.protocol = protocol;
        this.repoMethod = repoMethod;
        this.requestContext = requestContext;
        this.arguments = requestContext.arguments;
        this.instance = requestContext.instance;
    }
    Request.prototype.accept = function () {
        this.protocol.server.acceptRequestOnBranch(this.requestContext, this.repoMethod, "");
    };
    Request.prototype.acceptOnBranch = function (branch) {
        this.protocol.server.acceptRequestOnBranch(this.requestContext, this.repoMethod, branch);
    };
    Request.prototype.reject = function (reason) {
        this.protocol.server.rejectRequest(this.requestContext, this.repoMethod, reason);
    };
    return Request;
}());
exports.default = Request;
//# sourceMappingURL=request.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var promisify_1 = __webpack_require__(8);
var streaming_1 = __webpack_require__(52);
var stream_1 = __webpack_require__(51);
var Server = (function () {
    function Server(protocol, serverRepository, instance, configuration) {
        this.protocol = protocol;
        this.serverRepository = serverRepository;
        this.instance = instance;
        this.configuration = configuration;
        this.invocations = 0;
        this.streaming = new streaming_1.default(protocol, this);
        this.protocol.server.onInvoked(this.onMethodInvoked.bind(this));
    }
    Server.prototype.createStream = function (streamDef, callbacks, successCallback, errorCallback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (!streamDef) {
                reject("Please supply either a string of the Unique name or an object with property name for a stream definition");
            }
            var streamMethodDefinition;
            if (typeof streamDef === "string") {
                streamMethodDefinition = { name: "" + streamDef };
            }
            else {
                streamMethodDefinition = __assign({}, streamDef);
            }
            var nameAlreadyExists = _this.serverRepository.getList()
                .some(function (serverMethod) { return serverMethod.definition.name === streamMethodDefinition.name; });
            if (nameAlreadyExists) {
                return reject("Name already exists. You can have only one Stream or Method with this name!");
            }
            streamMethodDefinition.supportsStreaming = true;
            if (!callbacks) {
                callbacks = {};
            }
            if (typeof callbacks.subscriptionRequestHandler !== "function") {
                callbacks.subscriptionRequestHandler = function (request) {
                    request.accept();
                };
            }
            var repoMethod = {
                definition: streamMethodDefinition,
                streamCallbacks: callbacks,
                protocolState: {},
            };
            _this.serverRepository.add(repoMethod);
            _this.protocol.server.createStream(repoMethod)
                .then(function () {
                var streamFrontObject = new stream_1.default(_this.protocol, repoMethod, _this);
                repoMethod.stream = streamFrontObject;
                resolve(streamFrontObject);
            })
                .catch(function (err) {
                _this.serverRepository.remove(repoMethod.repoId);
                reject(err);
            });
        });
        return promisify_1.default(promise, successCallback, errorCallback);
    };
    Server.prototype.register = function (methodDefinition, callback) {
        if (!methodDefinition) {
            return Promise.reject("Please supply either a string of the Unique name or an object with property name for a method definition");
        }
        if (typeof callback !== "function") {
            return Promise.reject("The second parameter must be the callback function");
        }
        var wrappedCallbackFunction = function (context, resultCallback) {
            try {
                var result = callback(context.args, context.instance);
                resultCallback(null, result);
            }
            catch (e) {
                if (!e) {
                    e = "";
                }
                resultCallback(e, e);
            }
        };
        wrappedCallbackFunction.userCallback = callback;
        return this.registerCore(methodDefinition, wrappedCallbackFunction);
    };
    Server.prototype.registerAsync = function (methodDefinition, callback) {
        if (!methodDefinition) {
            return Promise.reject("Please supply either a string of the Unique name or an object with property name for a method definition");
        }
        if (typeof callback !== "function") {
            return Promise.reject("The second parameter must be the callback function");
        }
        var wrappedCallback = function (context, resultCallback) {
            try {
                callback(context.args, context.instance, function (result) {
                    resultCallback(null, result);
                }, function (e) {
                    if (!e) {
                        e = "";
                    }
                    resultCallback(e, e);
                });
            }
            catch (e) {
                resultCallback(e, null);
            }
        };
        wrappedCallback.userCallbackAsync = callback;
        return this.registerCore(methodDefinition, wrappedCallback);
    };
    Server.prototype.unregister = function (methodFilter, forStream) {
        if (forStream === void 0) { forStream = false; }
        return __awaiter(this, void 0, void 0, function () {
            var methodDefinition, methodToBeRemoved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (methodFilter === undefined) {
                            return [2, Promise.reject("Please supply either a string of the Unique name or an object with property name")];
                        }
                        if (!(typeof methodFilter === "function")) return [3, 2];
                        return [4, this.unregisterWithPredicate(methodFilter, forStream)];
                    case 1:
                        _a.sent();
                        return [2];
                    case 2:
                        if (typeof methodFilter === "string") {
                            methodDefinition = { name: methodFilter };
                        }
                        else {
                            methodDefinition = methodFilter;
                        }
                        if (methodDefinition.name === undefined) {
                            return [2, Promise.reject("Method with undefined name does not exist !")];
                        }
                        methodToBeRemoved = this.serverRepository.getList().find(function (serverMethod) {
                            return serverMethod.definition.name === methodDefinition.name
                                && (serverMethod.definition.supportsStreaming || false) === forStream;
                        });
                        if (!methodToBeRemoved) {
                            return [2, Promise.reject("Method does not exist or it is not registered by your application !")];
                        }
                        return [4, this.removeMethodsOrStreams([methodToBeRemoved])];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Server.prototype.unregisterWithPredicate = function (filterPredicate, forStream) {
        return __awaiter(this, void 0, void 0, function () {
            var methodsOrStreamsToRemove;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        methodsOrStreamsToRemove = this.serverRepository.getList()
                            .filter(function (sm) { return filterPredicate(sm.definition); })
                            .filter(function (serverMethod) {
                            return (serverMethod.definition.supportsStreaming || false) === forStream;
                        });
                        if (!methodsOrStreamsToRemove || methodsOrStreamsToRemove.length === 0) {
                            return [2, Promise.reject("No " + (forStream ? "stream" : "method") + " matches the condition !")];
                        }
                        return [4, this.removeMethodsOrStreams(methodsOrStreamsToRemove)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Server.prototype.removeMethodsOrStreams = function (methodsToRemove) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Promise.all(methodsToRemove.map(function (method) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, this.protocol.server.unregister(method)];
                                    case 1:
                                        _a.sent();
                                        this.serverRepository.remove(method.repoId);
                                        return [2];
                                }
                            });
                        }); }))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Server.prototype.registerCore = function (method, theFunction) {
        var _this = this;
        var methodDefinition;
        if (typeof method === "string") {
            methodDefinition = { name: "" + method };
        }
        else {
            methodDefinition = __assign({}, method);
        }
        var nameAlreadyExists = this.serverRepository.getList()
            .some(function (serverMethod) { return serverMethod.definition.name === methodDefinition.name; });
        if (nameAlreadyExists) {
            return Promise.reject("Name already exists. You can have only one Method or Stream with this name! !");
        }
        if (methodDefinition.supportsStreaming) {
            return Promise.reject("supportsStreaming can not be true ! If you want to create a stream please use glue.agm.createStream");
        }
        var repoMethod = this.serverRepository.add({
            definition: methodDefinition,
            theFunction: theFunction,
            protocolState: {},
        });
        return this.protocol.server.register(repoMethod)
            .catch(function (err) {
            _this.serverRepository.remove(repoMethod.repoId);
            throw err;
        });
    };
    Server.prototype.containsProps = function (filter, methodDefinition) {
        var filterProps = Object.keys(filter)
            .filter(function (prop) {
            return typeof filter[prop] !== "function"
                && prop !== "object_types"
                && prop !== "display_name";
        });
        var methodDefProps = Object.keys(methodDefinition);
        var uniqProps = Array.from(new Set(filterProps.concat(methodDefProps)));
        return uniqProps.reduce(function (isMatch, prop) {
            var filterValue = filter[prop];
            var methodDefValue = methodDefinition[prop];
            if (prop === "supportsStreaming") {
                methodDefValue = methodDefValue || false;
                filterValue = filterValue || false;
            }
            if (prop === "objectTypes" && filterValue !== undefined && methodDefValue !== undefined) {
                if (filterValue.length !== methodDefValue.length) {
                    isMatch = false;
                }
                else {
                    var firstObjType = filterValue.sort();
                    var secondObjTypes_1 = methodDefValue.sort();
                    var hasADifference = firstObjType.some(function (objType, index) { return objType !== secondObjTypes_1[index]; });
                    if (hasADifference) {
                        isMatch = false;
                    }
                }
            }
            else if (filterValue !== methodDefValue) {
                isMatch = false;
            }
            return isMatch;
        }, true);
    };
    Server.prototype.onMethodInvoked = function (methodToExecute, invocationId, invocationArgs) {
        var _this = this;
        if (!methodToExecute) {
            return;
        }
        methodToExecute.theFunction(invocationArgs, function (err, result) {
            if (err !== undefined && err !== null) {
                if (typeof err.message === "string") {
                    err = err.message;
                }
                else if (typeof err !== "string") {
                    try {
                        err = JSON.stringify(err);
                    }
                    catch (unStrException) {
                        err = "un-stringifyable error in onMethodInvoked ! Top level prop names: " + Object.keys(err);
                    }
                }
            }
            if (!result || typeof result !== "object" || result.constructor === Array) {
                result = { _result: result };
            }
            _this.protocol.server.methodInvocationResult(methodToExecute, invocationId, err, result);
        });
    };
    return Server;
}());
exports.default = Server;
//# sourceMappingURL=server.js.map

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var subscription_1 = __webpack_require__(9);
var branch_1 = __webpack_require__(47);
var ServerStream = (function () {
    function ServerStream(protocol, repoMethod, server) {
        this.protocol = protocol;
        this.repoMethod = repoMethod;
        this.server = server;
        this.def = repoMethod.definition;
    }
    Object.defineProperty(ServerStream.prototype, "name", {
        get: function () { return this.def.name; },
        enumerable: true,
        configurable: true
    });
    ServerStream.prototype.branches = function (key) {
        var _this = this;
        var bList = this.protocol.server.getBranchList(this.repoMethod);
        if (key) {
            if (bList.indexOf(key) > -1) {
                return new branch_1.default(key, this.protocol, this.repoMethod);
            }
            return undefined;
        }
        else {
            return bList.map(function (branchKey) {
                return new branch_1.default(branchKey, _this.protocol, _this.repoMethod);
            });
        }
    };
    ServerStream.prototype.subscriptions = function () {
        var _this = this;
        var subList = this.protocol.server.getSubscriptionList(this.repoMethod);
        return subList.map(function (sub) {
            return new subscription_1.default(_this.protocol, _this.repoMethod, sub);
        });
    };
    Object.defineProperty(ServerStream.prototype, "definition", {
        get: function () {
            var def2 = this.def;
            return {
                accepts: def2.accepts,
                description: def2.description,
                displayName: def2.displayName,
                name: def2.name,
                objectTypes: def2.objectTypes,
                returns: def2.returns,
                supportsStreaming: def2.supportsStreaming,
            };
        },
        enumerable: true,
        configurable: true
    });
    ServerStream.prototype.close = function () {
        this.protocol.server.closeAllSubscriptions(this.repoMethod);
        this.server.unregister(this.repoMethod.definition, true);
    };
    ServerStream.prototype.push = function (data, branches) {
        if (typeof branches !== "string" && !Array.isArray(branches) && branches !== undefined) {
            throw new Error("invalid branches should be string or string array");
        }
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        this.protocol.server.pushData(this.repoMethod, data, branches);
    };
    return ServerStream;
}());
exports.default = ServerStream;
//# sourceMappingURL=stream.js.map

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var subscription_1 = __webpack_require__(9);
var request_1 = __webpack_require__(49);
var ServerStreaming = (function () {
    function ServerStreaming(protocol, server) {
        var _this = this;
        this.protocol = protocol;
        this.server = server;
        protocol.server.onSubRequest(function (rc, rm) { return _this.handleSubRequest(rc, rm); });
        protocol.server.onSubAdded(function (sub, rm) { return _this.handleSubAdded(sub, rm); });
        protocol.server.onSubRemoved(function (sub, rm) { return _this.handleSubRemoved(sub, rm); });
    }
    ServerStreaming.prototype.handleSubRequest = function (requestContext, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionRequestHandler === "function")) {
            return;
        }
        var request = new request_1.default(this.protocol, repoMethod, requestContext);
        repoMethod.streamCallbacks.subscriptionRequestHandler(request);
    };
    ServerStreaming.prototype.handleSubAdded = function (subscription, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionAddedHandler === "function")) {
            return;
        }
        var sub = new subscription_1.default(this.protocol, repoMethod, subscription);
        repoMethod.streamCallbacks.subscriptionAddedHandler(sub);
    };
    ServerStreaming.prototype.handleSubRemoved = function (subscription, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionRemovedHandler === "function")) {
            return;
        }
        var sub = new subscription_1.default(this.protocol, repoMethod, subscription);
        repoMethod.streamCallbacks.subscriptionRemovedHandler(sub);
    };
    return ServerStreaming;
}());
exports.default = ServerStreaming;
//# sourceMappingURL=streaming.js.map

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var protocol_1 = __webpack_require__(54);
var successMessages = ["subscribed", "success"];
exports.default = (function (configuration) {
    var connection = configuration.connection, logger = configuration.logger;
    var session = connection.domain("bus", logger, successMessages);
    return new Promise(function (resolve, reject) {
        session.join()
            .then(function () {
            var protocol = protocol_1.default(connection, logger, session);
            resolve(protocol);
        })
            .catch(reject);
    });
});
//# sourceMappingURL=main.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(55);
var Protocol = (function () {
    function Protocol(connection, logger, session) {
        var _this = this;
        this.publish = function (topic, data, options) {
            var _a = options || {}, routingKey = _a.routingKey, target = _a.target;
            var args = utils_1.removeEmptyValues({
                type: "publish",
                topic: topic,
                data: data,
                peer_id: _this.peerId,
                routing_key: routingKey,
                target_identity: target
            });
            _this.session.send(args);
        };
        this.subscribe = function (topic, callback, options) {
            return new Promise(function (resolve, reject) {
                var _a = options || {}, routingKey = _a.routingKey, target = _a.target;
                var args = utils_1.removeEmptyValues({
                    type: "subscribe",
                    topic: topic,
                    peer_id: _this.peerId,
                    routing_key: routingKey,
                    source: target
                });
                _this.session.send(args)
                    .then(function (response) {
                    var subscription_id = response.subscription_id;
                    _this.subscriptions.push({ subscription_id: subscription_id, topic: topic, callback: callback, source: target });
                    resolve({
                        unsubscribe: function () {
                            _this.session.send({ type: "unsubscribe", subscription_id: subscription_id, peer_id: _this.peerId });
                            _this.subscriptions = _this.subscriptions.filter(function (s) { return s.subscription_id !== subscription_id; });
                            return Promise.resolve();
                        }
                    });
                })
                    .catch(function (error) { return reject(error); });
            });
        };
        this.watchOnEvent = function () {
            _this.session.on("event", function (args) {
                var data = args.data, subscription_id = args.subscription_id;
                var source = args["publisher-identity"];
                var subscription = _this.subscriptions.find(function (s) { return s.subscription_id === subscription_id; });
                if (subscription) {
                    if (!subscription.source) {
                        subscription.callback(data, subscription.topic, source);
                    }
                    else {
                        if (utils_1.keysMatch(subscription.source, source)) {
                            subscription.callback(data, subscription.topic, source);
                        }
                    }
                }
            });
        };
        this.connection = connection;
        this.logger = logger;
        this.session = session;
        this.peerId = connection.peerId;
        this.subscriptions = [];
    }
    return Protocol;
}());
function default_1(connection, logger, session) {
    var protocol = new Protocol(connection, logger, session);
    protocol.watchOnEvent();
    return protocol;
}
exports.default = default_1;
//# sourceMappingURL=protocol.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function removeEmptyValues(obj) {
    var cleaned = {};
    Object.keys(obj).forEach(function (key) {
        if (obj[key] !== undefined && obj[key] !== null) {
            cleaned[key] = obj[key];
        }
    });
    return cleaned;
}
exports.removeEmptyValues = removeEmptyValues;
function keysMatch(obj1, obj2) {
    var keysObj1 = Object.keys(obj1);
    var allMatch = true;
    keysObj1.forEach(function (key) {
        if (obj1[key] !== obj2[key]) {
            allMatch = false;
        }
    });
    return allMatch;
}
exports.keysMatch = keysMatch;
//# sourceMappingURL=utils.js.map

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {
Object.defineProperty(exports, "__esModule", { value: true });
var shortid_1 = __webpack_require__(6);
var utils_1 = __webpack_require__(11);
var contextMessageReplaySpec_1 = __webpack_require__(10);
var pjson = __webpack_require__(12);
function default_1(configuration, ext, hc, glue42gd, gdVersion) {
    if (typeof window !== "undefined") {
        global = global || window;
    }
    global = global || {};
    var uid = shortid_1.generate();
    var masterConfig = global.GLUE_CONFIG || {};
    var dynamicDefaults = global.GLUE_DEFAULT_CONFIG || {};
    var hardDefaults = getHardDefaults();
    var metricsIdentity = {
        system: getConfigProp("metrics", "system"),
        service: getConfigProp("metrics", "service"),
        instance: getConfigProp("metrics", "instance")
    };
    function getMetrics() {
        return ifNotFalse(getConfigProp("metrics"), {
            identity: metricsIdentity
        });
    }
    function getGateway() {
        var force = getConfigProp("gateway", "force");
        var gw = hc === undefined || force;
        if (gw) {
            var gwConfig = getConfigProp("gateway");
            var protocolVersion = getConfigProp("gateway", "protocolVersion");
            var reconnectInterval = getConfigProp("gateway", "reconnectInterval");
            var reconnectAttempts = getConfigProp("gateway", "reconnectAttempts");
            var ws = gwConfig.ws;
            var http = gwConfig.http;
            var inproc = gwConfig.inproc;
            if (!ws && !http && !inproc) {
                if (utils_1.default.isNode() || ("WebSocket" in window && window.WebSocket.CLOSING === 2)) {
                    ws = getConfigProp("gateway", "ws");
                }
                else {
                    http = getConfigProp("gateway", "http");
                }
            }
            var windowId = void 0;
            var pid = void 0;
            if (hc) {
                windowId = hc.windowId;
            }
            else if (typeof glue42gd !== "undefined") {
                windowId = glue42gd.windowId;
                pid = glue42gd.pid;
            }
            else if (utils_1.default.isNode()) {
                pid = process.pid;
            }
            var replaySpecs = getConfigProp("gateway", "replaySpecs") || [];
            replaySpecs.push(contextMessageReplaySpec_1.ContextMessageReplaySpec);
            return {
                identity: {
                    application: getApplication(),
                    windowId: windowId,
                    process: pid,
                },
                reconnectInterval: reconnectInterval,
                ws: ws,
                http: http,
                gw: inproc,
                protocolVersion: protocolVersion,
                reconnectAttempts: reconnectAttempts,
                force: true,
                replaySpecs: replaySpecs,
                gdVersion: gdVersion,
            };
        }
        return { gdVersion: gdVersion };
    }
    function getLogger() {
        return getConfigProp("logger");
    }
    function getAgm() {
        return ifNotFalse(configuration.agm, {
            instance: {
                application: getApplication()
            }
        });
    }
    function getContexts(connectionConfig) {
        if (connectionConfig.protocolVersion < 3) {
            return false;
        }
        var contextConfig = getConfigProp("contexts");
        if (typeof contextConfig === "boolean" && !contextConfig) {
            return false;
        }
        return true;
    }
    function getChannels(contextsEnabled) {
        if (!contextsEnabled) {
            return false;
        }
        var channelsConfig = getConfigProp("channels");
        if (typeof channelsConfig === "boolean" && !channelsConfig) {
            return false;
        }
        return true;
    }
    function getBus(connectionConfig) {
        var contextConfig = getConfigProp("bus");
        if (typeof contextConfig === "boolean" && contextConfig) {
            if (connectionConfig.protocolVersion && connectionConfig.protocolVersion < 3) {
                return false;
            }
            if (gdVersion === 2) {
                return false;
            }
            return true;
        }
        return false;
    }
    function getApplication() {
        return getConfigProp("application");
    }
    function getAuth() {
        return getConfigProp("auth");
    }
    function getHardDefaults() {
        function getMetricsDefaults() {
            var documentTitle = typeof document !== "undefined" ? document.title : "unknown";
            documentTitle = documentTitle || "none";
            if (typeof hc === "undefined") {
                return {
                    system: "Connect.Browser",
                    service: configuration.application || documentTitle,
                    instance: "~" + uid
                };
            }
            if (typeof hc.metricsFacade.getIdentity !== "undefined") {
                var identity = hc.metricsFacade.getIdentity();
                return {
                    system: identity.system,
                    service: identity.service,
                    instance: identity.instance
                };
            }
            return {
                system: "HtmlContainer." + hc.containerName,
                service: "JS." + hc.browserWindowName,
                instance: "~" + hc.machineName
            };
        }
        function getGatewayDefaults() {
            var defaultProtocol = 3;
            var gatewayURL = "localhost:8385";
            var defaultWs = "ws://" + gatewayURL;
            var defaultHttp = "http://" + gatewayURL;
            if (glue42gd) {
                defaultProtocol = 3;
                defaultWs = glue42gd.gwURL;
            }
            return {
                ws: defaultWs,
                http: defaultHttp,
                protocolVersion: defaultProtocol,
                reconnectInterval: 1000
            };
        }
        function getDefaultApplicationName() {
            if (hc) {
                return hc.containerName + "." + hc.browserWindowName;
            }
            if (glue42gd) {
                return glue42gd.appName;
            }
            if (typeof window !== "undefined" && typeof document !== "undefined") {
                return (window.agm_application || document.title) + uid;
            }
            else {
                return "NodeJS" + uid;
            }
        }
        function getDefaultLogger() {
            return {
                publish: "off",
                console: "info",
                metrics: "off",
            };
        }
        return {
            application: getDefaultApplicationName(),
            metrics: getMetricsDefaults(),
            agm: {},
            gateway: getGatewayDefaults(),
            logger: getDefaultLogger(),
            bus: false
        };
    }
    function getConfigProp(prop1, prop2) {
        var masterConfigProp1 = masterConfig[prop1];
        var userProp1 = configuration[prop1];
        var dynamicDefaultsProp1 = dynamicDefaults[prop1];
        var hardDefaultsProp1 = hardDefaults[prop1];
        if (prop2) {
            if (masterConfigProp1 && masterConfigProp1[prop2] !== undefined) {
                return masterConfigProp1[prop2];
            }
            if (userProp1 && userProp1[prop2] !== undefined) {
                return userProp1[prop2];
            }
            if (dynamicDefaultsProp1 && dynamicDefaultsProp1[prop2] !== undefined) {
                return dynamicDefaultsProp1[prop2];
            }
            if (hardDefaultsProp1 && hardDefaultsProp1[prop2] !== undefined) {
                return hardDefaultsProp1[prop2];
            }
        }
        else {
            if (masterConfigProp1 !== undefined) {
                return masterConfigProp1;
            }
            if (userProp1 !== undefined) {
                return userProp1;
            }
            if (dynamicDefaultsProp1 !== undefined) {
                return dynamicDefaultsProp1;
            }
            if (hardDefaultsProp1 !== undefined) {
                return hardDefaultsProp1;
            }
        }
        return undefined;
    }
    function ifNotFalse(what, then) {
        if (typeof what === "boolean" && !what) {
            return undefined;
        }
        else {
            return then;
        }
    }
    var connection = getGateway();
    var contexts = getContexts(connection);
    var channels = getChannels(contexts);
    var bus = getBus(connection);
    return {
        bus: bus,
        identity: metricsIdentity,
        application: getApplication(),
        auth: getAuth(),
        logger: getLogger(),
        connection: connection,
        metrics: getMetrics(),
        agm: getAgm(),
        contexts: contexts,
        channels: channels,
        version: ext.version || pjson.version,
        libs: ext.libs
    };
}
exports.default = default_1;
//# sourceMappingURL=config.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(19)))

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = __webpack_require__(14);
var messageReplayer_1 = __webpack_require__(59);
var GW3ConnectionImpl = (function (_super) {
    __extends(GW3ConnectionImpl, _super);
    function GW3ConnectionImpl(settings) {
        var _this = _super.call(this, settings) || this;
        if (settings.replaySpecs &&
            settings.replaySpecs.length) {
            _this.replayer = new messageReplayer_1.MessageReplayerImpl(settings.replaySpecs);
        }
        return _this;
    }
    GW3ConnectionImpl.prototype.init = function (transport, protocol) {
        _super.prototype.init.call(this, transport, protocol);
        if (this.replayer) {
            this.replayer.init(this);
        }
        this.gw3Protocol = protocol;
    };
    GW3ConnectionImpl.prototype.toAPI = function () {
        var that = this;
        var superAPI = _super.prototype.toAPI.call(this);
        return {
            domain: that.domain.bind(that),
            get peerId() { return that.peerId; },
            get token() { return that.token; },
            get info() { return that.info; },
            get resolvedIdentity() { return that.resolvedIdentity; },
            get availableDomains() { return that.availableDomains; },
            get gatewayToken() { return that.gatewayToken; },
            get replayer() { return that.replayer; },
            on: superAPI.on,
            send: superAPI.send,
            off: superAPI.off,
            login: superAPI.login,
            logout: superAPI.logout,
            loggedIn: superAPI.loggedIn,
            connected: superAPI.connected,
            disconnected: superAPI.disconnected,
            authToken: that.authToken.bind(that),
            get protocolVersion() { return superAPI.protocolVersion; },
        };
    };
    GW3ConnectionImpl.prototype.domain = function (domain, logger, successMessages, errorMessages) {
        return this.gw3Protocol.domain(domain, logger, successMessages, errorMessages);
    };
    GW3ConnectionImpl.prototype.authToken = function () {
        return this.gw3Protocol.authToken();
    };
    return GW3ConnectionImpl;
}(connection_1.default));
exports.default = GW3ConnectionImpl;
//# sourceMappingURL=gw3Connection.js.map

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = __webpack_require__(14);
var gw3_1 = __webpack_require__(61);
var hc_1 = __webpack_require__(63);
var ws_1 = __webpack_require__(66);
var gw3Connection_1 = __webpack_require__(57);
var gw1_1 = __webpack_require__(60);
var hc_2 = __webpack_require__(64);
var inproc_1 = __webpack_require__(65);
exports.default = (function (settings) {
    settings = settings || {};
    settings.reconnectAttempts = settings.reconnectAttempts || 10;
    settings.reconnectInterval = settings.reconnectInterval || 500;
    var connection = new connection_1.default(settings);
    var logger = settings.logger;
    if (!logger) {
        throw new Error("please pass a logger object");
    }
    var protocol = new hc_1.default();
    var transport = new hc_2.default();
    var outsideHC = settings.gdVersion !== 2 || settings.force;
    if (outsideHC) {
        if (settings.gw && settings.gw.facade && settings.gw.token && settings.protocolVersion === 3) {
            transport = new inproc_1.default(settings.gw.token, settings.gw.facade, logger.subLogger("inproc"));
        }
        else if (settings.ws !== undefined) {
            transport = new ws_1.default(settings, logger.subLogger("ws"));
        }
        else {
            throw new Error("No connection information specified");
        }
        if (settings.protocolVersion === 3) {
            var gw3Connection = new gw3Connection_1.default(settings);
            var gw3Port = gw3_1.default(gw3Connection, settings, logger.subLogger("gw3"));
            gw3Connection.init(transport, gw3Port);
            return gw3Connection.toAPI();
        }
        else {
            protocol = new gw1_1.default(connection, settings);
        }
    }
    connection.init(transport, protocol);
    return connection.toAPI();
});
//# sourceMappingURL=main.js.map

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MessageReplayerImpl = (function () {
    function MessageReplayerImpl(specs) {
        this.specsNames = [];
        this.messages = {};
        this.subs = {};
        this.subsRefCount = {};
        this.specs = {};
        for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
            var spec = specs_1[_i];
            this.specs[spec.name] = spec;
            this.specsNames.push(spec.name);
        }
    }
    MessageReplayerImpl.prototype.init = function (connection) {
        var _this = this;
        this.connection = connection;
        for (var _i = 0, _a = this.specsNames; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var _loop_1 = function (type) {
                var refCount = this_1.subsRefCount[type];
                if (!refCount) {
                    refCount = 0;
                }
                refCount += 1;
                this_1.subsRefCount[type] = refCount;
                if (refCount > 1) {
                    return "continue";
                }
                var sub = connection.on("glue-core", type, function (msg) { return _this.processMessage(type, msg); });
                this_1.subs[type] = sub;
            };
            var this_1 = this;
            for (var _b = 0, _c = this.specs[name_1].types; _b < _c.length; _b++) {
                var type = _c[_b];
                _loop_1(type);
            }
        }
    };
    MessageReplayerImpl.prototype.processMessage = function (type, msg) {
        if (this.isDone || !msg) {
            return;
        }
        for (var _i = 0, _a = this.specsNames; _i < _a.length; _i++) {
            var name_2 = _a[_i];
            if (this.specs[name_2].types.indexOf(type) !== -1) {
                var messages = this.messages[name_2] || [];
                this.messages[name_2] = messages;
                messages.push(msg);
            }
        }
    };
    MessageReplayerImpl.prototype.drain = function (name, callback) {
        if (callback) {
            (this.messages[name] || []).forEach(callback);
        }
        delete this.messages[name];
        for (var _i = 0, _a = this.specs[name].types; _i < _a.length; _i++) {
            var type = _a[_i];
            this.subsRefCount[type] -= 1;
            if (this.subsRefCount[type] <= 0) {
                this.connection.off(this.subs[type]);
                delete this.subs[type];
                delete this.subsRefCount[type];
            }
        }
        delete this.specs[name];
        if (!this.specs.length) {
            this.isDone = true;
        }
    };
    return MessageReplayerImpl;
}());
exports.MessageReplayerImpl = MessageReplayerImpl;
//# sourceMappingURL=messageReplayer.js.map

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GW1Protocol = (function () {
    function GW1Protocol(connection, settings) {
        this._connection = connection;
        this._settings = settings;
    }
    GW1Protocol.prototype.processStringMessage = function (message) {
        var messageObj = JSON.parse(message);
        return {
            msg: messageObj.message,
            msgType: messageObj.type,
        };
    };
    GW1Protocol.prototype.createStringMessage = function (product, type, message, id) {
        return JSON.stringify({
            type: type,
            message: message,
            id: id,
        });
    };
    GW1Protocol.prototype.login = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sendOptions = {
                retryInterval: _this._settings.reconnectInterval,
                maxRetries: _this._settings.reconnectAttempts
            };
            _this._connection.send("hello", "hello", {}, null, sendOptions)
                .then(function () { return resolve({ application: undefined }); })
                .catch(reject);
        });
    };
    GW1Protocol.prototype.logout = function () {
    };
    GW1Protocol.prototype.loggedIn = function (callback) {
        callback();
        return function () {
        };
    };
    GW1Protocol.prototype.processObjectMessage = function (message) {
        throw new Error("not supported");
    };
    GW1Protocol.prototype.createObjectMessage = function (product, type, message, id) {
        throw new Error("not supported");
    };
    return GW1Protocol;
}());
exports.default = GW1Protocol;
//# sourceMappingURL=gw1.js.map

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gw3Domain_1 = __webpack_require__(62);
var callback_registry_1 = __webpack_require__(1);
function default_1(connection, settings, logger) {
    var datePrefix = "#T42_DATE#";
    var datePrefixLen = datePrefix.length;
    var dateMinLen = datePrefixLen + 1;
    var datePrefixFirstChar = datePrefix[0];
    var registry = callback_registry_1.default();
    var globalDomain;
    var isLoggedIn = false;
    var shouldTryLogin = true;
    var initialLogin = true;
    var initialLoginAttempts = 3;
    var initialLoginAttemptsInterval = 500;
    var pingTimer;
    var sessions = [];
    var loginConfig;
    connection.disconnected(handleDisconnected.bind(this));
    ping();
    function processStringMessage(message) {
        var msg = JSON.parse(message, function (key, value) {
            if (typeof value !== "string") {
                return value;
            }
            if (value.length < dateMinLen) {
                return value;
            }
            if (value[0] !== datePrefixFirstChar) {
                return value;
            }
            if (value.substring(0, datePrefixLen) !== datePrefix) {
                return value;
            }
            try {
                var milliseconds = parseInt(value.substring(datePrefixLen, value.length), 10);
                if (isNaN(milliseconds)) {
                    return value;
                }
                return new Date(milliseconds);
            }
            catch (ex) {
                return value;
            }
        });
        return {
            msg: msg,
            msgType: msg.type,
        };
    }
    function createStringMessage(product, type, message, id) {
        var oldToJson = Date.prototype.toJSON;
        try {
            Date.prototype.toJSON = function () {
                return datePrefix + this.getTime();
            };
            var result = JSON.stringify(message);
            return result;
        }
        finally {
            Date.prototype.toJSON = oldToJson;
        }
    }
    function processObjectMessage(message) {
        if (!message.type) {
            throw new Error("Object should have type property");
        }
        return {
            msg: message,
            msgType: message.type,
        };
    }
    function createObjectMessage(product, type, message, id) {
        return message;
    }
    function login(config) {
        logger.debug("logging in...");
        loginConfig = config;
        if (!loginConfig) {
            loginConfig = { username: "", password: "" };
        }
        shouldTryLogin = true;
        return new Promise(function (resolve, reject) {
            var authentication = {};
            connection.gatewayToken = config.gatewayToken;
            if (connection.gatewayToken) {
                authentication.method = "gateway-token";
                authentication.token = connection.gatewayToken;
            }
            else if (config.token) {
                authentication.method = "access-token";
                authentication.token = config.token;
            }
            else if (config.username) {
                authentication.method = "secret";
                authentication.login = config.username;
                authentication.secret = config.password;
            }
            else {
                throw new Error("invalid auth message" + JSON.stringify(config));
            }
            var helloMsg = {
                type: "hello",
                identity: settings.identity,
                authentication: authentication,
            };
            globalDomain = gw3Domain_1.default("global", connection, logger, [
                "welcome",
                "token"
            ]);
            var sendOptions = { skipPeerId: true };
            if (initialLogin) {
                sendOptions.retryInterval = settings.reconnectInterval;
                sendOptions.maxRetries = settings.reconnectAttempts;
            }
            globalDomain.send(helloMsg, undefined, sendOptions)
                .then(function (msg) {
                initialLogin = false;
                logger.debug("login successful with PeerId " + msg.peer_id);
                connection.peerId = msg.peer_id;
                connection.resolvedIdentity = msg.resolved_identity;
                connection.availableDomains = msg.available_domains;
                if (msg.options) {
                    connection.token = msg.options.access_token;
                    connection.info = msg.options.info;
                }
                setLoggedIn(true);
                resolve(msg.resolved_identity);
            })
                .catch(function (err) {
                logger.error("error sending hello message - " + err);
                reject(err);
            });
        });
    }
    function logout() {
        logger.debug("logging out...");
        shouldTryLogin = false;
        if (pingTimer) {
            clearTimeout(pingTimer);
        }
        sessions.forEach(function (session) {
            session.leave();
        });
    }
    function loggedIn(callback) {
        if (isLoggedIn) {
            callback();
        }
        return registry.add("onLoggedIn", callback);
    }
    function domain(domainName, domainLogger, successMessages, errorMessages) {
        var session = sessions.filter(function (s) { return s.domain === domainName; })[0];
        if (!session) {
            session = gw3Domain_1.default(domainName, connection, domainLogger, successMessages, errorMessages);
            sessions.push(session);
        }
        return session;
    }
    function handleDisconnected() {
        setLoggedIn(false);
        var tryToLogin = shouldTryLogin;
        if (tryToLogin && initialLogin) {
            if (initialLoginAttempts <= 0) {
                return;
            }
            initialLoginAttempts--;
        }
        logger.debug("disconnected - will try new login?" + shouldTryLogin);
        if (shouldTryLogin) {
            connection.login(loginConfig)
                .catch(function () {
                setTimeout(handleDisconnected, 1000);
            });
        }
    }
    function setLoggedIn(value) {
        isLoggedIn = value;
        if (isLoggedIn) {
            registry.execute("onLoggedIn");
        }
    }
    function ping() {
        if (!shouldTryLogin) {
            return;
        }
        if (isLoggedIn) {
            connection.send("", "", { type: "ping" });
        }
        pingTimer = setTimeout(ping, 30 * 1000);
    }
    function authToken() {
        var createTokenReq = {
            type: "create-token"
        };
        return globalDomain.send(createTokenReq)
            .then(function (res) {
            return res.token;
        });
    }
    return {
        processStringMessage: processStringMessage,
        createStringMessage: createStringMessage,
        createObjectMessage: createObjectMessage,
        processObjectMessage: processObjectMessage,
        login: login,
        logout: logout,
        loggedIn: loggedIn,
        domain: domain,
        authToken: authToken,
    };
}
exports.default = default_1;
//# sourceMappingURL=gw3.js.map

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callbackRegistry = __webpack_require__(1);
var shortid_1 = __webpack_require__(6);
function default_1(domain, connection, logger, successMessages, errorMessages) {
    if (domain == null) {
        domain = "global";
    }
    var isJoined = false;
    var tryReconnecting = false;
    var _latestOptions;
    var _connectionOn = false;
    var callbacks = callbackRegistry();
    connection.disconnected(handleConnectionDisconnected);
    connection.loggedIn(handleConnectionLoggedIn);
    connection.on(domain, "success", function (msg) { return handleSuccessMessage(msg); });
    connection.on(domain, "error", function (msg) { return handleErrorMessage(msg); });
    connection.on(domain, "result", function (msg) { return handleSuccessMessage(msg); });
    if (successMessages) {
        successMessages.forEach(function (sm) {
            connection.on(domain, sm, function (msg) { return handleSuccessMessage(msg); });
        });
    }
    if (errorMessages) {
        errorMessages.forEach(function (sm) {
            connection.on(domain, sm, function (msg) { return handleErrorMessage(msg); });
        });
    }
    var requestsMap = {};
    function join(options) {
        _latestOptions = options;
        return new Promise(function (resolve, reject) {
            if (isJoined) {
                resolve();
                return;
            }
            var joinPromise;
            if (domain === "global") {
                joinPromise = _connectionOn ? Promise.resolve({}) : Promise.reject("not connected to gateway");
            }
            else {
                logger.debug("joining " + domain);
                var joinMsg = {
                    type: "join",
                    destination: domain,
                    domain: "global",
                    options: options,
                };
                joinPromise = send(joinMsg);
            }
            joinPromise
                .then(function () {
                handleJoined();
                resolve();
            })
                .catch(function (err) {
                logger.debug("error joining " + domain + " domain: " + JSON.stringify(err));
                reject(err);
            });
        });
    }
    function leave() {
        if (domain === "global") {
            return;
        }
        logger.debug("stopping session " + domain + "...");
        var leaveMsg = {
            type: "leave",
            destination: domain,
            domain: "global",
        };
        send(leaveMsg).then(function () {
            isJoined = false;
            callbacks.execute("onLeft");
        });
    }
    function handleJoined() {
        logger.debug("did join " + domain);
        isJoined = true;
        var wasReconnect = tryReconnecting;
        tryReconnecting = false;
        callbacks.execute("onJoined", wasReconnect);
    }
    function handleConnectionDisconnected() {
        _connectionOn = false;
        logger.warn("connection is down");
        isJoined = false;
        tryReconnecting = true;
        callbacks.execute("onLeft", { disconnected: true });
    }
    function handleConnectionLoggedIn() {
        _connectionOn = true;
        if (tryReconnecting) {
            logger.info("connection is now up - trying to reconnect...");
            join(_latestOptions);
        }
    }
    function onJoined(callback) {
        if (isJoined) {
            callback(false);
        }
        return callbacks.add("onJoined", callback);
    }
    function onLeft(callback) {
        if (!isJoined) {
            callback();
        }
        return callbacks.add("onLeft", callback);
    }
    function handleErrorMessage(msg) {
        if (domain !== msg.domain) {
            return;
        }
        var requestId = msg.request_id;
        var entry = requestsMap[requestId];
        if (!entry) {
            return;
        }
        entry.error(msg);
    }
    function handleSuccessMessage(msg) {
        if (msg.domain !== domain) {
            return;
        }
        var requestId = msg.request_id;
        var entry = requestsMap[requestId];
        if (!entry) {
            return;
        }
        entry.success(msg);
    }
    function getNextRequestId() {
        return shortid_1.generate();
    }
    function send(msg, tag, options) {
        options = options || {};
        msg.request_id = msg.request_id || getNextRequestId();
        msg.domain = msg.domain || domain;
        if (!options.skipPeerId) {
            msg.peer_id = connection.peerId;
        }
        var requestId = msg.request_id;
        return new Promise(function (resolve, reject) {
            requestsMap[requestId] = {
                success: function (successMsg) {
                    delete requestsMap[requestId];
                    successMsg._tag = tag;
                    resolve(successMsg);
                },
                error: function (errorMsg) {
                    logger.warn("GW error - " + JSON.stringify(errorMsg) + " for request " + JSON.stringify(msg));
                    delete requestsMap[requestId];
                    errorMsg._tag = tag;
                    reject(errorMsg);
                },
            };
            connection
                .send(domain, domain, msg, undefined, options)
                .catch(function (err) {
                requestsMap[requestId].error({ err: err });
            });
        });
    }
    function sendFireAndForget(msg) {
        msg.request_id = msg.request_id ? msg.request_id : getNextRequestId();
        msg.domain = msg.domain || domain;
        msg.peer_id = connection.peerId;
        connection.send(domain, domain, msg);
    }
    return {
        join: join,
        leave: leave,
        onJoined: onJoined,
        onLeft: onLeft,
        send: send,
        sendFireAndForget: sendFireAndForget,
        on: function (type, callback) {
            connection.on(domain, type, function (msg) {
                if (msg.domain !== domain) {
                    return;
                }
                try {
                    callback(msg);
                }
                catch (e) {
                    logger.error("Callback  failed: " + e + " \n msg was: " + JSON.stringify(msg));
                }
            });
        },
        loggedIn: function (callback) { return connection.loggedIn(callback); },
        connected: function (callback) { return connection.connected(callback); },
        disconnected: function (callback) { return connection.disconnected(callback); },
        get peerId() {
            return connection.peerId;
        },
        get domain() {
            return domain;
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=gw3Domain.js.map

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HCProtocol = (function () {
    function HCProtocol() {
    }
    HCProtocol.prototype.processStringMessage = function (message) {
        var messageObj = JSON.parse(message);
        return {
            msg: messageObj,
            msgType: messageObj.type,
        };
    };
    HCProtocol.prototype.createStringMessage = function (product, type, message, id) {
        return JSON.stringify(message);
    };
    HCProtocol.prototype.login = function (message) {
        return Promise.resolve({ application: undefined });
    };
    HCProtocol.prototype.logout = function () {
    };
    HCProtocol.prototype.loggedIn = function (callback) {
        callback();
        return function () {
        };
    };
    HCProtocol.prototype.processObjectMessage = function (message) {
        throw new Error("not supported");
    };
    HCProtocol.prototype.createObjectMessage = function (product, type, message, id) {
        throw new Error("not supported");
    };
    return HCProtocol;
}());
exports.default = HCProtocol;
//# sourceMappingURL=hc.js.map

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HCTransport = (function () {
    function HCTransport() {
        this.connectionId = Math.floor(1e10 * Math.random()).toString();
    }
    HCTransport.prototype.send = function (message, product, type) {
        if (product === "metrics") {
            window.htmlContainer.metricsFacade.send(type, message);
        }
        else if (product === "log") {
            window.htmlContainer.loggingFacade.send(type, message);
        }
        return Promise.resolve(undefined);
    };
    HCTransport.prototype.onConnectedChanged = function (callback) {
        callback(true);
    };
    HCTransport.prototype.onMessage = function (callback) {
    };
    HCTransport.prototype.close = function () {
    };
    HCTransport.prototype.open = function () {
    };
    return HCTransport;
}());
exports.default = HCTransport;
//# sourceMappingURL=hc.js.map

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var Inproc = (function () {
    function Inproc(token, gw, logger) {
        this.registry = callback_registry_1.default();
        this.gw = gw;
        this.gwToken = token;
        this.logger = logger;
        this.connectToken = this.gw.connect(this.gwToken, this.messageHandler.bind(this));
    }
    Object.defineProperty(Inproc.prototype, "isObjectBasedTransport", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Inproc.prototype.sendObject = function (msg) {
        this.logger.debug(JSON.stringify(msg));
        this.gw.send(this.connectToken, msg);
        return Promise.resolve(undefined);
    };
    Inproc.prototype.send = function (msg, product, type) {
        return Promise.reject("not supported");
    };
    Inproc.prototype.onMessage = function (callback) {
        return this.registry.add("onMessage", callback);
    };
    Inproc.prototype.onConnectedChanged = function (callback) {
        callback(true);
    };
    Inproc.prototype.close = function () {
    };
    Inproc.prototype.open = function () {
    };
    Inproc.prototype.messageHandler = function (msg) {
        if (this.logger.consoleLevel() === "trace") {
            this.logger.debug(JSON.stringify(msg));
        }
        this.registry.execute("onMessage", msg);
    };
    return Inproc;
}());
exports.default = Inproc;
//# sourceMappingURL=inproc.js.map

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(11);
var WebSocket = utils_1.default.isNode() ? __webpack_require__(27) : window.WebSocket;
var WS = (function () {
    function WS(settings, logger) {
        this._running = true;
        this._initied = false;
        this._registry = callback_registry_1.default();
        this._settings = settings;
        this._logger = logger;
    }
    WS.prototype.onMessage = function (callback) {
        return this._registry.add("onMessage", callback);
    };
    WS.prototype.send = function (msg, product, type, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            options = options || {};
            _this.waitForSocketConnection(function () {
                try {
                    _this._ws.send(msg);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }, reject, options.maxRetries, options.retryInterval);
        });
    };
    WS.prototype.open = function () {
        this._running = true;
    };
    WS.prototype.close = function () {
        this._running = false;
        this._ws.close();
    };
    WS.prototype.onConnectedChanged = function (callback) {
        return this._registry.add("onConnectedChanged", callback);
    };
    WS.prototype.initiateSocket = function () {
        var _this = this;
        this._logger.debug("initiating _ws to " + this._settings.ws + "...");
        this._ws = new WebSocket(this._settings.ws);
        this._ws.onerror = function (err) {
            _this.notifyStatusChanged(false, err);
        };
        this._ws.onclose = function () {
            _this._logger.debug("_ws closed");
            _this.notifyStatusChanged(false);
        };
        this._ws.onopen = function () {
            _this._logger.debug("_ws opened");
            _this.notifyStatusChanged(true);
        };
        this._ws.onmessage = function (message) {
            _this._registry.execute("onMessage", message.data);
        };
    };
    WS.prototype.waitForSocketConnection = function (callback, failed, retriesLeft, retryInterval) {
        var _this = this;
        if (!callback) {
            callback = function () { };
        }
        if (!failed) {
            failed = function () { };
        }
        if (retryInterval === undefined) {
            retryInterval = this._settings.reconnectInterval;
        }
        if (retriesLeft !== undefined) {
            if (retriesLeft === 0) {
                failed("wait for socket on " + this._settings.ws + " failed - no more retries left");
                return;
            }
            this._logger.debug("will retry " + retriesLeft + " more times (every " + retryInterval + " ms)");
        }
        if (!this._running) {
            failed("wait for socket on " + this._settings.ws + " failed - socket closed by user");
            return;
        }
        if (!this._ws || this._ws.readyState > 1) {
            this.initiateSocket();
        }
        else if (this._ws.readyState === 1) {
            return callback();
        }
        setTimeout(function () {
            var retries = retriesLeft === undefined ? undefined : retriesLeft - 1;
            _this.waitForSocketConnection(callback, failed, retries, retryInterval);
        }, retryInterval);
    };
    WS.prototype.notifyStatusChanged = function (status, reason) {
        this._registry.execute("onConnectedChanged", status, reason);
    };
    return WS;
}());
exports.default = WS;
//# sourceMappingURL=ws.js.map

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var gw3ContextData_1 = __webpack_require__(68);
var helpers_1 = __webpack_require__(71);
var msg = __webpack_require__(15);
var contextMessageReplaySpec_1 = __webpack_require__(10);
var GW3Bridge = (function () {
    function GW3Bridge(config) {
        var _this = this;
        this._contextNameToData = {};
        this._gw3Subscriptions = [];
        this._nextCallbackSubscriptionNumber = 0;
        this._contextNameToId = {};
        this._contextIdToName = {};
        this._connection = config.connection;
        this._logger = config.logger;
        this._gw3Session = this._connection.domain("global", this._logger, [
            msg.GW_MESSAGE_CONTEXT_CREATED,
            msg.GW_MESSAGE_SUBSCRIBED_CONTEXT,
            msg.GW_MESSAGE_CONTEXT_DESTROYED,
            msg.GW_MESSAGE_CONTEXT_UPDATED,
        ]);
        this.subscribeToContextCreatedMessages();
        this.subscribeToContextUpdatedMessages();
        this.subscribeToContextDestroyedMessages();
        this._connection.replayer.drain(contextMessageReplaySpec_1.ContextMessageReplaySpec.name, function (message) {
            var type = message.type;
            if (!type) {
                return;
            }
            if (type === msg.GW_MESSAGE_CONTEXT_CREATED ||
                type === msg.GW_MESSAGE_CONTEXT_ADDED ||
                type === msg.GW_MESSAGE_ACTIVITY_CREATED) {
                _this.handleContextCreatedMessage(message);
            }
            else if (type === msg.GW_MESSAGE_SUBSCRIBED_CONTEXT ||
                type === msg.GW_MESSAGE_CONTEXT_UPDATED ||
                type === msg.GW_MESSAGE_JOINED_ACTIVITY) {
                _this.handleContextUpdatedMessage(message);
            }
            else if (type === msg.GW_MESSAGE_CONTEXT_DESTROYED ||
                type === msg.GW_MESSAGE_ACTIVITY_DESTROYED) {
                _this.handleContextDestroyedMessage(message);
            }
        });
    }
    GW3Bridge.prototype.dispose = function () {
        for (var _i = 0, _a = this._gw3Subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            this._connection.off(sub);
        }
        this._gw3Subscriptions.length = 0;
        for (var contextName in this._contextNameToData) {
            if (this._contextNameToId.hasOwnProperty(contextName)) {
                delete this._contextNameToData[contextName];
            }
        }
    };
    GW3Bridge.prototype.createContext = function (name, data) {
        var _this = this;
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_CREATE_CONTEXT,
            domain: "global",
            name: name,
            data: data,
            lifetime: "retained",
        })
            .then(function (createContextMsg) {
            _this._contextNameToId[name] = createContextMsg.context_id;
            if (!_this._contextIdToName[createContextMsg.context_id]) {
                _this._contextIdToName[createContextMsg.context_id] = name;
                var contextData = _this._contextNameToData[name] || new gw3ContextData_1.GW3ContextData(createContextMsg.context_id, name, true, null);
                contextData.isAnnounced = true;
                contextData.name = name;
                contextData.contextId = createContextMsg.context_id;
                _this._contextNameToData[name] = contextData;
                contextData.context = createContextMsg.data;
                contextData.sentExplicitSubscription = true;
                if (contextData.context) {
                    _this.invokeUpdateCallbacks(contextData, contextData.context, null);
                }
                return _this.update(name, data).then(function () { return createContextMsg.context_id; });
            }
            return createContextMsg.context_id;
        });
    };
    GW3Bridge.prototype.all = function () {
        var _this = this;
        return Object.keys(this._contextNameToData)
            .filter(function (name) { return _this._contextNameToData[name].isAnnounced; });
    };
    GW3Bridge.prototype.update = function (name, delta) {
        var _this = this;
        var contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            return this.createContext(name, delta);
        }
        var calculatedDelta = this.calculateContextDelta(contextData.context, delta);
        if (!Object.keys(calculatedDelta.added).length
            && !Object.keys(calculatedDelta.updated).length
            && !calculatedDelta.removed.length) {
            return Promise.resolve();
        }
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_UPDATE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
            delta: calculatedDelta,
        }, {}, { skipPeerId: false })
            .then(function (gwResponse) {
            _this.handleUpdated(contextData, calculatedDelta, {
                updaterId: gwResponse.peer_id
            });
        });
    };
    GW3Bridge.prototype.set = function (name, data) {
        var _this = this;
        var contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            return this.createContext(name, data);
        }
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_UPDATE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
            delta: { reset: data },
        }, {}, { skipPeerId: false })
            .then(function (gwResponse) {
            _this.handleUpdated(contextData, { reset: data, added: {}, removed: [], updated: {} }, { updaterId: gwResponse.peer_id });
        });
    };
    GW3Bridge.prototype.get = function (name) {
        var _this = this;
        var contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.subscribe(name, function (data, delta, removed, un) {
                        _this.unsubscribe(un);
                        resolve(data);
                    });
                    return [2];
                });
            }); });
        }
        else {
            return Promise.resolve(contextData.context);
        }
    };
    GW3Bridge.prototype.subscribe = function (name, callback) {
        var thisCallbackSubscriptionNumber = this._nextCallbackSubscriptionNumber;
        this._nextCallbackSubscriptionNumber += 1;
        var contextData = this._contextNameToData[name];
        if (!contextData ||
            !contextData.isAnnounced) {
            contextData = contextData || new gw3ContextData_1.GW3ContextData(undefined, name, false, undefined);
            this._contextNameToData[name] = contextData;
            contextData.updateCallbacks[thisCallbackSubscriptionNumber] = callback;
            return Promise.resolve(thisCallbackSubscriptionNumber);
        }
        var hadCallbacks = contextData.hasCallbacks();
        contextData.updateCallbacks[thisCallbackSubscriptionNumber] = callback;
        if (!hadCallbacks) {
            if (!contextData.joinedActivity) {
                if (contextData.context &&
                    contextData.sentExplicitSubscription) {
                    callback(contextData.context, contextData.context, [], thisCallbackSubscriptionNumber);
                    return Promise.resolve(thisCallbackSubscriptionNumber);
                }
                return this.sendSubscribe(contextData)
                    .then(function () { return thisCallbackSubscriptionNumber; });
            }
            else {
                callback(contextData.context, contextData.context, [], thisCallbackSubscriptionNumber);
                return Promise.resolve(thisCallbackSubscriptionNumber);
            }
        }
        else {
            callback(contextData.context, contextData.context, [], thisCallbackSubscriptionNumber);
            return Promise.resolve(thisCallbackSubscriptionNumber);
        }
    };
    GW3Bridge.prototype.unsubscribe = function (subscriptionKey) {
        for (var _i = 0, _a = Object.keys(this._contextNameToData); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var contextId = this._contextNameToId[name_1];
            var contextData = this._contextNameToData[name_1];
            if (!contextData) {
                return;
            }
            var hadCallbacks = contextData.hasCallbacks();
            delete contextData.updateCallbacks[subscriptionKey];
            if (contextData.isAnnounced &&
                hadCallbacks &&
                !contextData.hasCallbacks() &&
                contextData.sentExplicitSubscription) {
                this.sendUnsubscribe(contextData);
            }
            if (!contextData.isAnnounced &&
                !contextData.hasCallbacks()) {
                delete this._contextNameToData[name_1];
            }
        }
    };
    GW3Bridge.prototype.handleUpdated = function (contextData, delta, extraData) {
        var oldContext = contextData.context;
        contextData.context = helpers_1.applyContextDelta(contextData.context, delta);
        if (this._contextNameToData[contextData.name] === contextData &&
            !helpers_1.deepEqual(oldContext, contextData.context)) {
            this.invokeUpdateCallbacks(contextData, contextData.context, delta, extraData);
        }
    };
    GW3Bridge.prototype.subscribeToContextCreatedMessages = function () {
        var createdMessageTypes = [
            msg.GW_MESSAGE_CONTEXT_ADDED,
            msg.GW_MESSAGE_CONTEXT_CREATED,
            msg.GW_MESSAGE_ACTIVITY_CREATED,
        ];
        for (var _i = 0, createdMessageTypes_1 = createdMessageTypes; _i < createdMessageTypes_1.length; _i++) {
            var createdMessageType = createdMessageTypes_1[_i];
            var sub = this._connection.on("js-contexts", createdMessageType, this.handleContextCreatedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    };
    GW3Bridge.prototype.handleContextCreatedMessage = function (contextCreatedMsg) {
        var createdMessageType = contextCreatedMsg.type;
        if (createdMessageType === msg.GW_MESSAGE_ACTIVITY_CREATED) {
            this._contextNameToId[contextCreatedMsg.activity_id] = contextCreatedMsg.context_id;
            this._contextIdToName[contextCreatedMsg.context_id] = contextCreatedMsg.activity_id;
        }
        else if (createdMessageType === msg.GW_MESSAGE_CONTEXT_ADDED) {
            this._contextNameToId[contextCreatedMsg.name] = contextCreatedMsg.context_id;
            this._contextIdToName[contextCreatedMsg.context_id] = contextCreatedMsg.name;
        }
        else if (createdMessageType === msg.GW_MESSAGE_CONTEXT_CREATED) {
        }
        var name = this._contextIdToName[contextCreatedMsg.context_id];
        if (!name) {
            throw new Error("Received created event for context with unknown name: " + contextCreatedMsg.context_id);
        }
        if (!this._contextNameToId[name]) {
            throw new Error("Received created event for context with unknown id: " + contextCreatedMsg.context_id);
        }
        var contextData = this._contextNameToData[name];
        if (contextData) {
            if (contextData.isAnnounced) {
                return;
            }
            else {
                if (!contextData.hasCallbacks()) {
                    throw new Error("Assertion failure: contextData.hasCallbacks()");
                }
                contextData.isAnnounced = true;
                contextData.contextId = contextCreatedMsg.context_id;
                contextData.activityId = contextCreatedMsg.activity_id;
                if (!contextData.sentExplicitSubscription) {
                    this.sendSubscribe(contextData);
                }
            }
        }
        else {
            this._contextNameToData[name] = contextData =
                new gw3ContextData_1.GW3ContextData(contextCreatedMsg.context_id, name, true, contextCreatedMsg.activity_id);
        }
    };
    GW3Bridge.prototype.subscribeToContextUpdatedMessages = function () {
        var updatedMessageTypes = [
            msg.GW_MESSAGE_CONTEXT_UPDATED,
            msg.GW_MESSAGE_SUBSCRIBED_CONTEXT,
            msg.GW_MESSAGE_JOINED_ACTIVITY,
        ];
        for (var _i = 0, updatedMessageTypes_1 = updatedMessageTypes; _i < updatedMessageTypes_1.length; _i++) {
            var updatedMessageType = updatedMessageTypes_1[_i];
            var sub = this._connection.on("js-contexts", updatedMessageType, this.handleContextUpdatedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    };
    GW3Bridge.prototype.handleContextUpdatedMessage = function (contextUpdatedMsg) {
        var updatedMessageType = contextUpdatedMsg.type;
        var contextId = contextUpdatedMsg.context_id;
        var contextData = this._contextNameToData[this._contextIdToName[contextId]];
        var justSeen = !contextData || !contextData.isAnnounced;
        if (updatedMessageType === msg.GW_MESSAGE_JOINED_ACTIVITY) {
            if (!contextData) {
                contextData = new gw3ContextData_1.GW3ContextData(contextId, contextUpdatedMsg.activity_id, true, contextUpdatedMsg.activity_id);
                this._contextNameToData[contextUpdatedMsg.activity_id] = contextData;
                this._contextIdToName[contextId] = contextUpdatedMsg.activity_id;
                this._contextNameToId[contextUpdatedMsg.activity_id] = contextId;
            }
            else {
                contextData.contextId = contextId;
                contextData.isAnnounced = true;
                contextData.activityId = contextUpdatedMsg.activity_id;
            }
            contextData.joinedActivity = true;
        }
        else {
            if (!contextData || !contextData.isAnnounced) {
                if (updatedMessageType === msg.GW_MESSAGE_SUBSCRIBED_CONTEXT) {
                    contextData = contextData || new gw3ContextData_1.GW3ContextData(contextId, contextUpdatedMsg.name, true, null);
                    contextData.sentExplicitSubscription = true;
                    this._contextNameToData[contextUpdatedMsg.name] = contextData;
                    this._contextIdToName[contextId] = contextUpdatedMsg.name;
                    this._contextNameToId[contextUpdatedMsg.name] = contextId;
                }
                else {
                    this._logger.error("Received 'update' for unknown context: " + contextId);
                }
                return;
            }
        }
        var oldContext = contextData.context;
        if (updatedMessageType === msg.GW_MESSAGE_SUBSCRIBED_CONTEXT) {
            contextData.context = contextUpdatedMsg.data || {};
        }
        else if (updatedMessageType === msg.GW_MESSAGE_JOINED_ACTIVITY) {
            contextData.context = contextUpdatedMsg.context_snapshot || {};
        }
        else if (updatedMessageType === msg.GW_MESSAGE_CONTEXT_UPDATED) {
            contextData.context = helpers_1.applyContextDelta(contextData.context, contextUpdatedMsg.delta);
        }
        else {
            throw new Error("Unrecognized context update message " + updatedMessageType);
        }
        if (justSeen ||
            !helpers_1.deepEqual(contextData.context, oldContext) ||
            updatedMessageType === msg.GW_MESSAGE_SUBSCRIBED_CONTEXT) {
            this.invokeUpdateCallbacks(contextData, contextData.context, null, { updaterId: contextUpdatedMsg.updater_id });
        }
    };
    GW3Bridge.prototype.invokeUpdateCallbacks = function (contextData, data, delta, extraData) {
        delta = delta || { added: {}, updated: {}, reset: {}, removed: [] };
        for (var updateCallbackIndex in contextData.updateCallbacks) {
            if (contextData.updateCallbacks.hasOwnProperty(updateCallbackIndex)) {
                try {
                    var updateCallback = contextData.updateCallbacks[updateCallbackIndex];
                    updateCallback(helpers_1.deepClone(data), Object.assign({}, delta.added || {}, delta.updated || {}, delta.reset || {}), delta.removed, parseInt(updateCallbackIndex, 10), extraData);
                }
                catch (err) {
                    this._logger.debug("Callback error: " + JSON.stringify(err));
                }
            }
        }
    };
    GW3Bridge.prototype.subscribeToContextDestroyedMessages = function () {
        var destroyedMessageTypes = [
            msg.GW_MESSAGE_CONTEXT_DESTROYED,
            msg.GW_MESSAGE_ACTIVITY_DESTROYED,
        ];
        for (var _i = 0, destroyedMessageTypes_1 = destroyedMessageTypes; _i < destroyedMessageTypes_1.length; _i++) {
            var destroyedMessageType = destroyedMessageTypes_1[_i];
            var sub = this._connection.on("js-contexts", destroyedMessageType, this.handleContextDestroyedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    };
    GW3Bridge.prototype.handleContextDestroyedMessage = function (destroyedMsg) {
        var destroyedMessageType = destroyedMsg.type;
        var contextId;
        var name;
        if (destroyedMessageType === msg.GW_MESSAGE_ACTIVITY_DESTROYED) {
            name = destroyedMsg.activity_id;
            contextId = this._contextNameToId[name];
            if (!contextId) {
                this._logger.error("Received 'destroyed' for unknown activity: " + destroyedMsg.activity_id);
                return;
            }
        }
        else {
            contextId = destroyedMsg.context_id;
            name = this._contextIdToName[contextId];
            if (!name) {
                this._logger.error("Received 'destroyed' for unknown context: " + destroyedMsg.context_id);
                return;
            }
        }
        delete this._contextIdToName[contextId];
        delete this._contextNameToId[name];
        var contextData = this._contextNameToData[name];
        delete this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            this._logger.error("Received 'destroyed' for unknown context: " + contextId);
            return;
        }
    };
    GW3Bridge.prototype.sendSubscribe = function (contextData) {
        contextData.sentExplicitSubscription = true;
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_SUBSCRIBE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
        }).then(function (_) { return undefined; });
    };
    GW3Bridge.prototype.sendUnsubscribe = function (contextData) {
        contextData.sentExplicitSubscription = false;
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_UNSUBSCRIBE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
        }).then(function (_) { return undefined; });
    };
    GW3Bridge.prototype.calculateContextDelta = function (from, to) {
        var delta = { added: {}, updated: {}, removed: [], reset: null };
        if (from) {
            for (var _i = 0, _a = Object.keys(from); _i < _a.length; _i++) {
                var x = _a[_i];
                if (Object.keys(to).indexOf(x) !== -1
                    && to[x] !== null
                    && !helpers_1.deepEqual(from[x], to[x])) {
                    delta.updated[x] = to[x];
                }
            }
        }
        for (var _b = 0, _c = Object.keys(to); _b < _c.length; _b++) {
            var x = _c[_b];
            if (!from || (Object.keys(from).indexOf(x) === -1)) {
                if (to[x] !== null) {
                    delta.added[x] = to[x];
                }
            }
            else if (to[x] === null) {
                delta.removed.push(x);
            }
        }
        return delta;
    };
    return GW3Bridge;
}());
exports.GW3Bridge = GW3Bridge;
//# sourceMappingURL=gw3Bridge.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GW3ContextData = (function () {
    function GW3ContextData(contextId, name, isAnnounced, activityId) {
        this.updateCallbacks = {};
        this.contextId = contextId;
        this.name = name;
        this.isAnnounced = isAnnounced;
        this.activityId = activityId;
        this.context = {};
    }
    GW3ContextData.prototype.hasCallbacks = function () {
        return Object.keys(this.updateCallbacks).length > 0;
    };
    GW3ContextData.prototype.getState = function () {
        if (this.isAnnounced && this.hasCallbacks()) {
            return 3;
        }
        if (this.isAnnounced) {
            return 2;
        }
        if (this.hasCallbacks()) {
            return 1;
        }
        return 0;
    };
    return GW3ContextData;
}());
exports.GW3ContextData = GW3ContextData;
//# sourceMappingURL=gw3ContextData.js.map

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var HCBridge = (function () {
    function HCBridge(config) {
        this._facade = window.htmlContainer.sharedContextFacade;
    }
    HCBridge.prototype.all = function () {
        var allObj = this._facade.all();
        if (!allObj || !allObj.keys) {
            return [];
        }
        return allObj.keys;
    };
    HCBridge.prototype.update = function (name, delta) {
        this._facade.update(name, delta);
        return Promise.resolve();
    };
    HCBridge.prototype.set = function (name, data) {
        this._facade.set(name, data);
        return Promise.resolve();
    };
    HCBridge.prototype.subscribe = function (name, callback) {
        var snapshot = null;
        var key = this._facade.subscribe(name, function (data, delta, removed) {
            if (!key && key !== 0) {
                snapshot = data;
                return;
            }
            callback(data, delta, removed, key);
        });
        if (snapshot) {
            callback(snapshot, snapshot, [], key);
            snapshot = null;
        }
        return Promise.resolve(key);
    };
    HCBridge.prototype.get = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.subscribe(name, function (data, un) {
                    _this.unsubscribe(un);
                    resolve(data);
                });
                return [2];
            });
        }); });
    };
    HCBridge.prototype.unsubscribe = function (key) {
        this._facade.unsubscribe(key);
    };
    return HCBridge;
}());
exports.HCBridge = HCBridge;
//# sourceMappingURL=hcBridge.js.map

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gw3Bridge_1 = __webpack_require__(67);
var hcBridge_1 = __webpack_require__(69);
var ContextsModule = (function () {
    function ContextsModule(config) {
        this.config = config;
        try {
            if (config.gdMajorVersion === 2) {
                var hc = window.htmlContainer;
                if (!hc.sharedContextFacade) {
                    throw new Error("Your version of HtmlContainer does not support contexts."
                        + " Get version 1.46.0.0 or later to have that feature.");
                }
                this._bridge = new hcBridge_1.HCBridge(config);
            }
            else if (config.connection.protocolVersion === 3) {
                this._bridge = new gw3Bridge_1.GW3Bridge(config);
            }
            else {
                throw new Error("To use the Contexts library you must run in the"
                    + " HTML Container or using a connection to Gateway v3.");
            }
        }
        catch (err) {
            throw err;
        }
    }
    ContextsModule.prototype.all = function () {
        return this._bridge.all();
    };
    ContextsModule.prototype.update = function (name, delta) {
        this.checkName(name);
        return this._bridge.update(name, delta);
    };
    ContextsModule.prototype.set = function (name, data) {
        this.checkName(name);
        return this._bridge.set(name, data);
    };
    ContextsModule.prototype.subscribe = function (name, callback) {
        var _this = this;
        this.checkName(name);
        return this._bridge
            .subscribe(name, function (data, delta, removed, key, extraData) { return callback(data, delta, removed, function () { return _this._bridge.unsubscribe(key); }, extraData); })
            .then(function (key) {
            return function () {
                _this._bridge.unsubscribe(key);
            };
        });
    };
    ContextsModule.prototype.get = function (name) {
        return this._bridge.get(name);
    };
    ContextsModule.prototype.ready = function () {
        return Promise.resolve(this);
    };
    ContextsModule.prototype.checkName = function (name) {
        if (typeof name !== "string" ||
            name === "") {
            throw new Error("'name' must be non-empty string, got '" + name + "'");
        }
    };
    return ContextsModule;
}());
exports.ContextsModule = ContextsModule;
//# sourceMappingURL=contextsModule.js.map

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", { value: true });
function applyContextDelta(context, delta) {
    if (delta) {
        if (delta.reset) {
            context = __assign({}, delta.reset);
            return context;
        }
        context = deepClone(context, null);
        var added_1 = delta.added;
        var updated_1 = delta.updated;
        var removed = delta.removed;
        if (added_1) {
            Object.keys(added_1).forEach(function (key) {
                context[key] = added_1[key];
            });
        }
        if (updated_1) {
            Object.keys(updated_1).forEach(function (key) {
                mergeObjectsProperties(key, context, updated_1);
            });
        }
        if (removed) {
            removed.forEach(function (key) {
                delete context[key];
            });
        }
    }
    return context;
}
exports.applyContextDelta = applyContextDelta;
function deepClone(obj, hash) {
    hash = hash || new WeakMap();
    if (Object(obj) !== obj) {
        return obj;
    }
    if (obj instanceof Set) {
        return new Set(obj);
    }
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    var result = obj instanceof Date ? new Date(obj)
        : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
            : obj.constructor ? new obj.constructor()
                : Object.create(null);
    hash.set(obj, result);
    if (obj instanceof Map) {
        Array.from(obj, function (_a) {
            var key = _a[0], val = _a[1];
            return result.set(key, deepClone(val, hash));
        });
    }
    return Object.assign.apply(Object, [result].concat(Object.keys(obj).map(function (key) {
        var _a;
        return (_a = {}, _a[key] = deepClone(obj[key], hash), _a);
    })));
}
exports.deepClone = deepClone;
var mergeObjectsProperties = function (key, what, withWhat) {
    var right = withWhat[key];
    if (right === undefined) {
        return what;
    }
    var left = what[key];
    if (!left || !right) {
        what[key] = right;
        return what;
    }
    if (typeof left === "string" ||
        typeof left === "number" ||
        typeof left === "boolean" ||
        typeof right === "string" ||
        typeof right === "number" ||
        typeof right === "boolean" ||
        Array.isArray(left) ||
        Array.isArray(right)) {
        what[key] = right;
        return what;
    }
    what[key] = Object.assign({}, left, right);
    return what;
};
function deepEqual(x, y) {
    if (x === y) {
        return true;
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }
    if (x.constructor !== y.constructor) {
        return false;
    }
    for (var p in x) {
        if (!x.hasOwnProperty(p)) {
            continue;
        }
        if (!y.hasOwnProperty(p)) {
            return false;
        }
        if (x[p] === y[p]) {
            continue;
        }
        if (typeof (x[p]) !== "object") {
            return false;
        }
        if (!deepEqual(x[p], y[p])) {
            return false;
        }
    }
    for (var p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}
exports.deepEqual = deepEqual;
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contextsModule_1 = __webpack_require__(70);
exports.ContextsModule = contextsModule_1.ContextsModule;
//# sourceMappingURL=main.js.map

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel = (function () {
    function LogLevel() {
    }
    LogLevel.canPublish = function (level, restriction) {
        var levelIdx = LogLevel.order.indexOf(level);
        var restrictionIdx = LogLevel.order.indexOf(restriction);
        return levelIdx >= restrictionIdx;
    };
    LogLevel.off = "off";
    LogLevel.trace = "trace";
    LogLevel.debug = "debug";
    LogLevel.info = "info";
    LogLevel.warn = "warn";
    LogLevel.error = "error";
    LogLevel.order = [LogLevel.trace, LogLevel.debug, LogLevel.info, LogLevel.warn, LogLevel.error, LogLevel.off];
    return LogLevel;
}());
exports.default = LogLevel;
//# sourceMappingURL=levels.js.map

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levels_1 = __webpack_require__(73);
var LoggerImpl = (function () {
    function LoggerImpl(name, parent, metricSystem) {
        this._subloggers = [];
        this._name = name;
        this._parent = parent;
        if (parent) {
            this._path = parent.path + "." + name;
        }
        else {
            this._path = name;
        }
        this._loggerFullName = "[" + this._path + "]";
        if (typeof metricSystem !== "undefined") {
            this.metricsLevel("warn", metricSystem.subSystem(name));
        }
    }
    Object.defineProperty(LoggerImpl.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoggerImpl.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    LoggerImpl.prototype.subLogger = function (name) {
        var existingSub = this._subloggers.filter(function (subLogger) {
            return subLogger.name === name;
        })[0];
        if (existingSub !== undefined) {
            return existingSub;
        }
        Object.keys(this).forEach(function (key) {
            if (key === name) {
                throw new Error("This sub logger name is not allowed.");
            }
        });
        var sub = new LoggerImpl(name, this);
        this._subloggers.push(sub);
        return sub;
    };
    LoggerImpl.prototype.publishLevel = function (level) {
        if (level !== null && level !== undefined) {
            this._publishLevel = level;
        }
        return this._publishLevel || this._parent.publishLevel();
    };
    LoggerImpl.prototype.consoleLevel = function (level) {
        if (level !== null && level !== undefined) {
            this._consoleLevel = level;
        }
        return this._consoleLevel || this._parent.consoleLevel();
    };
    LoggerImpl.prototype.metricsLevel = function (level, metricsSystem) {
        if (level !== null && level !== undefined) {
            this._metricLevel = level;
        }
        if (metricsSystem !== undefined) {
            if (typeof metricsSystem === "object" && typeof metricsSystem.objectMetric === "function") {
                this._metricSystem = metricsSystem;
            }
            else {
                throw new Error("Please specify metric system");
            }
        }
        return this._metricLevel || this._parent.metricsLevel();
    };
    LoggerImpl.prototype.log = function (message, level) {
        this.publishMessage(level || levels_1.default.info, message);
    };
    LoggerImpl.prototype.trace = function (message) {
        this.log(message, levels_1.default.trace);
    };
    LoggerImpl.prototype.debug = function (message) {
        this.log(message, levels_1.default.debug);
    };
    LoggerImpl.prototype.info = function (message) {
        this.log(message, levels_1.default.info);
    };
    LoggerImpl.prototype.warn = function (message) {
        this.log(message, levels_1.default.warn);
    };
    LoggerImpl.prototype.error = function (message) {
        this.log(message, levels_1.default.error);
    };
    LoggerImpl.prototype.toAPIObject = function () {
        var that = this;
        return {
            name: this.name,
            subLogger: this.subLogger.bind(that),
            publishLevel: this.publishLevel.bind(that),
            consoleLevel: this.consoleLevel.bind(that),
            metricsLevel: this.metricsLevel.bind(that),
            log: this.log.bind(that),
            trace: this.trace.bind(that),
            debug: this.debug.bind(that),
            info: this.info.bind(that),
            warn: this.warn.bind(that),
            error: this.error.bind(that),
        };
    };
    LoggerImpl.prototype.publishMessage = function (level, message) {
        var loggerName = this._loggerFullName;
        if (level === levels_1.default.error) {
            var e = new Error();
            if (e.stack) {
                message = message + "\n" +
                    (e.stack.split("\n").slice(3).join("\n"));
            }
        }
        if (levels_1.default.canPublish(level, this.consoleLevel())) {
            var toPrint = loggerName + ": " + message;
            switch (level) {
                case levels_1.default.trace:
                    console.trace(toPrint);
                    break;
                case levels_1.default.debug:
                    if (console.debug) {
                        console.debug(toPrint);
                    }
                    else {
                        console.log(toPrint);
                    }
                    break;
                case levels_1.default.info:
                    console.info(toPrint);
                    break;
                case levels_1.default.warn:
                    console.warn(toPrint);
                    break;
                case levels_1.default.error:
                    console.error(toPrint);
                    break;
            }
        }
        if (levels_1.default.canPublish(level, this.publishLevel())) {
            LoggerImpl.GetConnection().send("log", "LogMessage", {
                instance: LoggerImpl.Instance,
                level: levels_1.default.order.indexOf(level),
                logger: loggerName,
                message: message,
            });
        }
        if (levels_1.default.canPublish(level, this.metricsLevel())) {
            if (this._metricSystem !== undefined) {
                this._metricSystem.objectMetric("LogMessage", {
                    Level: level,
                    Logger: loggerName,
                    Message: message,
                    Time: new Date(),
                });
                if (level === levels_1.default.error) {
                    this._metricSystem.setState(100, message);
                }
            }
        }
    };
    return LoggerImpl;
}());
exports.default = LoggerImpl;
//# sourceMappingURL=logger.js.map

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(74);
exports.default = (function (settings) {
    var identity = settings.identity;
    if (!identity) {
        throw new Error("identity is missing");
    }
    var identityStr = identity.system + "\\" + identity.service + "\\" + identity.instance;
    logger_1.default.Instance = identityStr;
    logger_1.default.GetConnection = settings.getConnection;
    var mainLogger = new logger_1.default("main");
    mainLogger.publishLevel(settings.publish || "off");
    mainLogger.consoleLevel(settings.console || "info");
    mainLogger.metricsLevel(settings.metrics || "off");
    var apiLogger = mainLogger.toAPIObject();
    return apiLogger;
});
//# sourceMappingURL=main.js.map

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var glue_1 = __webpack_require__(17);
var pjson = __webpack_require__(12);
if (typeof window !== "undefined") {
    window.GlueCore = glue_1.default;
}
glue_1.default.default = glue_1.default;
glue_1.default.version = pjson.version;
module.exports = glue_1.default;
//# sourceMappingURL=main.js.map

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var metric_types_1 = __webpack_require__(0);
function addressMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var system = parent;
    var repo = parent.repo;
    var conflation = definition.conflation;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.ADDRESS;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = addressMetric;
//# sourceMappingURL=address.js.map

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var metric_types_1 = __webpack_require__(0);
function countMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || 0;
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.COUNT;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
    }
    function getValueType() {
        return undefined;
    }
    function incrementBy(num) {
        update(_value + num);
    }
    function increment() {
        incrementBy(1);
    }
    function decrement() {
        incrementBy(-1);
    }
    function decrementBy(num) {
        incrementBy(num * -1);
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get path() {
            return _path;
        },
        get value() {
            return _value;
        },
        update: update,
        getValueType: getValueType,
        incrementBy: incrementBy,
        increment: increment,
        decrement: decrement,
        decrementBy: decrementBy,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = countMetric;
//# sourceMappingURL=count.js.map

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var metric_types_1 = __webpack_require__(0);
function numberMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _path = parent.path.slice(0);
    var _value = value || 0;
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.NUMBER;
    _path.push(parent.name);
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
    }
    function getValueType() {
        return undefined;
    }
    function incrementBy(num) {
        update(_value + num);
    }
    function increment() {
        incrementBy(1);
    }
    function decrement() {
        incrementBy(-1);
    }
    function decrementBy(num) {
        incrementBy(num * -1);
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        conflation: conflation,
        get value() {
            return _value;
        },
        type: type,
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
        incrementBy: incrementBy,
        increment: increment,
        decrement: decrement,
        decrementBy: decrementBy,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = numberMetric;
//# sourceMappingURL=number.js.map

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metric_types_1 = __webpack_require__(0);
var helpers_1 = __webpack_require__(2);
function objectMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.OBJECT;
    function update(newValue) {
        mergeValues(newValue);
        _transport.updateMetric(me);
    }
    function getValueType() {
        return undefined;
    }
    function mergeValues(values) {
        return Object.keys(_value).forEach(function (k) {
            if (typeof values[k] !== "undefined") {
                _value[k] = values[k];
            }
        });
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = objectMetric;
//# sourceMappingURL=object.js.map

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var metric_types_1 = __webpack_require__(0);
function rateMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.RATE;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = rateMetric;
//# sourceMappingURL=rate.js.map

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var metric_types_1 = __webpack_require__(0);
function statisticsMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.STATISTICS;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = statisticsMetric;
//# sourceMappingURL=statistics.js.map

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var metric_types_1 = __webpack_require__(0);
function stringMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.STRING;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        type: type,
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = stringMetric;
//# sourceMappingURL=string.js.map

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var metric_types_1 = __webpack_require__(0);
function timespanMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.TIMESPAN;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
    }
    function start() {
        update(true);
    }
    function stop() {
        update(false);
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        start: start,
        stop: stop,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = timespanMetric;
//# sourceMappingURL=timespan.js.map

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var metric_types_1 = __webpack_require__(0);
function timestampMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.TIMESTAMP;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
    }
    function now() {
        update(new Date());
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        now: now,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = timestampMetric;
//# sourceMappingURL=timestamp.js.map

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = __webpack_require__(87);
function default_1(connection, config) {
    var DEFAULT_HEARTBEAT_INTERVAL = 3000;
    var heartbeatTimer;
    if (!connection || typeof connection !== "object") {
        throw new Error("Connection is required parameter");
    }
    var _connection = connection;
    var heartbeatInterval = config.heartbeatInterval || DEFAULT_HEARTBEAT_INTERVAL;
    var send = function (type, message) {
        _connection.send("metrics", type, message);
    };
    function sendFull(repo) {
        if (!repo.root) {
            return;
        }
        if (repo.root.subSystems.length === 0) {
            return;
        }
        sendFullSystem(repo.root);
    }
    function sendFullSystem(system) {
        createSystem(system);
        system.subSystems.forEach(function (sub) {
            sendFullSystem(sub);
        });
        system.metrics.forEach(function (metric) {
            createMetric(metric);
        });
    }
    function heartbeat(repo) {
        send("HeartbeatMetrics", {
            publishingInterval: heartbeatInterval,
            instance: repo.instance,
        });
    }
    function createSystem(system) {
        if (system.parent !== undefined) {
            send("CreateMetricSystem", {
                id: system.id,
                instance: system.repo.instance,
                definition: {
                    name: system.name,
                    description: system.description,
                    path: system.path,
                },
            });
        }
    }
    function updateSystem(system, state) {
        send("UpdateMetricSystem", {
            id: system.id,
            instance: system.repo.instance,
            state: state,
        });
    }
    function createMetric(metric) {
        send("CreateMetric", serializer_1.default(metric));
    }
    function updateMetric(metric) {
        send("UpdateMetric", serializer_1.default(metric));
    }
    function init(repo) {
        heartbeat(repo);
        _connection.on("metrics", "MetricsSnapshotRequest", function (instanceInfo) {
            if (instanceInfo.Instance !== repo.instance) {
                return;
            }
            sendFull(repo);
        });
        _connection.disconnected(function () { return clearInterval(heartbeatTimer); });
        if (typeof window !== "undefined" && typeof window.htmlContainer === "undefined") {
            heartbeatTimer = setInterval(function () {
                heartbeat(repo);
            }, heartbeatInterval);
        }
    }
    var me = {
        createSystem: createSystem,
        updateSystem: updateSystem,
        createMetric: createMetric,
        updateMetric: updateMetric,
        init: init,
    };
    return me;
}
exports.default = default_1;
//# sourceMappingURL=gw1.js.map

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metric_types_1 = __webpack_require__(0);
function metricToMessage(metric) {
    var definition = getMetricDefinition(metric.name, metric.value, metric.path, metric.type, metric.description, metric.period, metric.resolution, metric.conflation);
    function getMetricDefinition(name, value, path, type, description, period, resolution, conflation) {
        var _definition = {
            name: name,
            description: description,
            type: type ? type : getTypeFromValue(value),
            path: path,
            resolution: resolution,
            period: period,
            conflation: conflation,
        };
        if (_definition.type === metric_types_1.default.OBJECT) {
            _definition.Composite = Object.keys(value).reduce(function (arr, key) {
                var val = value[key];
                arr.push(getMetricDefinition(key, val, path));
                return arr;
            }, []);
        }
        return _definition;
    }
    function serializeValue(value, _metric) {
        if (value && value.constructor === Date) {
            return {
                value: {
                    type: _valueTypes.indexOf("date"),
                    value: value.valueOf(),
                    isArray: false,
                },
            };
        }
        if (typeof value === "object") {
            return {
                CompositeValue: Object.keys(value).reduce(function (arr, key) {
                    var val = serializeValue(value[key]);
                    val.InnerMetricName = key;
                    arr.push(val);
                    return arr;
                }, []),
            };
        }
        var valueType = _metric ? _metric.getValueType() : undefined;
        valueType = valueType || _valueTypes.indexOf(typeof value);
        return {
            value: {
                type: valueType,
                value: value,
                isArray: false,
            },
        };
    }
    function getTypeFromValue(value) {
        var typeAsString = value.constructor === Date ? "timestamp" : typeof value;
        switch (typeAsString) {
            case "string":
                return metric_types_1.default.STRING;
            case "number":
                return metric_types_1.default.NUMBER;
            case "timestamp":
                return metric_types_1.default.TIMESTAMP;
            case "object":
                return metric_types_1.default.OBJECT;
        }
        return 0;
    }
    var _valueTypes = [
        "boolean",
        "int",
        "number",
        "long",
        "string",
        "date",
        "object",
    ];
    return {
        id: metric.id,
        instance: metric.repo.instance,
        definition: definition,
        value: serializeValue(metric.value, metric),
    };
}
exports.default = metricToMessage;
//# sourceMappingURL=serializer.js.map

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = __webpack_require__(89);
function default_1(connection, config) {
    if (!connection || typeof connection !== "object") {
        throw new Error("Connection is required parameter");
    }
    var joinPromise;
    var session;
    var init = function (repo) {
        var resolveReadyPromise;
        joinPromise = new Promise(function (resolve) {
            resolveReadyPromise = resolve;
        });
        session = connection.domain("metrics", config.logger);
        session.onJoined(function (reconnect) {
            if (!reconnect) {
                resolveReadyPromise();
                resolveReadyPromise = undefined;
            }
            var rootStateMetric = {
                name: "/State",
                type: "object",
                composite: {
                    Description: {
                        type: "string",
                        description: "",
                    },
                    Value: {
                        type: "number",
                        description: "",
                    },
                },
                description: "System state",
                context: {},
            };
            var defineRootMetricsMsg = {
                type: "define",
                metrics: [rootStateMetric],
            };
            session.send(defineRootMetricsMsg);
            if (reconnect) {
                replayRepo(repo);
            }
        });
        session.join(config.identity);
    };
    var replayRepo = function (repo) {
        replaySystem(repo.root);
    };
    var replaySystem = function (system) {
        createSystem(system);
        system.metrics.forEach(function (m) {
            createMetric(m);
        });
        system.subSystems.forEach(function (ss) {
            replaySystem(ss);
        });
    };
    var createSystem = function (system) {
        if (system.parent === undefined) {
            return;
        }
        joinPromise.then(function () {
            var metric = {
                name: serializer_1.normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                type: "object",
                composite: {
                    Description: {
                        type: "string",
                        description: "",
                    },
                    Value: {
                        type: "number",
                        description: "",
                    },
                },
                description: "System state",
                context: {},
            };
            var createMetricsMsg = {
                type: "define",
                metrics: [metric],
            };
            session.send(createMetricsMsg);
        });
    };
    var updateSystem = function (system, state) {
        joinPromise.then(function () {
            var shadowedUpdateMetric = {
                type: "publish",
                values: [{
                        name: serializer_1.normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                        value: {
                            Description: state.description,
                            Value: state.state,
                        },
                        timestamp: Date.now(),
                    }],
            };
            session.send(shadowedUpdateMetric);
            var stateObj = serializer_1.composeMsgForRootStateMetric(system);
            var rootMetric = {
                type: "publish",
                peer_id: connection.peerId,
                values: [{
                        name: "/State",
                        value: {
                            Description: stateObj.description,
                            Value: stateObj.value,
                        },
                        timestamp: Date.now(),
                    }],
            };
            session.send(rootMetric);
        });
    };
    var createMetric = function (metric) {
        joinPromise.then(function () {
            var m = serializer_1.serializeMetric(metric);
            var createMetricsMsg = {
                type: "define",
                metrics: [m],
            };
            session.send(createMetricsMsg);
            if (typeof metric.value !== "undefined") {
                updateMetric(metric);
            }
        });
    };
    var updateMetric = function (metric) {
        joinPromise.then(function () {
            var value = serializer_1.getMetricValueByType(metric);
            var publishMetricsMsg = {
                type: "publish",
                values: [{
                        name: serializer_1.normalizeMetricName(metric.path.join("/") + "/" + metric.name),
                        value: value,
                        timestamp: Date.now(),
                    }],
            };
            session.send(publishMetricsMsg);
        });
    };
    return {
        init: init,
        createSystem: createSystem,
        updateSystem: updateSystem,
        createMetric: createMetric,
        updateMetric: updateMetric,
    };
}
exports.default = default_1;
//# sourceMappingURL=gw3.js.map

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metric_types_1 = __webpack_require__(0);
function getMetricTypeByValue(metric) {
    if ((metric.value && metric.value.constructor === Date) || metric.type === metric_types_1.default.TIMESPAN || metric.type === metric_types_1.default.TIMESTAMP) {
        return "timestamp";
    }
    else if (typeof metric.value === "number") {
        return "number";
    }
    else if (typeof metric.value === "string" || metric.type === metric_types_1.default.STRING || metric.type === metric_types_1.default.RATE) {
        return "string";
    }
    else if (typeof metric.value === "object") {
        return "object";
    }
}
function getTypeByValue(value) {
    if (value.constructor === Date) {
        return "timestamp";
    }
    else if (typeof value === "number") {
        return "number";
    }
    else if (typeof value === "string") {
        return "string";
    }
    else if (typeof value === "object") {
        return "object";
    }
    else {
        return "string";
    }
}
function serializeMetric(metric) {
    var serializedMetrics = {};
    var type = getMetricTypeByValue(metric);
    if (type === "object") {
        var values = Object.keys(metric.value).reduce(function (memo, key) {
            var innerType = getTypeByValue(metric.value[key]);
            if (innerType === "object") {
                var composite = defineNestedComposite(metric.value[key]);
                memo[key] = {
                    type: "object",
                    description: "",
                    context: {},
                    composite: composite,
                };
            }
            else {
                memo[key] = {
                    type: innerType,
                    description: "",
                    context: {},
                };
            }
            return memo;
        }, {});
        serializedMetrics.composite = values;
    }
    serializedMetrics.name = normalizeMetricName(metric.path.join("/") + "/" + metric.name);
    serializedMetrics.type = type;
    serializedMetrics.description = metric.description;
    serializedMetrics.context = {};
    return serializedMetrics;
}
exports.serializeMetric = serializeMetric;
function defineNestedComposite(values) {
    return Object.keys(values).reduce(function (memo, key) {
        var type = getTypeByValue(values[key]);
        if (type === "object") {
            memo[key] = {
                type: "object",
                description: "",
                context: {},
                composite: defineNestedComposite(values[key]),
            };
        }
        else {
            memo[key] = {
                type: type,
                description: "",
                context: {},
            };
        }
        return memo;
    }, {});
}
function normalizeMetricName(name) {
    if (typeof name !== "undefined" && name.length > 0 && name[0] !== "/") {
        return "/" + name;
    }
    else {
        return name;
    }
}
exports.normalizeMetricName = normalizeMetricName;
function getMetricValueByType(metric) {
    var type = getMetricTypeByValue(metric);
    if (type === "timestamp") {
        return Date.now();
    }
    else {
        return publishNestedComposite(metric.value);
    }
}
exports.getMetricValueByType = getMetricValueByType;
function publishNestedComposite(values) {
    if (typeof values !== "object") {
        return values;
    }
    return Object.keys(values).reduce(function (memo, key) {
        var value = values[key];
        if (typeof value === "object" && value.constructor !== Date) {
            memo[key] = publishNestedComposite(value);
        }
        else if (value.constructor === Date) {
            memo[key] = new Date(value).getTime();
        }
        else if (value.constructor === Boolean) {
            memo[key] = value.toString();
        }
        else {
            memo[key] = value;
        }
        return memo;
    }, {});
}
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function getHighestState(arr) {
    return arr.sort(function (a, b) {
        return b.state - a.state;
    })[0];
}
function aggregateDescription(arr) {
    var msg = "";
    arr.forEach(function (m, idx, a) {
        var path = m.path.join(".");
        if (idx === a.length - 1) {
            msg += path + "." + m.name + ": " + m.description;
        }
        else {
            msg += path + "." + m.name + ": " + m.description + ",";
        }
    });
    if (msg.length > 100) {
        return msg.slice(0, 100) + "...";
    }
    else {
        return msg;
    }
}
function composeMsgForRootStateMetric(system) {
    var aggregatedState = system.root.getAggregateState();
    var merged = flatten(aggregatedState);
    var highestState = getHighestState(merged);
    var aggregateDesc = aggregateDescription(merged);
    return {
        description: aggregateDesc,
        value: highestState.state,
    };
}
exports.composeMsgForRootStateMetric = composeMsgForRootStateMetric;
//# sourceMappingURL=serializer.js.map

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gw3_1 = __webpack_require__(88);
var gw1_1 = __webpack_require__(86);
var repository_1 = __webpack_require__(91);
exports.default = (function (settings) {
    var options = {
        connection: settings.connection,
        identity: settings.identity,
        logger: settings.logger,
        heartbeatInterval: settings.heartbeatInterval,
        settings: {},
        clickStream: settings.clickStream,
    };
    if (!options.connection || typeof options.connection !== "object") {
        throw new Error("Connection is required parameter");
    }
    var _protocol;
    if (options.connection.protocolVersion === 3) {
        _protocol = gw3_1.default(options.connection, settings);
    }
    else {
        _protocol = gw1_1.default(options.connection, settings);
    }
    var repo = repository_1.default(options, _protocol);
    var rootSystem = repo.root;
    return rootSystem;
});
//# sourceMappingURL=main.js.map

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var system_1 = __webpack_require__(92);
function repository(options, protocol) {
    if (!options.identity) {
        throw new Error("Identity missing from metrics configuration");
    }
    if (!options.identity.service || typeof options.identity.service !== "string") {
        throw new Error("Service missing or invalid in metrics identity configuration");
    }
    if (!options.identity.system || typeof options.identity.system !== "string") {
        throw new Error("System missing or invalid in metrics identity configuration");
    }
    if (!options.identity.instance || typeof options.identity.instance !== "string") {
        throw new Error("Instance missing or invalid in metrics identity configuration");
    }
    var identity = options.identity;
    var instance = options.identity.system + "/" + options.identity.service + "/" + options.identity.instance;
    function _initSystemMetrics(rootSystem, useClickStream) {
        if (typeof navigator !== "undefined") {
            rootSystem.stringMetric("UserAgent", navigator.userAgent);
        }
        if (useClickStream && typeof document !== "undefined") {
            var clickStream_1 = rootSystem.subSystem("ClickStream");
            var documentClickHandler = function (e) {
                if (!e.target) {
                    return;
                }
                var target = e.target;
                clickStream_1.objectMetric("LastBrowserEvent", {
                    type: "click",
                    timestamp: new Date(),
                    target: {
                        className: e.target ? target.className : "",
                        id: target.id,
                        type: "<" + target.tagName.toLowerCase() + ">",
                        href: target.href || "",
                    },
                });
            };
            clickStream_1.objectMetric("Page", {
                title: document.title,
                page: window.location.href,
            });
            if (document.addEventListener) {
                document.addEventListener("click", documentClickHandler);
            }
            else {
                document.attachEvent("onclick", documentClickHandler);
            }
        }
        var startTime = rootSystem.stringMetric("StartTime", (new Date()).toString());
        var urlMetric = rootSystem.stringMetric("StartURL", "");
        var appNameMetric = rootSystem.stringMetric("AppName", "");
        if (typeof window !== "undefined") {
            if (typeof window.location !== "undefined") {
                var startUrl = window.location.href;
                urlMetric.update(startUrl);
            }
            if (typeof window.glue42gd !== "undefined") {
                appNameMetric.update(window.glue42gd.appName);
            }
        }
    }
    var me = {
        identity: identity,
        instance: instance,
        get root() {
            return _root;
        },
    };
    protocol.init(me);
    var _root = system_1.default("", me, protocol);
    _initSystemMetrics(_root, options.clickStream || options.clickStream === undefined);
    return me;
}
exports.default = repository;
//# sourceMappingURL=repository.js.map

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var address_1 = __webpack_require__(77);
var count_1 = __webpack_require__(78);
var number_1 = __webpack_require__(79);
var object_1 = __webpack_require__(80);
var rate_1 = __webpack_require__(81);
var statistics_1 = __webpack_require__(82);
var string_1 = __webpack_require__(83);
var timespan_1 = __webpack_require__(84);
var timestamp_1 = __webpack_require__(85);
var metric_types_1 = __webpack_require__(0);
function system(name, repo, protocol, parent, description) {
    if (!repo) {
        throw new Error("Repository is required");
    }
    if (!protocol) {
        throw new Error("Transport is required");
    }
    var _transport = protocol;
    var _name = name;
    var _description = description || "";
    var _repo = repo;
    var _parent = parent;
    var _path = _buildPath(parent);
    var _state = {};
    var id = _arrayToString(_path, "/") + name;
    var identity = repo.identity;
    var root = repo.root;
    var _subSystems = [];
    var _metrics = [];
    function subSystem(nameSystem, descriptionSystem) {
        if (!nameSystem || nameSystem.length === 0) {
            throw new Error("name is required");
        }
        var match = _subSystems.filter(function (s) { return s.name === nameSystem; });
        if (match.length > 0) {
            return match[0];
        }
        var _system = system(nameSystem, _repo, _transport, me, descriptionSystem);
        _subSystems.push(_system);
        return _system;
    }
    function setState(state, stateDescription) {
        _state = { state: state, description: stateDescription };
        _transport.updateSystem(me, _state);
    }
    function stringMetric(definition, value) {
        return _getOrCreateMetric.call(me, definition, metric_types_1.default.STRING, value, function (metricDef) { return string_1.default(metricDef, me, _transport, value); });
    }
    function numberMetric(definition, value) {
        return _getOrCreateMetric.call(me, definition, metric_types_1.default.NUMBER, value, function (metricDef) { return number_1.default(metricDef, me, _transport, value); });
    }
    function countMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.COUNT, value, function (metricDef) { return count_1.default(metricDef, me, _transport, value); });
    }
    function addressMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.ADDRESS, value, function (metricDef) { return address_1.default(metricDef, me, _transport, value); });
    }
    function objectMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.OBJECT, value, function (metricDef) { return object_1.default(metricDef, me, _transport, value); });
    }
    function timespanMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.TIMESPAN, value, function (metricDef) { return timespan_1.default(metricDef, me, _transport, value); });
    }
    function timestampMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.TIMESTAMP, value, function (metricDef) { return timestamp_1.default(metricDef, me, _transport, value); });
    }
    function rateMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.RATE, value, function (metricDef) { return rate_1.default(metricDef, me, _transport, value); });
    }
    function statisticsMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.STATISTICS, value, function (metricDef) { return statistics_1.default(metricDef, me, _transport, value); });
    }
    function _unionToMetricDef(def) {
        var metricDefinition = {};
        if (typeof def === "string") {
            metricDefinition.name = def;
        }
        else {
            metricDefinition = def;
        }
        if (metricDefinition.name === undefined) {
            throw new Error("Metric name is required");
        }
        return metricDefinition;
    }
    function _getOrCreateMetric(definition, expectedType, value, createMetric) {
        var metricDefinition = _unionToMetricDef(definition);
        var matching = _metrics.filter(function (shadowedMetric) { return shadowedMetric.name === metricDefinition.name; });
        if (matching.length > 0) {
            var existing = matching[0];
            if (existing.type !== expectedType) {
                throw new Error("A metric named " + metricDefinition.name + " is already defined with different type.");
            }
            if (typeof value !== "undefined") {
                existing.update(value);
            }
            return existing;
        }
        var metric = createMetric(metricDefinition);
        _metrics.push(metric);
        return metric;
    }
    function _buildPath(shadowedSystem) {
        if (!shadowedSystem || !shadowedSystem.parent) {
            return [];
        }
        var path = _buildPath(shadowedSystem.parent);
        path.push(shadowedSystem.name);
        return path;
    }
    function _arrayToString(path, separator) {
        return ((path && path.length > 0) ? path.join(separator) : "");
    }
    function getAggregateState() {
        var aggState = [];
        if (Object.keys(_state).length > 0) {
            aggState.push({
                name: _name,
                path: _path,
                state: _state.state,
                description: _state.description,
            });
        }
        _subSystems.forEach(function (shadowedSubSystem) {
            var result = shadowedSubSystem.getAggregateState();
            if (result.length > 0) {
                aggState.push.apply(aggState, result);
            }
        });
        return aggState;
    }
    var me = {
        get name() {
            return _name;
        },
        get description() {
            return _description;
        },
        get repo() {
            return _repo;
        },
        get parent() {
            return _parent;
        },
        path: _path,
        id: id,
        identity: identity,
        root: root,
        get subSystems() {
            return _subSystems;
        },
        get metrics() {
            return _metrics;
        },
        subSystem: subSystem,
        getState: function () {
            return _state;
        },
        setState: setState,
        stringMetric: stringMetric,
        statisticsMetric: statisticsMetric,
        rateMetric: rateMetric,
        timestampMetric: timestampMetric,
        timespanMetric: timespanMetric,
        objectMetric: objectMetric,
        addressMetric: addressMetric,
        countMetric: countMetric,
        numberMetric: numberMetric,
        getAggregateState: getAggregateState,
    };
    _transport.createSystem(me);
    return me;
}
exports.default = system;
//# sourceMappingURL=system.js.map

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    function now() {
        return new Date().getTime();
    }
    var startTime = now();
    var endTime;
    var period;
    function stop() {
        endTime = now();
        period = now() - startTime;
        return period;
    }
    return {
        get startTime() {
            return startTime;
        },
        get endTime() {
            return endTime;
        },
        get period() {
            return period;
        },
        stop: stop
    };
}
exports.default = default_1;
//# sourceMappingURL=timer.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=tick42-glue-core.js.map