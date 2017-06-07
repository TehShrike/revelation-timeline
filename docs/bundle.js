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
	function get_block(state) {
		if (state.parameters) return create_if_block;
		return create_if_block_1;
	}

	var current_block = get_block(state);
	var if_block = current_block(state, component);

	var if_block_anchor = createComment();

	return {
		mount: function mount(target, anchor) {
			if_block.mount(target, anchor);
			insertNode(if_block_anchor, target, anchor);
		},

		update: function update(changed, state) {
			if (current_block === (current_block = get_block(state)) && if_block) {
				if_block.update(changed, state);
			} else {
				if_block.destroy(true);
				if_block = current_block(state, component);
				if_block.mount(if_block_anchor.parentNode, if_block_anchor);
			}
		},

		destroy: function destroy(detach) {
			if_block.destroy(detach);

			if (detach) {
				detachNode(if_block_anchor);
			}
		}
	};
}

function create_if_block(state, component) {
	var a_href_value, a_class_value, a_style_value;

	var a = createElement('a');
	a.href = a_href_value = state.querystring;
	a.className = a_class_value = state.className;
	a.style.cssText = a_style_value = state.style;

	function click_handler(event) {
		component.navigate(event);
	}

	addEventListener(a, 'click', click_handler);
	component.refs.link = a;
	if (component._yield) component._yield.mount(a, null);

	return {
		mount: function mount(target, anchor) {
			insertNode(a, target, anchor);
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

		destroy: function destroy(detach) {
			removeEventListener(a, 'click', click_handler);
			if (component.refs.link === a) component.refs.link = null;
			if (component._yield) component._yield.destroy(detach);

			if (detach) {
				detachNode(a);
			}
		}
	};
}

function create_if_block_1(state, component) {
	var a_class_value, a_style_value;

	var a = createElement('a');
	a.className = a_class_value = state.className;
	a.style.cssText = a_style_value = state.style;
	if (component._yield) component._yield.mount(a, null);

	return {
		mount: function mount(target, anchor) {
			insertNode(a, target, anchor);
		},

		update: function update(changed, state) {
			if (a_class_value !== (a_class_value = state.className)) {
				a.className = a_class_value;
			}

			if (a_style_value !== (a_style_value = state.style)) {
				a.style.cssText = a_style_value;
			}
		},

		destroy: function destroy(detach) {
			if (component._yield) component._yield.destroy(detach);

			if (detach) {
				detachNode(a);
			}
		}
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
	if (options.target) this._fragment.mount(options.target, null);
}

assign(Link.prototype, template.methods, {
	get: get$1,
	fire: fire,
	observe: observe,
	on: on,
	set: set$1,
	_flush: _flush
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

	this._fragment.destroy(detach !== false);
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function createElement(name) {
	return document.createElement(name);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function addEventListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeEventListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function createComment() {
	return document.createComment('');
}

function differs(a, b) {
	return a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
}

function assign(target) {
	for (var i = 1; i < arguments.length; i += 1) {
		var source = arguments[i];
		for (var k in source) {
			target[k] = source[k];
		}
	}

	return target;
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
	this._root._flush();
}

function _flush() {
	if (!this._renderHooks) return;

	while (this._renderHooks.length) {
		this._renderHooks.pop()();
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

function assign$1(target) {
	for (var i = 1; i < arguments.length; i += 1) {
		var source = arguments[i];
		for (var k in source) {
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

function addEventListener$1(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeEventListener$1(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

var transitionManager = {
	running: false,
	transitions: [],

	add: function add(transition) {
		transitionManager.transitions.push(transition);

		if (!this.running) {
			this.running = true;
			this.next();
		}
	},

	next: function next() {
		transitionManager.running = false;

		var now = window.performance.now();
		var i = transitionManager.transitions.length;

		while (i--) {
			var transition = transitionManager.transitions[i];

			if (transition.program && now >= transition.program.end) {
				transition.done();
			}

			if (transition.pending && now >= transition.pending.start) {
				transition.start(transition.pending);
			}

			if (transition.running) {
				transition.update(now);
				transitionManager.running = true;
			} else if (!transition.pending) {
				transitionManager.transitions.splice(i, 1);
			}
		}

		if (transitionManager.running) {
			requestAnimationFrame(transitionManager.next);
		}
	}
};

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
	this._root._flush();
}

function _flush$1() {
	if (!this._renderHooks) return;

	while (this._renderHooks.length) {
		this._renderHooks.pop()();
	}
}

var proto = {
	get: get$2,
	fire: fire$1,
	observe: observe$1,
	on: on$1,
	set: set$2,
	_flush: _flush$1
};

function recompute$2(state, newState, oldState, isInitial) {
	if (isInitial || 'point' in newState && differs$1(state.point, oldState.point) || 'height' in newState && differs$1(state.height, oldState.height)) {
		state.top = newState.top = template$2.computed.top(state.point, state.height);
	}
}

var template$2 = function () {
	return {
		data: function data() {
			return {
				point: 0,
				left: 0
			};
		},
		oncreate: function oncreate() {
			var container = this.refs.container;

			var height = container.clientHeight;

			this.set({
				height: height
			});
		},

		computed: {
			top: function top(point, height) {
				return point - height / 2;
			}
		}
	};
}();

function add_css$1() {
	var style = createElement$1('style');
	style.id = "svelte-629105964-style";
	style.textContent = "\n\t[svelte-629105964].vcentered, [svelte-629105964] .vcentered {\n\t\tposition: absolute;\n\t}\n";
	appendNode(style, document.head);
}

function create_main_fragment$2(state, component) {
	var div_style_value;

	var div = createElement$1('div');
	setAttribute(div, 'svelte-629105964', '');
	div.style.cssText = div_style_value = "top: " + state.top + "px; left: " + state.left + "px;";
	div.className = "vcentered";
	component.refs.container = div;
	if (component._yield) component._yield.mount(div, null);

	return {
		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
		},

		update: function update(changed, state) {
			if (div_style_value !== (div_style_value = "top: " + state.top + "px; left: " + state.left + "px;")) {
				div.style.cssText = div_style_value;
			}
		},

		destroy: function destroy(detach) {
			if (component.refs.container === div) component.refs.container = null;
			if (component._yield) component._yield.destroy(detach);

			if (detach) {
				detachNode$1(div);
			}
		}
	};
}

function VerticallyCentered(options) {
	options = options || {};
	this.refs = {};
	this._state = assign$1(template$2.data(), options.data);
	recompute$2(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if (!document.getElementById("svelte-629105964-style")) add_css$1();

	this._fragment = create_main_fragment$2(this._state, this);
	if (options.target) this._fragment.mount(options.target, null);

	if (options._root) {
		options._root._renderHooks.push(template$2.oncreate.bind(this));
	} else {
		template$2.oncreate.call(this);
	}
}

assign$1(VerticallyCentered.prototype, proto);

VerticallyCentered.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	recompute$2(this._state, newState, oldState, false);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
};

VerticallyCentered.prototype.teardown = VerticallyCentered.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	this._fragment.destroy(detach !== false);
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function multiplyIndentByWidth(indentLevel) {
	return indentLevel * 60;
}

function recompute$3(state, newState, oldState, isInitial) {
	if (isInitial || 'dayHeight' in newState && differs$1(state.dayHeight, oldState.dayHeight)) {
		state.multiplyDaysByHeight = newState.multiplyDaysByHeight = template$3.computed.multiplyDaysByHeight(state.dayHeight);
		state.singleDayHeight = newState.singleDayHeight = template$3.computed.singleDayHeight(state.dayHeight);
	}
}

var template$3 = function () {
	return {
		data: function data() {
			return {
				clickable: false
			};
		},

		helpers: {
			multiplyIndentByWidth: multiplyIndentByWidth
		},
		computed: {
			multiplyDaysByHeight: function multiplyDaysByHeight(dayHeight) {
				return function (days) {
					return days * dayHeight;
				};
			},
			singleDayHeight: function singleDayHeight(dayHeight) {
				return Math.min(dayHeight, 4);
			}
		},
		components: {
			Link: index.Link
		},
		methods: {
			click: function click(timelineEvent) {
				if (this.get('clickable')) {
					this.fire('eventClick', timelineEvent);
				}
			}
		}
	};
}();

function add_css$2() {
	var style = createElement$1('style');
	style.id = "svelte-3114443404-style";
	style.textContent = "\n[svelte-3114443404][data-clickable=true], [svelte-3114443404] [data-clickable=true] {\n\tcursor: pointer;\n}\n";
	appendNode(style, document.head);
}

function create_main_fragment$3(state, component) {
	var each_block_value = state.timeline;

	var each_block_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_iterations[i] = create_each_block$1(state, each_block_value, each_block_value[i], i, component);
	}

	var each_block_anchor = createComment$1();

	return {
		mount: function mount(target, anchor) {
			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].mount(target, null);
			}

			insertNode$1(each_block_anchor, target, anchor);
		},

		update: function update(changed, state) {
			var each_block_value = state.timeline;

			if ('timeline' in changed || 'multiplyDaysByHeight' in changed || 'singleDayHeight' in changed || 'clickable' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_iterations[i]) {
						each_block_iterations[i].update(changed, state, each_block_value, each_block_value[i], i);
					} else {
						each_block_iterations[i] = create_each_block$1(state, each_block_value, each_block_value[i], i, component);
						each_block_iterations[i].mount(each_block_anchor.parentNode, each_block_anchor);
					}
				}

				destroyEach(each_block_iterations, true, each_block_value.length);
				each_block_iterations.length = each_block_value.length;
			}
		},

		destroy: function destroy(detach) {
			destroyEach(each_block_iterations, detach, 0);

			if (detach) {
				detachNode$1(each_block_anchor);
			}
		}
	};
}

function create_each_block$1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	function get_block(state, each_block_value, timelineEvent, timelineEvent_index) {
		if (timelineEvent.axis.end === timelineEvent.axis.start) return create_if_block$2;
		return create_if_block_1$2;
	}

	var current_block = get_block(state, each_block_value, timelineEvent, timelineEvent_index);
	var if_block = current_block(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var if_block_anchor = createComment$1();

	return {
		mount: function mount(target, anchor) {
			if_block.mount(target, anchor);
			insertNode$1(if_block_anchor, target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			if (current_block === (current_block = get_block(state, each_block_value, timelineEvent, timelineEvent_index)) && if_block) {
				if_block.update(changed, state, each_block_value, timelineEvent, timelineEvent_index);
			} else {
				if_block.destroy(true);
				if_block = current_block(state, each_block_value, timelineEvent, timelineEvent_index, component);
				if_block.mount(if_block_anchor.parentNode, if_block_anchor);
			}
		},

		destroy: function destroy(detach) {
			if_block.destroy(detach);

			if (detach) {
				detachNode$1(if_block_anchor);
			}
		}
	};
}

function create_vcenter_yield_fragment$1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var div_data_title_value, div_data_days_value, div_style_value;

	var div = createElement$1('div');
	setAttribute(div, 'svelte-3114443404', '');
	div.className = "event";
	setAttribute(div, 'data-title', div_data_title_value = timelineEvent.title);
	setAttribute(div, 'data-days', div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1);
	div.style.cssText = div_style_value = "height: " + state.singleDayHeight + "px;";
	addEventListener$1(div, 'mouseover', mouseover_handler);
	addEventListener$1(div, 'mouseleave', mouseleave_handler);
	addEventListener$1(div, 'click', click_handler);

	div._svelte = {
		component: component,
		each_block_value: each_block_value,
		timelineEvent_index: timelineEvent_index
	};

	return {
		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			if (div_data_title_value !== (div_data_title_value = timelineEvent.title)) {
				setAttribute(div, 'data-title', div_data_title_value);
			}

			if (div_data_days_value !== (div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1)) {
				setAttribute(div, 'data-days', div_data_days_value);
			}

			if (div_style_value !== (div_style_value = "height: " + state.singleDayHeight + "px;")) {
				div.style.cssText = div_style_value;
			}

			div._svelte.each_block_value = each_block_value;
			div._svelte.timelineEvent_index = timelineEvent_index;
		},

		destroy: function destroy(detach) {
			removeEventListener$1(div, 'mouseover', mouseover_handler);
			removeEventListener$1(div, 'mouseleave', mouseleave_handler);
			removeEventListener$1(div, 'click', click_handler);

			if (detach) {
				detachNode$1(div);
			}
		}
	};
}

function create_link_yield_fragment(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var div_id_value, div_style_value, div_data_top_value, div_data_left_value, div_data_title_value, div_data_days_value;

	var div = createElement$1('div');
	setAttribute(div, 'svelte-3114443404', '');
	div.id = div_id_value = timelineEvent.slug;
	div.style.cssText = div_style_value = "\n\t\t\t\t\tposition: absolute;\n\t\t\t\t\ttop: " + state.multiplyDaysByHeight(timelineEvent.axisAfterStart) + "px; \n\t\t\t\t\tleft: " + template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel) + "px;\n\t\t\t\t\theight: " + state.multiplyDaysByHeight(timelineEvent.visibleDays) + "px;\n\t\t\t\t";
	setAttribute(div, 'data-top', div_data_top_value = state.multiplyDaysByHeight(timelineEvent.axisAfterStart));
	setAttribute(div, 'data-left', div_data_left_value = template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel));
	div.className = "event";
	setAttribute(div, 'data-title', div_data_title_value = timelineEvent.title);
	setAttribute(div, 'data-days', div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1);
	addEventListener$1(div, 'mouseover', mouseover_handler_1);
	addEventListener$1(div, 'mouseleave', mouseleave_handler_1);
	addEventListener$1(div, 'click', click_handler_1);

	div._svelte = {
		component: component,
		each_block_value: each_block_value,
		timelineEvent_index: timelineEvent_index
	};

	return {
		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			if (div_id_value !== (div_id_value = timelineEvent.slug)) {
				div.id = div_id_value;
			}

			if (div_style_value !== (div_style_value = "\n\t\t\t\t\tposition: absolute;\n\t\t\t\t\ttop: " + state.multiplyDaysByHeight(timelineEvent.axisAfterStart) + "px; \n\t\t\t\t\tleft: " + template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel) + "px;\n\t\t\t\t\theight: " + state.multiplyDaysByHeight(timelineEvent.visibleDays) + "px;\n\t\t\t\t")) {
				div.style.cssText = div_style_value;
			}

			if (div_data_top_value !== (div_data_top_value = state.multiplyDaysByHeight(timelineEvent.axisAfterStart))) {
				setAttribute(div, 'data-top', div_data_top_value);
			}

			if (div_data_left_value !== (div_data_left_value = template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel))) {
				setAttribute(div, 'data-left', div_data_left_value);
			}

			if (div_data_title_value !== (div_data_title_value = timelineEvent.title)) {
				setAttribute(div, 'data-title', div_data_title_value);
			}

			if (div_data_days_value !== (div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1)) {
				setAttribute(div, 'data-days', div_data_days_value);
			}

			div._svelte.each_block_value = each_block_value;
			div._svelte.timelineEvent_index = timelineEvent_index;
		},

		destroy: function destroy(detach) {
			removeEventListener$1(div, 'mouseover', mouseover_handler_1);
			removeEventListener$1(div, 'mouseleave', mouseleave_handler_1);
			removeEventListener$1(div, 'click', click_handler_1);

			if (detach) {
				detachNode$1(div);
			}
		}
	};
}

