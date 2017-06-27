(function () {
'use strict';

var index$4 = function index(str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

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

var index$6 = shouldUseNative() ? Object.assign : function (target, source) {
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
		return opts.strict ? index$4(value) : encodeURIComponent(value);
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
	opts = index$6({ arrayFormat: 'none' }, opts);

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

	opts = index$6(defaults$$1, opts);

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

var index$2 = {
	extract: extract,
	parse: parse,
	stringify: stringify
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$8 = createCommonjsModule(function (module) {
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

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
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

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function createComment() {
	return document.createComment('');
}

function differs(a, b) {
	return a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
}

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

function noop() {}

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
		parameters: index$2.parse(querystring)
	};
}

function defaultOnPopState(listener) {
	window.addEventListener('popstate', listener);
}

function parametersToQuerystring(parameters) {
	return '?' + index$2.stringify(parameters);
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

	var emitter = new index$8();
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

var index$1 = createInstance();

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

function addListener$1(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener$1(node, event, handler) {
	node.removeEventListener(event, handler, false);
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
	var div, div_style_value;

	return {
		create: function create() {
			div = createElement$1('div');
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			setAttribute(div, 'svelte-629105964', '');
			div.style.cssText = div_style_value = "top: " + state.top + "px; left: " + state.left + "px;";
			div.className = "vcentered";
		},

		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
			component.refs.container = div;
			if (component._yield) component._yield.mount(div, null);
		},

		update: function update(changed, state) {
			if (div_style_value !== (div_style_value = "top: " + state.top + "px; left: " + state.left + "px;")) {
				div.style.cssText = div_style_value;
			}
		},

		unmount: function unmount() {
			detachNode$1(div);
			if (component.refs.container === div) component.refs.container = null;
			if (component._yield) component._yield.unmount();
		},

		destroy: noop$1
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

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, null);
	}

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

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var globalUpdateEmitter = new index$8();

function debounce(fn) {
	var alreadyCalled = false;
	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (!alreadyCalled) {
			alreadyCalled = true;
			window.requestAnimationFrame(function () {
				alreadyCalled = false;
				fn.apply(undefined, args);
			});
		}
	};
}

var listener = debounce(function () {
	return globalUpdateEmitter.emit('update');
});

window.addEventListener('resize', listener);
window.addEventListener('scroll', listener);

var template$4 = function () {
	return {
		oncreate: function oncreate() {
			// const componentListener = () => this.updateVisibility()
			// globalUpdateEmitter.on('update', componentListener)

			// this.set({
			// 	listener: componentListener
			// })
		},
		ondestroy: function ondestroy() {
			// const componentListener = this.get('listener')
			// globalUpdateEmitter.removeListener('update', componentListener)
		},

		methods: {
			// updateVisibility() {
			// 	const relativeToViewport = this.refs.element.firstElementChild.getBoundingClientRect()
			// 	const viewportHeight = window.document.documentElement.clientHeight
			// 	const visible = relativeToViewport.bottom >= 0 && relativeToViewport.top <= viewportHeight
			// 	const topIsAboveViewport = relativeToViewport.top <= 0

			// 	this.set({
			// 		visible,
			// 		topIsAboveViewport
			// 	})
			// }
		}
	};
}();

function create_main_fragment$4(state, component) {
	var div;

	return {
		create: function create() {
			div = createElement$1('div');
		},

		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
			component.refs.element = div;
			if (component._yield) component._yield.mount(div, null);
		},

		unmount: function unmount() {
			detachNode$1(div);
			if (component.refs.element === div) component.refs.element = null;
			if (component._yield) component._yield.unmount();
		},

		destroy: noop$1
	};
}

function Visibility(options) {
	options = options || {};
	this.refs = {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$4(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, null);
	}

	if (options._root) {
		options._root._renderHooks.push(template$4.oncreate.bind(this));
	} else {
		template$4.oncreate.call(this);
	}
}

assign$1(Visibility.prototype, template$4.methods, proto);

Visibility.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
};

Visibility.prototype.teardown = Visibility.prototype.destroy = function destroy(detach) {
	this.fire('destroy');
	template$4.ondestroy.call(this);

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
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

	if (isInitial || 'timeline' in newState && differs$1(state.timeline, oldState.timeline) || 'visibleEventSlugs' in newState && differs$1(state.visibleEventSlugs, oldState.visibleEventSlugs)) {
		state.visibleEvents = newState.visibleEvents = template$3.computed.visibleEvents(state.timeline, state.visibleEventSlugs);
	}
}

var template$3 = function () {
	return {
		data: function data() {
			return {
				clickable: false,
				visibleEventSlugs: Object.create(null)
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
				return Math.max(dayHeight, 4);
			},
			visibleEvents: function visibleEvents(timeline, visibleEventSlugs) {
				return timeline.filter(function (event) {
					return visibleEventSlugs[event.slug];
				});
			}
		},
		components: {
			Link: index$1.Link
		}
	};
}();

function add_css$2() {
	var style = createElement$1('style');
	style.id = "svelte-907107307-style";
	style.textContent = "\n[svelte-907107307][data-clickable=true], [svelte-907107307] [data-clickable=true] {\n\tcursor: pointer;\n}\n[svelte-907107307].event, [svelte-907107307] .event {\n\tposition: absolute;\n\n\twidth: 48px;\n\t-webkit-border-radius: 10px;\n\t-moz-border-radius: 10px;\n\tborder-radius: 10px;\n}\n[svelte-907107307].event[data-cut-off-at-start=true], [svelte-907107307] .event[data-cut-off-at-start=true] {\n\t-webkit-border-top-right-radius: 0;\n\t-webkit-border-top-left-radius: 0;\n\tborder-top-right-radius: 0;\n\tborder-top-left-radius: 0;\n}\n[svelte-907107307].event[data-cut-off-at-end=true], [svelte-907107307] .event[data-cut-off-at-end=true] {\n\t-webkit-border-bottom-right-radius: 0;\n\t-webkit-border-bottom-left-radius: 0;\n\tborder-bottom-right-radius: 0;\n\tborder-bottom-left-radius: 0;\n}\n[svelte-907107307].event:hover, [svelte-907107307] .event:hover {\n\tbackground-color: red;\n}\n\n";
	appendNode(style, document.head);
}

function create_main_fragment$3(state, component) {
	var each_block_anchor;

	var each_block_value = state.timeline;

	var each_block_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_iterations[i] = create_each_block$1(state, each_block_value, each_block_value[i], i, component);
	}

	return {
		create: function create() {
			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].create();
			}

			each_block_anchor = createComment$1();
		},

		mount: function mount(target, anchor) {
			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].mount(target, anchor);
			}

			insertNode$1(each_block_anchor, target, anchor);
		},

		update: function update(changed, state) {
			var each_block_value = state.timeline;

			if ('timeline' in changed || 'multiplyDaysByHeight' in changed || 'visibleEventSlugs' in changed || 'singleDayHeight' in changed || 'clickable' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_iterations[i]) {
						each_block_iterations[i].update(changed, state, each_block_value, each_block_value[i], i);
					} else {
						each_block_iterations[i] = create_each_block$1(state, each_block_value, each_block_value[i], i, component);
						each_block_iterations[i].create();
						each_block_iterations[i].mount(each_block_anchor.parentNode, each_block_anchor);
					}
				}

				for (; i < each_block_iterations.length; i += 1) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}
		},

		unmount: function unmount() {
			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].unmount();
			}

			detachNode$1(each_block_anchor);
		},

		destroy: function destroy() {
			destroyEach(each_block_iterations, false, 0);
		}
	};
}

function create_each_block$1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var if_block_anchor;

	function get_block(state, each_block_value, timelineEvent, timelineEvent_index) {
		if (timelineEvent.axis.end === timelineEvent.axis.start) return create_if_block$2;
		return create_if_block_1$2;
	}

	var current_block = get_block(state, each_block_value, timelineEvent, timelineEvent_index);
	var if_block = current_block(state, each_block_value, timelineEvent, timelineEvent_index, component);

	return {
		create: function create() {
			if_block.create();
			if_block_anchor = createComment$1();
		},

		mount: function mount(target, anchor) {
			if_block.mount(target, anchor);
			insertNode$1(if_block_anchor, target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			if (current_block === (current_block = get_block(state, each_block_value, timelineEvent, timelineEvent_index)) && if_block) {
				if_block.update(changed, state, each_block_value, timelineEvent, timelineEvent_index);
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block(state, each_block_value, timelineEvent, timelineEvent_index, component);
				if_block.create();
				if_block.mount(if_block_anchor.parentNode, if_block_anchor);
			}
		},

		unmount: function unmount() {
			if_block.unmount();
			detachNode$1(if_block_anchor);
		},

		destroy: function destroy() {
			if_block.destroy();
		}
	};
}

