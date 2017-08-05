(function () {
'use strict';

var index$3 = function index(str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index$5 = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [encode(key, opts), '[', index, ']'].join('') : [encode(key, opts), '[', encode(index, opts), ']=', encode(value, opts)].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [encode(key, opts), '[]=', encode(value, opts)].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [encode(key, opts), '=', encode(value, opts)].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);

				key = key.replace(/\[\]$/, '');

				if (!result || accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? index$3(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

var extract = function extract(str) {
	return str.split('?')[1] || '';
};

var parse = function parse(str, opts) {
	opts = index$5({ arrayFormat: 'none' }, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

var stringify = function stringify(obj, opts) {
	var defaults$$1 = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = index$5(defaults$$1, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

var index$1 = {
	extract: extract,
	parse: parse,
	stringify: stringify
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$7 = createCommonjsModule(function (module) {
  'use strict';

  var has = Object.prototype.hasOwnProperty,
      prefix = '~';

  /**
   * Constructor to create a storage for our `EE` objects.
   * An `Events` instance is a plain object whose properties are event names.
   *
   * @constructor
   * @api private
   */
  function Events() {}

  //
  // We try to not inherit from `Object.prototype`. In some engines creating an
  // instance in this way is faster than calling `Object.create(null)` directly.
  // If `Object.create(null)` is not supported we prefix the event names with a
  // character to make sure that the built-in object properties are not
  // overridden or used as an attack vector.
  //
  if (Object.create) {
    Events.prototype = Object.create(null);

    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new Events().__proto__) prefix = false;
  }

  /**
   * Representation of a single event listener.
   *
   * @param {Function} fn The listener function.
   * @param {Mixed} context The context to invoke the listener with.
   * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
   * @constructor
   * @api private
   */
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }

  /**
   * Minimal `EventEmitter` interface that is molded against the Node.js
   * `EventEmitter` interface.
   *
   * @constructor
   * @api public
   */
  function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
  }

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   *
   * @returns {Array}
   * @api public
   */
  EventEmitter.prototype.eventNames = function eventNames() {
    var names = [],
        events,
        name;

    if (this._eventsCount === 0) return names;

    for (name in events = this._events) {
      if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }

    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }

    return names;
  };

  /**
   * Return the listeners registered for a given event.
   *
   * @param {String|Symbol} event The event name.
   * @param {Boolean} exists Only check if there are listeners.
   * @returns {Array|Boolean}
   * @api public
   */
  EventEmitter.prototype.listeners = function listeners(event, exists) {
    var evt = prefix ? prefix + event : event,
        available = this._events[evt];

    if (exists) return !!available;
    if (!available) return [];
    if (available.fn) return [available.fn];

    for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
      ee[i] = available[i].fn;
    }

    return ee;
  };

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {String|Symbol} event The event name.
   * @returns {Boolean} `true` if the event had listeners, else `false`.
   * @api public
   */
  EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;

    if (!this._events[evt]) return false;

    var listeners = this._events[evt],
        len = arguments.length,
        args,
        i;

    if (listeners.fn) {
      if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }

      for (i = 1, args = new Array(len - 1); i < len; i++) {
        args[i - 1] = arguments[i];
      }

      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length,
          j;

      for (i = 0; i < length; i++) {
        if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);break;
          default:
            if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
              args[j - 1] = arguments[j];
            }

            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }

    return true;
  };

  /**
   * Add a listener for a given event.
   *
   * @param {String|Symbol} event The event name.
   * @param {Function} fn The listener function.
   * @param {Mixed} [context=this] The context to invoke the listener with.
   * @returns {EventEmitter} `this`.
   * @api public
   */
  EventEmitter.prototype.on = function on(event, fn, context) {
    var listener = new EE(fn, context || this),
        evt = prefix ? prefix + event : event;

    if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;else if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];

    return this;
  };

  /**
   * Add a one-time listener for a given event.
   *
   * @param {String|Symbol} event The event name.
   * @param {Function} fn The listener function.
   * @param {Mixed} [context=this] The context to invoke the listener with.
   * @returns {EventEmitter} `this`.
   * @api public
   */
  EventEmitter.prototype.once = function once(event, fn, context) {
    var listener = new EE(fn, context || this, true),
        evt = prefix ? prefix + event : event;

    if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;else if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];

    return this;
  };

  /**
   * Remove the listeners of a given event.
   *
   * @param {String|Symbol} event The event name.
   * @param {Function} fn Only remove the listeners that match this function.
   * @param {Mixed} context Only remove the listeners that have this context.
   * @param {Boolean} once Only remove one-time listeners.
   * @returns {EventEmitter} `this`.
   * @api public
   */
  EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;

    if (!this._events[evt]) return this;
    if (!fn) {
      if (--this._eventsCount === 0) this._events = new Events();else delete this._events[evt];
      return this;
    }

    var listeners = this._events[evt];

    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        if (--this._eventsCount === 0) this._events = new Events();else delete this._events[evt];
      }
    } else {
      for (var i = 0, events = [], length = listeners.length; i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
          events.push(listeners[i]);
        }
      }

      //
      // Reset the array, or remove it completely if we have no more listeners.
      //
      if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else if (--this._eventsCount === 0) this._events = new Events();else delete this._events[evt];
    }

    return this;
  };

  /**
   * Remove all listeners, or those of the specified event.
   *
   * @param {String|Symbol} [event] The event name.
   * @returns {EventEmitter} `this`.
   * @api public
   */
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;

    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt]) {
        if (--this._eventsCount === 0) this._events = new Events();else delete this._events[evt];
      }
    } else {
      this._events = new Events();
      this._eventsCount = 0;
    }

    return this;
  };

  //
  // Alias methods names because people roll like that.
  //
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  //
  // This function doesn't apply anymore.
  //
  EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
    return this;
  };

  //
  // Expose the prefix.
  //
  EventEmitter.prefixed = prefix;

  //
  // Allow `EventEmitter` to be imported as module namespace.
  //
  EventEmitter.EventEmitter = EventEmitter;

  //
  // Expose the module.
  //
  {
    module.exports = EventEmitter;
  }
});

function recompute(state, newState, oldState, isInitial) {
	if (isInitial || 'parametersToQuerystring' in newState && differs(state.parametersToQuerystring, oldState.parametersToQuerystring) || 'parameters' in newState && differs(state.parameters, oldState.parameters)) {
		state.querystring = newState.querystring = template.computed.querystring(state.parametersToQuerystring, state.parameters);
	}
}

var template = function () {
	return {
		data: function data() {
			return {
				className: '',
				style: ''
			};
		},
		computed: {
			querystring: function querystring(parametersToQuerystring, parameters) {
				return parametersToQuerystring(parameters);
			}
		},
		methods: {
			navigate: function navigate(event) {
				event.preventDefault();

				this.fire('navigate', {
					querystring: this.get('querystring'),
					parameters: this.get('parameters')
				});
			}
		}
	};
}();

function create_main_fragment(state, component) {
	var if_block_anchor;

	function get_block(state) {
		if (state.parameters) return create_if_block;
		return create_if_block_1;
	}

	var current_block = get_block(state);
	var if_block = current_block(state, component);

	return {
		create: function create() {
			if_block.create();
			if_block_anchor = createComment();
		},

		mount: function mount(target, anchor) {
			if_block.mount(target, anchor);
			insertNode(if_block_anchor, target, anchor);
		},

		update: function update(changed, state) {
			if (current_block === (current_block = get_block(state)) && if_block) {
				if_block.update(changed, state);
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block(state, component);
				if_block.create();
				if_block.mount(if_block_anchor.parentNode, if_block_anchor);
			}
		},

		unmount: function unmount() {
			if_block.unmount();
			detachNode(if_block_anchor);
		},

		destroy: function destroy() {
			if_block.destroy();
		}
	};
}

function create_if_block(state, component) {
	var a, a_href_value, a_class_value, a_style_value;

	function click_handler(event) {
		component.navigate(event);
	}

	return {
		create: function create() {
			a = createElement('a');
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			a.href = a_href_value = state.querystring;
			a.className = a_class_value = state.className;
			a.style.cssText = a_style_value = state.style;
			addListener(a, 'click', click_handler);
		},

		mount: function mount(target, anchor) {
			insertNode(a, target, anchor);
			component.refs.link = a;
			if (component._yield) component._yield.mount(a, null);
		},

		update: function update(changed, state) {
			if (a_href_value !== (a_href_value = state.querystring)) {
				a.href = a_href_value;
			}

			if (a_class_value !== (a_class_value = state.className)) {
				a.className = a_class_value;
			}

			if (a_style_value !== (a_style_value = state.style)) {
				a.style.cssText = a_style_value;
			}
		},

		unmount: function unmount() {
			detachNode(a);
			if (component.refs.link === a) component.refs.link = null;
			if (component._yield) component._yield.unmount();
		},

		destroy: function destroy() {
			removeListener(a, 'click', click_handler);
		}
	};
}

function create_if_block_1(state, component) {
	var a, a_class_value, a_style_value;

	return {
		create: function create() {
			a = createElement('a');
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			a.className = a_class_value = state.className;
			a.style.cssText = a_style_value = state.style;
		},

		mount: function mount(target, anchor) {
			insertNode(a, target, anchor);
			if (component._yield) component._yield.mount(a, null);
		},

		update: function update(changed, state) {
			if (a_class_value !== (a_class_value = state.className)) {
				a.className = a_class_value;
			}

			if (a_style_value !== (a_style_value = state.style)) {
				a.style.cssText = a_style_value;
			}
		},

		unmount: function unmount() {
			detachNode(a);
			if (component._yield) component._yield.unmount();
		},

		destroy: noop
	};
}

function Link(options) {
	options = options || {};
	this.refs = {};
	this._state = assign(template.data(), options.data);
	recompute(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, null);
	}
}

assign(Link.prototype, template.methods, {
	get: get$1,
	fire: fire,
	observe: observe,
	on: on,
	set: set$1
});

Link.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign({}, oldState, newState);
	recompute(this._state, newState, oldState, false);
	dispatchObservers(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers(this, this._observers.post, newState, oldState);
};

Link.prototype.teardown = Link.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function differs(a, b) {
	return a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
}

function createComment() {
	return document.createComment('');
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function noop() {}

function assign(target) {
	var k,
	    source,
	    i = 1,
	    len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) {
			target[k] = source[k];
		}
	}

	return target;
}