function create_if_block$2(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var vcenter_1_yield_fragment = create_vcenter_yield_fragment$1(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var vcenter_1 = new VerticallyCentered({
		target: null,
		_root: component._root,
		_yield: vcenter_1_yield_fragment,
		data: { left: template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel), point: state.multiplyDaysByHeight(timelineEvent.axisAfterStart) }
	});

	return {
		mount: function mount(target, anchor) {
			vcenter_1._fragment.mount(target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			vcenter_1_yield_fragment.update(changed, state, each_block_value, timelineEvent, timelineEvent_index);

			var vcenter_1_changes = {};

			if ('timeline' in changed) vcenter_1_changes.left = template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel);
			if ('multiplyDaysByHeight' in changed || 'timeline' in changed) vcenter_1_changes.point = state.multiplyDaysByHeight(timelineEvent.axisAfterStart);

			if (Object.keys(vcenter_1_changes).length) vcenter_1.set(vcenter_1_changes);
		},

		destroy: function destroy(detach) {
			vcenter_1.destroy(detach);
		}
	};
}

function create_if_block_1$2(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var link_1_yield_fragment = create_link_yield_fragment(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var link_1 = new template$3.components.Link({
		target: null,
		_root: component._root,
		_yield: link_1_yield_fragment,
		data: { parameters: state.clickable ? { zoom: timelineEvent.slug } : null }
	});

	return {
		mount: function mount(target, anchor) {
			link_1._fragment.mount(target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			link_1_yield_fragment.update(changed, state, each_block_value, timelineEvent, timelineEvent_index);

			var link_1_changes = {};

			if ('clickable' in changed || 'timeline' in changed) link_1_changes.parameters = state.clickable ? { zoom: timelineEvent.slug } : null;

			if (Object.keys(link_1_changes).length) link_1.set(link_1_changes);
		},

		destroy: function destroy(detach) {
			link_1.destroy(detach);
		}
	};
}

function mouseover_handler(event) {
	var component = this._svelte.component;
	var each_block_value = this._svelte.each_block_value,
	    timelineEvent_index = this._svelte.timelineEvent_index,
	    timelineEvent = each_block_value[timelineEvent_index];
	component.fire('startHover', timelineEvent);
}

function mouseleave_handler(event) {
	var component = this._svelte.component;
	var each_block_value = this._svelte.each_block_value,
	    timelineEvent_index = this._svelte.timelineEvent_index,
	    timelineEvent = each_block_value[timelineEvent_index];
	component.fire('endHover', timelineEvent);
}

function click_handler(event) {
	var component = this._svelte.component;
	var each_block_value = this._svelte.each_block_value,
	    timelineEvent_index = this._svelte.timelineEvent_index,
	    timelineEvent = each_block_value[timelineEvent_index];
	component.click(timelineEvent);
}

function mouseover_handler_1(event) {
	var component = this._svelte.component;
	var each_block_value = this._svelte.each_block_value,
	    timelineEvent_index = this._svelte.timelineEvent_index,
	    timelineEvent = each_block_value[timelineEvent_index];
	component.fire('startHover', timelineEvent);
}

function mouseleave_handler_1(event) {
	var component = this._svelte.component;
	var each_block_value = this._svelte.each_block_value,
	    timelineEvent_index = this._svelte.timelineEvent_index,
	    timelineEvent = each_block_value[timelineEvent_index];
	component.fire('endHover', timelineEvent);
}

function click_handler_1(event) {
	var component = this._svelte.component;
	var each_block_value = this._svelte.each_block_value,
	    timelineEvent_index = this._svelte.timelineEvent_index,
	    timelineEvent = each_block_value[timelineEvent_index];
	component.click(timelineEvent);
}

function Events(options) {
	options = options || {};
	this._state = assign$1(template$3.data(), options.data);
	recompute$3(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if (!document.getElementById("svelte-3114443404-style")) add_css$2();
	this._renderHooks = [];

	this._fragment = create_main_fragment$3(this._state, this);
	if (options.target) this._fragment.mount(options.target, null);
	this._flush();
}

assign$1(Events.prototype, template$3.methods, proto);

Events.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	recompute$3(this._state, newState, oldState, false);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
	this._flush();
};

Events.prototype.teardown = Events.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	this._fragment.destroy(detach !== false);
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var pipe = function pipe(input) {
	for (var _len = arguments.length, fns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		fns[_key - 1] = arguments[_key];
	}

	return fns.reduce(function (last, fn) {
		return fn(last);
	}, input);
};
var flatMap = function flatMap(fn, ary) {
	return ary.reduce(function (acc, element) {
		return [].concat(toConsumableArray(acc), toConsumableArray(fn(element)));
	}, []);
};
var safeGet = function safeGet(object, property) {
	for (var _len2 = arguments.length, rest = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
		rest[_key2 - 2] = arguments[_key2];
	}

	var nextObject = object && object[property];
	return rest.length > 0 ? safeGet.apply(undefined, [nextObject].concat(rest)) : nextObject;
};
var getDates = function getDates(property, object) {
	return {
		hebrew: safeGet(object, 'hebrew', property),
		macedonian: safeGet(object, 'macedonian', property),
		gregorian: safeGet(object, 'gregorian', property),
		amd: safeGet(object, 'amd', property)
	};
};
var amdSort = function amdSort(a, b) {
	return a.amd - b.amd;
};

var createTimelineAxis_1 = createTimelineAxis;
function createTimelineAxis(_ref) {
	var timelineData = _ref.timelineData,
	    snipSectionsLongerThan = _ref.snipSectionsLongerThan,
	    snipBuffer = _ref.snipBuffer,
	    start = _ref.start,
	    end = _ref.end;

	// console.log(timelineData)
	var naiveAxisMarkers = flatMap(function (event) {
		return event.amd.start === event.amd.end ? [getDates('start', event)] : [getDates('start', event), getDates('end', event)];
	}, timelineData).filter(function (point) {
		return point.amd >= start && point.amd <= end;
	}).sort(amdSort);

	return pipe(naiveAxisMarkers, mergeDuplicates, function (_) {
		return addSnipEvents(_, snipSectionsLongerThan, snipBuffer);
	}, calculateAxisPoints);
}

var mergeProperties = function mergeProperties(target, object) {
	var pickValueToKeep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (a, b) {
		return a === undefined ? b : a;
	};

	Object.keys(object).forEach(function (key) {
		return target[key] = pickValueToKeep(target[key], object[key]);
	});
	return target;
};

var both = function both(a, b, type) {
	return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === type && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === type;
};
var returnLargest = function returnLargest(a, b) {
	if (a === undefined) {
		return b;
	} else if (b === undefined) {
		return a;
	} else if (both(a, b, 'number')) {
		return a > b ? a : b;
	} else if (both(a, b, 'string')) {
		return a.length > b.length ? a : b;
	} else if (typeof a === 'string') {
		return a;
	} else if (typeof b === 'string') {
		return b;
	}

	return a;
};
var mergeLongerProperties = function mergeLongerProperties(a, b) {
	if (!b) {
		return a;
	}
	if (!a) {
		return b;
	}

	return mergeProperties(mergeProperties({}, a), b, returnLargest);
};

function mergeDuplicates(dates) {
	var map = dates.reduce(function (map, date) {
		map[date.amd] = mergeLongerProperties(date, map[date.amd]);
		return map;
	}, {});

	return Object.keys(map).map(function (amd) {
		return map[amd];
	}).sort(amdSort);
}

function addSnipEvents(dates, snipSectionsLongerThan, snipBuffer) {
	if (!snipSectionsLongerThan) {
		return dates;
	}
	var lastDay = null;

	return flatMap(function (date) {
		if (lastDay) {
			var delta = date.amd - lastDay;
			if (delta > snipSectionsLongerThan) {
				var snipDays = delta - snipBuffer * 2;
				var snip = {
					type: 'snip',
					days: snipDays,
					start: lastDay + snipBuffer,
					end: date.amd - snipBuffer
				};
				lastDay = date.amd;
				return [snip, date];
			}
		}

		lastDay = date.amd;

		return [date];
	}, dates);
}

// axis points: number of visible days from the top of the timeline
function calculateAxisPoints(dates) {
	var snippedSoFar = 0;

	return dates.map(function (date) {
		if (date.type === 'snip') {
			var axisPoint = date.start - snippedSoFar;
			snippedSoFar += date.days;
			return Object.assign({ axisPoint: axisPoint }, date);
		} else {
			return Object.assign({
				axisPoint: date.amd - snippedSoFar
			}, date);
		}
	});
}

var addAxisPointsToTimelineData = addSnipsToTimelineData;

function addSnipsToTimelineData(axisPoints, timelineData) {
	var amdToAxisPoint = axisPoints.reduce(function (map, axis) {
		return map[axis.amd] = axis.axisPoint, map;
	}, Object.create(null));

	return timelineData.map(function (data) {
		if (data.amd) {
			return Object.assign({
				axis: {
					start: amdToAxisPoint[data.amd.start],
					end: amdToAxisPoint[data.amd.end]
				}
			}, data);
		} else {
			return data;
		}
	});
}

function recompute$1(state, newState, oldState, isInitial) {
	if (isInitial || 'timelineData' in newState && differs$1(state.timelineData, oldState.timelineData)) {
		state.zooms = newState.zooms = template$1.computed.zooms(state.timelineData);
	}

	if (isInitial || 'querystringParameters' in newState && differs$1(state.querystringParameters, oldState.querystringParameters) || 'zooms' in newState && differs$1(state.zooms, oldState.zooms)) {
		state.currentZoom = newState.currentZoom = template$1.computed.currentZoom(state.querystringParameters, state.zooms);
	}

	if (isInitial || 'currentZoom' in newState && differs$1(state.currentZoom, oldState.currentZoom)) {
		state.multiplyDaysByHeight = newState.multiplyDaysByHeight = template$1.computed.multiplyDaysByHeight(state.currentZoom);
	}

	if (isInitial || 'timelineData' in newState && differs$1(state.timelineData, oldState.timelineData) || 'currentZoom' in newState && differs$1(state.currentZoom, oldState.currentZoom)) {
		state.relevantEvents = newState.relevantEvents = template$1.computed.relevantEvents(state.timelineData, state.currentZoom);
	}

	if (isInitial || 'relevantEvents' in newState && differs$1(state.relevantEvents, oldState.relevantEvents) || 'currentZoom' in newState && differs$1(state.currentZoom, oldState.currentZoom)) {
		state.axis = newState.axis = template$1.computed.axis(state.relevantEvents, state.currentZoom);
	}

	if (isInitial || 'axis' in newState && differs$1(state.axis, oldState.axis) || 'relevantEvents' in newState && differs$1(state.relevantEvents, oldState.relevantEvents) || 'currentZoom' in newState && differs$1(state.currentZoom, oldState.currentZoom)) {
		state.relevantEventsWithAxis = newState.relevantEventsWithAxis = template$1.computed.relevantEventsWithAxis(state.axis, state.relevantEvents, state.currentZoom);
	}

	if (isInitial || 'currentZoom' in newState && differs$1(state.currentZoom, oldState.currentZoom)) {
		state.distanceFromStartDay = newState.distanceFromStartDay = template$1.computed.distanceFromStartDay(state.currentZoom);
	}

	if (isInitial || 'hoveredEvent' in newState && differs$1(state.hoveredEvent, oldState.hoveredEvent)) {
		state.axisIsRelevant = newState.axisIsRelevant = template$1.computed.axisIsRelevant(state.hoveredEvent);
	}
}

var template$1 = function () {
	function createIndentLevelCalculator() {
		var indentLevels = [];
		return function (event) {
			var eventDate = event.amd;
			var replaceIndent = indentLevels.findIndex(function (previousDate) {
				return previousDate.end < eventDate.start;
			});
			if (replaceIndent === -1) {
				indentLevels.push(eventDate);
				return indentLevels.length - 1;
			} else {
				indentLevels[replaceIndent] = eventDate;
				return replaceIndent;
			}
		};
	}
	function addIndentAndAxisAfterStart(events, startDay, endDay) {
		var getIndentLevel = createIndentLevelCalculator();
		return events.map(function (event) {
			var axisAfterStart = Math.max(event.axis.start - startDay, 0);
			var eventDays = event.axis.end - event.axis.start + 1;
			var daysBeforeStart = Math.max(startDay - event.axis.start, 0);
			var daysAfterEnd = Math.max(event.axis.end - endDay, 0);
			var visibleDays = eventDays - daysBeforeStart - daysAfterEnd;
			return Object.assign({
				indentLevel: getIndentLevel(event),
				axisAfterStart: axisAfterStart,
				visibleDays: visibleDays
			}, event);
		});
	}

	var topZoom = {
		dayHeight: 0.1,
		start: 1471937,
		end: 1488003,
		snipSectionsLongerThan: 10000,
		snipBuffer: 1500,
		type: 'top'
	};

	return {
		computed: {
			zooms: function zooms(timelineData) {
				return timelineData.reduce(function (map, event) {
					map[event.slug] = {
						start: event.amd.start,
						end: event.amd.end,
						dayHeight: 5,
						snipSectionsLongerThan: 300,
						snipBuffer: 50
					};
					return map;
				}, {
					top: topZoom
				});
			},
			multiplyDaysByHeight: function multiplyDaysByHeight(currentZoom) {
				return function (days) {
					return days * currentZoom.dayHeight;
				};
			},
			relevantEvents: function relevantEvents(timelineData, currentZoom) {
				return timelineData.filter(function (event) {
					return (event.amd.end >= currentZoom.start || event.amd.start <= currentZoom.end) && (!currentZoom.type || currentZoom.type === event.type);
				}).sort(function (a, b) {
					return a.amd - b.amd;
				});
			},
			axis: function axis(relevantEvents, currentZoom) {
				return createTimelineAxis_1({
					timelineData: relevantEvents,
					snipSectionsLongerThan: currentZoom.snipSectionsLongerThan,
					snipBuffer: currentZoom.snipBuffer,
					start: currentZoom.start,
					end: currentZoom.end
				});
			},
			relevantEventsWithAxis: function relevantEventsWithAxis(axis, relevantEvents, currentZoom) {
				return addIndentAndAxisAfterStart(addAxisPointsToTimelineData(axis, relevantEvents), currentZoom.start, currentZoom.end);
			},
			distanceFromStartDay: function distanceFromStartDay(currentZoom) {
				return function (day) {
					return day - currentZoom.start;
				};
			},
			axisIsRelevant: function axisIsRelevant(hoveredEvent) {
				return function (amdDay) {
					return !!hoveredEvent && (hoveredEvent.amd.start === amdDay || hoveredEvent.amd.end === amdDay);
				};
			},
			currentZoom: function currentZoom(querystringParameters, zooms) {
				return querystringParameters.zoom && zooms[querystringParameters.zoom] ? zooms[querystringParameters.zoom] : topZoom;
			}
		},
		helpers: {
			multiplyIndentByWidth: multiplyIndentByWidth
		},
		methods: {
			startHover: function startHover(event) {
				this.set({
					hoveredEvent: event
				});
			},
			endHover: function endHover() {
				this.set({
					hoveredEvent: null
				});
			}
		}
	};
}();

function add_css() {
	var style = createElement$1('style');
	style.id = "svelte-3568433739-style";
	style.textContent = "\n[svelte-3568433739].timeline-container, [svelte-3568433739] .timeline-container {\n\tdisplay: flex;\n\tflex-wrap: nowrap;\n\talign-items: flex-start;\n}\n[svelte-3568433739].timeline-row, [svelte-3568433739] .timeline-row {\n\tposition: relative;\n}\n[svelte-3568433739].axis, [svelte-3568433739] .axis {\n\tfont-size: 10px;\n\twidth: 100px;\n\ttext-align: right;\n}\n[svelte-3568433739].axis[data-relevant=true], [svelte-3568433739] .axis[data-relevant=true] {\n\tcolor: red;\n}\n[svelte-3568433739].event, [svelte-3568433739] .event {\n\twidth: 48px;\n\t-webkit-border-radius: 10px;\n\t-moz-border-radius: 10px;\n\tborder-radius: 10px;\n\tbackground-color: green;\n}\n[svelte-3568433739].event:hover, [svelte-3568433739] .event:hover {\n\tbackground-color: red;\n}\n[svelte-3568433739].eventhover, [svelte-3568433739] .eventhover {\n\tz-index: 1;\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tpadding: 10px;\n\tbackground-color: white;\n\tbackground-color: rgba(255, 255, 255, 0.8);\n}\n[svelte-3568433739]#zoombutton, [svelte-3568433739] #zoombutton {\n\tz-index: 1;\n\tposition: fixed;\n\ttop: 0;\n\tright: 0;\n}\n";
	appendNode(style, document.head);
}

function create_main_fragment$1(state, component) {
	var if_block = state.hoveredEvent && create_if_block$1(state, component);

	var text = createText("\n");
	var div = createElement$1('div');
	setAttribute(div, 'svelte-3568433739', '');
	div.className = "timeline-container";
	var div_1 = createElement$1('div');
	appendNode(div_1, div);
	div_1.className = "timeline-row";
	div_1.style.cssText = "width: 100px; margin-right: 10px;";
	var each_block_value = state.axis;

	var each_block_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_iterations[i] = create_each_block(state, each_block_value, each_block_value[i], i, component);
		each_block_iterations[i].mount(div_1, null);
	}

	appendNode(createText("\n\t"), div);
	var div_2 = createElement$1('div');
	appendNode(div_2, div);
	div_2.className = "timeline-row";
	div_2.style.cssText = "width: 250px";

	var events = new Events({
		target: div_2,
		_root: component._root,
		data: {
			timeline: state.relevantEventsWithAxis,
			dayHeight: state.currentZoom.dayHeight,
			clickable: true
		}
	});

	events.on('startHover', function (event) {
		component.startHover(event);
	});

	events.on('endHover', function (event) {
		component.endHover(event);
	});

	return {
		mount: function mount(target, anchor) {
			if (if_block) if_block.mount(target, anchor);
			insertNode$1(text, target, anchor);
			insertNode$1(div, target, anchor);
		},

		update: function update(changed, state) {
			if (state.hoveredEvent) {
				if (if_block) {
					if_block.update(changed, state);
				} else {
					if_block = create_if_block$1(state, component);
					if_block.mount(text.parentNode, text);
				}
			} else if (if_block) {
				if_block.destroy(true);
				if_block = null;
			}

			var each_block_value = state.axis;

			if ('multiplyDaysByHeight' in changed || 'distanceFromStartDay' in changed || 'axis' in changed || 'axisIsRelevant' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_iterations[i]) {
						each_block_iterations[i].update(changed, state, each_block_value, each_block_value[i], i);
					} else {
						each_block_iterations[i] = create_each_block(state, each_block_value, each_block_value[i], i, component);
						each_block_iterations[i].mount(div_1, null);
					}
				}

				destroyEach(each_block_iterations, true, each_block_value.length);
				each_block_iterations.length = each_block_value.length;
			}

			var events_changes = {};

			if ('relevantEventsWithAxis' in changed) events_changes.timeline = state.relevantEventsWithAxis;
			if ('currentZoom' in changed) events_changes.dayHeight = state.currentZoom.dayHeight;
			events_changes.clickable = true;

			if (Object.keys(events_changes).length) events.set(events_changes);
		},

		destroy: function destroy(detach) {
			if (if_block) if_block.destroy(detach);

			destroyEach(each_block_iterations, false, 0);

			events.destroy(false);

			if (detach) {
				detachNode$1(text);
				detachNode$1(div);
			}
		}
	};
}