function create_vcenter_yield_fragment$1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var visibility_1_updating = false;

	var visibility_1_yield_fragment = create_visibility_yield_fragment(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var visibility_1_initial_data = {};
	if (timelineEvent.slug in state.visibleEventSlugs) visibility_1_initial_data.visible = state.visibleEventSlugs[timelineEvent.slug];
	var visibility_1 = new Visibility({
		_root: component._root,
		_yield: visibility_1_yield_fragment,
		data: visibility_1_initial_data
	});

	component._bindings.push(function () {
		if (visibility_1._torndown) return;
		visibility_1.observe('visible', function (value) {
			if (visibility_1_updating) return;
			visibility_1_updating = true;
			var state = component.get();
			state.visibleEventSlugs[timelineEvent.slug] = value;
			component._set({ visibleEventSlugs: state.visibleEventSlugs, timeline: state.timeline });
			visibility_1_updating = false;
		}, { init: differs$1(visibility_1.get('visible'), state.visibleEventSlugs[timelineEvent.slug]) });
	});

	visibility_1._context = {
		state: state,
		each_block_value: each_block_value,
		timelineEvent_index: timelineEvent_index
	};

	return {
		create: function create() {
			visibility_1_yield_fragment.create();
			visibility_1._fragment.create();
		},

		mount: function mount(target, anchor) {
			visibility_1._fragment.mount(target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			visibility_1_yield_fragment.update(changed, state, each_block_value, timelineEvent, timelineEvent_index);

			if (!visibility_1_updating && 'visibleEventSlugs' in changed || 'timeline' in changed) {
				visibility_1_updating = true;
				visibility_1._set({ visible: state.visibleEventSlugs[timelineEvent.slug] });
				visibility_1_updating = false;
			}

			visibility_1._context.state = state;
			visibility_1._context.each_block_value = each_block_value;
			visibility_1._context.timelineEvent_index = timelineEvent_index;
		},

		unmount: function unmount() {
			visibility_1._fragment.unmount();
		},

		destroy: function destroy() {
			visibility_1_yield_fragment.destroy();
			visibility_1.destroy(false);
		}
	};
}

function create_visibility_yield_fragment(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var div, div_data_title_value, div_data_days_value, div_style_value;

	return {
		create: function create() {
			div = createElement$1('div');
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			setAttribute(div, 'svelte-907107307', '');
			div.className = "event";
			setAttribute(div, 'data-title', div_data_title_value = timelineEvent.title);
			setAttribute(div, 'data-days', div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1);
			div.style.cssText = div_style_value = "\n\t\t\t\t\t\theight: " + state.singleDayHeight + "px;\n\t\t\t\t\t\tbackground-color: " + timelineEvent.color + ";\n\t\t\t\t\t";
			addListener$1(div, 'mouseover', mouseover_handler);
			addListener$1(div, 'mouseleave', mouseleave_handler);

			div._svelte = {
				component: component,
				each_block_value: each_block_value,
				timelineEvent_index: timelineEvent_index
			};
		},

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

			if (div_style_value !== (div_style_value = "\n\t\t\t\t\t\theight: " + state.singleDayHeight + "px;\n\t\t\t\t\t\tbackground-color: " + timelineEvent.color + ";\n\t\t\t\t\t")) {
				div.style.cssText = div_style_value;
			}

			div._svelte.each_block_value = each_block_value;
			div._svelte.timelineEvent_index = timelineEvent_index;
		},

		unmount: function unmount() {
			detachNode$1(div);
		},

		destroy: function destroy() {
			removeListener$1(div, 'mouseover', mouseover_handler);
			removeListener$1(div, 'mouseleave', mouseleave_handler);
		}
	};
}

function create_link_yield_fragment(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var visibility_1_updating = false;

	var visibility_1_yield_fragment = create_visibility_yield_fragment_1(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var visibility_1_initial_data = {};
	if (timelineEvent.slug in state.visibleEventSlugs) visibility_1_initial_data.visible = state.visibleEventSlugs[timelineEvent.slug];
	var visibility_1 = new Visibility({
		_root: component._root,
		_yield: visibility_1_yield_fragment,
		data: visibility_1_initial_data
	});

	component._bindings.push(function () {
		if (visibility_1._torndown) return;
		visibility_1.observe('visible', function (value) {
			if (visibility_1_updating) return;
			visibility_1_updating = true;
			var state = component.get();
			state.visibleEventSlugs[timelineEvent.slug] = value;
			component._set({ visibleEventSlugs: state.visibleEventSlugs, timeline: state.timeline });
			visibility_1_updating = false;
		}, { init: differs$1(visibility_1.get('visible'), state.visibleEventSlugs[timelineEvent.slug]) });
	});

	visibility_1._context = {
		state: state,
		each_block_value: each_block_value,
		timelineEvent_index: timelineEvent_index
	};

	return {
		create: function create() {
			visibility_1_yield_fragment.create();
			visibility_1._fragment.create();
		},

		mount: function mount(target, anchor) {
			visibility_1._fragment.mount(target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			visibility_1_yield_fragment.update(changed, state, each_block_value, timelineEvent, timelineEvent_index);

			if (!visibility_1_updating && 'visibleEventSlugs' in changed || 'timeline' in changed) {
				visibility_1_updating = true;
				visibility_1._set({ visible: state.visibleEventSlugs[timelineEvent.slug] });
				visibility_1_updating = false;
			}

			visibility_1._context.state = state;
			visibility_1._context.each_block_value = each_block_value;
			visibility_1._context.timelineEvent_index = timelineEvent_index;
		},

		unmount: function unmount() {
			visibility_1._fragment.unmount();
		},

		destroy: function destroy() {
			visibility_1_yield_fragment.destroy();
			visibility_1.destroy(false);
		}
	};
}

function create_visibility_yield_fragment_1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var div, div_data_title_value, div_id_value, div_data_top_value, div_data_left_value, div_style_value, div_data_days_value, div_data_cut_off_at_start_value, div_data_cut_off_at_end_value;

	return {
		create: function create() {
			div = createElement$1('div');
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			setAttribute(div, 'svelte-907107307', '');
			setAttribute(div, 'data-title', div_data_title_value = timelineEvent.title);
			div.id = div_id_value = timelineEvent.slug;
			setAttribute(div, 'data-top', div_data_top_value = state.multiplyDaysByHeight(timelineEvent.axisAfterStart));
			setAttribute(div, 'data-left', div_data_left_value = template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel));
			div.className = "event";
			div.style.cssText = div_style_value = "\n\t\t\t\t\t\ttop: " + state.multiplyDaysByHeight(timelineEvent.axisAfterStart) + "px;\n\t\t\t\t\t\tleft: " + template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel) + "px;\n\t\t\t\t\t\theight: " + state.multiplyDaysByHeight(timelineEvent.visibleDays) + "px;\n\t\t\t\t\t\tbackground-color: " + timelineEvent.color + ";\n\t\t\t\t\t";
			setAttribute(div, 'data-days', div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1);
			setAttribute(div, 'data-cut-off-at-start', div_data_cut_off_at_start_value = timelineEvent.axis.cutOffAtStart);
			setAttribute(div, 'data-cut-off-at-end', div_data_cut_off_at_end_value = timelineEvent.axis.cutOffAtEnd);
			addListener$1(div, 'mouseover', mouseover_handler_1);
			addListener$1(div, 'mouseleave', mouseleave_handler_1);

			div._svelte = {
				component: component,
				each_block_value: each_block_value,
				timelineEvent_index: timelineEvent_index
			};
		},

		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			if (div_data_title_value !== (div_data_title_value = timelineEvent.title)) {
				setAttribute(div, 'data-title', div_data_title_value);
			}

			if (div_id_value !== (div_id_value = timelineEvent.slug)) {
				div.id = div_id_value;
			}

			if (div_data_top_value !== (div_data_top_value = state.multiplyDaysByHeight(timelineEvent.axisAfterStart))) {
				setAttribute(div, 'data-top', div_data_top_value);
			}

			if (div_data_left_value !== (div_data_left_value = template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel))) {
				setAttribute(div, 'data-left', div_data_left_value);
			}

			if (div_style_value !== (div_style_value = "\n\t\t\t\t\t\ttop: " + state.multiplyDaysByHeight(timelineEvent.axisAfterStart) + "px;\n\t\t\t\t\t\tleft: " + template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel) + "px;\n\t\t\t\t\t\theight: " + state.multiplyDaysByHeight(timelineEvent.visibleDays) + "px;\n\t\t\t\t\t\tbackground-color: " + timelineEvent.color + ";\n\t\t\t\t\t")) {
				div.style.cssText = div_style_value;
			}

			if (div_data_days_value !== (div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1)) {
				setAttribute(div, 'data-days', div_data_days_value);
			}

			if (div_data_cut_off_at_start_value !== (div_data_cut_off_at_start_value = timelineEvent.axis.cutOffAtStart)) {
				setAttribute(div, 'data-cut-off-at-start', div_data_cut_off_at_start_value);
			}

			if (div_data_cut_off_at_end_value !== (div_data_cut_off_at_end_value = timelineEvent.axis.cutOffAtEnd)) {
				setAttribute(div, 'data-cut-off-at-end', div_data_cut_off_at_end_value);
			}

			div._svelte.each_block_value = each_block_value;
			div._svelte.timelineEvent_index = timelineEvent_index;
		},

		unmount: function unmount() {
			detachNode$1(div);
		},

		destroy: function destroy() {
			removeListener$1(div, 'mouseover', mouseover_handler_1);
			removeListener$1(div, 'mouseleave', mouseleave_handler_1);
		}
	};
}