function get$1(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers = eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe(key, callback, options) {
	var group = options && options.defer ? this._observers.post : this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function cancel() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function cancel() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set$1(newState) {
	this._set(assign({}, newState));
	callAll(this._root._oncreate);
}

function dispatchObservers(component, group, newState, oldState) {
	for (var key in group) {
		if (!(key in newState)) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		if (differs(newValue, oldValue)) {
			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}
}

function callAll(fns) {
	while (fns && fns.length) {
		fns.pop()();
	}
}

var link = Link;

function defaultPushState(state, title, url) {
	history.pushState(state, title, url);
}

function defaultCurrentQuerystring() {
	var querystring = location.search;

	return {
		querystring: querystring,
		parameters: index$1.parse(querystring)
	};
}

function defaultOnPopState(listener) {
	window.addEventListener('popstate', listener);
}

function parametersToQuerystring(parameters) {
	return '?' + index$1.stringify(parameters);
}

function optionsWithAugmentedData(options) {
	return Object.assign({}, options, {
		data: Object.assign({}, options.data, { parametersToQuerystring: parametersToQuerystring })
	});
}

var createInstance = function createRouterInstance() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _Object$assign = Object.assign({
		pushState: defaultPushState,
		currentQuerystring: defaultCurrentQuerystring,
		onPopState: defaultOnPopState
	}, options),
	    pushState = _Object$assign.pushState,
	    currentQuerystring = _Object$assign.currentQuerystring,
	    onPopState = _Object$assign.onPopState;

	var emitter = new index$7();
	var current = currentQuerystring();

	onPopState(function () {
		var _currentQuerystring = currentQuerystring(),
		    querystring = _currentQuerystring.querystring,
		    parameters = _currentQuerystring.parameters;

		emitter.emit('navigate', { querystring: querystring, parameters: parameters });
	});

	function navigate(_ref) {
		var querystring = _ref.querystring,
		    parameters = _ref.parameters,
		    element = _ref.element;

		if (typeof querystring === 'undefined') {
			querystring = parametersToQuerystring(parameters);
		}
		current = { querystring: querystring, parameters: parameters };

		function emit(event) {
			emitter.emit(event, {
				querystring: querystring,
				parameters: parameters,
				element: element
			});
		}

		emit('before navigate');

		emit('navigate');

		pushState(parameters, '', querystring);

		emit('after navigate');
	}

	return {
		navigate: navigate,
		Link: function linkProxy(options) {
			var linkComponent = new link(optionsWithAugmentedData(options));

			linkComponent.on('navigate', function (_ref2) {
				var querystring = _ref2.querystring,
				    parameters = _ref2.parameters;

				navigate({
					querystring: querystring,
					parameters: parameters,
					element: linkComponent.refs.link
				});
			});

			return linkComponent;
		},
		attachQuerystringData: function attachQuerystringData(component) {
			function navigateListener(_ref3) {
				var parameters = _ref3.parameters;

				component.set({
					querystringParameters: parameters
				});
			}
			emitter.on('navigate', navigateListener);
			component.on('destroy', function () {
				return emitter.removeListener('navigate', navigateListener);
			});
			component.set({
				querystringParameters: current.parameters
			});
		},
		on: function on(event, listener) {
			emitter.on(event, listener);
			return function () {
				return emitter.removeListener(event, listener);
			};
		},
		once: function once(event, listener) {
			emitter.once(event, listener);
			return function () {
				return emitter.removeListener(event, listener);
			};
		},
		getCurrentQuerystring: function getCurrentQuerystring() {
			return current.querystring;
		},
		getCurrentParameters: function getCurrentParameters() {
			return current.parameters;
		}
	};
};

var index = createInstance();

var index$9 = function match(regex, str) {
	var definitelyGlobal = forceGlobal(regex);
	var lastMatch = null;
	var matches = [];

	while ((lastMatch = definitelyGlobal.exec(str)) !== null) {
		var _lastMatch = lastMatch,
		    _lastMatch2 = toArray(_lastMatch),
		    captured = _lastMatch2.slice(1);

		matches.push(captured);
	}

	return matches;
};

function forceGlobal(regex) {
	var isGlobal = regex.flags.split('').some(function (flag) {
		return flag === 'g';
	});

	return isGlobal ? regex : new RegExp(regex, regex.flags + 'g');
}

var index$10 = function index(arr, iter, context) {
  var results = [];
  if (!Array.isArray(arr)) return results;
  arr.forEach(function (value, index, list) {
    var res = iter.call(context, value, index, list);
    if (Array.isArray(res)) {
      results.push.apply(results, res);
    } else if (res != null) {
      results.push(res);
    }
  });
  return results;
};

var regexSource = function regexSource(regex) {
  return regex instanceof RegExp ? regex.source : regex;
};

var closingCharacters = {
	'(': ')',
	'[': ']'
};

var isAtomic = function isAtomic(regex) {
	var string = regexSource(regex);

	return (/^\w$/.test(string) || enclosedByTopLevelCharacters(string)
	);
};

function enclosedByTopLevelCharacters(string) {
	var openingCharacter = string[0];
	var closingCharacter = closingCharacters[openingCharacter];

	var closedByAppropriateCharacter = closingCharacter !== undefined && string[string.length - 1] === closingCharacter;

	if (!closedByAppropriateCharacter) {
		return false;
	}

	return !isClosedBeforeEndOfString(0, string, openingCharacter, closingCharacter);
}

function isClosedBeforeEndOfString(depth, string, openingCharacter, closingCharacter) {
	if (string.length === 1 && string[0] === closingCharacter && depth === 1) {
		return false;
	}

	var _string = toArray(string),
	    nextCharacter = _string[0],
	    restOfCharacters = _string.slice(1);

	var newDepth = calculateNewDepth(depth, openingCharacter, closingCharacter, nextCharacter);

	if (newDepth === 0) {
		return true;
	}

	return isClosedBeforeEndOfString(newDepth, restOfCharacters, openingCharacter, closingCharacter);
}

function calculateNewDepth(previousDepth, openingCharacter, closingCharacter, character) {
	if (character === openingCharacter) {
		return previousDepth + 1;
	} else if (character === closingCharacter) {
		return previousDepth - 1;
	} else {
		return previousDepth;
	}
}

var index$12 = {
	combine: returnsRegex(function () {
		return escapeInputForCombining.apply(undefined, arguments).join('');
	}),
	either: makeJoiningFunction('(?:', '|', ')'),
	capture: makeJoiningFunction('(', '', ')'),

	flags: function flags(regex, _flags) {
		return new RegExp(regex, _flags);
	},

	anyNumber: suffix('*'),
	oneOrMore: suffix('+'),
	optional: suffix('?'),
	exactly: function exactly(n, regex) {
		return suffix('{' + n + '}')(regex);
	},
	atLeast: function atLeast(n, regex) {
		return suffix('{' + n + ',}')(regex);
	},
	between: function between(n, m, regex) {
		return suffix('{' + n + ',' + m + '}')(regex);
	},

	anyNumberNonGreedy: suffix('*?'),
	oneOrMoreNonGreedy: suffix('+?'),
	optionalNonGreedy: suffix('??'),
	exactlyNonGreedy: function exactlyNonGreedy(n, regex) {
		return suffix('{' + n + '}?')(regex);
	},
	atLeastNonGreedy: function atLeastNonGreedy(n, regex) {
		return suffix('{' + n + ',}?')(regex);
	},
	betweenNonGreedy: function betweenNonGreedy(n, m, regex) {
		return suffix('{' + n + ',' + m + '}?')(regex);
	}
};

var guaranteeAtomic = function guaranteeAtomic(regex) {
	return isAtomic(regex) ? regex : '(?:' + regexSource(regex) + ')';
};
var escapeRegex = function escapeRegex(str) {
	return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};

function escapeInputAndReturnString(regex) {
	if (regex instanceof RegExp) {
		return regex.source;
	} else {
		return escapeRegex(regex);
	}
}

function removeNonCapturingGroupIfExists(regexString) {
	var match = /^\(\?:(.+)\)$/.exec(regexString);
	return match ? match[1] : regexString;
}

function guaranteeNoTopLevelOrs(regexString) {
	return regexString.indexOf('|') >= 0 ? guaranteeAtomic(regexString) : regexString;
}

function escapeInputForCombining() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return args.map(escapeInputAndReturnString).map(guaranteeNoTopLevelOrs);
}

function returnsRegex(fn) {
	return function () {
		return new RegExp(fn.apply(undefined, arguments));
	};
}

function makeJoiningFunction(openingCharacter, joinCharacter, closingCharacter) {
	return returnsRegex(function () {
		var naiveBody = escapeInputForCombining.apply(undefined, arguments).join(joinCharacter);
		var body = isAtomic(naiveBody) ? removeNonCapturingGroupIfExists(naiveBody) : naiveBody;

		return openingCharacter + body + closingCharacter;
	});
}

function suffix(appendCharacter) {
	return returnsRegex(function (regex) {
		return guaranteeAtomic(escapeInputAndReturnString(regex)) + appendCharacter;
	});
}

var books = [{ name: 'Genesis', aliases: ['Gen'] }, { name: 'Exodus', aliases: ['Exod', 'Ex', 'Exo'] }, { name: 'Leviticus', aliases: ['Lev'] }, { name: 'Numbers', aliases: ['Num'] }, { name: 'Deuteronomy', aliases: ['Deut'] }, { name: 'Joshua', aliases: ['Josh'] }, { name: 'Judges', aliases: ['Judg'] }, { name: 'Ruth', aliases: [] }, { name: '1 Samuel', aliases: ['1 Sam', '1st Sam', '1st Samuel'] }, { name: '2 Samuel', aliases: ['2 Sam', '2nd Sam', '2nd Samuel'] }, { name: '1 Kings', aliases: ['1 Kgs', '1st Kgs', '1st Kings'] }, { name: '2 Kings', aliases: ['2 Kgs', '2nd Kgs', '2nd Kings'] }, { name: '1 Chronicles', aliases: ['1 Chr', '1st Chr', '1st Chronicles'] }, { name: '2 Chronicles', aliases: ['2 Chr', '2nd Chr', '2nd Chronicles'] }, { name: 'Ezra', aliases: ['Ezra'] }, { name: 'Nehemiah', aliases: ['Neh'] }, { name: 'Esther', aliases: ['Esth', 'Est'] }, { name: 'Job', aliases: [] }, { name: 'Psalms', aliases: ['Ps', 'Psalm'] }, { name: 'Proverbs', aliases: ['Prov', 'Pro'] }, { name: 'Ecclesiastes', aliases: ['Eccl', 'Ecc'] }, { name: 'Song of Solomon', aliases: ['Song', 'Song of Songs'] }, { name: 'Isaiah', aliases: ['Isa'] }, { name: 'Jeremiah', aliases: ['Jer'] }, { name: 'Lamentations', aliases: ['Lam'] }, { name: 'Ezekiel', aliases: ['Ezek'] }, { name: 'Daniel', aliases: ['Dan'] }, { name: 'Hosea', aliases: ['Hos'] }, { name: 'Joel', aliases: [] }, { name: 'Amos', aliases: [] }, { name: 'Obadiah', aliases: ['Obad', 'Oba'] }, { name: 'Jonah', aliases: ['Jon'] }, { name: 'Micah', aliases: ['Mic'] }, { name: 'Nahum', aliases: ['Nah'] }, { name: 'Habakkuk', aliases: ['Hab'] }, { name: 'Zephaniah', aliases: ['Zeph'] }, { name: 'Haggai', aliases: ['Hag'] }, { name: 'Zechariah', aliases: ['Zech'] }, { name: 'Malachi', aliases: ['Mal'] }, { name: 'Matthew', aliases: ['Matt'] }, { name: 'Mark', aliases: [] }, { name: 'Luke', aliases: [] }, { name: 'John', aliases: [] }, { name: 'Acts', aliases: [] }, { name: 'Romans', aliases: ['Rom'] }, { name: '1 Corinthians', aliases: ['1 Cor', '1st Cor', '1st Corinthians'] }, { name: '2 Corinthians', aliases: ['2 Cor', '2nd Cor', '2nd Corinthians'] }, { name: 'Galatians', aliases: ['Gal'] }, { name: 'Ephesians', aliases: ['Eph'] }, { name: 'Philippians', aliases: ['Phil'] }, { name: 'Colossians', aliases: ['Col'] }, { name: '1 Thessalonians', aliases: ['1 Thess', '1st Thess', '1st Thessalonians'] }, { name: '2 Thessalonians', aliases: ['2 Thess', '2nd Thess', '2nd Thessalonians'] }, { name: '1 Timothy', aliases: ['1 Tim', '1st Tim', '1st Timothy'] }, { name: '2 Timothy', aliases: ['2 Tim', '2nd Tim', '2nd Timothy'] }, { name: 'Titus', aliases: [] }, { name: 'Philemon', aliases: ['Phlm'] }, { name: 'Hebrews', aliases: ['Heb'] }, { name: 'James', aliases: ['Jas'] }, { name: '1 Peter', aliases: ['1 Pet', '1st Pet', '1st Peter'] }, { name: '2 Peter', aliases: ['2 Pet', '2nd Pet', '2nd Peter'] }, { name: '1 John', aliases: ['1st John'] }, { name: '2 John', aliases: ['2nd John'] }, { name: '3 John', aliases: ['3rd John'] }, { name: 'Jude', aliases: [] }, { name: 'Revelation', aliases: ['Rev'] }];

var combine = index$12.combine;
var either = index$12.either;
var capture = index$12.capture;
var optional = index$12.optional;
var flags = index$12.flags;


var createRegex = function createRegex() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    _ref$requireVerse = _ref.requireVerse,
	    requireVerse = _ref$requireVerse === undefined ? false : _ref$requireVerse,
	    _ref$flags = _ref.flags,
	    regexFlags = _ref$flags === undefined ? 'i' : _ref$flags;

	var bookNames = books.map(function (_ref2) {
		var name = _ref2.name;
		return name;
	});
	var abbreviations = index$10(books, function (_ref3) {
		var aliases = _ref3.aliases;

		return index$10(aliases, function (alias) {
			return [alias, alias + '.'];
		});
	});

	var number = /(\d+)/;
	var numberAndOptionalLetter = /(\d+)([a-z])?/;
	var colonVerse = combine(':', numberAndOptionalLetter);
	var chapterAndVerse = combine(number, requireVerse ? colonVerse : optional(colonVerse));

	var secondHalfOfRange = combine('-', either(/([a-z])/, /(\d+)([a-z])/, chapterAndVerse, numberAndOptionalLetter));
	var range = combine(chapterAndVerse, optional(secondHalfOfRange));

	return flags(combine(capture(either.apply(undefined, toConsumableArray(bookNames).concat(toConsumableArray(abbreviations)))), ' ', range), regexFlags);
};