function create_if_block_1$1(state, component) {
	var text_1_value;

	var text = createText("(");
	var text_1 = createText(text_1_value = state.hoveredEvent.reference);
	var text_2 = createText(")");

	return {
		mount: function mount(target, anchor) {
			insertNode$1(text, target, anchor);
			insertNode$1(text_1, target, anchor);
			insertNode$1(text_2, target, anchor);
		},

		update: function update(changed, state) {
			if (text_1_value !== (text_1_value = state.hoveredEvent.reference)) {
				text_1.data = text_1_value;
			}
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode$1(text);
				detachNode$1(text_1);
				detachNode$1(text_2);
			}
		}
	};
}

function create_if_block$1(state, component) {
	var text_value;

	var div = createElement$1('div');
	setAttribute(div, 'svelte-3568433739', '');
	div.className = "eventhover";
	var text = createText(text_value = state.hoveredEvent.title);
	appendNode(text, div);
	appendNode(createText(" "), div);

	var if_block_1 = state.hoveredEvent.reference && create_if_block_1$1(state, component);

	if (if_block_1) if_block_1.mount(div, null);

	return {
		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
		},

		update: function update(changed, state) {
			if (text_value !== (text_value = state.hoveredEvent.title)) {
				text.data = text_value;
			}

			if (state.hoveredEvent.reference) {
				if (if_block_1) {
					if_block_1.update(changed, state);
				} else {
					if_block_1 = create_if_block_1$1(state, component);
					if_block_1.mount(div, null);
				}
			} else if (if_block_1) {
				if_block_1.destroy(true);
				if_block_1 = null;
			}
		},

		destroy: function destroy(detach) {
			if (if_block_1) if_block_1.destroy(false);

			if (detach) {
				detachNode$1(div);
			}
		}
	};
}