function create_if_block$2(state, each_block_value, timelineEvent, timelineEvent_index, component) {

	var vcenter_1_yield_fragment = create_vcenter_yield_fragment$1(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var vcenter_1 = new VerticallyCentered({
		_root: component._root,
		_yield: vcenter_1_yield_fragment,
		data: { left: template$3.helpers.multiplyIndentByWidth(timelineEvent.indentLevel), point: state.multiplyDaysByHeight(timelineEvent.axisAfterStart) }
	});

	return {
		create: function create() {
			vcenter_1_yield_fragment.create();
			vcenter_1._fragment.create();
		},

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

		unmount: function unmount() {
			vcenter_1._fragment.unmount();
		},

		destroy: function destroy() {
			vcenter_1_yield_fragment.destroy();
			vcenter_1.destroy(false);
		}
	};
}

function create_if_block_1$2(state, each_block_value, timelineEvent, timelineEvent_index, component) {

	var link_1_yield_fragment = create_link_yield_fragment(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var link_1 = new template$3.components.Link({
		_root: component._root,
		_yield: link_1_yield_fragment,
		data: { parameters: state.clickable ? { zoom: timelineEvent.slug } : null }
	});

	return {
		create: function create() {
			link_1_yield_fragment.create();
			link_1._fragment.create();
		},

		mount: function mount(target, anchor) {
			link_1._fragment.mount(target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			link_1_yield_fragment.update(changed, state, each_block_value, timelineEvent, timelineEvent_index);

			var link_1_changes = {};

			if ('clickable' in changed || 'timeline' in changed) link_1_changes.parameters = state.clickable ? { zoom: timelineEvent.slug } : null;

			if (Object.keys(link_1_changes).length) link_1.set(link_1_changes);
		},

		unmount: function unmount() {
			link_1._fragment.unmount();
		},

		destroy: function destroy() {
			link_1_yield_fragment.destroy();
			link_1.destroy(false);
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
	if (!document.getElementById("svelte-907107307-style")) add_css$2();
	this._renderHooks = [];
	this._bindings = [];

	this._fragment = create_main_fragment$3(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, null);
	}

	while (this._bindings.length) {
		this._bindings.pop()();
	}this._flush();
}

assign$1(Events.prototype, proto);

Events.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	recompute$3(this._state, newState, oldState, false);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
	while (this._bindings.length) {
		this._bindings.pop()();
	}this._flush();
};

Events.prototype.teardown = Events.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$5 = function () {
	return {
		data: function data() {
			return {
				descriptionHeight: 40,
				buffer: 4
			};
		}
	};
}();

function add_css$3() {
	var style = createElement$1('style');
	style.id = "svelte-1266125325-style";
	style.textContent = "\n[svelte-1266125325].event-description, [svelte-1266125325] .event-description {\n\tposition: fixed;\n\tborder-width: 2px;\n\tborder-style: solid;\n\tpadding: 4px 8px;\n}\n";
	appendNode(style, document.head);
}

function create_main_fragment$5(state, component) {
	var each_block_anchor;

	var each_block_value = state.timeline;

	var each_block_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_iterations[i] = create_each_block$2(state, each_block_value, each_block_value[i], i, component);
	}

	return {
		create: function create() {
			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].create();
			}

			each_block_anchor = createComment$1();
		},

		mount: function mount(target, anchor) {
			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].mount(target, anchor);
			}

			insertNode$1(each_block_anchor, target, anchor);
		},

		update: function update(changed, state) {
			var each_block_value = state.timeline;

			if ('timeline' in changed || 'buffer' in changed || 'descriptionHeight' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_iterations[i]) {
						each_block_iterations[i].update(changed, state, each_block_value, each_block_value[i], i);
					} else {
						each_block_iterations[i] = create_each_block$2(state, each_block_value, each_block_value[i], i, component);
						each_block_iterations[i].create();
						each_block_iterations[i].mount(each_block_anchor.parentNode, each_block_anchor);
					}
				}

				for (; i < each_block_iterations.length; i += 1) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}
		},

		unmount: function unmount() {
			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].unmount();
			}

			detachNode$1(each_block_anchor);
		},

		destroy: function destroy() {
			destroyEach(each_block_iterations, false, 0);
		}
	};
}

function create_each_block$2(state, each_block_value, timelineEvent, i, component) {
	var div, div_style_value, text_value, text;

	return {
		create: function create() {
			div = createElement$1('div');
			text = createText(text_value = timelineEvent.title);
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			setAttribute(div, 'svelte-1266125325', '');
			div.className = "event-description";
			div.style.cssText = div_style_value = "\n\t\t\tborder-color: " + timelineEvent.color + ";\n\t\t\ttop: " + (state.buffer + state.descriptionHeight * i + state.buffer * i) + "px;\n\t\t";
		},

		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
			appendNode(text, div);
		},

		update: function update(changed, state, each_block_value, timelineEvent, i) {
			if (div_style_value !== (div_style_value = "\n\t\t\tborder-color: " + timelineEvent.color + ";\n\t\t\ttop: " + (state.buffer + state.descriptionHeight * i + state.buffer * i) + "px;\n\t\t")) {
				div.style.cssText = div_style_value;
			}

			if (text_value !== (text_value = timelineEvent.title)) {
				text.data = text_value;
			}
		},

		unmount: function unmount() {
			detachNode$1(div);
		},

		destroy: noop$1
	};
}

function EventDescriptions(options) {
	options = options || {};
	this._state = assign$1(template$5.data(), options.data);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if (!document.getElementById("svelte-1266125325-style")) add_css$3();

	this._fragment = create_main_fragment$5(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, null);
	}
}

assign$1(EventDescriptions.prototype, proto);

EventDescriptions.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
};

EventDescriptions.prototype.teardown = EventDescriptions.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
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
	for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		rest[_key - 2] = arguments[_key];
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

// console.log(createTimelineAxis(require('./filter-and-sort')(require('./timeline-data')), 5).map(date => {
// 	return Object.assign({
// 		afterCrucifixion: (date.start || date.amd) - 1471937
// 	}, date)
// }))

var addAxisPointsToTimelineData_1 = addAxisPointsToTimelineData;

