(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/chnl/dist/channel.cjs.js
  var require_channel_cjs = __commonJS({
    "node_modules/chnl/dist/channel.cjs.js"(exports, module) {
      "use strict";
      function _typeof(e) {
        return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
          return typeof e2;
        } : function(e2) {
          return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
        })(e);
      }
      function _classCallCheck(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      function _defineProperties(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
        }
      }
      function _createClass(e, t, n) {
        return t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e;
      }
      function _inherits(e, t) {
        if ("function" != typeof t && null !== t)
          throw new TypeError("Super expression must either be null or a function");
        e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: true, configurable: true } }), t && _setPrototypeOf(e, t);
      }
      function _getPrototypeOf(e) {
        return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(e2) {
          return e2.__proto__ || Object.getPrototypeOf(e2);
        })(e);
      }
      function _setPrototypeOf(e, t) {
        return (_setPrototypeOf = Object.setPrototypeOf || function(e2, t2) {
          return e2.__proto__ = t2, e2;
        })(e, t);
      }
      function _isNativeReflectConstruct() {
        if ("undefined" == typeof Reflect || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if ("function" == typeof Proxy)
          return true;
        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
          })), true;
        } catch (e) {
          return false;
        }
      }
      function _assertThisInitialized(e) {
        if (void 0 === e)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e;
      }
      function _possibleConstructorReturn(e, t) {
        return !t || "object" != typeof t && "function" != typeof t ? _assertThisInitialized(e) : t;
      }
      function _createSuper(r) {
        var i = _isNativeReflectConstruct();
        return function() {
          var e, t = _getPrototypeOf(r);
          if (i) {
            var n = _getPrototypeOf(this).constructor;
            e = Reflect.construct(t, arguments, n);
          } else
            e = t.apply(this, arguments);
          return _possibleConstructorReturn(this, e);
        };
      }
      function _toConsumableArray(e) {
        return _arrayWithoutHoles(e) || _iterableToArray(e) || _unsupportedIterableToArray(e) || _nonIterableSpread();
      }
      function _arrayWithoutHoles(e) {
        if (Array.isArray(e))
          return _arrayLikeToArray(e);
      }
      function _iterableToArray(e) {
        if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
          return Array.from(e);
      }
      function _unsupportedIterableToArray(e, t) {
        if (e) {
          if ("string" == typeof e)
            return _arrayLikeToArray(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _arrayLikeToArray(e, t) : void 0;
        }
      }
      function _arrayLikeToArray(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++)
          r[n] = e[n];
        return r;
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var Channel = function() {
        function c(e) {
          _classCallCheck(this, c), this._listeners = [], this._mute = false, this._accumulate = false, this._accumulatedEvents = [], this._name = e || "", this._onListenerAdded = null, this._onFirstListenerAdded = null, this._onListenerRemoved = null, this._onLastListenerRemoved = null;
        }
        return _createClass(c, [{ key: "addListener", value: function(e, t) {
          this._pushListener(e, t, false);
        } }, { key: "addOnceListener", value: function(e, t) {
          this._pushListener(e, t, true);
        } }, { key: "removeListener", value: function(e, t) {
          this._ensureListener(e);
          var n = this._indexOfListener(e, t);
          0 <= n && this._spliceListener(n);
        } }, { key: "removeAllListeners", value: function() {
          for (; this.hasListeners(); )
            this._spliceListener(0);
        } }, { key: "hasListener", value: function(e, t) {
          return this._ensureListener(e), 0 <= this._indexOfListener(e, t);
        } }, { key: "hasListeners", value: function() {
          return 0 < this._listeners.length;
        } }, { key: "dispatch", value: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n];
          this._invokeListeners({ args: t, async: false });
        } }, { key: "dispatchAsync", value: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n];
          this._invokeListeners({ args: t, async: true });
        } }, { key: "mute", value: function(e) {
          var t = 0 < arguments.length && void 0 !== e ? e : {};
          this._mute = true, t.accumulate ? this._accumulate = true : (this._accumulate = false, this._accumulatedEvents = []);
        } }, { key: "unmute", value: function() {
          this._mute = false, this._accumulate && (this._dispatchAccumulated(), this._accumulate = false);
        } }, { key: "_invokeListeners", value: function(e) {
          var t = this, n = 0 < arguments.length && void 0 !== e ? e : { args: [], async: false };
          this._mute ? this._accumulate && this._accumulatedEvents.push(n) : this._listeners.slice().forEach(function(e2) {
            t._invokeListener(e2, n), e2.once && t.removeListener(e2.callback, e2.context);
          });
        } }, { key: "_invokeListener", value: function(e, t) {
          var n, r, i = e.callback instanceof c;
          t.async ? i ? (n = e.callback).dispatchAsync.apply(n, _toConsumableArray(t.args)) : setTimeout(function() {
            return e.callback.apply(e.context, t.args);
          }, 0) : i ? (r = e.callback).dispatch.apply(r, _toConsumableArray(t.args)) : e.callback.apply(e.context, t.args);
        } }, { key: "_ensureListener", value: function(e) {
          if (!c.isValidListener(e))
            throw new Error("Channel " + this._name + ": listener is not a function and not a Channel");
        } }, { key: "_dispatchInnerAddEvents", value: function() {
          var e, t;
          this._onListenerAdded && (e = this._onListenerAdded).dispatch.apply(e, arguments);
          this._onFirstListenerAdded && 1 === this._listeners.length && (t = this._onFirstListenerAdded).dispatch.apply(t, arguments);
        } }, { key: "_dispatchInnerRemoveEvents", value: function() {
          var e, t;
          this._onListenerRemoved && (e = this._onListenerRemoved).dispatch.apply(e, arguments);
          this._onLastListenerRemoved && 0 === this._listeners.length && (t = this._onLastListenerRemoved).dispatch.apply(t, arguments);
        } }, { key: "_indexOfListener", value: function(e, t) {
          for (var n = 0; n < this._listeners.length; n++) {
            var r = this._listeners[n], i = r.callback === e, s = e instanceof c, o = void 0 === t && void 0 === r.context, a = t === r.context;
            if (i && (s || o || a))
              return n;
          }
        } }, { key: "_dispatchAccumulated", value: function() {
          var t = this;
          this._accumulatedEvents.forEach(function(e) {
            return t._invokeListeners(e);
          }), this._accumulatedEvents = [];
        } }, { key: "_pushListener", value: function(e, t, n) {
          this._ensureListener(e), this._checkForDuplicates(e, t), this._listeners.push({ callback: e, context: t, once: n }), this._dispatchInnerAddEvents(e, t, n);
        } }, { key: "_checkForDuplicates", value: function(e, t) {
          if (this.hasListener(e, t))
            throw new Error("Channel " + this._name + ": duplicating listeners");
        } }, { key: "_spliceListener", value: function(e) {
          var t = this._listeners[e], n = t.callback, r = t.context, i = t.once;
          this._listeners.splice(e, 1), this._dispatchInnerRemoveEvents(n, r, i);
        } }, { key: "onListenerAdded", get: function() {
          return this._onListenerAdded || (this._onListenerAdded = new c("".concat(this._name, ":onListenerAdded"))), this._onListenerAdded;
        } }, { key: "onFirstListenerAdded", get: function() {
          return this._onFirstListenerAdded || (this._onFirstListenerAdded = new c("".concat(this._name, ":onFirstListenerAdded"))), this._onFirstListenerAdded;
        } }, { key: "onListenerRemoved", get: function() {
          return this._onListenerRemoved || (this._onListenerRemoved = new c("".concat(this._name, ":onListenerRemoved"))), this._onListenerRemoved;
        } }, { key: "onLastListenerRemoved", get: function() {
          return this._onLastListenerRemoved || (this._onLastListenerRemoved = new c("".concat(this._name, ":onLastListenerRemoved"))), this._onLastListenerRemoved;
        } }], [{ key: "isValidListener", value: function(e) {
          return "function" == typeof e || e instanceof c;
        } }]), c;
      }();
      var EventEmitter = function() {
        function e() {
          _classCallCheck(this, e), this._channels = /* @__PURE__ */ new Map();
        }
        return _createClass(e, [{ key: "addListener", value: function(e2, t, n) {
          this._getChannel(e2).addListener(t, n);
        } }, { key: "on", value: function(e2, t, n) {
          this.addListener(e2, t, n);
        } }, { key: "addOnceListener", value: function(e2, t, n) {
          this._getChannel(e2).addOnceListener(t, n);
        } }, { key: "once", value: function(e2, t, n) {
          this.addOnceListener(e2, t, n);
        } }, { key: "removeListener", value: function(e2, t, n) {
          this._getChannel(e2).removeListener(t, n);
        } }, { key: "off", value: function(e2, t, n) {
          this.removeListener(e2, t, n);
        } }, { key: "hasListener", value: function(e2, t, n) {
          return this._getChannel(e2).hasListener(t, n);
        } }, { key: "has", value: function(e2, t, n) {
          return this.hasListener(e2, t, n);
        } }, { key: "hasListeners", value: function(e2) {
          return this._getChannel(e2).hasListeners();
        } }, { key: "dispatch", value: function(e2) {
          for (var t, n = arguments.length, r = new Array(1 < n ? n - 1 : 0), i = 1; i < n; i++)
            r[i - 1] = arguments[i];
          (t = this._getChannel(e2)).dispatch.apply(t, r);
        } }, { key: "emit", value: function(e2) {
          for (var t = arguments.length, n = new Array(1 < t ? t - 1 : 0), r = 1; r < t; r++)
            n[r - 1] = arguments[r];
          this.dispatch.apply(this, [e2].concat(n));
        } }, { key: "_getChannel", value: function(e2) {
          return this._channels.has(e2) || this._channels.set(e2, new Channel(e2)), this._channels.get(e2);
        } }]), e;
      }();
      var SubscriptionItem = function() {
        function t(e) {
          _classCallCheck(this, t), this._params = e, this._isOn = false, this._assertParams();
        }
        return _createClass(t, [{ key: "on", value: function() {
          if (!this._isOn) {
            var e = this._params.channel, t2 = e.addListener || e.addEventListener || e.on;
            this._applyMethod(t2), this._isOn = true;
          }
        } }, { key: "off", value: function() {
          if (this._isOn) {
            var e = this._params.channel, t2 = e.removeListener || e.removeEventListener || e.off;
            this._applyMethod(t2), this._isOn = false;
          }
        } }, { key: "_applyMethod", value: function(e) {
          var t2 = this._params, n = t2.channel, r = t2.event, i = t2.listener, s = r ? [r, i] : [i];
          e.apply(n, s);
        } }, { key: "_assertParams", value: function() {
          var e = this._params, t2 = e.channel, n = e.event, r = e.listener;
          if (!t2 || "object" !== _typeof(t2))
            throw new Error("Channel should be object");
          if (n && "string" != typeof n)
            throw new Error("Event should be string");
          if (!r || !Channel.isValidListener(r))
            throw new Error("Listener should be function or Channel");
        } }]), t;
      }();
      var Subscription = function() {
        function t(e) {
          _classCallCheck(this, t), this._items = e.map(function(e2) {
            return new SubscriptionItem(e2);
          });
        }
        return _createClass(t, [{ key: "on", value: function() {
          return this._items.forEach(function(e) {
            return e.on();
          }), this;
        } }, { key: "off", value: function() {
          return this._items.forEach(function(e) {
            return e.off();
          }), this;
        } }]), t;
      }();
      var ReactSubscription = function() {
        _inherits(i, Subscription);
        var r = _createSuper(i);
        function i(e, t) {
          var n;
          return _classCallCheck(this, i), (n = r.call(this, t))._overrideComponentCallback(e, "componentDidMount", "on"), n._overrideComponentCallback(e, "componentWillUnmount", "off"), n;
        }
        return _createClass(i, [{ key: "_overrideComponentCallback", value: function(r2, e, i2) {
          var s = this, o = r2[e];
          r2[e] = function() {
            if (s[i2](), "function" == typeof o) {
              for (var e2 = arguments.length, t = new Array(e2), n = 0; n < e2; n++)
                t[n] = arguments[n];
              return o.apply(r2, t);
            }
          };
        } }]), i;
      }();
      var chnl = Channel;
      chnl.EventEmitter = EventEmitter, chnl.Subscription = Subscription, chnl.ReactSubscription = ReactSubscription, module.exports = chnl;
    }
  });

  // node_modules/promise-controller/src/defaults.js
  var require_defaults = __commonJS({
    "node_modules/promise-controller/src/defaults.js"(exports, module) {
      module.exports = {
        timeout: 0,
        timeoutReason: "Promise rejected by PromiseController timeout {timeout} ms.",
        resetReason: "Promise rejected by PromiseController reset."
      };
    }
  });

  // node_modules/promise-controller/src/utils.js
  var require_utils = __commonJS({
    "node_modules/promise-controller/src/utils.js"(exports) {
      exports.isPromise = function(p) {
        return p && typeof p.then === "function";
      };
      exports.tryCall = function(value) {
        return typeof value === "function" ? value() : value;
      };
      exports.createErrorType = function(name) {
        function E(message) {
          if (!Error.captureStackTrace) {
            this.stack = new Error().stack;
          } else {
            Error.captureStackTrace(this, this.constructor);
          }
          this.message = message;
        }
        E.prototype = new Error();
        E.prototype.name = name;
        E.prototype.constructor = E;
        return E;
      };
    }
  });

  // node_modules/promise-controller/src/index.js
  var require_src = __commonJS({
    "node_modules/promise-controller/src/index.js"(exports, module) {
      var defaults = require_defaults();
      var { isPromise, createErrorType, tryCall } = require_utils();
      var PromiseController = class {
        /**
         * Creates promise controller. Unlike original Promise, it does not immediately call any function.
         * Instead it has [.call()](#PromiseController+call) method that calls provided function
         * and stores `resolve / reject` methods for future access.
         *
         * @param {Options} [options]
         */
        constructor(options) {
          this._options = Object.assign({}, defaults, options);
          this._resolve = null;
          this._reject = null;
          this._isPending = false;
          this._isFulfilled = false;
          this._isRejected = false;
          this._value = void 0;
          this._promise = null;
          this._timer = null;
        }
        /**
         * Returns promise itself.
         *
         * @returns {Promise}
         */
        get promise() {
          return this._promise;
        }
        /**
         * Returns value with that promise was settled (fulfilled or rejected).
         *
         * @returns {*}
         */
        get value() {
          return this._value;
        }
        /**
         * Returns true if promise is pending.
         *
         * @returns {Boolean}
         */
        get isPending() {
          return this._isPending;
        }
        /**
         * Returns true if promise is fulfilled.
         *
         * @returns {Boolean}
         */
        get isFulfilled() {
          return this._isFulfilled;
        }
        /**
         * Returns true if promise rejected.
         *
         * @returns {Boolean}
         */
        get isRejected() {
          return this._isRejected;
        }
        /**
         * Returns true if promise is fulfilled or rejected.
         *
         * @returns {Boolean}
         */
        get isSettled() {
          return this._isFulfilled || this._isRejected;
        }
        /**
         * Calls `fn` and returns promise OR just returns existing promise from previous `call()` if it is still pending.
         * To fulfill returned promise you should use
         * {@link PromiseController#resolve} / {@link PromiseController#reject} methods.
         * If `fn` itself returns promise, then external promise is attached to it and fulfills together.
         * If no `fn` passed - promiseController is initialized as well.
         *
         * @param {Function} [fn] function to be called.
         * @returns {Promise}
         */
        call(fn) {
          if (!this._isPending) {
            this.reset();
            this._createPromise();
            this._createTimer();
            this._callFn(fn);
          }
          return this._promise;
        }
        /**
         * Resolves pending promise with specified `value`.
         *
         * @param {*} [value]
         */
        resolve(value) {
          if (this._isPending) {
            if (isPromise(value)) {
              this._tryAttachToPromise(value);
            } else {
              this._settle(value);
              this._isFulfilled = true;
              this._resolve(value);
            }
          }
        }
        /**
         * Rejects pending promise with specified `value`.
         *
         * @param {*} [value]
         */
        reject(value) {
          if (this._isPending) {
            this._settle(value);
            this._isRejected = true;
            this._reject(value);
          }
        }
        /**
         * Resets to initial state.
         * If promise is pending it will be rejected with {@link PromiseController.ResetError}.
         */
        reset() {
          if (this._isPending) {
            const message = tryCall(this._options.resetReason);
            const error = new PromiseController.ResetError(message);
            this.reject(error);
          }
          this._promise = null;
          this._isPending = false;
          this._isFulfilled = false;
          this._isRejected = false;
          this._value = void 0;
          this._clearTimer();
        }
        /**
         * Re-assign one or more options.
         *
         * @param {Options} options
         */
        configure(options) {
          Object.assign(this._options, options);
        }
        _createPromise() {
          this._promise = new Promise((resolve, reject) => {
            this._isPending = true;
            this._resolve = resolve;
            this._reject = reject;
          });
        }
        _handleTimeout() {
          const messageTpl = tryCall(this._options.timeoutReason);
          const message = typeof messageTpl === "string" ? messageTpl.replace("{timeout}", this._options.timeout) : "";
          const error = new PromiseController.TimeoutError(message);
          this.reject(error);
        }
        _createTimer() {
          if (this._options.timeout) {
            this._timer = setTimeout(() => this._handleTimeout(), this._options.timeout);
          }
        }
        _clearTimer() {
          if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
          }
        }
        _settle(value) {
          this._isPending = false;
          this._value = value;
          this._clearTimer();
        }
        _callFn(fn) {
          if (typeof fn === "function") {
            try {
              const result = fn();
              this._tryAttachToPromise(result);
            } catch (e) {
              this.reject(e);
            }
          }
        }
        _tryAttachToPromise(p) {
          if (isPromise(p)) {
            p.then((value) => this.resolve(value), (e) => this.reject(e));
          }
        }
      };
      PromiseController.TimeoutError = createErrorType("TimeoutError");
      PromiseController.ResetError = createErrorType("ResetError");
      module.exports = PromiseController;
    }
  });

  // node_modules/promised-map/dist/cjs/index.js
  var require_cjs = __commonJS({
    "node_modules/promised-map/dist/cjs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PromisedMap = void 0;
      var PromisedMap = (
        /** @class */
        function() {
          function PromisedMap2() {
            this.map = /* @__PURE__ */ new Map();
          }
          Object.defineProperty(PromisedMap2.prototype, "size", {
            /**
             * Returns map size.
             */
            get: function() {
              return this.map.size;
            },
            enumerable: false,
            configurable: true
          });
          PromisedMap2.prototype.set = function(key, data) {
            var item = this.createMapItem(data);
            this.map.set(key, item);
            return item.promise;
          };
          PromisedMap2.prototype.get = function(key) {
            var item = this.map.get(key);
            return item && item.data;
          };
          PromisedMap2.prototype.has = function(key) {
            return this.map.has(key);
          };
          PromisedMap2.prototype.delete = function(key) {
            return this.map.delete(key);
          };
          PromisedMap2.prototype.resolve = function(key, value) {
            var item = this.map.get(key);
            if (item) {
              this.delete(key);
              item.resolve(value);
            }
          };
          PromisedMap2.prototype.reject = function(key, reason) {
            var item = this.map.get(key);
            if (item) {
              this.delete(key);
              item.reject(reason);
            }
          };
          PromisedMap2.prototype.resolveAll = function(value) {
            this.map.forEach(function(item) {
              return item.resolve(value);
            });
            this.map.clear();
          };
          PromisedMap2.prototype.rejectAll = function(reason) {
            this.map.forEach(function(item) {
              return item.reject(reason);
            });
            this.map.clear();
          };
          PromisedMap2.prototype.forEach = function(fn) {
            this.map.forEach(function(item, key, map) {
              return fn(item.data, key, map);
            });
          };
          PromisedMap2.prototype.clear = function() {
            return this.map.clear();
          };
          PromisedMap2.prototype.createMapItem = function(data) {
            var item = { data };
            item.promise = new Promise(function(resolve, reject) {
              item.resolve = resolve;
              item.reject = reject;
            });
            return item;
          };
          return PromisedMap2;
        }()
      );
      exports.PromisedMap = PromisedMap;
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var slice = Array.prototype.slice;
      var toStr = Object.prototype.toString;
      var funcType = "[object Function]";
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.call(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          } else {
            return target.apply(
              that,
              args.concat(slice.call(arguments))
            );
          }
        };
        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs.push("$" + i);
        }
        bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      var implementation = require_implementation();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/has/src/index.js
  var require_src2 = __commonJS({
    "node_modules/has/src/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      var undefined2;
      var $SyntaxError = SyntaxError;
      var $Function = Function;
      var $TypeError = TypeError;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = Object.getPrototypeOf || function(x) {
        return x.__proto__;
      };
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": RangeError,
        "%ReferenceError%": ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
      };
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
      var errorProto;
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_src2();
      var $concat = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var $exec = bind.call(Function.call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var GetIntrinsic = require_get_intrinsic();
      var $apply = GetIntrinsic("%Function.prototype.apply%");
      var $call = GetIntrinsic("%Function.prototype.call%");
      var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
      var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
      var $max = GetIntrinsic("%Math.max%");
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = null;
        }
      }
      module.exports = function callBind(originalFunction) {
        var func = $reflectApply(bind, $call, arguments);
        if ($gOPD && $defineProperty) {
          var desc = $gOPD(func, "length");
          if (desc.configurable) {
            $defineProperty(
              func,
              "length",
              { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
            );
          }
        }
        return func;
      };
      var applyBind = function applyBind2() {
        return $reflectApply(bind, $apply, arguments);
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/object-keys/isArguments.js
  var require_isArguments = __commonJS({
    "node_modules/object-keys/isArguments.js"(exports, module) {
      "use strict";
      var toStr = Object.prototype.toString;
      module.exports = function isArguments(value) {
        var str = toStr.call(value);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
        }
        return isArgs;
      };
    }
  });

  // node_modules/object-keys/implementation.js
  var require_implementation2 = __commonJS({
    "node_modules/object-keys/implementation.js"(exports, module) {
      "use strict";
      var keysShim;
      if (!Object.keys) {
        has = Object.prototype.hasOwnProperty;
        toStr = Object.prototype.toString;
        isArgs = require_isArguments();
        isEnumerable = Object.prototype.propertyIsEnumerable;
        hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
        hasProtoEnumBug = isEnumerable.call(function() {
        }, "prototype");
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ];
        equalsConstructorPrototype = function(o) {
          var ctor = o.constructor;
          return ctor && ctor.prototype === o;
        };
        excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        };
        hasAutomationEqualityBug = function() {
          if (typeof window === "undefined") {
            return false;
          }
          for (var k in window) {
            try {
              if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                try {
                  equalsConstructorPrototype(window[k]);
                } catch (e) {
                  return true;
                }
              }
            } catch (e) {
              return true;
            }
          }
          return false;
        }();
        equalsConstructorPrototypeIfNotBuggy = function(o) {
          if (typeof window === "undefined" || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o);
          }
          try {
            return equalsConstructorPrototype(o);
          } catch (e) {
            return false;
          }
        };
        keysShim = function keys(object) {
          var isObject = object !== null && typeof object === "object";
          var isFunction = toStr.call(object) === "[object Function]";
          var isArguments = isArgs(object);
          var isString = isObject && toStr.call(object) === "[object String]";
          var theKeys = [];
          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError("Object.keys called on a non-object");
          }
          var skipProto = hasProtoEnumBug && isFunction;
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (var i = 0; i < object.length; ++i) {
              theKeys.push(String(i));
            }
          }
          if (isArguments && object.length > 0) {
            for (var j = 0; j < object.length; ++j) {
              theKeys.push(String(j));
            }
          } else {
            for (var name in object) {
              if (!(skipProto && name === "prototype") && has.call(object, name)) {
                theKeys.push(String(name));
              }
            }
          }
          if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k]);
              }
            }
          }
          return theKeys;
        };
      }
      var has;
      var toStr;
      var isArgs;
      var isEnumerable;
      var hasDontEnumBug;
      var hasProtoEnumBug;
      var dontEnums;
      var equalsConstructorPrototype;
      var excludedKeys;
      var hasAutomationEqualityBug;
      var equalsConstructorPrototypeIfNotBuggy;
      module.exports = keysShim;
    }
  });

  // node_modules/object-keys/index.js
  var require_object_keys = __commonJS({
    "node_modules/object-keys/index.js"(exports, module) {
      "use strict";
      var slice = Array.prototype.slice;
      var isArgs = require_isArguments();
      var origKeys = Object.keys;
      var keysShim = origKeys ? function keys(o) {
        return origKeys(o);
      } : require_implementation2();
      var originalKeys = Object.keys;
      keysShim.shim = function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = function() {
            var args = Object.keys(arguments);
            return args && args.length === arguments.length;
          }(1, 2);
          if (!keysWorksWithArguments) {
            Object.keys = function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              }
              return originalKeys(object);
            };
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      };
      module.exports = keysShim;
    }
  });

  // node_modules/has-property-descriptors/index.js
  var require_has_property_descriptors = __commonJS({
    "node_modules/has-property-descriptors/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
      var hasPropertyDescriptors = function hasPropertyDescriptors2() {
        if ($defineProperty) {
          try {
            $defineProperty({}, "a", { value: 1 });
            return true;
          } catch (e) {
            return false;
          }
        }
        return false;
      };
      hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
        if (!hasPropertyDescriptors()) {
          return null;
        }
        try {
          return $defineProperty([], "length", { value: 1 }).length !== 1;
        } catch (e) {
          return true;
        }
      };
      module.exports = hasPropertyDescriptors;
    }
  });

  // node_modules/define-properties/index.js
  var require_define_properties = __commonJS({
    "node_modules/define-properties/index.js"(exports, module) {
      "use strict";
      var keys = require_object_keys();
      var hasSymbols = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
      var toStr = Object.prototype.toString;
      var concat = Array.prototype.concat;
      var origDefineProperty = Object.defineProperty;
      var isFunction = function(fn) {
        return typeof fn === "function" && toStr.call(fn) === "[object Function]";
      };
      var hasPropertyDescriptors = require_has_property_descriptors()();
      var supportsDescriptors = origDefineProperty && hasPropertyDescriptors;
      var defineProperty = function(object, name, value, predicate) {
        if (name in object) {
          if (predicate === true) {
            if (object[name] === value) {
              return;
            }
          } else if (!isFunction(predicate) || !predicate()) {
            return;
          }
        }
        if (supportsDescriptors) {
          origDefineProperty(object, name, {
            configurable: true,
            enumerable: false,
            value,
            writable: true
          });
        } else {
          object[name] = value;
        }
      };
      var defineProperties = function(object, map) {
        var predicates = arguments.length > 2 ? arguments[2] : {};
        var props = keys(map);
        if (hasSymbols) {
          props = concat.call(props, Object.getOwnPropertySymbols(map));
        }
        for (var i = 0; i < props.length; i += 1) {
          defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
        }
      };
      defineProperties.supportsDescriptors = !!supportsDescriptors;
      module.exports = defineProperties;
    }
  });

  // node_modules/promise.prototype.finally/requirePromise.js
  var require_requirePromise = __commonJS({
    "node_modules/promise.prototype.finally/requirePromise.js"(exports, module) {
      "use strict";
      module.exports = function requirePromise() {
        if (typeof Promise !== "function") {
          throw new TypeError("`Promise.prototype.finally` requires a global `Promise` be available.");
        }
      };
    }
  });

  // node_modules/is-callable/index.js
  var require_is_callable = __commonJS({
    "node_modules/is-callable/index.js"(exports, module) {
      "use strict";
      var fnToStr = Function.prototype.toString;
      var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
      var badArrayLike;
      var isCallableMarker;
      if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
        try {
          badArrayLike = Object.defineProperty({}, "length", {
            get: function() {
              throw isCallableMarker;
            }
          });
          isCallableMarker = {};
          reflectApply(function() {
            throw 42;
          }, null, badArrayLike);
        } catch (_) {
          if (_ !== isCallableMarker) {
            reflectApply = null;
          }
        }
      } else {
        reflectApply = null;
      }
      var constructorRegex = /^\s*class\b/;
      var isES6ClassFn = function isES6ClassFunction(value) {
        try {
          var fnStr = fnToStr.call(value);
          return constructorRegex.test(fnStr);
        } catch (e) {
          return false;
        }
      };
      var tryFunctionObject = function tryFunctionToStr(value) {
        try {
          if (isES6ClassFn(value)) {
            return false;
          }
          fnToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      };
      var toStr = Object.prototype.toString;
      var objectClass = "[object Object]";
      var fnClass = "[object Function]";
      var genClass = "[object GeneratorFunction]";
      var ddaClass = "[object HTMLAllCollection]";
      var ddaClass2 = "[object HTML document.all class]";
      var ddaClass3 = "[object HTMLCollection]";
      var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
      var isIE68 = !(0 in [,]);
      var isDDA = function isDocumentDotAll() {
        return false;
      };
      if (typeof document === "object") {
        all = document.all;
        if (toStr.call(all) === toStr.call(document.all)) {
          isDDA = function isDocumentDotAll(value) {
            if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
              try {
                var str = toStr.call(value);
                return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
              } catch (e) {
              }
            }
            return false;
          };
        }
      }
      var all;
      module.exports = reflectApply ? function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        try {
          reflectApply(value, null, badArrayLike);
        } catch (e) {
          if (e !== isCallableMarker) {
            return false;
          }
        }
        return !isES6ClassFn(value) && tryFunctionObject(value);
      } : function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        if (isES6ClassFn(value)) {
          return false;
        }
        var strClass = toStr.call(value);
        if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
          return false;
        }
        return tryFunctionObject(value);
      };
    }
  });

  // node_modules/es-abstract/2022/IsCallable.js
  var require_IsCallable = __commonJS({
    "node_modules/es-abstract/2022/IsCallable.js"(exports, module) {
      "use strict";
      module.exports = require_is_callable();
    }
  });

  // node_modules/es-abstract/GetIntrinsic.js
  var require_GetIntrinsic = __commonJS({
    "node_modules/es-abstract/GetIntrinsic.js"(exports, module) {
      "use strict";
      module.exports = require_get_intrinsic();
    }
  });

  // node_modules/es-abstract/helpers/isPropertyDescriptor.js
  var require_isPropertyDescriptor = __commonJS({
    "node_modules/es-abstract/helpers/isPropertyDescriptor.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var has = require_src2();
      var $TypeError = GetIntrinsic("%TypeError%");
      module.exports = function IsPropertyDescriptor(ES, Desc) {
        if (ES.Type(Desc) !== "Object") {
          return false;
        }
        var allowed = {
          "[[Configurable]]": true,
          "[[Enumerable]]": true,
          "[[Get]]": true,
          "[[Set]]": true,
          "[[Value]]": true,
          "[[Writable]]": true
        };
        for (var key in Desc) {
          if (has(Desc, key) && !allowed[key]) {
            return false;
          }
        }
        if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
          throw new $TypeError("Property Descriptors may not be both accessor and data descriptors");
        }
        return true;
      };
    }
  });

  // node_modules/call-bind/callBound.js
  var require_callBound = __commonJS({
    "node_modules/call-bind/callBound.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBind = require_call_bind();
      var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      };
    }
  });

  // node_modules/es-abstract/helpers/IsArray.js
  var require_IsArray = __commonJS({
    "node_modules/es-abstract/helpers/IsArray.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $Array = GetIntrinsic("%Array%");
      var toStr = !$Array.isArray && require_callBound()("Object.prototype.toString");
      module.exports = $Array.isArray || function IsArray(argument) {
        return toStr(argument) === "[object Array]";
      };
    }
  });

  // node_modules/es-abstract/helpers/DefineOwnProperty.js
  var require_DefineOwnProperty = __commonJS({
    "node_modules/es-abstract/helpers/DefineOwnProperty.js"(exports, module) {
      "use strict";
      var hasPropertyDescriptors = require_has_property_descriptors();
      var GetIntrinsic = require_get_intrinsic();
      var $defineProperty = hasPropertyDescriptors() && GetIntrinsic("%Object.defineProperty%", true);
      var hasArrayLengthDefineBug = hasPropertyDescriptors.hasArrayLengthDefineBug();
      var isArray = hasArrayLengthDefineBug && require_IsArray();
      var callBound = require_callBound();
      var $isEnumerable = callBound("Object.prototype.propertyIsEnumerable");
      module.exports = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
        if (!$defineProperty) {
          if (!IsDataDescriptor(desc)) {
            return false;
          }
          if (!desc["[[Configurable]]"] || !desc["[[Writable]]"]) {
            return false;
          }
          if (P in O && $isEnumerable(O, P) !== !!desc["[[Enumerable]]"]) {
            return false;
          }
          var V = desc["[[Value]]"];
          O[P] = V;
          return SameValue(O[P], V);
        }
        if (hasArrayLengthDefineBug && P === "length" && "[[Value]]" in desc && isArray(O) && O.length !== desc["[[Value]]"]) {
          O.length = desc["[[Value]]"];
          return O.length === desc["[[Value]]"];
        }
        $defineProperty(O, P, FromPropertyDescriptor(desc));
        return true;
      };
    }
  });

  // node_modules/es-abstract/helpers/isMatchRecord.js
  var require_isMatchRecord = __commonJS({
    "node_modules/es-abstract/helpers/isMatchRecord.js"(exports, module) {
      "use strict";
      var has = require_src2();
      module.exports = function isMatchRecord(record) {
        return has(record, "[[StartIndex]]") && has(record, "[[EndIndex]]") && record["[[StartIndex]]"] >= 0 && record["[[EndIndex]]"] >= record["[[StartIndex]]"] && String(parseInt(record["[[StartIndex]]"], 10)) === String(record["[[StartIndex]]"]) && String(parseInt(record["[[EndIndex]]"], 10)) === String(record["[[EndIndex]]"]);
      };
    }
  });

  // node_modules/es-abstract/helpers/assertRecord.js
  var require_assertRecord = __commonJS({
    "node_modules/es-abstract/helpers/assertRecord.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $TypeError = GetIntrinsic("%TypeError%");
      var $SyntaxError = GetIntrinsic("%SyntaxError%");
      var has = require_src2();
      var isMatchRecord = require_isMatchRecord();
      var predicates = {
        // https://262.ecma-international.org/6.0/#sec-property-descriptor-specification-type
        "Property Descriptor": function isPropertyDescriptor(Desc) {
          var allowed = {
            "[[Configurable]]": true,
            "[[Enumerable]]": true,
            "[[Get]]": true,
            "[[Set]]": true,
            "[[Value]]": true,
            "[[Writable]]": true
          };
          if (!Desc) {
            return false;
          }
          for (var key in Desc) {
            if (has(Desc, key) && !allowed[key]) {
              return false;
            }
          }
          var isData = has(Desc, "[[Value]]");
          var IsAccessor = has(Desc, "[[Get]]") || has(Desc, "[[Set]]");
          if (isData && IsAccessor) {
            throw new $TypeError("Property Descriptors may not be both accessor and data descriptors");
          }
          return true;
        },
        // https://262.ecma-international.org/13.0/#sec-match-records
        "Match Record": isMatchRecord,
        "Iterator Record": function isIteratorRecord(value) {
          return has(value, "[[Iterator]]") && has(value, "[[NextMethod]]") && has(value, "[[Done]]");
        },
        "PromiseCapability Record": function isPromiseCapabilityRecord(value) {
          return !!value && has(value, "[[Resolve]]") && typeof value["[[Resolve]]"] === "function" && has(value, "[[Reject]]") && typeof value["[[Reject]]"] === "function" && has(value, "[[Promise]]") && value["[[Promise]]"] && typeof value["[[Promise]]"].then === "function";
        },
        "AsyncGeneratorRequest Record": function isAsyncGeneratorRequestRecord(value) {
          return !!value && has(value, "[[Completion]]") && has(value, "[[Capability]]") && predicates["PromiseCapability Record"](value["[[Capability]]"]);
        }
      };
      module.exports = function assertRecord(Type, recordType, argumentName, value) {
        var predicate = predicates[recordType];
        if (typeof predicate !== "function") {
          throw new $SyntaxError("unknown record type: " + recordType);
        }
        if (Type(value) !== "Object" || !predicate(value)) {
          throw new $TypeError(argumentName + " must be a " + recordType);
        }
      };
    }
  });

  // node_modules/es-abstract/helpers/fromPropertyDescriptor.js
  var require_fromPropertyDescriptor = __commonJS({
    "node_modules/es-abstract/helpers/fromPropertyDescriptor.js"(exports, module) {
      "use strict";
      module.exports = function fromPropertyDescriptor(Desc) {
        if (typeof Desc === "undefined") {
          return Desc;
        }
        var obj = {};
        if ("[[Value]]" in Desc) {
          obj.value = Desc["[[Value]]"];
        }
        if ("[[Writable]]" in Desc) {
          obj.writable = !!Desc["[[Writable]]"];
        }
        if ("[[Get]]" in Desc) {
          obj.get = Desc["[[Get]]"];
        }
        if ("[[Set]]" in Desc) {
          obj.set = Desc["[[Set]]"];
        }
        if ("[[Enumerable]]" in Desc) {
          obj.enumerable = !!Desc["[[Enumerable]]"];
        }
        if ("[[Configurable]]" in Desc) {
          obj.configurable = !!Desc["[[Configurable]]"];
        }
        return obj;
      };
    }
  });

  // node_modules/es-abstract/5/Type.js
  var require_Type = __commonJS({
    "node_modules/es-abstract/5/Type.js"(exports, module) {
      "use strict";
      module.exports = function Type(x) {
        if (x === null) {
          return "Null";
        }
        if (typeof x === "undefined") {
          return "Undefined";
        }
        if (typeof x === "function" || typeof x === "object") {
          return "Object";
        }
        if (typeof x === "number") {
          return "Number";
        }
        if (typeof x === "boolean") {
          return "Boolean";
        }
        if (typeof x === "string") {
          return "String";
        }
      };
    }
  });

  // node_modules/es-abstract/2022/Type.js
  var require_Type2 = __commonJS({
    "node_modules/es-abstract/2022/Type.js"(exports, module) {
      "use strict";
      var ES5Type = require_Type();
      module.exports = function Type(x) {
        if (typeof x === "symbol") {
          return "Symbol";
        }
        if (typeof x === "bigint") {
          return "BigInt";
        }
        return ES5Type(x);
      };
    }
  });

  // node_modules/es-abstract/2022/FromPropertyDescriptor.js
  var require_FromPropertyDescriptor = __commonJS({
    "node_modules/es-abstract/2022/FromPropertyDescriptor.js"(exports, module) {
      "use strict";
      var assertRecord = require_assertRecord();
      var fromPropertyDescriptor = require_fromPropertyDescriptor();
      var Type = require_Type2();
      module.exports = function FromPropertyDescriptor(Desc) {
        if (typeof Desc !== "undefined") {
          assertRecord(Type, "Property Descriptor", "Desc", Desc);
        }
        return fromPropertyDescriptor(Desc);
      };
    }
  });

  // node_modules/es-abstract/2022/IsAccessorDescriptor.js
  var require_IsAccessorDescriptor = __commonJS({
    "node_modules/es-abstract/2022/IsAccessorDescriptor.js"(exports, module) {
      "use strict";
      var has = require_src2();
      var Type = require_Type2();
      var assertRecord = require_assertRecord();
      module.exports = function IsAccessorDescriptor(Desc) {
        if (typeof Desc === "undefined") {
          return false;
        }
        assertRecord(Type, "Property Descriptor", "Desc", Desc);
        if (!has(Desc, "[[Get]]") && !has(Desc, "[[Set]]")) {
          return false;
        }
        return true;
      };
    }
  });

  // node_modules/es-abstract/2022/IsDataDescriptor.js
  var require_IsDataDescriptor = __commonJS({
    "node_modules/es-abstract/2022/IsDataDescriptor.js"(exports, module) {
      "use strict";
      var has = require_src2();
      var Type = require_Type2();
      var assertRecord = require_assertRecord();
      module.exports = function IsDataDescriptor(Desc) {
        if (typeof Desc === "undefined") {
          return false;
        }
        assertRecord(Type, "Property Descriptor", "Desc", Desc);
        if (!has(Desc, "[[Value]]") && !has(Desc, "[[Writable]]")) {
          return false;
        }
        return true;
      };
    }
  });

  // node_modules/es-abstract/2022/IsPropertyKey.js
  var require_IsPropertyKey = __commonJS({
    "node_modules/es-abstract/2022/IsPropertyKey.js"(exports, module) {
      "use strict";
      module.exports = function IsPropertyKey(argument) {
        return typeof argument === "string" || typeof argument === "symbol";
      };
    }
  });

  // node_modules/es-abstract/helpers/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/es-abstract/helpers/isNaN.js"(exports, module) {
      "use strict";
      module.exports = Number.isNaN || function isNaN2(a) {
        return a !== a;
      };
    }
  });

  // node_modules/es-abstract/2022/SameValue.js
  var require_SameValue = __commonJS({
    "node_modules/es-abstract/2022/SameValue.js"(exports, module) {
      "use strict";
      var $isNaN = require_isNaN();
      module.exports = function SameValue(x, y) {
        if (x === y) {
          if (x === 0) {
            return 1 / x === 1 / y;
          }
          return true;
        }
        return $isNaN(x) && $isNaN(y);
      };
    }
  });

  // node_modules/es-abstract/2022/ToBoolean.js
  var require_ToBoolean = __commonJS({
    "node_modules/es-abstract/2022/ToBoolean.js"(exports, module) {
      "use strict";
      module.exports = function ToBoolean(value) {
        return !!value;
      };
    }
  });

  // node_modules/es-abstract/2022/ToPropertyDescriptor.js
  var require_ToPropertyDescriptor = __commonJS({
    "node_modules/es-abstract/2022/ToPropertyDescriptor.js"(exports, module) {
      "use strict";
      var has = require_src2();
      var GetIntrinsic = require_get_intrinsic();
      var $TypeError = GetIntrinsic("%TypeError%");
      var Type = require_Type2();
      var ToBoolean = require_ToBoolean();
      var IsCallable = require_IsCallable();
      module.exports = function ToPropertyDescriptor(Obj) {
        if (Type(Obj) !== "Object") {
          throw new $TypeError("ToPropertyDescriptor requires an object");
        }
        var desc = {};
        if (has(Obj, "enumerable")) {
          desc["[[Enumerable]]"] = ToBoolean(Obj.enumerable);
        }
        if (has(Obj, "configurable")) {
          desc["[[Configurable]]"] = ToBoolean(Obj.configurable);
        }
        if (has(Obj, "value")) {
          desc["[[Value]]"] = Obj.value;
        }
        if (has(Obj, "writable")) {
          desc["[[Writable]]"] = ToBoolean(Obj.writable);
        }
        if (has(Obj, "get")) {
          var getter = Obj.get;
          if (typeof getter !== "undefined" && !IsCallable(getter)) {
            throw new $TypeError("getter must be a function");
          }
          desc["[[Get]]"] = getter;
        }
        if (has(Obj, "set")) {
          var setter = Obj.set;
          if (typeof setter !== "undefined" && !IsCallable(setter)) {
            throw new $TypeError("setter must be a function");
          }
          desc["[[Set]]"] = setter;
        }
        if ((has(desc, "[[Get]]") || has(desc, "[[Set]]")) && (has(desc, "[[Value]]") || has(desc, "[[Writable]]"))) {
          throw new $TypeError("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute");
        }
        return desc;
      };
    }
  });

  // node_modules/es-abstract/2022/DefinePropertyOrThrow.js
  var require_DefinePropertyOrThrow = __commonJS({
    "node_modules/es-abstract/2022/DefinePropertyOrThrow.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $TypeError = GetIntrinsic("%TypeError%");
      var isPropertyDescriptor = require_isPropertyDescriptor();
      var DefineOwnProperty = require_DefineOwnProperty();
      var FromPropertyDescriptor = require_FromPropertyDescriptor();
      var IsAccessorDescriptor = require_IsAccessorDescriptor();
      var IsDataDescriptor = require_IsDataDescriptor();
      var IsPropertyKey = require_IsPropertyKey();
      var SameValue = require_SameValue();
      var ToPropertyDescriptor = require_ToPropertyDescriptor();
      var Type = require_Type2();
      module.exports = function DefinePropertyOrThrow(O, P, desc) {
        if (Type(O) !== "Object") {
          throw new $TypeError("Assertion failed: Type(O) is not Object");
        }
        if (!IsPropertyKey(P)) {
          throw new $TypeError("Assertion failed: IsPropertyKey(P) is not true");
        }
        var Desc = isPropertyDescriptor({
          Type,
          IsDataDescriptor,
          IsAccessorDescriptor
        }, desc) ? desc : ToPropertyDescriptor(desc);
        if (!isPropertyDescriptor({
          Type,
          IsDataDescriptor,
          IsAccessorDescriptor
        }, Desc)) {
          throw new $TypeError("Assertion failed: Desc is not a valid Property Descriptor");
        }
        return DefineOwnProperty(
          IsDataDescriptor,
          SameValue,
          FromPropertyDescriptor,
          O,
          P,
          Desc
        );
      };
    }
  });

  // node_modules/es-abstract/2022/IsConstructor.js
  var require_IsConstructor = __commonJS({
    "node_modules/es-abstract/2022/IsConstructor.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_GetIntrinsic();
      var $construct = GetIntrinsic("%Reflect.construct%", true);
      var DefinePropertyOrThrow = require_DefinePropertyOrThrow();
      try {
        DefinePropertyOrThrow({}, "", { "[[Get]]": function() {
        } });
      } catch (e) {
        DefinePropertyOrThrow = null;
      }
      if (DefinePropertyOrThrow && $construct) {
        isConstructorMarker = {};
        badArrayLike = {};
        DefinePropertyOrThrow(badArrayLike, "length", {
          "[[Get]]": function() {
            throw isConstructorMarker;
          },
          "[[Enumerable]]": true
        });
        module.exports = function IsConstructor(argument) {
          try {
            $construct(argument, badArrayLike);
          } catch (err) {
            return err === isConstructorMarker;
          }
        };
      } else {
        module.exports = function IsConstructor(argument) {
          return typeof argument === "function" && !!argument.prototype;
        };
      }
      var isConstructorMarker;
      var badArrayLike;
    }
  });

  // node_modules/es-abstract/2022/SpeciesConstructor.js
  var require_SpeciesConstructor = __commonJS({
    "node_modules/es-abstract/2022/SpeciesConstructor.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $species = GetIntrinsic("%Symbol.species%", true);
      var $TypeError = GetIntrinsic("%TypeError%");
      var IsConstructor = require_IsConstructor();
      var Type = require_Type2();
      module.exports = function SpeciesConstructor(O, defaultConstructor) {
        if (Type(O) !== "Object") {
          throw new $TypeError("Assertion failed: Type(O) is not Object");
        }
        var C = O.constructor;
        if (typeof C === "undefined") {
          return defaultConstructor;
        }
        if (Type(C) !== "Object") {
          throw new $TypeError("O.constructor is not an Object");
        }
        var S = $species ? C[$species] : void 0;
        if (S == null) {
          return defaultConstructor;
        }
        if (IsConstructor(S)) {
          return S;
        }
        throw new $TypeError("no constructor found");
      };
    }
  });

  // node_modules/promise.prototype.finally/implementation.js
  var require_implementation3 = __commonJS({
    "node_modules/promise.prototype.finally/implementation.js"(exports, module) {
      "use strict";
      var requirePromise = require_requirePromise();
      requirePromise();
      var IsCallable = require_IsCallable();
      var SpeciesConstructor = require_SpeciesConstructor();
      var Type = require_Type2();
      var promiseResolve = function PromiseResolve(C, value) {
        return new C(function(resolve) {
          resolve(value);
        });
      };
      var OriginalPromise = Promise;
      var createThenFinally = function CreateThenFinally(C, onFinally) {
        return function(value) {
          var result = onFinally();
          var promise = promiseResolve(C, result);
          var valueThunk = function() {
            return value;
          };
          return promise.then(valueThunk);
        };
      };
      var createCatchFinally = function CreateCatchFinally(C, onFinally) {
        return function(reason) {
          var result = onFinally();
          var promise = promiseResolve(C, result);
          var thrower = function() {
            throw reason;
          };
          return promise.then(thrower);
        };
      };
      var promiseFinally = function finally_(onFinally) {
        var promise = this;
        if (Type(promise) !== "Object") {
          throw new TypeError("receiver is not an Object");
        }
        var C = SpeciesConstructor(promise, OriginalPromise);
        var thenFinally = onFinally;
        var catchFinally = onFinally;
        if (IsCallable(onFinally)) {
          thenFinally = createThenFinally(C, onFinally);
          catchFinally = createCatchFinally(C, onFinally);
        }
        return promise.then(thenFinally, catchFinally);
      };
      if (Object.getOwnPropertyDescriptor) {
        descriptor = Object.getOwnPropertyDescriptor(promiseFinally, "name");
        if (descriptor && descriptor.configurable) {
          Object.defineProperty(promiseFinally, "name", { configurable: true, value: "finally" });
        }
      }
      var descriptor;
      module.exports = promiseFinally;
    }
  });

  // node_modules/promise.prototype.finally/polyfill.js
  var require_polyfill = __commonJS({
    "node_modules/promise.prototype.finally/polyfill.js"(exports, module) {
      "use strict";
      var requirePromise = require_requirePromise();
      var implementation = require_implementation3();
      module.exports = function getPolyfill() {
        requirePromise();
        return typeof Promise.prototype["finally"] === "function" ? Promise.prototype["finally"] : implementation;
      };
    }
  });

  // node_modules/promise.prototype.finally/shim.js
  var require_shim = __commonJS({
    "node_modules/promise.prototype.finally/shim.js"(exports, module) {
      "use strict";
      var requirePromise = require_requirePromise();
      var getPolyfill = require_polyfill();
      var define = require_define_properties();
      module.exports = function shimPromiseFinally() {
        requirePromise();
        var polyfill = getPolyfill();
        define(Promise.prototype, { "finally": polyfill }, {
          "finally": function testFinally() {
            return Promise.prototype["finally"] !== polyfill;
          }
        });
        return polyfill;
      };
    }
  });

  // node_modules/promise.prototype.finally/index.js
  var require_promise_prototype = __commonJS({
    "node_modules/promise.prototype.finally/index.js"(exports, module) {
      "use strict";
      var callBind = require_call_bind();
      var define = require_define_properties();
      var implementation = require_implementation3();
      var getPolyfill = require_polyfill();
      var shim = require_shim();
      var bound = callBind(getPolyfill());
      define(bound, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = bound;
    }
  });

  // node_modules/websocket-as-promised/src/requests.js
  var require_requests = __commonJS({
    "node_modules/websocket-as-promised/src/requests.js"(exports, module) {
      var PromiseController = require_src();
      var promiseFinally = require_promise_prototype();
      module.exports = class Requests {
        constructor() {
          this._items = /* @__PURE__ */ new Map();
        }
        /**
         * Creates new request and stores it in the list.
         *
         * @param {String|Number} requestId
         * @param {Function} fn
         * @param {Number} timeout
         * @returns {Promise}
         */
        create(requestId, fn, timeout) {
          this._rejectExistingRequest(requestId);
          return this._createNewRequest(requestId, fn, timeout);
        }
        resolve(requestId, data) {
          if (requestId && this._items.has(requestId)) {
            this._items.get(requestId).resolve(data);
          }
        }
        rejectAll(error) {
          this._items.forEach((request) => request.isPending ? request.reject(error) : null);
        }
        _rejectExistingRequest(requestId) {
          const existingRequest = this._items.get(requestId);
          if (existingRequest && existingRequest.isPending) {
            existingRequest.reject(new Error(`WebSocket request is replaced, id: ${requestId}`));
          }
        }
        _createNewRequest(requestId, fn, timeout) {
          const request = new PromiseController({
            timeout,
            timeoutReason: `WebSocket request was rejected by timeout (${timeout} ms). RequestId: ${requestId}`
          });
          this._items.set(requestId, request);
          return promiseFinally(request.call(fn), () => this._deleteRequest(requestId, request));
        }
        _deleteRequest(requestId, request) {
          if (this._items.get(requestId) === request) {
            this._items.delete(requestId);
          }
        }
      };
    }
  });

  // node_modules/websocket-as-promised/src/options.js
  var require_options = __commonJS({
    "node_modules/websocket-as-promised/src/options.js"(exports, module) {
      module.exports = {
        /**
         * See {@link Options.createWebSocket}
         *
         * @param {String} url
         * @returns {WebSocket}
         */
        createWebSocket: (url) => new WebSocket(url),
        /**
         * See {@link Options.packMessage}
         *
         * @param {*} data
         * @returns {String|ArrayBuffer|Blob}
         */
        packMessage: null,
        /**
         * See {@link Options.unpackMessage}
         *
         * @param {String|ArrayBuffer|Blob} data
         * @returns {*}
         */
        unpackMessage: null,
        /**
         * See {@link Options.attachRequestId}
         *
         * @param {*} data
         * @param {String|Number} requestId
         * @returns {*}
         */
        attachRequestId: null,
        /**
         * See {@link Options.extractRequestId}
         *
         * @param {*} data
         * @returns {String|Number|undefined}
         */
        extractRequestId: null,
        /**
         * See {@link Options.extractMessageData}
         *
         * @param {*} event
         * @returns {*}
         */
        extractMessageData: (event) => event.data,
        /**
         * See {@link Options.timeout}
         */
        timeout: 0,
        /**
         * See {@link Options.connectionTimeout}
         */
        connectionTimeout: 0
      };
    }
  });

  // node_modules/websocket-as-promised/src/utils.js
  var require_utils2 = __commonJS({
    "node_modules/websocket-as-promised/src/utils.js"(exports) {
      exports.throwIf = (condition, message) => {
        if (condition) {
          throw new Error(message);
        }
      };
      exports.isPromise = (value) => {
        return value && typeof value.then === "function";
      };
    }
  });

  // node_modules/websocket-as-promised/src/index.js
  var require_src3 = __commonJS({
    "node_modules/websocket-as-promised/src/index.js"(exports, module) {
      var Channel = require_channel_cjs();
      var PromiseController = require_src();
      var { PromisedMap } = require_cjs();
      var Requests = require_requests();
      var defaultOptions = require_options();
      var { throwIf, isPromise } = require_utils2();
      var STATE = {
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3
      };
      var WebSocketAsPromised2 = class {
        /**
         * Constructor. Unlike original WebSocket it does not immediately open connection.
         * Please call `open()` method to connect.
         *
         * @param {String} url WebSocket URL
         * @param {Options} [options]
         */
        constructor(url, options) {
          this._assertOptions(options);
          this._url = url;
          this._options = Object.assign({}, defaultOptions, options);
          this._requests = new Requests();
          this._promisedMap = new PromisedMap();
          this._ws = null;
          this._wsSubscription = null;
          this._createOpeningController();
          this._createClosingController();
          this._createChannels();
        }
        /**
         * Returns original WebSocket instance created by `options.createWebSocket`.
         *
         * @returns {WebSocket}
         */
        get ws() {
          return this._ws;
        }
        /**
         * Returns WebSocket url.
         *
         * @returns {String}
         */
        get url() {
          return this._url;
        }
        /**
         * Is WebSocket connection in opening state.
         *
         * @returns {Boolean}
         */
        get isOpening() {
          return Boolean(this._ws && this._ws.readyState === STATE.CONNECTING);
        }
        /**
         * Is WebSocket connection opened.
         *
         * @returns {Boolean}
         */
        get isOpened() {
          return Boolean(this._ws && this._ws.readyState === STATE.OPEN);
        }
        /**
         * Is WebSocket connection in closing state.
         *
         * @returns {Boolean}
         */
        get isClosing() {
          return Boolean(this._ws && this._ws.readyState === STATE.CLOSING);
        }
        /**
         * Is WebSocket connection closed.
         *
         * @returns {Boolean}
         */
        get isClosed() {
          return Boolean(!this._ws || this._ws.readyState === STATE.CLOSED);
        }
        /**
         * Event channel triggered when connection is opened.
         *
         * @see https://vitalets.github.io/chnl/#channel
         * @example
         * wsp.onOpen.addListener(() => console.log('Connection opened'));
         *
         * @returns {Channel}
         */
        get onOpen() {
          return this._onOpen;
        }
        /**
         * Event channel triggered every time when message is sent to server.
         *
         * @see https://vitalets.github.io/chnl/#channel
         * @example
         * wsp.onSend.addListener(data => console.log('Message sent', data));
         *
         * @returns {Channel}
         */
        get onSend() {
          return this._onSend;
        }
        /**
         * Event channel triggered every time when message received from server.
         *
         * @see https://vitalets.github.io/chnl/#channel
         * @example
         * wsp.onMessage.addListener(message => console.log(message));
         *
         * @returns {Channel}
         */
        get onMessage() {
          return this._onMessage;
        }
        /**
         * Event channel triggered every time when received message is successfully unpacked.
         * For example, if you are using JSON transport, the listener will receive already JSON parsed data.
         *
         * @see https://vitalets.github.io/chnl/#channel
         * @example
         * wsp.onUnpackedMessage.addListener(data => console.log(data.foo));
         *
         * @returns {Channel}
         */
        get onUnpackedMessage() {
          return this._onUnpackedMessage;
        }
        /**
         * Event channel triggered every time when response to some request comes.
         * Received message considered a response if requestId is found in it.
         *
         * @see https://vitalets.github.io/chnl/#channel
         * @example
         * wsp.onResponse.addListener(data => console.log(data));
         *
         * @returns {Channel}
         */
        get onResponse() {
          return this._onResponse;
        }
        /**
         * Event channel triggered when connection closed.
         * Listener accepts single argument `{code, reason}`.
         *
         * @see https://vitalets.github.io/chnl/#channel
         * @example
         * wsp.onClose.addListener(event => console.log(`Connections closed: ${event.reason}`));
         *
         * @returns {Channel}
         */
        get onClose() {
          return this._onClose;
        }
        /**
         * Event channel triggered when by Websocket 'error' event.
         *
         * @see https://vitalets.github.io/chnl/#channel
         * @example
         * wsp.onError.addListener(event => console.error(event));
         *
         * @returns {Channel}
         */
        get onError() {
          return this._onError;
        }
        /**
         * Opens WebSocket connection. If connection already opened, promise will be resolved with "open event".
         *
         * @returns {Promise<Event>}
         */
        open() {
          if (this.isClosing) {
            return Promise.reject(new Error(`Can't open WebSocket while closing.`));
          }
          if (this.isOpened) {
            return this._opening.promise;
          }
          return this._opening.call(() => {
            this._opening.promise.catch((e) => this._cleanup(e));
            this._createWS();
          });
        }
        /**
         * Performs request and waits for response.
         *
         * @param {*} data
         * @param {Object} [options]
         * @param {String|Number} [options.requestId=<auto-generated>]
         * @param {Number} [options.timeout=0]
         * @returns {Promise}
         */
        sendRequest(data, options = {}) {
          const requestId = options.requestId || `${Math.random()}`;
          const timeout = options.timeout !== void 0 ? options.timeout : this._options.timeout;
          return this._requests.create(requestId, () => {
            this._assertRequestIdHandlers();
            const finalData = this._options.attachRequestId(data, requestId);
            this.sendPacked(finalData);
          }, timeout);
        }
        /**
         * Packs data with `options.packMessage` and sends to the server.
         *
         * @param {*} data
         */
        sendPacked(data) {
          this._assertPackingHandlers();
          const message = this._options.packMessage(data);
          this.send(message);
        }
        /**
         * Sends data without packing.
         *
         * @param {String|Blob|ArrayBuffer} data
         */
        send(data) {
          throwIf(!this.isOpened, `Can't send data because WebSocket is not opened.`);
          this._ws.send(data);
          this._onSend.dispatchAsync(data);
        }
        /**
         * Waits for particular message to come.
         *
         * @param {Function} predicate function to check incoming message.
         * @param {Object} [options]
         * @param {Number} [options.timeout=0]
         * @param {Error} [options.timeoutError]
         * @returns {Promise}
         *
         * @example
         * const response = await wsp.waitUnpackedMessage(data => data && data.foo === 'bar');
         */
        waitUnpackedMessage(predicate, options = {}) {
          throwIf(typeof predicate !== "function", `Predicate must be a function, got ${typeof predicate}`);
          if (options.timeout) {
            setTimeout(() => {
              if (this._promisedMap.has(predicate)) {
                const error = options.timeoutError || new Error("Timeout");
                this._promisedMap.reject(predicate, error);
              }
            }, options.timeout);
          }
          return this._promisedMap.set(predicate);
        }
        /**
         * Closes WebSocket connection. If connection already closed, promise will be resolved with "close event".
         *
         * @param {number=} [code=1000] A numeric value indicating the status code.
         * @param {string=} [reason] A human-readable reason for closing connection.
         * @returns {Promise<Event>}
         */
        close(code, reason) {
          return this.isClosed ? Promise.resolve(this._closing.value) : this._closing.call(() => this._ws.close(code, reason));
        }
        /**
         * Removes all listeners from WSP instance. Useful for cleanup.
         */
        removeAllListeners() {
          this._onOpen.removeAllListeners();
          this._onMessage.removeAllListeners();
          this._onUnpackedMessage.removeAllListeners();
          this._onResponse.removeAllListeners();
          this._onSend.removeAllListeners();
          this._onClose.removeAllListeners();
          this._onError.removeAllListeners();
        }
        _createOpeningController() {
          const connectionTimeout = this._options.connectionTimeout || this._options.timeout;
          this._opening = new PromiseController({
            timeout: connectionTimeout,
            timeoutReason: `Can't open WebSocket within allowed timeout: ${connectionTimeout} ms.`
          });
        }
        _createClosingController() {
          const closingTimeout = this._options.timeout;
          this._closing = new PromiseController({
            timeout: closingTimeout,
            timeoutReason: `Can't close WebSocket within allowed timeout: ${closingTimeout} ms.`
          });
        }
        _createChannels() {
          this._onOpen = new Channel();
          this._onMessage = new Channel();
          this._onUnpackedMessage = new Channel();
          this._onResponse = new Channel();
          this._onSend = new Channel();
          this._onClose = new Channel();
          this._onError = new Channel();
        }
        _createWS() {
          this._ws = this._options.createWebSocket(this._url);
          this._wsSubscription = new Channel.Subscription([
            { channel: this._ws, event: "open", listener: (e) => this._handleOpen(e) },
            { channel: this._ws, event: "message", listener: (e) => this._handleMessage(e) },
            { channel: this._ws, event: "error", listener: (e) => this._handleError(e) },
            { channel: this._ws, event: "close", listener: (e) => this._handleClose(e) }
          ]).on();
        }
        _handleOpen(event) {
          this._onOpen.dispatchAsync(event);
          this._opening.resolve(event);
        }
        _handleMessage(event) {
          const data = this._options.extractMessageData(event);
          this._onMessage.dispatchAsync(data);
          this._tryUnpack(data);
        }
        _tryUnpack(data) {
          if (this._options.unpackMessage) {
            data = this._options.unpackMessage(data);
            if (isPromise(data)) {
              data.then((data2) => this._handleUnpackedData(data2));
            } else {
              this._handleUnpackedData(data);
            }
          }
        }
        _handleUnpackedData(data) {
          if (data !== void 0) {
            this._onUnpackedMessage.dispatchAsync(data);
            this._tryHandleResponse(data);
          }
          this._tryHandleWaitingMessage(data);
        }
        _tryHandleResponse(data) {
          if (this._options.extractRequestId) {
            const requestId = this._options.extractRequestId(data);
            if (requestId) {
              this._onResponse.dispatchAsync(data, requestId);
              this._requests.resolve(requestId, data);
            }
          }
        }
        _tryHandleWaitingMessage(data) {
          this._promisedMap.forEach((_, predicate) => {
            let isMatched = false;
            try {
              isMatched = predicate(data);
            } catch (e) {
              this._promisedMap.reject(predicate, e);
              return;
            }
            if (isMatched) {
              this._promisedMap.resolve(predicate, data);
            }
          });
        }
        _handleError(event) {
          this._onError.dispatchAsync(event);
        }
        _handleClose(event) {
          this._onClose.dispatchAsync(event);
          this._closing.resolve(event);
          const error = new Error(`WebSocket closed with reason: ${event.reason} (${event.code}).`);
          if (this._opening.isPending) {
            this._opening.reject(error);
          }
          this._cleanup(error);
        }
        _cleanupWS() {
          if (this._wsSubscription) {
            this._wsSubscription.off();
            this._wsSubscription = null;
          }
          this._ws = null;
        }
        _cleanup(error) {
          this._cleanupWS();
          this._requests.rejectAll(error);
        }
        _assertOptions(options) {
          Object.keys(options || {}).forEach((key) => {
            if (!defaultOptions.hasOwnProperty(key)) {
              throw new Error(`Unknown option: ${key}`);
            }
          });
        }
        _assertPackingHandlers() {
          const { packMessage, unpackMessage } = this._options;
          throwIf(
            !packMessage || !unpackMessage,
            `Please define 'options.packMessage / options.unpackMessage' for sending packed messages.`
          );
        }
        _assertRequestIdHandlers() {
          const { attachRequestId, extractRequestId } = this._options;
          throwIf(
            !attachRequestId || !extractRequestId,
            `Please define 'options.attachRequestId / options.extractRequestId' for sending requests.`
          );
        }
      };
      module.exports = WebSocketAsPromised2;
    }
  });

  // src/js/ws.js
  var WebSocketAsPromised = require_src3();
  var wsp = new WebSocketAsPromised("ws://localhost:49437", {
    packMessage: (data) => JSON.stringify(data),
    unpackMessage: (data) => JSON.parse(data),
    attachRequestId: (data, requestId) => Object.assign({ uid: requestId }, data),
    extractRequestId: (data) => data && data.uid
  });
  var ws_default = wsp;

  // src/js/helpers/authU2F.js
  async function authU2F(reqx) {
    var req = {
      publicKey: {
        allowCredentials: [
          {
            id: reqx,
            transports: ["nfc"],
            type: "public-key"
          }
        ],
        challenge: new Uint8Array([
          113,
          241,
          176,
          49,
          249,
          113,
          39,
          237,
          135,
          170,
          177,
          61,
          15,
          14,
          105,
          236,
          120,
          140,
          4,
          41,
          65,
          225,
          107,
          63,
          214,
          129,
          133,
          223,
          169,
          200,
          21,
          88
        ]),
        rpId: window.location.host,
        timeout: 6e4,
        userVerification: "discouraged"
      }
    };
    var xdd = await navigator.credentials.get(req);
    return xdd.response.signature;
  }

  // src/js/helpers/buf2hex.js
  function buf2hex2(buffer) {
    return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  // src/js/helpers/download.js
  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  // src/js/helpers/fromHexString.js
  function fromHexString(hexString) {
    return new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  }

  // src/js/helpers/generateCmd.js
  function generateCmd(cmd, keyslot, message = null, ethereumSigFormat = null) {
    let messageBytes = null;
    if (ethereumSigFormat == "eip191") {
      messageBytes = ethers.utils.hashMessage(message);
    } else {
      messageBytes = ethers.utils.hashMessage(message);
    }
    let messageBytesSlice = messageBytes.slice(2);
    let cmdBytes = new Uint8Array(2);
    cmdBytes[0] = cmd;
    cmdBytes[1] = keyslot;
    cmdBytes = buf2hex2(cmdBytes);
    inputBytes = cmdBytes + messageBytesSlice;
    return [inputBytes, messageBytes, ethereumSigFormat];
  }

  // src/js/helpers/parseKeys.js
  function parseKeys(payload) {
    primaryPublicKeyLength = parseInt("0x" + payload.slice(0, 2)) * 2;
    primaryPublicKeyRaw = payload.slice(2, primaryPublicKeyLength + 2);
    primaryPublicKeyHash = ethers.utils.sha256("0x" + primaryPublicKeyRaw.slice(2));
    secondaryPublicKeyLength = parseInt("0x" + payload.slice(primaryPublicKeyLength + 2, primaryPublicKeyLength + 4)) * 2;
    secondaryPublicKeyRaw = payload.slice(
      primaryPublicKeyLength + 4,
      primaryPublicKeyLength + secondaryPublicKeyLength + 4
    );
    secondaryPublicKeyHash = ethers.utils.sha256("0x" + secondaryPublicKeyRaw.slice(2));
    tertiaryPublicKeyLength = parseInt(
      "0x" + payload.slice(
        primaryPublicKeyLength + secondaryPublicKeyLength + 4,
        primaryPublicKeyLength + secondaryPublicKeyLength + 6
      )
    ) * 2;
    var tertiaryPublicKeyRaw = null;
    var tertiaryPublicKeyHash = null;
    if (tertiaryPublicKeyLength > 0) {
      tertiaryPublicKeyRaw = payload.slice(
        primaryPublicKeyLength + secondaryPublicKeyLength + 6,
        primaryPublicKeyLength + secondaryPublicKeyLength + tertiaryPublicKeyLength + 6
      );
      tertiaryPublicKeyHash = ethers.utils.sha256("0x" + tertiaryPublicKeyRaw.slice(2));
    }
    const keys = {
      primaryPublicKeyHash,
      primaryPublicKeyRaw,
      secondaryPublicKeyHash,
      secondaryPublicKeyRaw,
      tertiaryPublicKeyHash,
      tertiaryPublicKeyRaw
    };
    return keys;
  }

  // src/js/helpers/splitHash.js
  function splitHash(str) {
    const last4 = str.substr(str.length - 4);
    const rest = str.slice(0, -4);
    return { start: rest, end: last4 };
  }

  // src/js/helpers/unpackDERSignature.js
  function unpackDERSignature2(sig) {
    let header0 = sig.slice(0, 2);
    if (parseInt("0x" + header0) !== 48) {
      throw Error("Invalid header.");
    }
    let header_r0 = sig.slice(4, 6);
    let header_r1 = sig.slice(6, 8);
    if (parseInt("0x" + header_r0) !== 2) {
      throw Error("Invalid header (2).");
    }
    let length_r = parseInt("0x" + header_r1) * 2;
    let r = sig.slice(8, length_r + 8);
    let header_s0 = sig.slice(length_r + 8, length_r + 10);
    let header_s1 = sig.slice(length_r + 10, length_r + 12);
    if (parseInt("0x" + header_s0) !== 2) {
      throw Error("Invalid header (2).");
    }
    let s = sig.slice(
      length_r + 12,
      length_r + 12 + parseInt("0x" + header_s1) * 2
    );
    if (r.length == 66) {
      r = r.slice(2, 130);
    }
    if (s.length == 66) {
      s = s.slice(2, 130);
    }
    return {
      r,
      s
    };
  }

  // src/js/helpers/parseKeysCli.js
  function parseKeysCli(keys) {
    const primaryPublicKeyRaw2 = keys["1"];
    const primaryPublicKeyHash2 = ethers.utils.sha256("0x" + primaryPublicKeyRaw2.slice(2));
    const secondaryPublicKeyRaw2 = keys["2"];
    const secondaryPublicKeyHash2 = ethers.utils.sha256("0x" + secondaryPublicKeyRaw2.slice(2));
    let tertiaryPublicKeyRaw = keys["3"];
    let tertiaryPublicKeyHash = null;
    if (keys["3"]) {
      tertiaryPublicKeyHash = ethers.utils.sha256("0x" + tertiaryPublicKeyRaw.slice(2));
    }
    return {
      primaryPublicKeyRaw: primaryPublicKeyRaw2,
      primaryPublicKeyHash: primaryPublicKeyHash2,
      secondaryPublicKeyRaw: secondaryPublicKeyRaw2,
      secondaryPublicKeyHash: secondaryPublicKeyHash2,
      tertiaryPublicKeyRaw,
      tertiaryPublicKeyHash
    };
  }

  // src/scripts.js
  var scannedHalos = {};
  var currentURL = new URL(window.location.href);
  var staticHaloData = currentURL.searchParams.get("static");
  function prepareVerify(staticHaloData2, publicKeys) {
    let keys = publicKeys ? parseKeysCli(publicKeys) : parseKeys(buf2hex2(staticHaloData2));
    let primaryPublicKeyHash2 = keys["primaryPublicKeyHash"];
    keys["metadata"] = document.querySelector(".metadata-input").value;
    keys["address"] = ethers.utils.computeAddress("0x" + keys["primaryPublicKeyRaw"]);
    const recordExists = scannedHalos[primaryPublicKeyHash2] !== void 0;
    if (!recordExists) {
      scannedHalos[primaryPublicKeyHash2] = keys;
      const row = buildRow(keys["primaryPublicKeyHash"]);
      document.querySelector(".records").appendChild(row);
      document.querySelector(".empty-text").classList.add("hide");
      document.querySelector("#export").classList.remove("hide");
      document.querySelector("#clear").classList.remove("hide");
      localStorage.setItem("halos", JSON.stringify(scannedHalos));
      document.querySelector("#clear").style.display = "flex";
      updateCounter();
    }
  }
  async function readKeyU2F() {
    let res = await authU2F(fromHexString("02"));
    prepareVerify(res);
  }
  async function signU2F() {
    const challenge = document.querySelector(".metadata-input").value;
    const [input, digest, ethereumSigFormat] = generateCmd(1, 1, challenge, "eip191");
    var req = fromHexString(input);
    var res = await authU2F(req);
    const signature = buf2hex2(res);
    const sigRaw = unpackDERSignature2(signature);
    let curveOrder = 115792089237316195423570985008687907852837564279074904382605163141518161494337n;
    let rn = BigInt("0x" + sigRaw.r.toString("hex"));
    let sn = BigInt("0x" + sigRaw.s.toString("hex"));
    if (sn > curveOrder / 2n) {
      sn = -sn + curveOrder;
    }
    let foundPrimaryPublicKeyHash = null;
    for (halo in scannedHalos) {
      let recover27;
      let recover28;
      try {
        recover27 = ethers.utils.recoverAddress(digest, {
          r: "0x" + rn.toString(16),
          s: "0x" + sn.toString(16),
          v: 27
        });
      } catch (error) {
        console.error(error);
      }
      try {
        recover28 = ethers.utils.recoverAddress(digest, {
          r: "0x" + rn.toString(16),
          s: "0x" + sn.toString(16),
          v: 28
        });
      } catch (error) {
        console.error(error);
      }
      if (recover27 && recover27 == scannedHalos[halo]["address"]) {
        foundPrimaryPublicKeyHash = scannedHalos[halo]["primaryPublicKeyHash"];
        break;
      } else if (recover28 && recover28 == scannedHalos[halo]["address"]) {
        foundPrimaryPublicKeyHash = scannedHalos[halo]["primaryPublicKeyHash"];
        break;
      }
    }
    if (foundPrimaryPublicKeyHash) {
      scannedHalos[foundPrimaryPublicKeyHash]["signature"] = signature;
      scannedHalos[foundPrimaryPublicKeyHash]["sigDigest"] = digest;
      scannedHalos[foundPrimaryPublicKeyHash]["sigMessage"] = challenge;
      scannedHalos[foundPrimaryPublicKeyHash]["sigFormat"] = ethereumSigFormat;
      localStorage.setItem("halos", JSON.stringify(scannedHalos));
    } else {
      alert("Please scan this chip first, then sign again.");
    }
  }
  function buildRow(primary) {
    const record = scannedHalos[primary];
    const el = document.createElement("div");
    el.classList.add("record");
    el.setAttribute("data-primary", primary);
    const pkSplit = splitHash(primary);
    el.innerHTML = `
  <div class="record-header">
    <button class="record-header-delete">
      <img src="./assets/delete.svg">
    </button>
    <div class="record-header-pk">
      <div class="record-header-pk-start">
        ${pkSplit.start}
      </div>
      <div class="record-header-pk-end">${pkSplit.end}</div>
    </div>
    <div class="record-header-chevron">
      <img src="./assets/chevron-down.svg">
    </div>
  </div>
  <div class="record-body">
    ${record.metadata ? `<div class="record-body-section">
      <h2>Metadata</h2>
      <div class="record-body-section-box">${record.metadata}</div>
    </div>` : ""}
    <div class="record-body-section">
      <h2>Primary public key</h2>
      <div class="record-body-section-box">
        ${record.primaryPublicKeyRaw}
      </div>
    </div>
    <div class="record-body-section">
      <h2>Address</h2>
      <div class="record-body-section-box">
        ${record.address}
      </div>
    </div>
  </div>
  `;
    return el;
  }
  function updateCounter() {
    const countEl = document.querySelector("#count");
    const count = Object.entries(scannedHalos).length;
    countEl.textContent = count;
    if (count === 0) {
      countEl.classList.add("hide");
    } else {
      countEl.classList.remove("hide");
    }
  }
  if (staticHaloData) {
    prepareVerify(staticHaloData);
  }
  document.querySelector("#scan").addEventListener("click", () => {
    readKeyU2F();
  });
  document.querySelector("#sign").addEventListener("click", () => {
    signU2F();
  });
  document.addEventListener(
    "click",
    function(e) {
      const isDelete = e.target.matches(".record-header-delete, .record-header-delete *");
      const isHeader = e.target.matches(".record-header, .record-header *");
      if (isDelete) {
        e.preventDefault();
        const el = e.target.closest(".record");
        const pk = el.getAttribute("data-primary");
        el?.remove();
        delete scannedHalos[pk];
        if (Object.entries(scannedHalos).length === 0) {
          document.querySelector("#clear").style.display = "none";
        }
        localStorage.setItem("halos", JSON.stringify(scannedHalos));
        updateCounter();
        if (document.querySelectorAll(".record").length === 0) {
          document.querySelector(".empty-text").classList.remove("hide");
          document.querySelector("#export").classList.add("hide");
          document.querySelector("#clear").classList.add("hide");
        }
      } else if (isHeader) {
        e.preventDefault();
        e.target.closest(".record").classList.toggle("active");
      }
    },
    false
  );
  document.querySelector("#clear").addEventListener("click", function() {
    if (confirm("Clear all scanned chips?")) {
      scannedHalos = {};
      localStorage.removeItem("halos");
      document.querySelectorAll(".record").forEach((el) => el.remove());
      document.querySelector("#clear").classList.add("hide");
      document.querySelector("#export").classList.add("hide");
      document.querySelector(".empty-text").classList.add("hide");
      updateCounter();
    }
  });
  document.querySelector("#export").addEventListener("click", function() {
    download(JSON.stringify(scannedHalos), `scanned-halos-${Date.now()}.json`, "application/json");
  });
  try {
    const halos = localStorage.getItem("halos");
    if (halos) {
      scannedHalos = JSON.parse(halos);
    } else {
      scannedHalos = {};
    }
    if (scannedHalos && Object.entries(scannedHalos).length > 0) {
      for (halo in scannedHalos) {
        row = buildRow(scannedHalos[halo]["primaryPublicKeyHash"]);
        document.querySelector(".records").appendChild(row);
      }
      document.querySelector("#clear").classList.remove("hide");
      document.querySelector("#export").classList.remove("hide");
      document.querySelector(".empty-text").classList.add("hide");
      updateCounter();
    }
  } catch (err) {
    console.log(err);
  }
  var row;
  document.querySelector(".metadata-input").addEventListener("input", function(e) {
    document.querySelector("#sign").disabled = !e.target.value;
  });
  async function processTag(handle) {
    let res = await ws_default.sendRequest({
      type: "exec_halo",
      handle,
      command: {
        name: "get_pkeys"
      }
    });
    if (res.event === "exec_exception") {
      console.log("!!! ERROR !!! Failed to execute HaLo command.");
    }
    if (res?.data?.res?.publicKeys) {
      prepareVerify(null, res.data.res.publicKeys);
    }
    res = await ws_default.sendRequest({
      type: "exec_halo",
      handle,
      command: {
        name: "sign",
        message: "010203",
        keyNo: 1
      }
    });
    if (res.event === "exec_exception") {
      console.log("!!! ERROR !!! Failed to execute HaLo command.");
    }
  }
  ws_default.onUnpackedMessage.addListener(async (ev) => {
    if (ev.event !== "exec_success" && ev.event !== "exec_exception") {
    }
    if (ev.event === "handle_added") {
      await processTag(ev.data.handle);
    }
  });
  ws_default.onClose.addListener((event) => {
    if (event.code === 4001) {
      console.log("Connection closed, new client has connected.");
    } else {
      console.log("Connection closed: " + event.code);
    }
  });
  ws_default.open();
})();
/*! Bundled license information:

chnl/dist/channel.cjs.js:
  (* chnl v1.2.0 by Vitaliy Potapov @preserve *)
*/
//# sourceMappingURL=scripts.js.map