function create_each_block(state, each_block_value, date, date_index, component) {
	var vcenter_1_yield_fragment = create_vcenter_yield_fragment(state, each_block_value, date, date_index, component);

	var vcenter_1 = new VerticallyCentered({
		target: null,
		_root: component._root,
		_yield: vcenter_1_yield_fragment,
		data: { point: state.multiplyDaysByHeight(state.distanceFromStartDay(date.axisPoint)) }
	});

	return {
		mount: function mount(target, anchor) {
			vcenter_1._fragment.mount(target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			vcenter_1_yield_fragment.update(changed, state, each_block_value, date, date_index);

			var vcenter_1_changes = {};

			if ('multiplyDaysByHeight' in changed || 'distanceFromStartDay' in changed || 'axis' in changed) vcenter_1_changes.point = state.multiplyDaysByHeight(state.distanceFromStartDay(date.axisPoint));

			if (Object.keys(vcenter_1_changes).length) vcenter_1.set(vcenter_1_changes);
		},

		destroy: function destroy(detach) {
			vcenter_1.destroy(detach);
		}
	};
}

function create_vcenter_yield_fragment(state, each_block_value, date, date_index, component) {
	var div_data_relevant_value;

	var div = createElement$1('div');
	div.className = "axis";
	setAttribute(div, 'data-relevant', div_data_relevant_value = state.axisIsRelevant(date.amd));

	function get_block(state, each_block_value, date, date_index) {
		if (date.type === 'snip') return create_if_block_2;
		return create_if_block_3;
	}

	var current_block = get_block(state, each_block_value, date, date_index);
	var if_block_2 = current_block(state, each_block_value, date, date_index, component);

	if_block_2.mount(div, null);

	return {
		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			if (div_data_relevant_value !== (div_data_relevant_value = state.axisIsRelevant(date.amd))) {
				setAttribute(div, 'data-relevant', div_data_relevant_value);
			}

			if (current_block === (current_block = get_block(state, each_block_value, date, date_index)) && if_block_2) {
				if_block_2.update(changed, state, each_block_value, date, date_index);
			} else {
				if_block_2.destroy(true);
				if_block_2 = current_block(state, each_block_value, date, date_index, component);
				if_block_2.mount(div, null);
			}
		},

		destroy: function destroy(detach) {
			if_block_2.destroy(false);

			if (detach) {
				detachNode$1(div);
			}
		}
	};
}