function addAxisPointsToTimelineData(axisPoints, timelineData) {
	var minAxisPoint = null;
	var maxAxisPoint = null;

	var amdToAxisPoint = axisPoints.reduce(function (map, axis) {
		if (!minAxisPoint || minAxisPoint > axis.axisPoint) {
			minAxisPoint = axis.axisPoint;
		}
		if (!maxAxisPoint || maxAxisPoint < axis.axisPoint) {
			maxAxisPoint = axis.axisPoint;
		}

		map[axis.amd] = axis.axisPoint;
		return map;
	}, Object.create(null));

	return timelineData.map(function (data) {
		if (data.amd) {
			return Object.assign({
				axis: {
					start: amdToAxisPoint[data.amd.start] || minAxisPoint,
					end: amdToAxisPoint[data.amd.end] || maxAxisPoint,
					cutOffAtStart: !amdToAxisPoint[data.amd.start],
					cutOffAtEnd: !amdToAxisPoint[data.amd.end]
				}
			}, data);
		} else {
			return data;
		}
	});
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

var index$9 = withinRange;

withinRange.LESS_THAN_START = LESS_THAN;
withinRange.WITHIN = WITHIN;
withinRange.GREATER_THAN_END = GREATER_THAN;

withinRange.relative = relative;

var rangeSort = index$9.relative;


var sortRange = function sortRange(ary, getRangeValues) {
	return ary.slice().sort(function (a, b) {
		var bValue = getRangeValues(b);
		return rangeSort(bValue, bValue, getRangeValues(a));
	});
};

function fromHex(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;n = n.replace("#", "").match(/.{2}/g);for (var a = 0; a < n.length; a++) {
    n[a] = parseInt(n[a], 16);
  }switch (e) {case "rgb":
      return { r: n[0], g: n[1], b: n[2] };default:
      return o.convert({ conversions: t, operations: o, helpers: s }, e, { r: n[0], g: n[1], b: n[2] });}
}function fromRgb(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "hex":
      return 1 == (g = Math.round(n.r).toString(16)).length && (g = "0" + g), 1 == (y = Math.round(n.g).toString(16)).length && (y = "0" + y), 1 == (_ = Math.round(n.b).toString(16)).length && (_ = "0" + _), "#" + g + y + _;case "cssrgb":
      return "rgb(" + Math.round(n.r) + "," + Math.round(n.g) + "," + Math.round(n.b) + ")";case "hsl":
      var a = [g = n.r / 255, y = n.g / 255, _ = n.b / 255].sort(),
          i = (a[0] + a[2]) / 2 * 100;return a[0] == a[2] ? (b = 0, d = 0) : (b = i >= 50 ? (a[2] - a[0]) / (2 - a[2] - a[0]) * 100 : (a[2] - a[0]) / (a[2] + a[0]) * 100, (d = a[2] == g ? (y - _) / (a[2] - a[0]) * 60 : a[2] == y ? 60 * (2 + (_ - g) / (a[2] - a[0])) : 60 * (4 + (g - y) / (a[2] - a[0]))) < 0 ? d += 360 : d > 360 && (d %= 360)), { h: d, s: b, l: i };case "csshsl":
      var c = o.convert({ conversions: t, helpers: s }, "hsl", n);return "hsl(" + Math.round(c.h) + "," + Math.round(c.s) + "%," + Math.round(c.l) + "%)";case "cmyk":
      var u = n.r / 255,
          l = n.g / 255,
          h = n.b / 255,
          v = 1 - Math.max(u, l, h);if (1 != v) var p = (1 - u - v) / (1 - v),
          f = (1 - l - v) / (1 - v),
          m = (1 - h - v) / (1 - v);else var p = 0,
          f = 0,
          m = 0;return { c: p, m: f, y: m, k: v };case "hsv":
      var d,
          b,
          g = n.r / 255,
          y = n.g / 255,
          _ = n.b / 255,
          M = Math.min(g, y, _),
          Y = Math.max(g, y, _),
          L = Y - M,
          X = Y;if (0 == L) d = 0, b = 0;else {
        b = L / Y;var Z = ((Y - g) / 6 + L / 2) / L,
            R = ((Y - y) / 6 + L / 2) / L,
            w = ((Y - _) / 6 + L / 2) / L;g == Y ? d = w - R : y == Y ? d = 1 / 3 + Z - w : _ == Y && (d = 2 / 3 + R - Z), d < 0 && (d += 1), d > 1 && (d -= 1);
      }return { h: 360 * d, s: 100 * b, v: 100 * X };case "yiq":
      var m = n.r / 255 * .299 + n.g / 255 * .587 + n.b / 255 * .114,
          C = n.r / 255 * .596 + n.g / 255 * -.274 + n.b / 255 * -.322,
          x = n.r / 255 * .211 + n.g / 255 * -.523 + n.b / 255 * .312;return C = s.bounded(C, [-.5957, .5957]), x = s.bounded(x, [-.5226, .5226]), { y: m, i: C, q: x };case "XYZ":
      var A = [n.r, n.g, n.b].map(function (r) {
        return r / 255;
      }).map(function (r) {
        return r <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
      }),
          S = s.getTransform("SRGB_XYZ").map(function (r) {
        return A.reduce(function (e, n, t) {
          return r[t] * n + e;
        }, 0);
      }).map(function (r) {
        return 100 * r;
      }),
          O = slicedToArray$1(S, 3);return { X: O[0], Y: O[1], Z: O[2] };case "lms":case "cielab":case "cieluv":case "xyY":
      var I = o.convert({ conversions: t, operations: o, helpers: s }, "XYZ", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, I);case "cielch":
      var j = o.convert({ conversions: t, operations: o, helpers: s }, "cieluv", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, j);case "hsluv":
      var D = o.convert({ conversions: t, operations: o, helpers: s }, "cielch", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, D);}
}function fromCssRgb(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;n = n.replace(/((rgb\(|\))|[\s]*)/g, "").split(",");for (var a = 0; a < n.length; a++) {
    n[a] = parseInt(n[a]);
  }switch (e) {case "rgb":
      return { r: n[0], g: n[1], b: n[2] };default:
      return o.convert({ conversions: t, operations: o, helpers: s }, e, { r: n[0], g: n[1], b: n[2] });}
}function fromHsl(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "rgb":
      if (0 == n.s) {
        var a = n.l / 100 * 255;return { r: a, g: a, b: a };
      }var i, c, u;i = n.l >= 50 ? n.l / 100 + n.s / 100 - n.l / 100 * (n.s / 100) : n.l / 100 * (1 + n.s / 100), c = n.l / 100 * 2 - i;var l,
          h,
          v,
          p = ((u = n.h / 360) + .333) % 1,
          f = u,
          m = s.negMod(u - .333, 1);return l = 6 * p < 1 ? c + 6 * (i - c) * p : 2 * p < 1 ? i : 3 * p < 2 ? c + 6 * (.666 - p) * (i - c) : c, h = 6 * f < 1 ? c + 6 * (i - c) * f : 2 * f < 1 ? i : 3 * f < 2 ? c + 6 * (.666 - f) * (i - c) : c, v = 6 * m < 1 ? c + 6 * (i - c) * m : 2 * m < 1 ? i : 3 * m < 2 ? c + 6 * (.666 - m) * (i - c) : c, l < 0 && (l = 0), h < 0 && (h = 0), v < 0 && (v = 0), { r: 255 * l, g: 255 * h, b: 255 * v };case "csshsl":
      return "hsl(" + Math.round(n.h) + "," + Math.round(n.s) + "%," + Math.round(n.l) + "%)";case "hsv":
      n.s = n.s / 100, n.l = n.l / 100;var d = n.s * (n.l < .5 ? n.l : 1 - n.l);return { h: n.h, s: 100 * (2 * d / (n.l + d)), v: 100 * (n.l + d) };default:
      var b = o.convert({ conversions: t, operations: o, helpers: s }, "rgb", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, b);}
}function fromCssHsl(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;n = n.replace(/(hsl\(|\)|%|[\s]*)/g, "").split(",");for (var a = 0; a < n.length; a++) {
    n[a] = parseInt(n[a]);
  }switch (e) {case "hsl":
      return { h: n[0], s: n[1], l: n[2] };default:
      return o.convert({ conversions: t, operations: o, helpers: s }, e, { h: n[0], s: n[1], l: n[2] });}
}function fromHsv(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "rgb":
      var a, i, c;n.h = n.h / 360, n.s = n.s / 100, n.v = n.v / 100;var u = 6 * n.h;6 == u && (u = 0);var l,
          h,
          v,
          p = Math.round(u),
          f = n.v * (1 - n.s),
          m = n.v * (1 - n.s * (u - p)),
          d = n.v * (1 - n.s * (1 - (u - p)));return 0 == p ? (l = n.v, h = d, v = f) : 1 == p ? (l = m, h = n.v, v = f) : 2 == p ? (l = f, h = n.v, v = d) : 3 == p ? (l = f, h = m, v = n.v) : 4 == p ? (l = d, h = f, v = n.v) : (l = n.v, h = f, v = m), a = 255 * l, i = 255 * h, c = 255 * v, { r: a, g: i, b: c };case "hsl":
      n.h = n.h / 360, n.s = n.s / 100, n.v = n.v / 100;return { h: 360 * n.h, s: 100 * ((2 - n.s) * n.v < 1 ? n.s * n.v / ((2 - n.s) * n.v) : n.s * n.v / (2 - (2 - n.s) * n.v)), l: 100 * ((2 - n.s) * n.v / 2) };default:
      var b = o.convert({ conversions: t, operations: o, helpers: s }, "rgb", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, b);}
}function fromCmyk(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "rgb":
      return { r: a = 255 * (1 - n.c) * (1 - n.k), g: i = 255 * (1 - n.m) * (1 - n.k), b: c = 255 * (1 - n.y) * (1 - n.k) };case "cssrgb":
      var a = 255 * (1 - n.c) * (1 - n.k),
          i = 255 * (1 - n.m) * (1 - n.k),
          c = 255 * (1 - n.y) * (1 - n.k);return "rgb(" + Math.round(a) + "," + Math.round(i) + "," + Math.round(c) + ")";default:
      var u = o.convert({ conversions: t, operations: o, helpers: s }, "rgb", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, u);}
}function fromYiq(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (n.i = s.bounded(n.i, [-.5957, .5957]), n.q = s.bounded(n.q, [-.5226, .5226]), e) {case "rgb":
      var a = 255 * (n.y + .956 * n.i + .621 * n.q),
          i = 255 * (n.y + -.272 * n.i + -.647 * n.q),
          c = 255 * (n.y + -1.106 * n.i + -1.703 * n.q);return a = s.bounded(a, [0, 255]), i = s.bounded(i, [0, 255]), c = s.bounded(c, [0, 255]), { r: a, g: i, b: c };default:
      var u = o.convert({ conversions: t, operations: o, helpers: s }, "rgb", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, u);}
}function fromXYZ(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers,
      a = s.getIlluminant("D65");switch (e) {case "rgb":
      var i = [n.X, n.Y, n.Z].map(function (r) {
        return r / 100;
      }),
          c = s.getTransform("INVERSE_SRGB_XYZ").map(function (r) {
        return i.reduce(function (e, n, t) {
          return r[t] * n + e;
        }, 0);
      }).map(function (r) {
        return r <= .0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055;
      }).map(function (r) {
        return 255 * r;
      }),
          u = slicedToArray$1(c, 3),
          l = u[0],
          h = u[1],
          v = u[2];return s.boundedRgb({ r: l, g: h, b: v });case "lms":
      var p = [n.X, n.Y, n.Z].map(function (r) {
        return r / 100;
      }),
          f = s.getTransform("BRADFORD").map(function (r) {
        return p.reduce(function (e, n, t) {
          return r[t] * n + e;
        }, 0);
      });return { rho: f[0], gamma: f[1], beta: f[2] };case "cielab":
      var m = n.X / a.X,
          d = n.Y / a.Y,
          b = n.Z / a.Z,
          g = function g(r) {
        return r > .008856 ? s.cbrt(r) : (903.3 * r + 16) / 116;
      },
          y = g(m),
          _ = g(d);return { L: 116 * _ - 16, a: 500 * (y - _), b: 200 * (_ - g(b)) };case "cieluv":
      var M = n.Y / a.Y,
          Y = M > .008856 ? 116 * s.cbrt(M) - 16 : 903.3 * M,
          L = function L(r) {
        return 4 * r.X / (r.X + 15 * r.Y + 3 * r.Z);
      },
          X = function X(r) {
        return 9 * r.Y / (r.X + 15 * r.Y + 3 * r.Z);
      };return { L: Y, u: 13 * Y * (L(n) - L(a)), v: 13 * Y * (X(n) - X(a)) };case "xyY":
      return { x: n.X / (n.X + n.Y + n.Z), y: n.Y / (n.X + n.Y + n.Z), Y: n.Y };default:
      var Z = s.boundedRgb(o.convert({ conversions: t, operations: o, helpers: s }, "rgb", n));return o.convert({ conversions: t, operations: o, helpers: s }, e, Z);}
}function fromxyY(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "XYZ":
      var a = n.Y / n.y * n.x,
          i = n.Y / n.y * (1 - n.x - n.y);return { X: a, Y: n.Y, Z: i };default:
      var c = o.convert({ conversions: t, operations: o, helpers: s }, "XYZ", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, c);}
}function fromLms(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "XYZ":
      var a = [n.rho, n.gamma, n.beta],
          i = s.getTransform("INVERSE_BRADFORD").map(function (r) {
        return a.reduce(function (e, n, t) {
          return r[t] * n + e;
        }, 0);
      });return { X: 100 * i[0], Y: 100 * i[1], Z: 100 * i[2] };default:
      var c = o.convert({ conversions: t, operations: o, helpers: s }, "XYZ", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, c);}
}function fromCieLab(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "XYZ":
      var a = s.getIlluminant("D65"),
          i = (n.L + 16) / 116,
          c = n.a / 500 + i,
          u = i - n.b / 200,
          l = function l(r) {
        return Math.pow(r, 3) > .008856 ? Math.pow(r, 3) : (116 * r - 16) / 903.3;
      },
          h = l(c),
          v = l(u),
          p = n.L > 903.3 * .008856 ? Math.pow(i, 3) : n.L / 903.3;return { X: h * a.X, Y: p * a.Y, Z: v * a.Z };default:
      var f = o.convert({ conversions: t, operations: o, helpers: s }, "XYZ", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, f);}
}function fromCieLuv(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "XYZ":
      var a = s.getIlluminant("D65"),
          i = function (r) {
        return 4 * r.X / (r.X + 15 * r.Y + 3 * r.Z);
      }(a),
          c = function (r) {
        return 9 * r.Y / (r.X + 15 * r.Y + 3 * r.Z);
      }(a),
          u = 1 / 3 * (52 * n.L / (n.u + 13 * n.L * i) - 1),
          l = n.L > 903.3 * .008856 ? Math.pow((n.L + 16) / 116, 3) : n.L / 903.3,
          h = -5 * l,
          v = (l * (39 * n.L / (n.v + 13 * n.L * c) - 5) - h) / (u - -1 / 3);return { X: 100 * v, Y: 100 * l, Z: 100 * (v * u + h) };case "cielch":
      var p = Math.sqrt(Math.pow(n.u, 2) + Math.pow(n.v, 2)),
          f = Math.atan2(n.v, n.u);return f < 0 && (f += 2 * Math.PI), f = s.toDeg(f), { L: n.L, C: p, h: f };default:
      var m = o.convert({ conversions: t, operations: o, helpers: s }, "XYZ", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, m);}
}function fromCieLch(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "cieluv":
      var a = s.toRad(n.h),
          i = n.C * Math.cos(a),
          c = n.C * Math.sin(a);return { L: n.L, u: i, v: c };case "hsluv":
      if (n.L > 99.9999999) return { hu: n.h, s: 0, l: 100 };if (n.L < 1e-8) return { hu: n.h, s: 0, l: 0 };for (var u = (n.L + 16) / 1560896, l = u > .008856 ? u : n.L / 903.3, h = s.getTransform("INVERSE_SRGB_XYZ"), v = [], p = 0; p < 3; p++) {
        for (var f = h[p][0], m = h[p][1], d = h[p][2], b = 0; b < 2; b++) {
          var g = (284517 * f - 94839 * d) * l,
              y = (838422 * d + 769860 * m + 731718 * f) * n.L * l - 769860 * b * n.L,
              _ = (632260 * d - 126452 * m) * l + 126452 * b;v.push({ m: g / _, b: y / _ });
        }
      }var M = Number.MAX_VALUE,
          Y = s.toRad(n.h);v.forEach(function (r) {
        var e = r.b / (Math.sin(Y) - r.m * Math.cos(Y));e >= 0 && (M = Math.min(M, e));
      });var L = M;return { hu: n.h, s: n.C / L * 100, l: n.L };default:
      var X = o.convert({ conversions: t, operations: o, helpers: s }, "cieluv", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, X);}
}function fromCieLch$1(r, e, n) {
  var t = r.conversions,
      o = r.operations,
      s = r.helpers;switch (e) {case "cielch":
      if (n.L > 99.9999999) return { L: 100, C: 0, h: n.hu };if (n.L < 1e-8) return { L: 0, C: 0, h: n.hu };for (var a = (n.l + 16) / 1560896, i = a > .008856 ? a : n.l / 903.3, c = s.getTransform("INVERSE_SRGB_XYZ"), u = [], l = 0; l < 3; l++) {
        for (var h = c[l][0], v = c[l][1], p = c[l][2], f = 0; f < 2; f++) {
          var m = (284517 * h - 94839 * p) * i,
              d = (838422 * p + 769860 * v + 731718 * h) * n.l * i - 769860 * f * n.l,
              b = (632260 * p - 126452 * v) * i + 126452 * f;u.push({ m: m / b, b: d / b });
        }
      }var g = Number.MAX_VALUE,
          y = s.toRad(n.hu);u.forEach(function (r) {
        var e = r.b / (Math.sin(y) - r.m * Math.cos(y));e >= 0 && (g = Math.min(g, e));
      });var _ = g;return { L: n.l, C: _ / 100 * n.s, h: n.hu };default:
      var M = o.convert({ conversions: t, operations: o, helpers: s }, "cielch", n);return o.convert({ conversions: t, operations: o, helpers: s }, e, M);}
}function contains(r, e) {
  return Object.keys(r).every(function (r) {
    return -1 !== e.indexOf(r);
  });
}function adapt(r, e, n, t) {
  var o = r.operations.convert(r, "XYZ", e),
      s = r.operations.convert(r, "lms", n);if (t) a = r.operations.convert(r, "lms", t);else var a = r.operations.convert(r, "lms", r.helpers.getIlluminant("D65"));var i = r.helpers.getTransform("BRADFORD"),
      c = r.helpers.getTransform("INVERSE_BRADFORD"),
      u = [[s.rho / a.rho, 0, 0], [0, s.gamma / a.gamma, 0], [0, 0, s.beta / a.beta]],
      l = r.helpers.matrixMultiply(c, u),
      h = r.helpers.matrixMultiply(l, i),
      v = [[o.X], [o.Y], [o.Z]],
      p = r.helpers.matrixMultiply(h, v),
      f = { X: p[0][0], Y: p[1][0], Z: p[2][0] };return r.helpers.ready(r, f);
}function adjacent(r, e, n, t) {
  for (var o = r.operations.convert(r, "hsl", t), s = [{ h: o.h, s: o.s, l: o.l }], a = 0; a < n - 1; a++) {
    o.h = r.helpers.negMod(o.h + e, 360), s.push({ h: o.h, s: o.s, l: o.l });
  }return r.helpers.ready(r, s);
}function brightness(r, e, n) {
  var t = r.operations.convert(r, "hsl", n);return t.l += e, t.l < 0 ? t.l = 0 : t.l > 100 && (t.l = 100), r.helpers.ready(r, t);
}function complementary(r, e) {
  var n = r.operations.convert(r, "hsl", e);return n.h = (n.h + 180) % 360, r.helpers.ready(r, n);
}function contrast(r, e, n) {
  var t = r.operations.convert(r, "rgb", n);return t.r = 255 * ((t.r / 255 - .5) * e + .5), t.r < 0 ? t.r = 0 : t.r > 255 && (t.r = 255), t.g = 255 * ((t.g / 255 - .5) * e + .5), t.g < 0 ? t.g = 0 : t.g > 255 && (t.g = 255), t.b = 255 * ((t.b / 255 - .5) * e + .5), t.b < 0 ? t.b = 0 : t.b > 255 && (t.b = 255), r.helpers.ready(r, t);
}function contrastRatio(r, e) {
  var n = r.operations.convert(r, "rgb", e);return n = (299 * n.r + 587 * n.g + 114 * n.b) / 1e3 >= 128 ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 }, r.helpers.ready(r, n);
}function convert(r, e, n) {
  if (Object.keys(r.conversions).indexOf(e) > -1) {
    n.colour ? n = n.colour : n.colours && (n = n.colours);var t = r.helpers.determineMode(n);return t != e ? r.conversions[t].convert(r, e, n) : n;
  }return r.helpers.ready(r, e);
}function difference(r, e, n, t, o) {
  t = t || 1, o = o || 1;var s = r.operations.convert(r, "cielab", e),
      a = r.operations.convert(r, "cielab", n),
      i = Math.sqrt(Math.pow(s.a, 2) + Math.pow(s.b, 2)),
      c = i - Math.sqrt(Math.pow(a.a, 2) + Math.pow(a.b, 2)),
      u = s.L - a.L,
      l = s.a - a.a,
      h = s.b - a.b,
      v = Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2) - Math.pow(c, 2)),
      p = s.L < 16 ? .511 : .040975 * s.L / (1.01765 * s.L),
      f = .0638 * i / (1.0131 * i),
      m = Math.atan2(s.b, s.a),
      d = m >= 0 ? m : m + 360,
      b = 164 <= d && d <= 345 ? .56 + Math.abs(.2 * Math.cos(r.helpers.toRad(d + 168))) : .36 + Math.abs(.4 * Math.cos(r.helpers.toRad(d + 35))),
      g = Math.pow(i, 4) / (Math.pow(i, 4) + 1900),
      y = f * (g * b + 1 - g),
      _ = Math.pow(u / (t * p), 2);Math.pow(c / (o * f), 2), Math.pow(v / y, 2);return Math.sqrt(_ + _ + _);
}function fade(r, e, n, t) {
  var o = r.operations.convert(r, "rgb", n),
      s = r.operations.convert(r, "rgb", t),
      a = [o];e -= 1;for (var i = (s.r - o.r) / e, c = (s.g - o.g) / e, u = (s.b - o.b) / e, l = { r: o.r, g: o.g, b: o.b }, h = 0; h < e - 1; h++) {
    l.r = r.helpers.slopeMod(l.r + i, 255), l.g = r.helpers.slopeMod(l.g + c, 255), l.b = r.helpers.slopeMod(l.b + u, 255), a.push({ r: l.r, g: l.g, b: l.b });
  }return a.push(s), r.helpers.ready(r, a);
}function greyscale(r, e) {
  var n = r.operations.convert(r, "rgb", e),
      t = (n.r + n.g + n.b) / 3;return n = { r: t, g: t, b: t }, r.helpers.ready(r, n);
}function hue(r, e, n) {
  var t = r.operations.convert(r, "hsl", n);return t.h = r.helpers.negMod(t.h + e, 360), r.helpers.ready(r, t);
}function invert(r, e) {
  var n = r.operations.convert(r, "rgb", e);return n.r = r.helpers.negMod(255 - n.r, 255), n.g = r.helpers.negMod(255 - n.g, 255), n.b = r.helpers.negMod(255 - n.b, 255), r.helpers.ready(r, n);
}function invertLightness(r, e) {
  var n = r.operations.convert(r, "hsl", e);return n.l = 100 - n.l, r.helpers.ready(r, n);
}function mid(r, e, n) {
  var t = r.operations.convert(r, "hsl", e),
      o = r.operations.convert(r, "hsl", n),
      s = { h: (t.h + o.h) / 2, s: (t.s + o.s) / 2, l: (t.l + o.l) / 2 };return r.helpers.ready(r, s);
}function multiply(r, e, n) {
  var t = r.operations.convert(r, "hsl", e),
      o = r.operations.convert(r, "hsl", n),
      s = { h: t.h, s: t.s, l: t.l / 100 * (o.l / 100) * 100 };return s.l = s.l > 100 ? 100 : s.l, s.l = s.l < 0 ? 0 : s.l, r.helpers.ready(r, s);
}function saturation(r, e, n) {
  var t = r.operations.convert(r, "hsl", n);return t.s += e, t.s < 0 ? t.s = 0 : t.s > 100 && (t.s = 100), r.helpers.ready(r, t);
}function sepia(r, e) {
  var n = r.operations.convert(r, "rgb", e),
      t = {};return t.r = .393 * n.r + .769 * n.g + .189 * n.b, t.g = .349 * n.r + .686 * n.g + .168 * n.b, t.b = .272 * n.r + .534 * n.g + .131 * n.b, r.helpers.ready(r, t);
}function shade(r, e, n) {
  var t = r.operations.convert(r, "hsv", n);return t.v += e, t.v < 0 ? t.v = 0 : t.v > 100 && (t.v = 100), r.helpers.ready(r, t);
}function temperature(r, e) {
  var n = r.operations.convert(r, "xyY", e),
      t = (n.x - .332) / (n.y - .1858);return -449 * Math.pow(t, 3) + 3525 * Math.pow(t, 2) - 6823.3 * t + 5520.33;
}function tetrad(r, e) {
  for (var n = r.operations.convert(r, "hsl", e), t = [{ h: n.h, s: n.s, l: n.l }], o = 0; o < 3; o++) {
    n.h = (n.h + 90) % 360, t.push({ h: n.h, s: n.s, l: n.l });
  }return r.helpers.ready(r, t);
}function triad(r, e) {
  for (var n = r.operations.convert(r, "hsl", e), t = [{ h: n.h, s: n.s, l: n.l }], o = 0; o < 2; o++) {
    n.h = (n.h + 120) % 360, t.push({ h: n.h, s: n.s, l: n.l });
  }return r.helpers.ready(r, t);
}var fromHex_1 = fromHex;
var _typeof$1 = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (r) {
  return typeof r === "undefined" ? "undefined" : _typeof(r);
} : function (r) {
  return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r === "undefined" ? "undefined" : _typeof(r);
};
var slicedToArray$1 = function () {
  function r(r, e) {
    var n = [],
        t = !0,
        o = !1,
        s = void 0;try {
      for (var a, i = r[Symbol.iterator](); !(t = (a = i.next()).done) && (n.push(a.value), !e || n.length !== e); t = !0) {}
    } catch (r) {
      o = !0, s = r;
    } finally {
      try {
        !t && i.return && i.return();
      } finally {
        if (o) throw s;
      }
    }return n;
  }return function (e, n) {
    if (Array.isArray(e)) return e;if (Symbol.iterator in Object(e)) return r(e, n);throw new TypeError("Invalid attempt to destructure non-iterable instance");
  };
}();
var toConsumableArray$1 = function toConsumableArray$$1(r) {
  if (Array.isArray(r)) {
    for (var e = 0, n = Array(r.length); e < r.length; e++) {
      n[e] = r[e];
    }return n;
  }return Array.from(r);
};
var fromRgb_1 = fromRgb;
var fromCssRgb_1 = fromCssRgb;
var fromHsl_1 = fromHsl;
var fromCssHsl_1 = fromCssHsl;
var fromHsv_1 = fromHsv;
var fromCmyk_1 = fromCmyk;
var fromYiq_1 = fromYiq;
var fromXYZ_1 = fromXYZ;
var fromxyY_1 = fromxyY;
var fromLms_1 = fromLms;
var fromCieLab_1 = fromCieLab;
var fromCieLuv_1 = fromCieLuv;
var fromCieLch_1 = fromCieLch;
var fromHsluv = fromCieLch$1;
var index$11 = { hex: { test: function test(r) {
      return "string" == typeof r && "#" === r.slice(0, 1);
    }, convert: fromHex_1 }, rgb: { test: function test(r) {
      return contains(r, ["r", "g", "b"]);
    }, convert: fromRgb_1 }, cssrgb: { test: function test(r) {
      return "string" == typeof r && "rgb(" === r.slice(0, 4);
    }, convert: fromCssRgb_1 }, hsl: { test: function test(r) {
      return contains(r, ["h", "s", "l"]);
    }, convert: fromHsl_1 }, csshsl: { test: function test(r) {
      return "string" == typeof r && "hsl(" === r.slice(0, 4);
    }, convert: fromCssHsl_1 }, hsv: { test: function test(r) {
      return contains(r, ["h", "s", "v"]);
    }, convert: fromHsv_1 }, cmyk: { test: function test(r) {
      return contains(r, ["c", "m", "y", "k"]);
    }, convert: fromCmyk_1 }, yiq: { test: function test(r) {
      return contains(r, ["y", "i", "q"]);
    }, convert: fromYiq_1 }, XYZ: { test: function test(r) {
      return contains(r, ["X", "Y", "Z"]);
    }, convert: fromXYZ_1 }, xyY: { test: function test(r) {
      return contains(r, ["x", "y", "Y"]);
    }, convert: fromxyY_1 }, lms: { test: function test(r) {
      return contains(r, ["rho", "gamma", "beta"]);
    }, convert: fromLms_1 }, cielab: { test: function test(r) {
      return contains(r, ["L", "a", "b"]);
    }, convert: fromCieLab_1 }, cieluv: { test: function test(r) {
      return contains(r, ["L", "u", "v"]);
    }, convert: fromCieLuv_1 }, cielch: { test: function test(r) {
      return contains(r, ["L", "C", "h"]);
    }, convert: fromCieLch_1 }, hsluv: { test: function test(r) {
      return contains(r, ["hu", "s", "l"]);
    }, convert: fromHsluv } };