var mapOfAliasesToBookNames = books.reduce(function (map, book) {
	map[book.name.toLowerCase()] = book;
	book.aliases.forEach(function (alias) {
		return map[alias.toLowerCase()] = book;
	});
	return map;
}, Object.create(null));

var extractRangeFromMatch = function extractRangeFromMatch(match) {
	var _match = toArray(match),
	    matchText = _match[0],
	    matchBook = _match[1],
	    matchStartChapter = _match[2],
	    matchStartVerse = _match[3],
	    matchStartSection = _match[4],
	    matchTail = _match.slice(5);

	var rangeEndValues = matchTail.filter(function (value) {
		return value !== undefined;
	});

	var start = {
		chapter: int(valueOrNull(matchStartChapter)),
		verse: int(valueOrNull(matchStartVerse)),
		section: valueOrNull(matchStartSection)
	};

	var end = ifelse(rangeEndValues.length === 3, function () {
		var _rangeEndValues = slicedToArray(rangeEndValues, 3),
		    chapter = _rangeEndValues[0],
		    verse = _rangeEndValues[1],
		    section = _rangeEndValues[2];

		return {
			chapter: int(chapter),
			verse: int(verse),
			section: valueOrNull(section)
		};
	}, function () {
		var _separateSectionFromN = separateSectionFromNumbers(rangeEndValues),
		    numbers = _separateSectionFromN.numbers,
		    section = _separateSectionFromN.section;

		if (numbers.length === 2) {
			var _numbers = slicedToArray(numbers, 2),
			    chapter = _numbers[0],
			    verse = _numbers[1];

			return {
				chapter: chapter,
				verse: verse,
				section: section
			};
		} else if (numbers.length === 1) {
			var rangeIsChapter = start.verse === null;

			return rangeIsChapter ? {
				chapter: numbers[0],
				verse: null,
				section: section
			} : {
				chapter: start.chapter,
				verse: numbers[0],
				section: section
			};
		} else {
			return {
				chapter: start.chapter,
				verse: start.verse,
				section: section || start.section
			};
		}
	});

	return {
		book: mapOfAliasesToBookNames[stripPeriod(matchBook).toLowerCase()].name,
		start: start,
		end: end
	};
};

function valueOrNull(value) {
	return valueOr(value, null);
}

function valueOr(value, defaultValue) {
	return value === undefined ? evaluate(defaultValue) : value;
}

function evaluate(value) {
	return typeof value === 'function' ? value() : value;
}

function int(value) {
	return value === null ? value : parseInt(value, 10);
}

function stripPeriod(str) {
	return str[str.length - 1] === '.' ? str.substr(0, str.length - 1) : str;
}

function ifelse(predicate, truthyCase, falsyCase) {
	return evaluate(predicate) ? evaluate(truthyCase) : evaluate(falsyCase);
}

function separateSectionFromNumbers(ary) {
	var lastValue = ary[ary.length - 1];

	if (ary.length > 0 && isSection(lastValue)) {
		return {
			numbers: ary.slice(0, ary.length - 1).map(int),
			section: lastValue
		};
	} else {
		return {
			numbers: ary.map(int),
			section: null
		};
	}
}

function isSection(str) {
	return (/[a-z]/.test(str)
	);
}

var LESS_THAN = -1;
var WITHIN = 0;
var GREATER_THAN = 1;

function withinRange(rangeStart, rangeEnd, value) {
	return relative(rangeStart, rangeEnd, value) === WITHIN;
}

function relative(rangeStart, rangeEnd, value) {
	if (rangeStart.length !== rangeEnd.length || rangeEnd.length !== value.length || rangeStart.length === 0) {
		throw new Error('All values must have the same positive number of elements');
	}

	if (compareTwoValues(rangeStart, value) === LESS_THAN) {
		return LESS_THAN;
	} else if (compareTwoValues(rangeEnd, value) === GREATER_THAN) {
		return GREATER_THAN;
	}

	return WITHIN;
}

function compareTwoValues(target, value) {
	for (var i = 0; i < target.length; ++i) {
		var currentTarget = target[i];
		var currentValue = value[i];

		if (currentValue < currentTarget) {
			return LESS_THAN;
		} else if (currentValue > currentTarget) {
			return GREATER_THAN;
		}
	}

	return WITHIN;
}

var index$14 = withinRange;

withinRange.LESS_THAN_START = LESS_THAN;
withinRange.WITHIN = WITHIN;
withinRange.GREATER_THAN_END = GREATER_THAN;

withinRange.relative = relative;

function noop$1() {}

function assign$1(target) {
	var k,
	    source,
	    i = 1,
	    len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) {
			target[k] = source[k];
		}
	}

	return target;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode$1(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode$1(node) {
	node.parentNode.removeChild(node);
}

// TODO this is out of date
function destroyEach(iterations, detach, start) {
	for (var i = start; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].destroy(detach);
	}
}