function create_if_block_2(state, each_block_value, date, date_index, component) {
	var text_1_value;

	var text = createText("...snip (");
	var text_1 = createText(text_1_value = date.days);
	var text_2 = createText(" days)");

	return {
		mount: function mount(target, anchor) {
			insertNode$1(text, target, anchor);
			insertNode$1(text_1, target, anchor);
			insertNode$1(text_2, target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			if (text_1_value !== (text_1_value = date.days)) {
				text_1.data = text_1_value;
			}
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode$1(text);
				detachNode$1(text_1);
				detachNode$1(text_2);
			}
		}
	};
}

function create_if_block_3(state, each_block_value, date, date_index, component) {
	var text_value;

	var text = createText(text_value = date.hebrew || date.amd);

	return {
		mount: function mount(target, anchor) {
			insertNode$1(text, target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			if (text_value !== (text_value = date.hebrew || date.amd)) {
				text.data = text_value;
			}
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode$1(text);
			}
		}
	};
}

function Main(options) {
	options = options || {};
	this._state = options.data || {};
	recompute$1(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if (!document.getElementById("svelte-3568433739-style")) add_css();
	this._renderHooks = [];

	this._fragment = create_main_fragment$1(this._state, this);
	if (options.target) this._fragment.mount(options.target, null);
	this._flush();
}

assign$1(Main.prototype, template$1.methods, proto);

Main.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	recompute$1(this._state, newState, oldState, false);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
	this._flush();
};

Main.prototype.teardown = Main.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	this._fragment.destroy(detach !== false);
	this._fragment = null;

	this._state = {};
	this._torndown = true;
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


var component = new Main({
	target: document.querySelector('#timeline'),
	data: {
		timelineData: timelineData, // no need to re-sort, is pre-sorted by transform-timeline-to-json.js
		querystringParameters: getCurrentParameters()
	}
});

attachQuerystringData(component);

}());
//# sourceMappingURL=bundle.js.map