var adapt_1 = adapt;
var adjacent_1 = adjacent;
var brightness_1 = brightness;
var complementary_1 = complementary;
var contrast_1 = contrast;
var contrastRatio_1 = contrastRatio;
var convert_1 = convert;
var difference_1 = difference;
var fade_1 = fade;
var greyscale_1 = greyscale;
var hue_1 = hue;
var invert_1 = invert;
var invertLightness_1 = invertLightness;
var mid_1 = mid;
var multiply_1 = multiply;
var saturation_1 = saturation;
var sepia_1 = sepia;
var shade_1 = shade;
var temperature_1 = temperature;
var tetrad_1 = tetrad;
var triad_1 = triad;
var index$2$1 = { adapt: adapt_1, adjacent: adjacent_1, brightness: brightness_1, complementary: complementary_1, contrast: contrast_1, contrastRatio: contrastRatio_1, convert: convert_1, difference: difference_1, fade: fade_1, greyscale: greyscale_1, hue: hue_1, invert: invert_1, invertLightness: invertLightness_1, mid: mid_1, multiply: multiply_1, saturation: saturation_1, sepia: sepia_1, shade: shade_1, temperature: temperature_1, tetrad: tetrad_1, triad: triad_1 };
var constants = { ILLUMINANTS: { A: { X: 1.0985 * 100, Y: 100, Z: 35.585 }, B: { X: 99.072, Y: 100, Z: 85.223 }, C: { X: 98.074, Y: 100, Z: 118.232 }, D50: { X: 96.422, Y: 100, Z: 82.521 }, D55: { X: 95.682, Y: 100, Z: 92.149 }, D65: { X: 95.047, Y: 100, Z: 108.883 }, D75: { X: 94.972, Y: 100, Z: 122.638 }, E: { X: 100, Y: 100, Z: 100 }, F2: { X: .99186 * 100, Y: 100, Z: 67.393 }, F7: { X: 95.041, Y: 100, Z: 108.747 }, F11: { X: 1.00962 * 100, Y: 100, Z: 64.35 } }, TRANSFORMS: { BRADFORD: [[.8951, .2664, -.1614], [-.7502, 1.7135, .0367], [.0389, -.0685, 1.0296]], INVERSE_BRADFORD: [[.9869929, -.1470543, .1599627], [.4323053, .5183603, .0492912], [-.0085287, .0400428, .9684867]], SRGB_XYZ: [[.4124, .3576, .1805], [.2126, .7152, .0722], [.0193, .1192, .9505]], INVERSE_SRGB_XYZ: [[3.2406, -1.5372, -.4986], [-.9689, 1.8758, .0415], [.0557, -.204, 1.057]] } };
var api = function api(r, e, n) {
  var t = Object.keys(r.operations).reduce(function (e, t) {
    var o = r.operations[t];return e[t] = function () {
      for (var e = arguments.length, t = Array(e), s = 0; s < e; s++) {
        t[s] = arguments[s];
      }var a = t.slice(0).map(function (r) {
        return "object" === (void 0 === r ? "undefined" : _typeof$1(r)) ? Object.assign({}, r) : r;
      });if (n && n.colours) {
        return function e(n) {
          var t = n.map(function (n) {
            if (Array.isArray(n)) {
              var t = e(n);return t.colours || t.colour;
            }var s = o.apply(void 0, [r].concat(toConsumableArray$1(a), [n]));return "object" === (void 0 === s ? "undefined" : _typeof$1(s)) ? s.colours || s.colour : s;
          });return "number" != typeof t[0] ? r.helpers.ready(r, t) : t;
        }(n.colours);
      }return o.apply(void 0, [r].concat(toConsumableArray$1(a), [n ? n.colour : void 0]));
    }, e;
  }, {});return n || (t = Object.assign(t, e)), t;
};
var api_1 = api;
var helpers = { getIlluminant: function getIlluminant(r) {
    return constants.ILLUMINANTS[r];
  }, getTransform: function getTransform(r) {
    return constants.TRANSFORMS[r];
  }, matrixMultiply: function matrixMultiply(r, e) {
    for (var n = [], t = 0; t < r.length; t++) {
      n[t] = [];for (var o = 0; o < e[0].length; o++) {
        for (var s = 0, a = 0; a < r[0].length; a++) {
          s += r[t][a] * e[a][o];
        }n[t][o] = s;
      }
    }return n;
  }, cbrt: function cbrt(r) {
    if (Math.cbrt) return Math.cbrt(r);var e = Math.pow(Math.abs(r), 1 / 3);return r < 0 ? -e : e;
  }, toRad: function toRad(r) {
    return r * (Math.PI / 180);
  }, toDeg: function toDeg(r) {
    return r * (180 / Math.PI);
  }, negMod: function negMod(r, e) {
    return (r % e + e) % e;
  }, slopeMod: function (r) {
    function e(e, n) {
      return r.apply(this, arguments);
    }return e.toString = function () {
      return r.toString();
    }, e;
  }(function (r, e) {
    return r > 2 * e ? slopeMod(r - 2 * e, e) : r > e ? 2 * e - r : r < 0 ? slopeMod(r + 2 * e, e) : r;
  }), bounded: function bounded(r, e) {
    return r < e[0] ? r = e[0] : r > e[1] && (r = e[1]), r;
  }, boundedRgb: function boundedRgb(r) {
    var e = this,
        n = function n(r) {
      return e.bounded(r, [0, 255]);
    };return { r: n(r.r), g: n(r.g), b: n(r.b) };
  }, determineMode: function determineMode(r) {
    for (var e in index$11) {
      if (index$11.hasOwnProperty(e) && index$11[e].test(r)) return e;
    }return null;
  }, ready: function ready(r, e) {
    var n = r.conversions,
        t = r.operations,
        o = r.helpers,
        s = {};switch (Object.prototype.toString.call(e)) {case "[object Object]":case "[object String]":
        s.colour = e;for (var a in n) {
          n.hasOwnProperty(a) && function (r) {
            Object.defineProperty(s, r, { get: function get$$1() {
                o.determineMode(e);return t.convert({ conversions: n, operations: t, helpers: o }, r, e);
              }, enumerable: !0 });
          }(a);
        }return s = Object.assign(s, api_1({ conversions: n, operations: t, helpers: o }, constants, s));case "[object Array]":
        s.colours = e;for (var i in n) {
          n.hasOwnProperty(i) && function (r) {
            Object.defineProperty(s, r, { get: function get$$1() {
                return function e(s) {
                  return s.map(function (s) {
                    return Array.isArray(s) ? e(s) : t.convert({ conversions: n, operations: t, helpers: o }, r, s);
                  });
                }(e);
              }, enumerable: !0 });
          }(i);
        }return s = Object.assign(s, api_1({ conversions: n, operations: t, helpers: o }, constants, s));default:
        return null;}
  } };