function createElement$1(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function createComment$1() {
	return document.createComment('');
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function differs$1(a, b) {
	return a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
}

function dispatchObservers$1(component, group, newState, oldState) {
	for (var key in group) {
		if (!(key in newState)) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		if (differs$1(newValue, oldValue)) {
			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}
}

function get$2(key) {
	return key ? this._state[key] : this._state;
}

function fire$1(eventName, data) {
	var handlers = eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe$1(key, callback, options) {
	var group = options && options.defer ? this._observers.post : this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function cancel() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on$1(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function cancel() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set$2(newState) {
	this._set(assign$1({}, newState));
	if (this._root._lock) return;
	this._root._lock = true;
	callAll$1(this._root._beforecreate);
	callAll$1(this._root._oncreate);
	callAll$1(this._root._aftercreate);
	this._root._lock = false;
}

function callAll$1(fns) {
	while (fns && fns.length) {
		fns.pop()();
	}
}

var proto = {
	get: get$2,
	fire: fire$1,
	observe: observe$1,
	on: on$1,
	set: set$2
};

function recompute$2(state, newState, oldState, isInitial) {
	if (isInitial || 'root' in newState && differs$1(state.root, oldState.root) || 'pathname' in newState && differs$1(state.pathname, oldState.pathname)) {
		state.route = newState.route = template$2.computed.route(state.root, state.pathname);
	}

	if (isInitial || 'menu' in newState && differs$1(state.menu, oldState.menu)) {
		state.possibleRoutes = newState.possibleRoutes = template$2.computed.possibleRoutes(state.menu);
	}

	if (isInitial || 'route' in newState && differs$1(state.route, oldState.route) || 'possibleRoutes' in newState && differs$1(state.possibleRoutes, oldState.possibleRoutes)) {
		state.activeMenuItems = newState.activeMenuItems = template$2.computed.activeMenuItems(state.route, state.possibleRoutes);
	}

	if (isInitial || 'activeMenuItems' in newState && differs$1(state.activeMenuItems, oldState.activeMenuItems)) {
		state.isActive = newState.isActive = template$2.computed.isActive(state.activeMenuItems);
	}

	if (isInitial || 'root' in newState && differs$1(state.root, oldState.root)) {
		state.makeUrl = newState.makeUrl = template$2.computed.makeUrl(state.root);
	}

	if (isInitial || 'activeMenuItems' in newState && differs$1(state.activeMenuItems, oldState.activeMenuItems)) {
		state.activeParentMenuItem = newState.activeParentMenuItem = template$2.computed.activeParentMenuItem(state.activeMenuItems);
	}
}

var template$2 = function () {
	var flatmap = function flatmap(array, fn) {
		var output = [];
		array.forEach(function (item) {
			var additions = fn(item);
			Array.isArray(additions) ? output.push.apply(output, toConsumableArray(additions)) : output.push(additions);
		});
		return output;
	};

	var joinRoutes = function joinRoutes() {
		for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
			items[_key] = arguments[_key];
		}

		return items.map(function (item) {
			return item.route;
		}).join('');
	};
	var removeTrailingSlash = function removeTrailingSlash(route) {
		return route[route.length - 1] === '/' ? route.slice(0, route.length - 1) : route;
	};
	var exactMatchIgnoringTrailingSlash = function exactMatchIgnoringTrailingSlash(routeA, routeB) {
		return removeTrailingSlash(routeA) === removeTrailingSlash(routeB);
	};

	var possibilities = function possibilities(menu) {
		return flatmap(menu, function (item) {
			return item.children ? item.children.map(function (child) {
				return { route: joinRoutes(item, child), hierarchy: [item, child] };
			}) : { route: item.route, hierarchy: [item] };
		});
	};

	return {
		data: function data() {
			return {
				root: '',
				pathname: document.location.pathname,
				menu: [{
					name: 'Project Home',
					route: '/'
				}, {
					name: 'Historical timeline',
					route: '/timeline/',
					children: [{
						name: 'Timeline',
						route: ''
					}, {
						name: 'Table of dates',
						route: 'table.html'
					}]
				}, {
					name: 'The structure of the book',
					route: '/structure/',
					children: [{
						name: 'Explanation',
						route: 'explanation.html'
					}, {
						name: 'The book',
						route: ''
					}]
				}]
			};
		},

		computed: {
			route: function route(root, pathname) {
				return pathname.indexOf(root) === 0 ? pathname.slice(root.length) : pathname;
			},
			possibleRoutes: function possibleRoutes(menu) {
				return possibilities(menu);
			},
			activeMenuItems: function activeMenuItems(route, possibleRoutes) {
				var currentRoute = possibleRoutes.find(function (possibility) {
					return exactMatchIgnoringTrailingSlash(route, possibility.route);
				});

				return currentRoute && currentRoute.hierarchy;
			},
			isActive: function isActive(activeMenuItems) {
				return function () {
					for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						items[_key2] = arguments[_key2];
					}

					return activeMenuItems && items.every(function (item, i) {
						return activeMenuItems[i] && item.route === activeMenuItems[i].route;
					});
				};
			},
			makeUrl: function makeUrl(root) {
				return function () {
					return root + joinRoutes.apply(undefined, arguments);
				};
			},
			activeParentMenuItem: function activeParentMenuItem(activeMenuItems) {
				return activeMenuItems && activeMenuItems[0];
			}
		}
	};
}();

function encapsulateStyles$1(node) {
	setAttribute(node, 'svelte-2164047804', '');
}

function add_css$1() {
	var style = createElement$1('style');
	style.id = 'svelte-2164047804-style';
	style.textContent = "a[svelte-2164047804],[svelte-2164047804] a{white-space:nowrap;display:block}[svelte-2164047804].menu,[svelte-2164047804] .menu{display:flex;flex-wrap:wrap;font-family:Verdana, sans-serif;font-size:16px}[svelte-2164047804].parent-menu-box,[svelte-2164047804] .parent-menu-box{margin:4px}[svelte-2164047804].menu-item,[svelte-2164047804] .menu-item{padding:8px 16px;background-color:#e0e0e0;color:black;border-radius:2px}[svelte-2164047804].menu-item[data-active=true],[svelte-2164047804] .menu-item[data-active=true]{font-weight:bold}[svelte-2164047804].child-menu,[svelte-2164047804] .child-menu{padding-left:4px;padding-right:4px}[svelte-2164047804].child-item,[svelte-2164047804] .child-item{padding:4px 8px;color:black;background-color:#f5f5f5;font-size:14px}[svelte-2164047804].child-item[data-active=true],[svelte-2164047804] .child-item[data-active=true]{font-weight:bold}";
	appendNode(style, document.head);
}

function create_main_fragment$2(state, component) {
	var div, text_1, if_block_anchor;

	var each_block_value = state.menu;

	var each_block_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_iterations[i] = create_each_block$1(state, each_block_value, each_block_value[i], i, component);
	}

	var if_block = state.activeParentMenuItem && state.activeParentMenuItem.children && create_if_block$1(state, component);

	return {
		create: function create() {
			div = createElement$1('div');

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].create();
			}

			text_1 = createText("\n");
			if (if_block) if_block.create();
			if_block_anchor = createComment$1();
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			encapsulateStyles$1(div);
			div.className = "menu";
		},

		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].mount(div, null);
			}

			insertNode$1(text_1, target, anchor);
			if (if_block) if_block.mount(target, anchor);
			insertNode$1(if_block_anchor, target, anchor);
		},

		update: function update(changed, state) {
			var each_block_value = state.menu;

			if ('makeUrl' in changed || 'menu' in changed || 'isActive' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_iterations[i]) {
						each_block_iterations[i].update(changed, state, each_block_value, each_block_value[i], i);
					} else {
						each_block_iterations[i] = create_each_block$1(state, each_block_value, each_block_value[i], i, component);
						each_block_iterations[i].create();
						each_block_iterations[i].mount(div, null);
					}
				}

				for (; i < each_block_iterations.length; i += 1) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}

			if (state.activeParentMenuItem && state.activeParentMenuItem.children) {
				if (if_block) {
					if_block.update(changed, state);
				} else {
					if_block = create_if_block$1(state, component);
					if_block.create();
					if_block.mount(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.unmount();
				if_block.destroy();
				if_block = null;
			}
		},

		unmount: function unmount() {
			detachNode$1(div);

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].unmount();
			}

			detachNode$1(text_1);
			if (if_block) if_block.unmount();
			detachNode$1(if_block_anchor);
		},

		destroy: function destroy() {
			destroyEach(each_block_iterations, false, 0);

			if (if_block) if_block.destroy();
		}
	};
}

function create_each_block$1(state, each_block_value, item, item_index, component) {
	var span, a, a_href_value, a_data_active_value, text_value, text;

	return {
		create: function create() {
			span = createElement$1('span');
			a = createElement$1('a');
			text = createText(text_value = item.name);
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			span.className = "parent-menu-box";
			a.href = a_href_value = state.makeUrl(item);
			a.className = "menu-item";
			setAttribute(a, 'data-active', a_data_active_value = state.isActive(item));
		},

		mount: function mount(target, anchor) {
			insertNode$1(span, target, anchor);
			appendNode(a, span);
			appendNode(text, a);
		},

		update: function update(changed, state, each_block_value, item, item_index) {
			if (a_href_value !== (a_href_value = state.makeUrl(item))) {
				a.href = a_href_value;
			}

			if (a_data_active_value !== (a_data_active_value = state.isActive(item))) {
				setAttribute(a, 'data-active', a_data_active_value);
			}

			if (text_value !== (text_value = item.name)) {
				text.data = text_value;
			}
		},

		unmount: function unmount() {
			detachNode$1(span);
		},

		destroy: noop$1
	};
}

function create_each_block_1$1(state, each_block_value, child, child_index, component) {
	var a, a_href_value, a_data_active_value, text_value, text;

	return {
		create: function create() {
			a = createElement$1('a');
			text = createText(text_value = child.name);
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			a.href = a_href_value = state.makeUrl(state.activeParentMenuItem, child);
			a.className = "child-item";
			setAttribute(a, 'data-active', a_data_active_value = state.isActive(state.activeParentMenuItem, child));
		},

		mount: function mount(target, anchor) {
			insertNode$1(a, target, anchor);
			appendNode(text, a);
		},

		update: function update(changed, state, each_block_value, child, child_index) {
			if (a_href_value !== (a_href_value = state.makeUrl(state.activeParentMenuItem, child))) {
				a.href = a_href_value;
			}

			if (a_data_active_value !== (a_data_active_value = state.isActive(state.activeParentMenuItem, child))) {
				setAttribute(a, 'data-active', a_data_active_value);
			}

			if (text_value !== (text_value = child.name)) {
				text.data = text_value;
			}
		},

		unmount: function unmount() {
			detachNode$1(a);
		},

		destroy: noop$1
	};
}

function create_if_block$1(state, component) {
	var span;

	var each_block_value = state.activeParentMenuItem.children;

	var each_block_1_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_1_iterations[i] = create_each_block_1$1(state, each_block_value, each_block_value[i], i, component);
	}

	return {
		create: function create() {
			span = createElement$1('span');

			for (var i = 0; i < each_block_1_iterations.length; i += 1) {
				each_block_1_iterations[i].create();
			}
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			encapsulateStyles$1(span);
			span.className = "menu child-menu";
		},

		mount: function mount(target, anchor) {
			insertNode$1(span, target, anchor);

			for (var i = 0; i < each_block_1_iterations.length; i += 1) {
				each_block_1_iterations[i].mount(span, null);
			}
		},

		update: function update(changed, state) {
			var each_block_value = state.activeParentMenuItem.children;

			if ('makeUrl' in changed || 'activeParentMenuItem' in changed || 'isActive' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_1_iterations[i]) {
						each_block_1_iterations[i].update(changed, state, each_block_value, each_block_value[i], i);
					} else {
						each_block_1_iterations[i] = create_each_block_1$1(state, each_block_value, each_block_value[i], i, component);
						each_block_1_iterations[i].create();
						each_block_1_iterations[i].mount(span, null);
					}
				}

				for (; i < each_block_1_iterations.length; i += 1) {
					each_block_1_iterations[i].unmount();
					each_block_1_iterations[i].destroy();
				}
				each_block_1_iterations.length = each_block_value.length;
			}
		},

		unmount: function unmount() {
			detachNode$1(span);

			for (var i = 0; i < each_block_1_iterations.length; i += 1) {
				each_block_1_iterations[i].unmount();
			}
		},

		destroy: function destroy() {
			destroyEach(each_block_1_iterations, false, 0);
		}
	};
}

function Menu(options) {
	options = options || {};
	this._state = assign$1(template$2.data(), options.data);
	recompute$2(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._destroyed = false;
	if (!document.getElementById('svelte-2164047804-style')) add_css$1();

	this._fragment = create_main_fragment$2(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, null);
	}
}

assign$1(Menu.prototype, proto);

Menu.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	recompute$2(this._state, newState, oldState, false);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
};

Menu.prototype.teardown = Menu.prototype.destroy = function destroy(detach) {
	if (this._destroyed) return;
	this.fire('destroy');

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._destroyed = true;
};

function recompute$1(state, newState, oldState, isInitial) {
	if (isInitial || 'querystringParameters' in newState && differs$1(state.querystringParameters, oldState.querystringParameters)) {
		state.sort = newState.sort = template$1.computed.sort(state.querystringParameters);
	}

	if (isInitial || 'sort' in newState && differs$1(state.sort, oldState.sort)) {
		state.columnOrder = newState.columnOrder = template$1.computed.columnOrder(state.sort);
	}

	if (isInitial || 'timelineData' in newState && differs$1(state.timelineData, oldState.timelineData)) {
		state.eventsWithVerses = newState.eventsWithVerses = template$1.computed.eventsWithVerses(state.timelineData);
	}

	if (isInitial || 'eventsWithVerses' in newState && differs$1(state.eventsWithVerses, oldState.eventsWithVerses)) {
		state.eventsByReference = newState.eventsByReference = template$1.computed.eventsByReference(state.eventsWithVerses);
	}

	if (isInitial || 'sort' in newState && differs$1(state.sort, oldState.sort) || 'eventsByReference' in newState && differs$1(state.eventsByReference, oldState.eventsByReference) || 'eventsWithVerses' in newState && differs$1(state.eventsWithVerses, oldState.eventsWithVerses)) {
		state.events = newState.events = template$1.computed.events(state.sort, state.eventsByReference, state.eventsWithVerses);
	}
}