var helpers_1 = helpers;
var dependencies = { conversions: index$11, operations: index$2$1, helpers: helpers_1 };
var entry = api_1(dependencies, constants);

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

	if (isInitial || 'relevantEventsWithAxis' in newState && differs$1(state.relevantEventsWithAxis, oldState.relevantEventsWithAxis)) {
		state.indentLevels = newState.indentLevels = template$1.computed.indentLevels(state.relevantEventsWithAxis);
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
			if (event.axis.start === undefined || event.axis.end === undefined) {
				console.error(event);
				throw new Error('No axis values for ' + event.title);
			}
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

	var defaultZoomedDayHeight = 0.5;
	var topZoom = {
		dayHeight: 0.1,
		start: 1471937,
		end: 1488003,
		snipSectionsLongerThan: 10000,
		snipBuffer: 1500,
		type: 'top'
	};

	function eventOverlapsRange(eventRange, zoomRange) {
		var solidlyInside = eventRange.start >= zoomRange.start && eventRange.end <= zoomRange.end;
		var overlapsBeginning = eventRange.end >= zoomRange.start && eventRange.start < zoomRange.start;
		var overlapsEnd = eventRange.start <= zoomRange.end && eventRange.end > zoomRange.end;

		return solidlyInside || overlapsBeginning || overlapsEnd;
	}

	function daysThatOverlapRange(eventRange, zoomRange) {
		var eventDays = eventRange.end - eventRange.start;
		var lostAtStart = Math.max(zoomRange.start - eventRange.start, 0);
		var lostAtEnd = Math.max(eventRange.end - zoomRange.end, 0);

		return eventDays - lostAtStart - lostAtEnd;
	}

	// const startingColor = '#2900ff'
	// const startingColor = '#00cdd4'
	// const endingColor = '#00ccd4'
	var startingColor = '#0074D9';
	var endingColor = '#2ECC40';
	// const eventColors = chromatism.adjacent(20, 5, startingColor).hex
	var eventColors = entry.fade(4, startingColor, endingColor).hex;
	var hoverColors = eventColors.map(function (color) {
		return entry.contrast(3, color).hex;
	});

	function addColorToEvents(events) {
		return events.map(function (event) {
			return Object.assign({
				color: eventColors[event.indentLevel % eventColors.length],
				hoverColor: hoverColors[event.indentLevel % eventColors.length]
			}, event);
		});
	}

	function filterToRelevantEvents(timelineData, currentZoom) {
		return timelineData.filter(function (event) {
			return eventOverlapsRange(event.amd, currentZoom) && (!currentZoom.type || currentZoom.type === event.type);
		});
	}

	function sortEventsForDisplay(timelineData, currentZoom) {
		return sortRange(timelineData, function (event) {
			return event.type === 'top' ? [0, -daysThatOverlapRange(event.amd, currentZoom), 0] : [1, event.amd.start, -daysThatOverlapRange(event.amd, currentZoom)];
		});
	}

	return {
		data: function data() {
			return {
				visibleEvents: []
			};
		},

		computed: {
			zooms: function zooms(timelineData) {
				return timelineData.reduce(function (map, event) {
					map[event.slug] = {
						start: event.amd.start,
						end: event.amd.end,
						dayHeight: event.dayHeight || defaultZoomedDayHeight,
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
				return pipe(timelineData, function (_) {
					return filterToRelevantEvents(_, currentZoom);
				}, function (_) {
					return sortEventsForDisplay(_, currentZoom);
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
				return pipe(relevantEvents, function (_) {
					return addAxisPointsToTimelineData_1(axis, _);
				}, function (_) {
					return addIndentAndAxisAfterStart(_, currentZoom.start, currentZoom.end);
				}, addColorToEvents);
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
			},
			indentLevels: function indentLevels(relevantEventsWithAxis) {
				return relevantEventsWithAxis.reduce(function (max, event) {
					return max < event.indentLevel ? event.indentLevel : max;
				}, 0);
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
		// oncreate() {
		// 	this.observe('visibleEvents', () => {
		// 		console.log(this.get())
		// 	})
		// }
	};
}();

function add_css() {
	var style = createElement$1('style');
	style.id = "svelte-2992398978-style";
	style.textContent = "\n[svelte-2992398978].timeline-container, [svelte-2992398978] .timeline-container {\n\tdisplay: flex;\n\tflex-wrap: nowrap;\n\talign-items: flex-start;\n}\n[svelte-2992398978].timeline-row, [svelte-2992398978] .timeline-row {\n\tposition: relative;\n}\n[svelte-2992398978].axis, [svelte-2992398978] .axis {\n\tfont-size: 10px;\n\twidth: 100px;\n\ttext-align: right;\n}\n[svelte-2992398978].axis[data-relevant=true], [svelte-2992398978] .axis[data-relevant=true] {\n\tcolor: red;\n}\n[svelte-2992398978].eventhover, [svelte-2992398978] .eventhover {\n\tz-index: 1;\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tpadding: 10px;\n\tbackground-color: white;\n\tbackground-color: rgba(255, 255, 255, 0.8);\n}\n";
	appendNode(style, document.head);
}

function create_main_fragment$1(state, component) {
	var text,
	    div,
	    div_1,
	    text_1,
	    div_2,
	    div_2_style_value,
	    events_updating = false,
	    text_2,
	    div_3;

	var if_block = state.hoveredEvent && create_if_block$1(state, component);

	var each_block_value = state.axis;

	var each_block_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_iterations[i] = create_each_block(state, each_block_value, each_block_value[i], i, component);
	}

	var events_initial_data = {
		timeline: state.relevantEventsWithAxis,
		dayHeight: state.currentZoom.dayHeight,
		clickable: true
	};
	if ('visibleEvents' in state) events_initial_data.visibleEvents = state.visibleEvents;
	var events = new Events({
		_root: component._root,
		data: events_initial_data
	});

	events.on('startHover', function (event) {
		component.startHover(event);
	});

	events.on('endHover', function (event) {
		component.endHover(event);
	});

	component._bindings.push(function () {
		if (events._torndown) return;
		events.observe('visibleEvents', function (value) {
			if (events_updating) return;
			events_updating = true;
			component._set({ visibleEvents: value });
			events_updating = false;
		}, { init: differs$1(events.get('visibleEvents'), state.visibleEvents) });
	});

	events._context = {
		state: state
	};

	var eventdescriptions = new EventDescriptions({
		_root: component._root,
		data: { timeline: state.visibleEvents }
	});

	return {
		create: function create() {
			if (if_block) if_block.create();
			text = createText("\n");
			div = createElement$1('div');
			div_1 = createElement$1('div');

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].create();
			}

			text_1 = createText("\n\t");
			div_2 = createElement$1('div');
			events._fragment.create();
			text_2 = createText("\n\t");
			div_3 = createElement$1('div');
			eventdescriptions._fragment.create();
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			setAttribute(div, 'svelte-2992398978', '');
			div.className = "timeline-container";
			div_1.className = "timeline-row";
			div_1.style.cssText = "width: 100px; margin-right: 10px;";
			div_2.className = "timeline-row";
			div_2.style.cssText = div_2_style_value = "width: " + template$1.helpers.multiplyIndentByWidth(state.indentLevels + 1) + "px";
			div_3.className = "timeline-row";
		},

		mount: function mount(target, anchor) {
			if (if_block) if_block.mount(target, anchor);
			insertNode$1(text, target, anchor);
			insertNode$1(div, target, anchor);
			appendNode(div_1, div);

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].mount(div_1, null);
			}

			appendNode(text_1, div);
			appendNode(div_2, div);
			events._fragment.mount(div_2, null);
			appendNode(text_2, div);
			appendNode(div_3, div);
			eventdescriptions._fragment.mount(div_3, null);
		},

		update: function update(changed, state) {
			if (state.hoveredEvent) {
				if (if_block) {
					if_block.update(changed, state);
				} else {
					if_block = create_if_block$1(state, component);
					if_block.create();
					if_block.mount(text.parentNode, text);
				}
			} else if (if_block) {
				if_block.unmount();
				if_block.destroy();
				if_block = null;
			}

			var each_block_value = state.axis;

			if ('multiplyDaysByHeight' in changed || 'distanceFromStartDay' in changed || 'axis' in changed || 'axisIsRelevant' in changed) {
				for (var i = 0; i < each_block_value.length; i += 1) {
					if (each_block_iterations[i]) {
						each_block_iterations[i].update(changed, state, each_block_value, each_block_value[i], i);
					} else {
						each_block_iterations[i] = create_each_block(state, each_block_value, each_block_value[i], i, component);
						each_block_iterations[i].create();
						each_block_iterations[i].mount(div_1, null);
					}
				}

				for (; i < each_block_iterations.length; i += 1) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}

			if (div_2_style_value !== (div_2_style_value = "width: " + template$1.helpers.multiplyIndentByWidth(state.indentLevels + 1) + "px")) {
				div_2.style.cssText = div_2_style_value;
			}

			if (!events_updating && 'visibleEvents' in changed) {
				events_updating = true;
				events._set({ visibleEvents: state.visibleEvents
				});
				events_updating = false;
			}

			events._context.state = state;

			var events_changes = {};

			if ('relevantEventsWithAxis' in changed) events_changes.timeline = state.relevantEventsWithAxis;
			if ('currentZoom' in changed) events_changes.dayHeight = state.currentZoom.dayHeight;
			events_changes.clickable = true;

			if (Object.keys(events_changes).length) events.set(events_changes);

			var eventdescriptions_changes = {};

			if ('visibleEvents' in changed) eventdescriptions_changes.timeline = state.visibleEvents;

			if (Object.keys(eventdescriptions_changes).length) eventdescriptions.set(eventdescriptions_changes);
		},

		unmount: function unmount() {
			if (if_block) if_block.unmount();
			detachNode$1(text);
			detachNode$1(div);

			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].unmount();
			}
		},

		destroy: function destroy() {
			if (if_block) if_block.destroy();

			destroyEach(each_block_iterations, false, 0);

			events.destroy(false);
			eventdescriptions.destroy(false);
		}
	};
}