var template$1 = function () {
	var sortRange = index$14.relative;
	var Link = index.Link;


	var referenceRegex = createRegex();

	var flatMap = function flatMap(fn, ary) {
		return ary.reduce(function (acc, element) {
			return [].concat(toConsumableArray(acc), toConsumableArray(fn(element)));
		}, []);
	};
	var relationToTempleBurning = function relationToTempleBurning(amd) {
		return amd - 1486668;
	};
	var referenceToRange = function referenceToRange(_ref) {
		var chapter = _ref.chapter,
		    verse = _ref.verse;
		return [chapter, verse || 0];
	};
	var referenceToString = function referenceToString(_ref2) {
		var chapter = _ref2.chapter,
		    verse = _ref2.verse;

		return verse ? chapter + ':' + verse : chapter.toString();
	};
	var referenceRangeToString = function referenceRangeToString(_ref3) {
		var start = _ref3.start,
		    end = _ref3.end;

		var same = end && end.chapter === start.chapter && end.verse === start.verse;

		return same ? referenceToString(start) : referenceToString(start) + '\u2013' + referenceToString(end);
	};

	function getColumnOrders() {
		var c = function c(property, header) {
			var wrap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
			return { property: property, header: header, wrap: wrap };
		};
		var columns = {
			date: c('date', 'Date'),
			temple: c('templeRange', 'Days from temple burning', false),
			reference: c('reference', 'Revelation', false),
			revelationReferences: c('revelationReferences', 'Revelation', false),
			title: c('title', 'Event title')
		};

		return {
			bydate: [columns.date, columns.temple, columns.revelationReferences, columns.title],
			byverse: [columns.reference, columns.date, columns.temple, columns.title]
		};
	}

	var columnOrders = getColumnOrders();

	var formatters = {
		date: function date(_ref4) {
			var hebrew = _ref4.hebrew;
			return hebrew.start === hebrew.end ? hebrew.start : hebrew.start + ' to ' + hebrew.end;
		},
		templeRange: function templeRange(_ref5) {
			var amd = _ref5.amd;

			return amd.end === amd.start ? relationToTempleBurning(amd.start).toString() : relationToTempleBurning(amd.start) + ' to ' + relationToTempleBurning(amd.end);
		},
		reference: function reference(_ref6) {
			var _reference = _ref6.reference;
			return referenceRangeToString(_reference);
		},
		revelationReferences: function revelationReferences(_ref7) {
			var _revelationReferences = _ref7.revelationReferences;
			return _revelationReferences.map(referenceRangeToString).join(', ');
		},
		title: function title(_ref8) {
			var _title = _ref8.title;
			return _title;
		}
	};

	return {
		data: function data() {
			return {
				formatters: formatters
			};
		},

		computed: {
			sort: function sort(querystringParameters) {
				return querystringParameters.sort === 'bydate' ? 'bydate' : 'byverse';
			},
			columnOrder: function columnOrder(sort) {
				return columnOrders[sort];
			},
			eventsWithVerses: function eventsWithVerses(timelineData) {
				return timelineData.filter(function (event) {
					return event.type !== 'top';
				}).map(function (event) {
					var referenceMatches = index$9(referenceRegex, event.reference);

					var revelationReferences = [];

					referenceMatches.forEach(function (matches) {
						var range = extractRangeFromMatch([null].concat(toConsumableArray(matches)));
						if (range.book === 'Revelation') {
							var start = range.start,
							    end = range.end;

							revelationReferences.push({ start: start, end: end });
						}
					});

					return Object.assign({
						revelationReferences: revelationReferences
					}, event);
				});
			},
			eventsByReference: function eventsByReference(eventsWithVerses) {
				return flatMap(function (_ref9) {
					var title = _ref9.title,
					    amd = _ref9.amd,
					    hebrew = _ref9.hebrew,
					    revelationReferences = _ref9.revelationReferences;

					return revelationReferences.map(function (reference) {
						return Object.assign({ reference: reference }, {
							title: title,
							amd: amd,
							hebrew: hebrew
						});
					});
				}, eventsWithVerses).sort(function (a, b) {
					return sortRange(referenceToRange(b.reference.start), referenceToRange(b.reference.start), referenceToRange(a.reference.start));
				});
			},
			events: function events(sort, eventsByReference, eventsWithVerses) {
				return sort === 'bydate' ? eventsWithVerses : eventsByReference;
			}
		},
		components: {
			Link: Link
		}
	};
}();

function encapsulateStyles(node) {
	setAttribute(node, 'svelte-3770024735', '');
}

function add_css() {
	var style = createElement$1('style');
	style.id = 'svelte-3770024735-style';
	style.textContent = "[svelte-3770024735][data-wrap=false],[svelte-3770024735] [data-wrap=false]{white-space:nowrap}[svelte-3770024735]#container,[svelte-3770024735] #container{margin-top:16px}";
	appendNode(style, document.head);
}

function create_main_fragment$1(state, component) {
	var text, div, text_1, table, thead, tr, text_4, tbody;

	var revelationprojectmenu = new Menu({
		_root: component._root
	});

	var link_1_yield_fragment = create_link_yield_fragment(state, component);

	var link_1 = new template$1.components.Link({
		_root: component._root,
		_yield: link_1_yield_fragment,
		data: { parameters: { sort: state.sort === 'bydate' ? 'byverse' : 'bydate' } }
	});

	var each_block_value = state.columnOrder;

	var each_block_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_iterations[i] = create_each_block(state, each_block_value, each_block_value[i], i, component);
	}

	var each_block_value_1 = state.events;

	var each_block_1_iterations = [];

	for (var i = 0; i < each_block_value_1.length; i += 1) {
		each_block_1_iterations[i] = create_each_block_1(state, each_block_value_1, each_block_value_1[i], i, component);
	}

	return {
		create: function create() {
			revelationprojectmenu._fragment.create();
			text = createText("\n\n");
			div = createElement$1('div');
			link_1_yield_fragment.create();
			link_1._fragment.create();
			text_1 = createText("\n\n\t");
			table = createElement$1('table');
			thead = createElement$1('thead');
			tr = createElement$1('tr');

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].create();
			}

			text_4 = createText("\n\t\t");
			tbody = createElement$1('tbody');

			for (var i = 0; i < each_block_1_iterations.length; i += 1) {
				each_block_1_iterations[i].create();
			}
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			encapsulateStyles(div);
			div.id = "container";
			table.className = "pure-table pure-table-bordered";
		},

		mount: function mount(target, anchor) {
			revelationprojectmenu._fragment.mount(target, anchor);
			insertNode$1(text, target, anchor);
			insertNode$1(div, target, anchor);
			link_1._fragment.mount(div, null);
			appendNode(text_1, div);
			appendNode(table, div);
			appendNode(thead, table);
			appendNode(tr, thead);

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].mount(tr, null);
			}

			appendNode(text_4, table);
			appendNode(tbody, table);

			for (var i = 0; i < each_block_1_iterations.length; i += 1) {
				each_block_1_iterations[i].mount(tbody, null);
			}
		},

		update: function update(changed, state) {
			link_1_yield_fragment.update(changed, state);

			var link_1_changes = {};

			if ('sort' in changed) link_1_changes.parameters = { sort: state.sort === 'bydate' ? 'byverse' : 'bydate' };

			if (Object.keys(link_1_changes).length) link_1._set(link_1_changes);

			var each_block_value = state.columnOrder;

			if ('columnOrder' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_iterations[i]) {
						each_block_iterations[i].update(changed, state, each_block_value, each_block_value[i], i);
					} else {
						each_block_iterations[i] = create_each_block(state, each_block_value, each_block_value[i], i, component);
						each_block_iterations[i].create();
						each_block_iterations[i].mount(tr, null);
					}
				}

				for (; i < each_block_iterations.length; i += 1) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}

			var each_block_value_1 = state.events;

			if ('columnOrder' in changed || 'formatters' in changed || 'events' in changed) {
				for (var i = 0; i < each_block_value_1.length; i += 1) {
					if (each_block_1_iterations[i]) {
						each_block_1_iterations[i].update(changed, state, each_block_value_1, each_block_value_1[i], i);
					} else {
						each_block_1_iterations[i] = create_each_block_1(state, each_block_value_1, each_block_value_1[i], i, component);
						each_block_1_iterations[i].create();
						each_block_1_iterations[i].mount(tbody, null);
					}
				}

				for (; i < each_block_1_iterations.length; i += 1) {
					each_block_1_iterations[i].unmount();
					each_block_1_iterations[i].destroy();
				}
				each_block_1_iterations.length = each_block_value_1.length;
			}
		},

		unmount: function unmount() {
			revelationprojectmenu._fragment.unmount();
			detachNode$1(text);
			detachNode$1(div);

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].unmount();
			}

			for (var i = 0; i < each_block_1_iterations.length; i += 1) {
				each_block_1_iterations[i].unmount();
			}
		},

		destroy: function destroy() {
			revelationprojectmenu.destroy(false);
			link_1_yield_fragment.destroy();
			link_1.destroy(false);

			destroyEach(each_block_iterations, false, 0);

			destroyEach(each_block_1_iterations, false, 0);
		}
	};
}

function create_link_yield_fragment(state, component) {
	var text, text_1_value, text_1;

	return {
		create: function create() {
			text = createText("View ");
			text_1 = createText(text_1_value = state.sort === 'bydate' ? 'by verse' : 'by date');
		},

		mount: function mount(target, anchor) {
			insertNode$1(text, target, anchor);
			insertNode$1(text_1, target, anchor);
		},

		update: function update(changed, state) {
			if (text_1_value !== (text_1_value = state.sort === 'bydate' ? 'by verse' : 'by date')) {
				text_1.data = text_1_value;
			}
		},

		unmount: function unmount() {
			detachNode$1(text);
			detachNode$1(text_1);
		},

		destroy: noop$1
	};
}

function create_each_block(state, each_block_value, column, column_index, component) {
	var th, text_value, text;

	return {
		create: function create() {
			th = createElement$1('th');
			text = createText(text_value = column.header);
		},

		mount: function mount(target, anchor) {
			insertNode$1(th, target, anchor);
			appendNode(text, th);
		},

		update: function update(changed, state, each_block_value, column, column_index) {
			if (text_value !== (text_value = column.header)) {
				text.data = text_value;
			}
		},

		unmount: function unmount() {
			detachNode$1(th);
		},

		destroy: noop$1
	};
}

function create_each_block_1(state, each_block_value_1, row, row_index, component) {
	var tr;

	var each_block_value = state.columnOrder;

	var each_block_2_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_2_iterations[i] = create_each_block_2(state, each_block_value_1, row, row_index, each_block_value, each_block_value[i], i, component);
	}

	return {
		create: function create() {
			tr = createElement$1('tr');

			for (var i = 0; i < each_block_2_iterations.length; i += 1) {
				each_block_2_iterations[i].create();
			}
		},

		mount: function mount(target, anchor) {
			insertNode$1(tr, target, anchor);

			for (var i = 0; i < each_block_2_iterations.length; i += 1) {
				each_block_2_iterations[i].mount(tr, null);
			}
		},

		update: function update(changed, state, each_block_value_1, row, row_index) {
			var each_block_value = state.columnOrder;

			if ('columnOrder' in changed || 'formatters' in changed || 'events' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_2_iterations[i]) {
						each_block_2_iterations[i].update(changed, state, each_block_value_1, row, row_index, each_block_value, each_block_value[i], i);
					} else {
						each_block_2_iterations[i] = create_each_block_2(state, each_block_value_1, row, row_index, each_block_value, each_block_value[i], i, component);
						each_block_2_iterations[i].create();
						each_block_2_iterations[i].mount(tr, null);
					}
				}

				for (; i < each_block_2_iterations.length; i += 1) {
					each_block_2_iterations[i].unmount();
					each_block_2_iterations[i].destroy();
				}
				each_block_2_iterations.length = each_block_value.length;
			}
		},

		unmount: function unmount() {
			detachNode$1(tr);

			for (var i = 0; i < each_block_2_iterations.length; i += 1) {
				each_block_2_iterations[i].unmount();
			}
		},

		destroy: function destroy() {
			destroyEach(each_block_2_iterations, false, 0);
		}
	};
}

function create_each_block_2(state, each_block_value_1, row, row_index, each_block_value, column_1, column_index, component) {
	var td, td_data_wrap_value, text_value, text;

	return {
		create: function create() {
			td = createElement$1('td');
			text = createText(text_value = state.formatters[column_1.property](row));
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			setAttribute(td, 'data-wrap', td_data_wrap_value = column_1.wrap);
		},

		mount: function mount(target, anchor) {
			insertNode$1(td, target, anchor);
			appendNode(text, td);
		},

		update: function update(changed, state, each_block_value_1, row, row_index, each_block_value, column_1, column_index) {
			if (td_data_wrap_value !== (td_data_wrap_value = column_1.wrap)) {
				setAttribute(td, 'data-wrap', td_data_wrap_value);
			}

			if (text_value !== (text_value = state.formatters[column_1.property](row))) {
				text.data = text_value;
			}
		},

		unmount: function unmount() {
			detachNode$1(td);
		},

		destroy: noop$1
	};
}

function TableMain(options) {
	options = options || {};
	this._state = assign$1(template$1.data(), options.data);
	recompute$1(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._destroyed = false;
	if (!document.getElementById('svelte-3770024735-style')) add_css();

	if (!options._root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment$1(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, null);
	}

	if (!options._root) {
		this._lock = true;
		callAll$1(this._beforecreate);
		callAll$1(this._oncreate);
		callAll$1(this._aftercreate);
		this._lock = false;
	}
}

assign$1(TableMain.prototype, proto);

TableMain.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	recompute$1(this._state, newState, oldState, false);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
};

TableMain.prototype.teardown = TableMain.prototype.destroy = function destroy(detach) {
	if (this._destroyed) return;
	this.fire('destroy');

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._destroyed = true;
};