function create_if_block_1$1(state, component) {
	var text, text_1_value, text_1, text_2;

	return {
		create: function create() {
			text = createText("(");
			text_1 = createText(text_1_value = state.hoveredEvent.reference);
			text_2 = createText(")");
		},

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

		unmount: function unmount() {
			detachNode$1(text);
			detachNode$1(text_1);
			detachNode$1(text_2);
		},

		destroy: noop$1
	};
}

function create_if_block$1(state, component) {
	var div, text_value, text, text_1;

	var if_block_1 = state.hoveredEvent.reference && create_if_block_1$1(state, component);

	return {
		create: function create() {
			div = createElement$1('div');
			text = createText(text_value = state.hoveredEvent.title);
			text_1 = createText(" ");
			if (if_block_1) if_block_1.create();
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			setAttribute(div, 'svelte-2992398978', '');
			div.className = "eventhover";
		},

		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
			appendNode(text, div);
			appendNode(text_1, div);
			if (if_block_1) if_block_1.mount(div, null);
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
					if_block_1.create();
					if_block_1.mount(div, null);
				}
			} else if (if_block_1) {
				if_block_1.unmount();
				if_block_1.destroy();
				if_block_1 = null;
			}
		},

		unmount: function unmount() {
			detachNode$1(div);
			if (if_block_1) if_block_1.unmount();
		},

		destroy: function destroy() {
			if (if_block_1) if_block_1.destroy();
		}
	};
}