var timelineData = [{
	"title": "Burning of temple by Nebuchadnezzar",
	"hebrew": {
		"start": "Ab 9, 3413",
		"end": "Ab 9, 3413"
	},
	"macedonian": {
		"start": "NA",
		"end": "NA"
	},
	"gregorian": {
		"start": "August 1, 588 BC",
		"end": "August 1, 588 BC"
	},
	"josephus war": "6.250",
	"amd": {
		"start": 1246702,
		"end": 1246702
	},
	"slug": "burning-of-temple-by-nebuchadnezzar"
}, {
	"title": "Crucifixion",
	"hebrew": {
		"start": "Ab 14, 4030",
		"end": "Ab 14, 4030"
	},
	"macedonian": {
		"start": "Xanthicus 14, 341",
		"end": "Xanthicus 14, 341"
	},
	"gregorian": {
		"start": "April 4, 30",
		"end": "April 4, 30"
	},
	"amd": {
		"start": 1471937,
		"end": 1471937
	},
	"slug": "crucifixion"
}, {
	"title": "Resurrection",
	"hebrew": {
		"start": "Ab 16, 4030",
		"end": "Ab 16, 4030"
	},
	"macedonian": {
		"start": "Xanthicus 16, 341",
		"end": "Xanthicus 16, 341"
	},
	"gregorian": {
		"start": "April 6, 30",
		"end": "April 6, 30"
	},
	"amd": {
		"start": 1471939,
		"end": 1471939
	},
	"slug": "resurrection"
}, {
	"title": "Seven seals",
	"hebrew": {
		"start": "Ab 16, 4030",
		"end": "Tishri 1, 4066"
	},
	"macedonian": {
		"start": "Xanthicus 16, 341",
		"end": "Hyperberataios 1, 377"
	},
	"gregorian": {
		"start": "April 6, 30",
		"end": "September 8, 66"
	},
	"amd": {
		"start": 1471939,
		"end": 1485229
	},
	"type": "top",
	"dayHeight": 3,
	"slug": "seven-seals"
}, {
	"title": "First Seal - Tiberius",
	"hebrew": {
		"start": "4030",
		"end": "4037"
	},
	"macedonian": {
		"start": "341",
		"end": "348"
	},
	"gregorian": {
		"start": "April 22, 30",
		"end": "March 16, 37"
	},
	"amd": {
		"start": 1471955,
		"end": 1474475
	},
	"reference": "Revelation 6:1-2",
	"slug": "first-seal-tiberius"
}, {
	"title": "Ascension",
	"hebrew": {
		"start": "Iyar 24, 4030",
		"end": "Iyar 24, 4030"
	},
	"macedonian": {
		"start": "Xanthicus 24, 341",
		"end": "Xanthicus 24, 341"
	},
	"gregorian": {
		"start": "May 14, 30",
		"end": "May 14, 30"
	},
	"amd": {
		"start": 1471977,
		"end": 1471977
	},
	"reference": "Revelation 4-5",
	"slug": "ascension"
}, {
	"title": "Second Seal - Caligula",
	"hebrew": {
		"start": "4037",
		"end": "4040"
	},
	"macedonian": {
		"start": "348",
		"end": "351"
	},
	"gregorian": {
		"start": "March 16, 37",
		"end": "January 24, 41"
	},
	"amd": {
		"start": 1474475,
		"end": 1475885
	},
	"reference": "Revelation 6:3-4",
	"slug": "second-seal-caligula"
}, {
	"title": "Third Seal - Claudius",
	"hebrew": {
		"start": "4040",
		"end": "4054"
	},
	"macedonian": {
		"start": "351",
		"end": "365"
	},
	"gregorian": {
		"start": "January 24, 41",
		"end": "October 13, 54"
	},
	"amd": {
		"start": 1475885,
		"end": 1480895
	},
	"reference": "Revelation 6:5-6",
	"slug": "third-seal-claudius"
}, {
	"title": "Fourth Seal - Nero early years",
	"hebrew": {
		"start": "4054",
		"end": "4061"
	},
	"macedonian": {
		"start": "365",
		"end": "372"
	},
	"gregorian": {
		"start": "October 13, 54",
		"end": "early 66"
	},
	"amd": {
		"start": 1480895,
		"end": 1483647
	},
	"reference": "Revelation 6:7-8",
	"slug": "fourth-seal-nero-early-years"
}, {
	"title": "Fifth Seal",
	"hebrew": {
		"start": "4061",
		"end": "4066"
	},
	"macedonian": {
		"start": "372",
		"end": "377"
	},
	"gregorian": {
		"start": "62",
		"end": "66"
	},
	"amd": {
		"start": 1483532,
		"end": 1485114
	},
	"reference": "Revelation 6:9-11",
	"slug": "fifth-seal"
}, {
	"title": "Great Tribulation (Rome & Israel killing Christians)",
	"hebrew": {
		"start": "4061",
		"end": "Sivan 22, 4068"
	},
	"amd": {
		"start": 1483532,
		"end": 1485883
	},
	"type": "top",
	"dayHeight": 2,
	"slug": "great-tribulation-rome-israel-killing-christians"
}, {
	"title": "Sixth Seal - visible appearance of Christ in the sky",
	"hebrew": {
		"start": "Iyar 20 4066",
		"end": "Sivan 5, 4066"
	},
	"macedonian": {
		"start": "377",
		"end": "377"
	},
	"gregorian": {
		"start": "May 2, 66",
		"end": "May 18, 66"
	},
	"amd": {
		"start": 1485114,
		"end": 1485129
	},
	"reference": "Revelation 6:12; Rev 12:7-12",
	"slug": "sixth-seal-visible-appearance-of-christ-in-the-sky"
}, {
	"title": "Seventh Seal - silence in heaven",
	"hebrew": {
		"start": "Sivan 6, 4066",
		"end": "Tishri 1, 4066"
	},
	"macedonian": {
		"start": "Daisios 6, 377",
		"end": "Hyperberataios 1, 377"
	},
	"gregorian": {
		"start": "May 18, 66",
		"end": "September 8, 66"
	},
	"josephus war": "6.299",
	"amd": {
		"start": 1485129,
		"end": 1485229
	},
	"reference": "Revelation 8:1-6; Rev 16:1",
	"slug": "seventh-seal-silence-in-heaven"
}, {
	"title": "Ending sacrifice to Caesar and any foreigners?????",
	"hebrew": {
		"start": "Tammuz 17, 4066",
		"end": "Tammuz 17, 4066"
	},
	"macedonian": {
		"start": "Panemos 17, 377",
		"end": "Panemos 17, 377"
	},
	"gregorian": {
		"start": "June 27, 66",
		"end": "June 27, 66"
	},
	"josephus war": "2.408-410",
	"amd": {
		"start": 1485170,
		"end": 1485170
	},
	"slug": "ending-sacrifice-to-caesar-and-any-foreigners"
}, {
	"title": "Romans evacuated from Jerusalem",
	"hebrew": {
		"start": "Ellul 6",
		"end": "Ellul 6"
	},
	"macedonian": {
		"start": "Gorpiaios 6, 377",
		"end": "Gorpiaios 6, 377"
	},
	"gregorian": {
		"start": "August 26, 66",
		"end": "August 26, 66"
	},
	"josephus war": "2.449-456",
	"amd": {
		"start": 1485229,
		"end": 1485229
	},
	"slug": "romans-evacuated-from-jerusalem"
}, {
	"title": "The \"time\" portion of \"time, times, and half a time\"",
	"reference": "Revelation 12:14",
	"hebrew": {
		"start": "Elul 26, 4066",
		"end": "Heshvan 27, 4066"
	},
	"gregorian": {
		"start": "September 4, 66",
		"end": "November 4, 66"
	},
	"amd": {
		"start": 1485238,
		"end": 1485298
	},
	"type": "time",
	"slug": "the-time-portion-of-time-times-and-half-a-time"
}, {
	"title": "First Trumpet",
	"hebrew": {
		"start": "Tishri 1, 4066",
		"end": "Tishri 1, 4066"
	},
	"macedonian": {
		"start": "Hyperberataios 1, 377",
		"end": "Hyperberataios 1, 377"
	},
	"gregorian": {
		"start": "September 8, 66",
		"end": "September 8, 66"
	},
	"amd": {
		"start": 1485242,
		"end": 1485242
	},
	"reference": "Revelation 8:7",
	"slug": "first-trumpet"
}, {
	"title": "Seven trumpets",
	"hebrew": {
		"start": "Tishri 1, 4066",
		"end": "Ab 9, 4070"
	},
	"macedonian": {
		"start": "Hyperberataios 1, 377",
		"end": "Loos 9, 381"
	},
	"gregorian": {
		"start": "September 8, 66",
		"end": "August 3, 70"
	},
	"amd": {
		"start": 1485242,
		"end": 1486668
	},
	"type": "top",
	"dayHeight": 4,
	"slug": "seven-trumpets"
}, {
	"title": "Second Trumpet",
	"hebrew": {
		"start": "Tishri 15, 4066",
		"end": "Tishri 15, 4066"
	},
	"macedonian": {
		"start": "Hyperberataios 15, 377",
		"end": "Hyperberataios 15, 377"
	},
	"gregorian": {
		"start": "Sept 22, 66",
		"end": "Sept 22, 66"
	},
	"josephus war": "2:515",
	"amd": {
		"start": 1485256,
		"end": 1485256
	},
	"reference": "Revelation 8:8-9",
	"slug": "second-trumpet"
}, {
	"title": "Third Trumpet",
	"hebrew": {
		"start": "Tishri 22, 4066",
		"end": "Tishri 22, 4066"
	},
	"macedonian": {
		"start": "Hyperberataios 22, 377",
		"end": "Hyperberataios 22, 377"
	},
	"gregorian": {
		"start": "September 28, 66",
		"end": "September 28, 66"
	},
	"amd": {
		"start": 1485263,
		"end": 1485263
	},
	"reference": "Revelation 8:10-11",
	"slug": "third-trumpet"
}, {
	"title": "Fourth Trumpet - Cestius defeated",
	"hebrew": {
		"start": "Heshvan 9, 4066",
		"end": "Heshvan 9, 4066"
	},
	"macedonian": {
		"start": "Dios 9, 377",
		"end": "Dios 9, 377"
	},
	"gregorian": {
		"start": "October 15, 66",
		"end": "October 15, 66"
	},
	"josephus war": "2:555",
	"amd": {
		"start": 1485280,
		"end": 1485280
	},
	"reference": "Revelation 8:12-13",
	"slug": "fourth-trumpet-cestius-defeated"
}, {
	"title": "Fifth Trumpet - Nero orders Vespasian and Titus to invade Israel",
	"hebrew": {
		"start": "Heshvan 24, 4066",
		"end": "Heshvan 24, 4066"
	},
	"macedonian": {
		"start": "Dius 24, 377",
		"end": "Dius 24, 377"
	},
	"gregorian": {
		"start": "October 31, 66",
		"end": "October 31, 66"
	},
	"amd": {
		"start": 1485295,
		"end": 1485295
	},
	"reference": "Revelation 9:1",
	"slug": "fifth-trumpet-nero-orders-vespasian-and-titus-to-invade-israel"
}, {
	"title": "Five months lull in killing",
	"hebrew": {
		"start": "Heshvan 24, 4066",
		"end": "Vedar 25, 4067"
	},
	"macedonian": {
		"start": "Dius 24, 377",
		"end": "Dystos II 25, 377"
	},
	"gregorian": {
		"start": "October 31, 66",
		"end": "March 28, 67"
	},
	"amd": {
		"start": 1485295,
		"end": 1485444
	},
	"reference": "Revelation 9:5, Rev 9:10",
	"slug": "five-months-lull-in-killing"
}, {
	"title": "The \"times\" portion of \"time, times, and half a time\"",
	"reference": "Revelation 12:14",
	"hebrew": {
		"start": "Heshvan 24, 4066",
		"end": "Sivan 22, 4068"
	},
	"gregorian": {
		"start": "October 31, 66",
		"end": "June 9, 68"
	},
	"amd": {
		"start": 1485295,
		"end": 1485883
	},
	"type": "time",
	"slug": "the-times-portion-of-time-times-and-half-a-time"
}, {
	"title": "Great Wrath (Rome against Israel)",
	"hebrew": {
		"start": "Heshvan 24, 4066",
		"end": "4074"
	},
	"amd": {
		"start": 1485295,
		"end": 1487959
	},
	"type": "top",
	"dayHeight": 3,
	"slug": "great-wrath-rome-against-israel"
}, {
	"title": "Jewish preparations for defence of temple and city start in earnest",
	"hebrew": {
		"start": "Adar 19, 4067",
		"end": "Adar 19, 4067"
	},
	"macedonian": {
		"start": "Dystos 19, 378",
		"end": "Dystos 19, 378"
	},
	"gregorian": {
		"start": "February 20, 67",
		"end": "February 20, 67"
	},
	"amd": {
		"start": 1485408,
		"end": 1485408
	},
	"slug": "jewish-preparations-for-defence-of-temple-and-city-start-in-earnest"
}, {
	"title": "First three and a half years of the war of Titus the prince",
	"hebrew": {
		"start": "Adar 19, 4067",
		"end": "Ab 9, 4070"
	},
	"macedonian": {
		"start": "Dystos 19, 378",
		"end": "Loos 9, 381 SE"
	},
	"gregorian": {
		"start": "February 20, 67",
		"end": "August 3, 70"
	},
	"amd": {
		"start": 1485408,
		"end": 1486668
	},
	"reference": "Revelation 11:1, Rev 11:3-14",
	"slug": "first-three-and-a-half-years-of-the-war-of-titus-the-prince"
}, {
	"title": "Nero dies - Rome dies with him",
	"hebrew": {
		"start": "Sivan 22, 4068",
		"end": "Sivan 22, 4068"
	},
	"macedonian": {
		"start": "Daisios 22, 379",
		"end": "Daisios 22, 379"
	},
	"gregorian": {
		"start": "June 9, 68",
		"end": "June 9, 68"
	},
	"amd": {
		"start": 1485883,
		"end": 1485883
	},
	"reference": "Revelation 13:3",
	"slug": "nero-dies-rome-dies-with-him"
}, {
	"title": "Vespasian proclaimed emperor by armies of Egypt and Judea",
	"hebrew": {
		"start": "Tammuz 24, 4069",
		"end": "Tammuz 24, 4069"
	},
	"macedonian": {
		"start": "Panemos 24, 380",
		"end": "Panemos 24, 380"
	},
	"gregorian": {
		"start": "July 1, 69",
		"end": "July 1, 69"
	},
	"amd": {
		"start": 1486269,
		"end": 1486269
	},
	"reference": "Revelation 17:8-10",
	"slug": "vespasian-proclaimed-emperor-by-armies-of-egypt-and-judea"
}, {
	"title": "Vespasian crowned emperor - beast comes back to life",
	"hebrew": {
		"start": "Tebeth 20, 4069",
		"end": "Tebeth 20, 4069"
	},
	"macedonian": {
		"start": "Audynios 20, 380",
		"end": "Audynios 20, 380"
	},
	"gregorian": {
		"start": "December 21, 69",
		"end": "December 21, 69"
	},
	"amd": {
		"start": 1486443,
		"end": 1486443
	},
	"reference": "Revelation 13:3",
	"slug": "vespasian-crowned-emperor-beast-comes-back-to-life"
}, {
	"title": "Jerusalem surrounded by Titus/Vespasian armies",
	"hebrew": {
		"start": "Ab 14, 4070",
		"end": "Ab 14, 4070"
	},
	"macedonian": {
		"start": "Xanthicus 14, 381",
		"end": "Xanthicus 14, 381"
	},
	"gregorian": {
		"start": "April 12, 70",
		"end": "April 12, 70"
	},
	"josephus war": "5:99",
	"amd": {
		"start": 1486555,
		"end": 1486555
	},
	"slug": "jerusalem-surrounded-by-titusvespasian-armies"
}, {
	"title": "The \"half a time\" portion of \"time, times, and half a time\"",
	"reference": "Revelation 12:14",
	"hebrew": {
		"start": "Ab 14, 4070",
		"end": "Elul 8, 4070"
	},
	"gregorian": {
		"start": "April 12, 70 September 1, 70",
		"end": "April 12, 70 September 1, 70"
	},
	"amd": {
		"start": 1486555,
		"end": 1486696
	},
	"type": "time",
	"slug": "the-half-a-time-portion-of-time-times-and-half-a-time"
}, {
	"title": "Third wall of Jerusalem breached by Titus' battering rams",
	"hebrew": {
		"start": "Iyar 7, 4070",
		"end": "Iyar 7, 4070"
	},
	"macedonian": {
		"start": "Artemisios 7, 381",
		"end": "Artemisios 7, 381"
	},
	"gregorian": {
		"start": "May 5, 70",
		"end": "May 5, 70"
	},
	"josephus war": "5.300-302",
	"amd": {
		"start": 1486577,
		"end": 1486577
	},
	"slug": "third-wall-of-jerusalem-breached-by-titus-battering-rams"
}, {
	"title": "Second wall of Jerusalem breached by Titus' battering rams, but Romans ambushed, barely escaping. Many soldiers wounded.",
	"hebrew": {
		"start": "Iyar 12, 4070",
		"end": "Iyar 12, 4070"
	},
	"macedonian": {
		"start": "Artemisios 12, 381",
		"end": "Artemisios 12, 381"
	},
	"gregorian": {
		"start": "May 10, 70",
		"end": "May 10, 70"
	},
	"josephus war": "5.331-347",
	"amd": {
		"start": 1486582,
		"end": 1486582
	},
	"slug": "second-wall-of-jerusalem-breached-by-titus-battering-rams-but-romans-ambushed-barely-escaping-many-soldiers-wounded"
}, {
	"title": "Titus builds earthworks against Antonia Fortress & in northern city",
	"hebrew": {
		"start": "Iyar 20, 4070",
		"end": "Iyar 20, 4070"
	},
	"macedonian": {
		"start": "Artemisios 20, 381",
		"end": "Artemisios 20, 381"
	},
	"gregorian": {
		"start": "May 18, 70",
		"end": "May 18, 70"
	},
	"josephus war": "5.347-348",
	"amd": {
		"start": 1486591,
		"end": 1486591
	},
	"slug": "titus-builds-earthworks-against-antonia-fortress-in-northern-city"
}, {
	"title": "John undermines Antonia earthworks built by Titus and burns them",
	"hebrew": {
		"start": "Iyar 29, 4070",
		"end": "Iyar 29, 4070"
	},
	"macedonian": {
		"start": "Artemisios 29, 381",
		"end": "Artemisios 29, 381"
	},
	"gregorian": {
		"start": "May 27, 70",
		"end": "May 27, 70"
	},
	"josephus war": "5.466-490; 5.522-526",
	"amd": {
		"start": 1486599,
		"end": 1486599
	},
	"slug": "john-undermines-antonia-earthworks-built-by-titus-and-burns-them"
}, {
	"title": "Titus finally finishes Antonia earthworks",
	"hebrew": {
		"start": "Tammuz 1, 4070",
		"end": "Tammuz 1, 4070"
	},
	"macedonian": {
		"start": "Panemos 1, 381",
		"end": "Panemos 1, 381"
	},
	"gregorian": {
		"start": "June 27, 70",
		"end": "June 27, 70"
	},
	"josephus war": "6.1-22",
	"amd": {
		"start": 1486631,
		"end": 1486631
	},
	"slug": "titus-finally-finishes-antonia-earthworks"
}, {
	"title": "Antonia Fortress taken by Romans, but they are repulsed from temple",
	"hebrew": {
		"start": "Tammuz 5, 4070",
		"end": "Tammuz 5, 4070"
	},
	"macedonian": {
		"start": "Panemos 5, 381",
		"end": "Panemos 5, 381"
	},
	"gregorian": {
		"start": "July 1, 70",
		"end": "July 1, 70"
	},
	"josephus war": "6.54-67",
	"amd": {
		"start": 1486634,
		"end": 1486634
	},
	"slug": "antonia-fortress-taken-by-romans-but-they-are-repulsed-from-temple"
}, {
	"title": "Even the unlawful sacrifices now end in temple",
	"hebrew": {
		"start": "Tammuz 17, 4070",
		"end": "Tammuz 17, 4070"
	},
	"macedonian": {
		"start": "Panemus 17, 381",
		"end": "Panemus 17, 381"
	},
	"gregorian": {
		"start": "July 13, 70",
		"end": "July 13, 70"
	},
	"josephus war": "6.94",
	"amd": {
		"start": 1486646,
		"end": 1486646
	},
	"slug": "even-the-unlawful-sacrifices-now-end-in-temple"
}, {
	"title": "Antonia disconnected from temple by rebels; major setback for Romans",
	"hebrew": {
		"start": "Tammuz 24, 4070",
		"end": "Tammuz 24, 4070"
	},
	"macedonian": {
		"start": "Panemos 24, 381",
		"end": "Panemos 24, 381"
	},
	"gregorian": {
		"start": "July 20",
		"end": "July 20"
	},
	"josephus war": "6.166; 6:311",
	"amd": {
		"start": 1486653,
		"end": 1486653
	},
	"slug": "antonia-disconnected-from-temple-by-rebels-major-setback-for-romans"
}, {
	"title": "Romans burned alive by rebels in west portico ambush",
	"hebrew": {
		"start": "Tammuz 27, 4070",
		"end": "Tammuz 27, 4070"
	},
	"macedonian": {
		"start": "Panemos 27, 381",
		"end": "Panemos 27, 381"
	},
	"gregorian": {
		"start": "July 23, 70",
		"end": "July 23, 70"
	},
	"josephus war": "6.170-190",
	"amd": {
		"start": 1486656,
		"end": 1486656
	},
	"slug": "romans-burned-alive-by-rebels-in-west-portico-ambush"
}, {
	"title": "Prophets are killed",
	"hebrew": {
		"start": "Ab 5, 4070",
		"end": "Ab 5, 4070"
	},
	"macedonian": {
		"start": "Loos 5, 381",
		"end": "Loos 5, 381"
	},
	"gregorian": {
		"start": "July 31",
		"end": "July 31"
	},
	"amd": {
		"start": 1486664,
		"end": 1486664
	},
	"reference": "Revelation 11:7-11",
	"slug": "prophets-are-killed"
}, {
	"title": "Roman battering rams utterly unable to penetrate western wall of Temple. Romans suffer heavy losses seeking to scale walls",
	"hebrew": {
		"start": "Ab 8, 4070",
		"end": "Ab 8, 4070"
	},
	"macedonian": {
		"start": "Loos 8, 381",
		"end": "Loos 8, 381"
	},
	"gregorian": {
		"start": "August 2",
		"end": "August 2"
	},
	"josephus war": "6.220-228",
	"amd": {
		"start": 1486667,
		"end": 1486667
	},
	"reference": "Revelation 11:7-11",
	"slug": "roman-battering-rams-utterly-unable-to-penetrate-western-wall-of-temple-romans-suffer-heavy-losses-seeking-to-scale-walls"
}, {
	"title": "Romans scale wall in dead of night and capture temple",
	"hebrew": {
		"start": "Ab 8, 4070",
		"end": "Ab 8, 4070"
	},
	"macedonian": {
		"start": "Loos 8, 381",
		"end": "Loos 8, 381"
	},
	"gregorian": {
		"start": "August 2, 70",
		"end": "August 2, 70"
	},
	"amd": {
		"start": 1486667,
		"end": 1486667
	},
	"slug": "romans-scale-wall-in-dead-of-night-and-capture-temple"
}, {
	"title": "Resurrection and events of Rev. 11:11-19",
	"hebrew": {
		"start": "Ab 9, 4070",
		"end": "Ab 9, 4070"
	},
	"macedonian": {
		"start": "Loos 9, 381",
		"end": "Loos 9, 381"
	},
	"gregorian": {
		"start": "August 3, 70",
		"end": "August 3, 70"
	},
	"amd": {
		"start": 1486668,
		"end": 1486668
	},
	"reference": "Rev. 11:11-19",
	"slug": "resurrection-and-events-of-rev-1111-19"
}, {
	"title": "Temple burned",
	"hebrew": {
		"start": "Ab 9, 4070",
		"end": "Ab 9, 4070"
	},
	"macedonian": {
		"start": "Loos 9, 381",
		"end": "Loos 9, 381"
	},
	"gregorian": {
		"start": "August 3, 70",
		"end": "August 3, 70"
	},
	"josephus war": "6:250; 6.233-237; 6.265, 271ff, 281-288",
	"amd": {
		"start": 1486668,
		"end": 1486668
	},
	"slug": "temple-burned"
}, {
	"title": "Forty months",
	"reference": "Revelation 11:2",
	"hebrew": {
		"start": "Ab 9, 4070",
		"end": "Tebeth 29, AD 4074"
	},
	"gregorian": {
		"start": "August 3, 70",
		"end": "January 15, AD 74"
	},
	"amd": {
		"start": 1486668,
		"end": 1487928
	},
	"type": "time",
	"slug": "forty-months"
}, {
	"title": "Second three and a half years of the war of Titus the prince",
	"hebrew": {
		"start": "Ab 9, 4070",
		"end": "Tebeth 29, 4073"
	},
	"macedonian": {
		"start": "Loos 9, 381 SE",
		"end": "Audynios 29, 384"
	},
	"gregorian": {
		"start": "August 3, 70",
		"end": "January 15, 74"
	},
	"amd": {
		"start": 1486668,
		"end": 1487929
	},
	"reference": "Revelation 11:2; Rev 18:1-24",
	"slug": "second-three-and-a-half-years-of-the-war-of-titus-the-prince"
}, {
	"title": "1290 days",
	"reference": "Daniel 12:11",
	"hebrew": {
		"start": "Ab 9, 4070",
		"end": "Shebat 30, 4074"
	},
	"gregorian": {
		"start": "August 3, 70",
		"end": "February 14, 74"
	},
	"amd": {
		"start": 1486668,
		"end": 1487959
	},
	"type": "time",
	"slug": "1290-days"
}, {
	"title": "Titus orders earthworks against Upper City",
	"hebrew": {
		"start": "Ab 19, 4070",
		"end": "Ab 19, 4070"
	},
	"macedonian": {
		"start": "Loos 19, 381",
		"end": "Loos 19, 381"
	},
	"gregorian": {
		"start": "August 14, 70",
		"end": "August 14, 70"
	},
	"josephus war": "6.374",
	"amd": {
		"start": 1486678,
		"end": 1486678
	},
	"slug": "titus-orders-earthworks-against-upper-city"
}, {
	"title": "Jerusalem completely defeated",
	"hebrew": {
		"start": "Elul 8, 4070",
		"end": "Elul 8, 4070"
	},
	"macedonian": {
		"start": "Gorpiaios 8, 381",
		"end": "Gorpiaios 8, 381"
	},
	"gregorian": {
		"start": "September 1, 70",
		"end": "September 1, 70"
	},
	"josephus war": "6:407",
	"amd": {
		"start": 1486696,
		"end": 1486696
	},
	"slug": "jerusalem-completely-defeated"
}, {
	"title": "Romans stamp out all resistance in Israel (other than Masada)",
	"hebrew": {
		"start": "Tebeth 29, 4074",
		"end": "Tebeth 29, 4074"
	},
	"macedonian": {
		"start": "Audynios 29, 385",
		"end": "Audynios 29, 385"
	},
	"gregorian": {
		"start": "January 15, 74",
		"end": "January 15, 74"
	},
	"josephus war": "Book 7",
	"amd": {
		"start": 1487928,
		"end": 1487928
	},
	"slug": "romans-stamp-out-all-resistance-in-israel-other-than-masada"
}, {
	"title": "Romans finish their atrocities against Jews throughout empire",
	"hebrew": {
		"start": "Shebat 30, 4074",
		"end": "Shebat 30, 4074"
	},
	"macedonian": {
		"start": "Peritios 30, 385",
		"end": "Peritios 30, 385"
	},
	"gregorian": {
		"start": "February 15, 74",
		"end": "February 15, 74"
	},
	"amd": {
		"start": 1487959,
		"end": 1487959
	},
	"slug": "romans-finish-their-atrocities-against-jews-throughout-empire"
}, {
	"title": "1335 days",
	"reference": "Daniel 12:12",
	"hebrew": {
		"start": "Ab 9, 4070",
		"end": "Nisan 15, 4074"
	},
	"gregorian": {
		"start": "August 3, 70",
		"end": "March 31, 74"
	},
	"amd": {
		"start": 1488003,
		"end": 1488003
	},
	"type": "time",
	"slug": "1335-days"
}, {
	"title": "Masada fell",
	"hebrew": {
		"start": "Nisan 15, 4074",
		"end": "Nisan 15, 4074"
	},
	"macedonian": {
		"start": "Xanthicus 15, 385",
		"end": "Xanthicus 15, 385"
	},
	"gregorian": {
		"start": "March 30, 74",
		"end": "March 30, 74"
	},
	"amd": {
		"start": 1488003,
		"end": 1488003
	},
	"reference": "Daniel 12:12",
	"slug": "masada-fell"
}];

var attachQuerystringData = index.attachQuerystringData;
var getCurrentParameters = index.getCurrentParameters;


var component = new TableMain({
	target: document.querySelector('#target'),
	data: {
		timelineData: timelineData,
		querystringParameters: getCurrentParameters()
	}
});

attachQuerystringData(component);

}());
//# sourceMappingURL=table-bundle.js.map