function create_each_block(state, each_block_value, date, date_index, component) {

	var vcenter_1_yield_fragment = create_vcenter_yield_fragment(state, each_block_value, date, date_index, component);

	var vcenter_1 = new VerticallyCentered({
		_root: component._root,
		_yield: vcenter_1_yield_fragment,
		data: { point: state.multiplyDaysByHeight(state.distanceFromStartDay(date.axisPoint)) }
	});

	return {
		create: function create() {
			vcenter_1_yield_fragment.create();
			vcenter_1._fragment.create();
		},

		mount: function mount(target, anchor) {
			vcenter_1._fragment.mount(target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			vcenter_1_yield_fragment.update(changed, state, each_block_value, date, date_index);

			var vcenter_1_changes = {};

			if ('multiplyDaysByHeight' in changed || 'distanceFromStartDay' in changed || 'axis' in changed) vcenter_1_changes.point = state.multiplyDaysByHeight(state.distanceFromStartDay(date.axisPoint));

			if (Object.keys(vcenter_1_changes).length) vcenter_1.set(vcenter_1_changes);
		},

		unmount: function unmount() {
			vcenter_1._fragment.unmount();
		},

		destroy: function destroy() {
			vcenter_1_yield_fragment.destroy();
			vcenter_1.destroy(false);
		}
	};
}

function create_vcenter_yield_fragment(state, each_block_value, date, date_index, component) {
	var div, div_data_relevant_value;

	function get_block(state, each_block_value, date, date_index) {
		if (date.type === 'snip') return create_if_block_2;
		return create_if_block_3;
	}

	var current_block = get_block(state, each_block_value, date, date_index);
	var if_block_2 = current_block(state, each_block_value, date, date_index, component);

	return {
		create: function create() {
			div = createElement$1('div');
			if_block_2.create();
			this.hydrate();
		},

		hydrate: function hydrate(nodes) {
			div.className = "axis";
			setAttribute(div, 'data-relevant', div_data_relevant_value = state.axisIsRelevant(date.amd));
		},

		mount: function mount(target, anchor) {
			insertNode$1(div, target, anchor);
			if_block_2.mount(div, null);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			if (div_data_relevant_value !== (div_data_relevant_value = state.axisIsRelevant(date.amd))) {
				setAttribute(div, 'data-relevant', div_data_relevant_value);
			}

			if (current_block === (current_block = get_block(state, each_block_value, date, date_index)) && if_block_2) {
				if_block_2.update(changed, state, each_block_value, date, date_index);
			} else {
				if_block_2.unmount();
				if_block_2.destroy();
				if_block_2 = current_block(state, each_block_value, date, date_index, component);
				if_block_2.create();
				if_block_2.mount(div, null);
			}
		},

		unmount: function unmount() {
			detachNode$1(div);
			if_block_2.unmount();
		},

		destroy: function destroy() {
			if_block_2.destroy();
		}
	};
}

function create_if_block_2(state, each_block_value, date, date_index, component) {
	var text, text_1_value, text_1, text_2;

	return {
		create: function create() {
			text = createText("...snip (");
			text_1 = createText(text_1_value = date.days);
			text_2 = createText(" days)");
		},

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

		unmount: function unmount() {
			detachNode$1(text);
			detachNode$1(text_1);
			detachNode$1(text_2);
		},

		destroy: noop$1
	};
}

function create_if_block_3(state, each_block_value, date, date_index, component) {
	var text_value, text;

	return {
		create: function create() {
			text = createText(text_value = date.hebrew || date.amd);
		},

		mount: function mount(target, anchor) {
			insertNode$1(text, target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			if (text_value !== (text_value = date.hebrew || date.amd)) {
				text.data = text_value;
			}
		},

		unmount: function unmount() {
			detachNode$1(text);
		},

		destroy: noop$1
	};
}

function Main(options) {
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

	this._torndown = false;
	if (!document.getElementById("svelte-2992398978-style")) add_css();
	this._renderHooks = [];
	this._bindings = [];

	this._fragment = create_main_fragment$1(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, null);
	}

	while (this._bindings.length) {
		this._bindings.pop()();
	}this._flush();
}

assign$1(Main.prototype, template$1.methods, proto);

Main.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign$1({}, oldState, newState);
	recompute$1(this._state, newState, oldState, false);
	dispatchObservers$1(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers$1(this, this._observers.post, newState, oldState);
	while (this._bindings.length) {
		this._bindings.pop()();
	}this._flush();
};

Main.prototype.teardown = Main.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
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

var attachQuerystringData = index$1.attachQuerystringData;
var getCurrentParameters = index$1.getCurrentParameters;


var component = new Main({
	target: document.querySelector('#timeline'),
	data: {
		timelineData: timelineData, // no need to re-sort, is pre-sorted by transform-timeline-to-json.js
		querystringParameters: getCurrentParameters()
	}
});

attachQuerystringData(component);

}());
