(function () {
'use strict';

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

function assign(target) {
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

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations, detach, start) {
	for (var i = start; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].destroy(detach);
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function addEventListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeEventListener(node, event, handler) {
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

function differs(a, b) {
	return a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
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

function get$$1(key) {
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

function set$$1(newState) {
	this._set(assign({}, newState));
	this._root._flush();
}

function _flush() {
	if (!this._renderHooks) return;

	while (this._renderHooks.length) {
		this._renderHooks.pop()();
	}
}

var proto = {
	get: get$$1,
	fire: fire,
	observe: observe,
	on: on,
	set: set$$1,
	_flush: _flush
};

function recompute$1(state, newState, oldState, isInitial) {
	if (isInitial || 'point' in newState && differs(state.point, oldState.point) || 'height' in newState && differs(state.height, oldState.height)) {
		state.top = newState.top = template$1.computed.top(state.point, state.height);
	}
}

var template$1 = function () {
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
	var style = createElement('style');
	style.id = "svelte-629105964-style";
	style.textContent = "\n\t[svelte-629105964].vcentered, [svelte-629105964] .vcentered {\n\t\tposition: absolute;\n\t}\n";
	appendNode(style, document.head);
}

function create_main_fragment$1(state, component) {
	var div_style_value;

	var div = createElement('div');
	setAttribute(div, 'svelte-629105964', '');
	div.style.cssText = div_style_value = "top: " + state.top + "px; left: " + state.left + "px;";
	div.className = "vcentered";
	component.refs.container = div;
	if (component._yield) component._yield.mount(div, null);

	return {
		mount: function mount(target, anchor) {
			insertNode(div, target, anchor);
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
				detachNode(div);
			}
		}
	};
}

function VerticallyCentered(options) {
	options = options || {};
	this.refs = {};
	this._state = assign(template$1.data(), options.data);
	recompute$1(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if (!document.getElementById("svelte-629105964-style")) add_css$1();

	this._fragment = create_main_fragment$1(this._state, this);
	if (options.target) this._fragment.mount(options.target, null);

	if (options._root) {
		options._root._renderHooks.push(template$1.oncreate.bind(this));
	} else {
		template$1.oncreate.call(this);
	}
}

assign(VerticallyCentered.prototype, proto);

VerticallyCentered.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign({}, oldState, newState);
	recompute$1(this._state, newState, oldState, false);
	dispatchObservers(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers(this, this._observers.post, newState, oldState);
};

VerticallyCentered.prototype.teardown = VerticallyCentered.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	this._fragment.destroy(detach !== false);
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function multiplyIndentByWidth(indentLevel) {
	return indentLevel * 20;
}

function recompute$2(state, newState, oldState, isInitial) {
	if (isInitial || 'dayHeight' in newState && differs(state.dayHeight, oldState.dayHeight)) {
		state.multiplyDaysByHeight = newState.multiplyDaysByHeight = template$2.computed.multiplyDaysByHeight(state.dayHeight);
	}
}

var template$2 = function () {
	return {
		helpers: {
			multiplyIndentByWidth: multiplyIndentByWidth
		},
		computed: {
			multiplyDaysByHeight: function multiplyDaysByHeight(dayHeight) {
				return function (days) {
					return days * dayHeight;
				};
			}
		}
	};
}();

function create_main_fragment$2(state, component) {
	var each_block_value = state.timeline;

	var each_block_iterations = [];

	for (var i = 0; i < each_block_value.length; i += 1) {
		each_block_iterations[i] = create_each_block$1(state, each_block_value, each_block_value[i], i, component);
	}

	var each_block_anchor = createComment();

	return {
		mount: function mount(target, anchor) {
			for (var i = 0; i < each_block_iterations.length; i += 1) {
				each_block_iterations[i].mount(target, null);
			}

			insertNode(each_block_anchor, target, anchor);
		},

		update: function update(changed, state) {
			var each_block_value = state.timeline;

			if ('timeline' in changed || 'multiplyDaysByHeight' in changed) {
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
				detachNode(each_block_anchor);
			}
		}
	};
}

function create_each_block$1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	function get_block(state, each_block_value, timelineEvent, timelineEvent_index) {
		if (timelineEvent.axis.end === timelineEvent.axis.start) return create_if_block$1;
		return create_if_block_1$1;
	}

	var current_block = get_block(state, each_block_value, timelineEvent, timelineEvent_index);
	var if_block = current_block(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var if_block_anchor = createComment();

	return {
		mount: function mount(target, anchor) {
			if_block.mount(target, anchor);
			insertNode(if_block_anchor, target, anchor);
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
				detachNode(if_block_anchor);
			}
		}
	};
}

function create_vcenter_yield_fragment$1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var div_data_title_value, div_data_days_value;

	var div = createElement('div');
	div.className = "event";
	setAttribute(div, 'data-title', div_data_title_value = timelineEvent.title);
	setAttribute(div, 'data-days', div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1);
	div.style.cssText = "height: 4px;";
	addEventListener(div, 'mouseover', mouseover_handler);
	addEventListener(div, 'mouseleave', mouseleave_handler);

	div._svelte = {
		component: component,
		each_block_value: each_block_value,
		timelineEvent_index: timelineEvent_index
	};

	return {
		mount: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
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
			removeEventListener(div, 'mouseover', mouseover_handler);
			removeEventListener(div, 'mouseleave', mouseleave_handler);

			if (detach) {
				detachNode(div);
			}
		}
	};
}

function create_if_block$1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var vcenter_1_yield_fragment = create_vcenter_yield_fragment$1(state, each_block_value, timelineEvent, timelineEvent_index, component);

	var vcenter_1 = new VerticallyCentered({
		target: null,
		_root: component._root,
		_yield: vcenter_1_yield_fragment,
		data: { left: template$2.helpers.multiplyIndentByWidth(timelineEvent.indentLevel), point: state.multiplyDaysByHeight(timelineEvent.axisAfterStart) }
	});

	return {
		mount: function mount(target, anchor) {
			vcenter_1._fragment.mount(target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			vcenter_1_yield_fragment.update(changed, state, each_block_value, timelineEvent, timelineEvent_index);

			var vcenter_1_changes = {};

			if ('timeline' in changed) vcenter_1_changes.left = template$2.helpers.multiplyIndentByWidth(timelineEvent.indentLevel);
			if ('multiplyDaysByHeight' in changed || 'timeline' in changed) vcenter_1_changes.point = state.multiplyDaysByHeight(timelineEvent.axisAfterStart);

			if (Object.keys(vcenter_1_changes).length) vcenter_1.set(vcenter_1_changes);
		},

		destroy: function destroy(detach) {
			vcenter_1.destroy(detach);
		}
	};
}

function create_if_block_1$1(state, each_block_value, timelineEvent, timelineEvent_index, component) {
	var div_style_value, div_data_title_value, div_data_days_value;

	var div = createElement('div');
	div.style.cssText = div_style_value = "\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: " + state.multiplyDaysByHeight(timelineEvent.axisAfterStart) + "px; \n\t\t\t\tleft: " + template$2.helpers.multiplyIndentByWidth(timelineEvent.indentLevel) + "px;\n\t\t\t\theight: " + state.multiplyDaysByHeight(timelineEvent.axis.end - timelineEvent.axis.start + 1) + "px;\n\t\t\t";
	div.className = "event";
	setAttribute(div, 'data-title', div_data_title_value = timelineEvent.title);
	setAttribute(div, 'data-days', div_data_days_value = timelineEvent.axis.end - timelineEvent.axis.start + 1);
	addEventListener(div, 'mouseover', mouseover_handler_1);
	addEventListener(div, 'mouseleave', mouseleave_handler_1);

	div._svelte = {
		component: component,
		each_block_value: each_block_value,
		timelineEvent_index: timelineEvent_index
	};

	return {
		mount: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		update: function update(changed, state, each_block_value, timelineEvent, timelineEvent_index) {
			if (div_style_value !== (div_style_value = "\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: " + state.multiplyDaysByHeight(timelineEvent.axisAfterStart) + "px; \n\t\t\t\tleft: " + template$2.helpers.multiplyIndentByWidth(timelineEvent.indentLevel) + "px;\n\t\t\t\theight: " + state.multiplyDaysByHeight(timelineEvent.axis.end - timelineEvent.axis.start + 1) + "px;\n\t\t\t")) {
				div.style.cssText = div_style_value;
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
			removeEventListener(div, 'mouseover', mouseover_handler_1);
			removeEventListener(div, 'mouseleave', mouseleave_handler_1);

			if (detach) {
				detachNode(div);
			}
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
	this._state = options.data || {};
	recompute$2(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	this._renderHooks = [];

	this._fragment = create_main_fragment$2(this._state, this);
	if (options.target) this._fragment.mount(options.target, null);
	this._flush();
}

assign(Events.prototype, proto);

Events.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign({}, oldState, newState);
	recompute$2(this._state, newState, oldState, false);
	dispatchObservers(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers(this, this._observers.post, newState, oldState);
	this._flush();
};

Events.prototype.teardown = Events.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	this._fragment.destroy(detach !== false);
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

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

var index = withinRange;

withinRange.LESS_THAN_START = LESS_THAN;
withinRange.WITHIN = WITHIN;
withinRange.GREATER_THAN_END = GREATER_THAN;

withinRange.relative = relative;

var rangeSort = index.relative;


var sortRange = function sortRange(ary, getRangeValues) {
	return ary.slice().sort(function (a, b) {
		var bValue = getRangeValues(b);
		return rangeSort(bValue, bValue, getRangeValues(a));
	});
};

var filterAndSort = function filterAndSort(timelineData) {
	var minimumLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	return sortRange(timelineData.filter(function (event) {
		return event.amd.end > 1471937 && event.amd.start < 1488003 && event.amd.end - event.amd.start + 1 >= minimumLength;
	}), function (event) {
		return [event.amd.start, event.amd.end];
	});
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

var createTimelineAxis_1 = createTimelineAxis;
function createTimelineAxis(timelineData, snipSectionsLongerThan, snipBuffer) {
	var naiveAxisMarkers = flatMap(function (event) {
		return event.amd.start === event.amd.end ? [getDates('start', event)] : [getDates('start', event), getDates('end', event)];
	}, timelineData).sort(function (a, b) {
		return a.amd - b.amd;
	});

	return pipe(naiveAxisMarkers, filterOutDuplicates, function (_) {
		return addSnipEvents(_, snipSectionsLongerThan, snipBuffer);
	}, calculateAxisPoints);
}

function filterOutDuplicates(dates) {
	var last = null;
	return dates.filter(function (date) {
		var keep = last !== date.amd;
		last = date.amd;
		return keep;
	});
}

function addSnipEvents(dates, snipSectionsLongerThan, snipBuffer) {
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

function recompute(state, newState, oldState, isInitial) {
	if (isInitial || 'dayHeight' in newState && differs(state.dayHeight, oldState.dayHeight)) {
		state.multiplyDaysByHeight = newState.multiplyDaysByHeight = template.computed.multiplyDaysByHeight(state.dayHeight);
	}

	if (isInitial || 'timelineData' in newState && differs(state.timelineData, oldState.timelineData) || 'minimumLength' in newState && differs(state.minimumLength, oldState.minimumLength)) {
		state.relevantEvents = newState.relevantEvents = template.computed.relevantEvents(state.timelineData, state.minimumLength);
	}

	if (isInitial || 'relevantEvents' in newState && differs(state.relevantEvents, oldState.relevantEvents)) {
		state.startDay = newState.startDay = template.computed.startDay(state.relevantEvents);
	}

	if (isInitial || 'relevantEvents' in newState && differs(state.relevantEvents, oldState.relevantEvents) || 'snipSectionsLongerThan' in newState && differs(state.snipSectionsLongerThan, oldState.snipSectionsLongerThan) || 'snipBuffer' in newState && differs(state.snipBuffer, oldState.snipBuffer)) {
		state.axis = newState.axis = template.computed.axis(state.relevantEvents, state.snipSectionsLongerThan, state.snipBuffer);
	}

	if (isInitial || 'axis' in newState && differs(state.axis, oldState.axis) || 'relevantEvents' in newState && differs(state.relevantEvents, oldState.relevantEvents)) {
		state.relevantEventsWithAxis = newState.relevantEventsWithAxis = template.computed.relevantEventsWithAxis(state.axis, state.relevantEvents);
	}

	if (isInitial || 'relevantEventsWithAxis' in newState && differs(state.relevantEventsWithAxis, oldState.relevantEventsWithAxis) || 'startDay' in newState && differs(state.startDay, oldState.startDay)) {
		state.times = newState.times = template.computed.times(state.relevantEventsWithAxis, state.startDay);
		state.otherEvents = newState.otherEvents = template.computed.otherEvents(state.relevantEventsWithAxis, state.startDay);
	}

	if (isInitial || 'startDay' in newState && differs(state.startDay, oldState.startDay)) {
		state.distanceFromStartDay = newState.distanceFromStartDay = template.computed.distanceFromStartDay(state.startDay);
	}

	if (isInitial || 'hoveredEvent' in newState && differs(state.hoveredEvent, oldState.hoveredEvent)) {
		state.axisIsRelevant = newState.axisIsRelevant = template.computed.axisIsRelevant(state.hoveredEvent);
	}
}

var template = function () {
	function mapKnowingPrevious(ary, fn) {
		var last = null;
		return ary.map(function (current) {
			var transformed = fn(current, last);
			last = transformed;
			return transformed;
		});
	}

	function addIndentAndAxisAfterStart(events, startDay) {
		return mapKnowingPrevious(events, function (event, previous) {
			var calculatedIndentLevel = function calculatedIndentLevel() {
				return previous.amd.end >= event.amd.start ? previous.indentLevel + 1 : previous.indentLevel;
			};

			var indentLevel = previous ? calculatedIndentLevel() : 0;

			return Object.assign({
				indentLevel: indentLevel,
				axisAfterStart: event.axis.start - startDay
			}, event);
		});
	}

	var zoomedIn = {
		snipSectionsLongerThan: 300,
		snipBuffer: 10,
		dayHeight: 10,
		minimumLength: 1,
		zoomedIn: true
	};
	var zoomedOut = {
		snipSectionsLongerThan: 10000,
		snipBuffer: 50,
		dayHeight: 0.05,
		minimumLength: 100,
		zoomedIn: false
	};

	return {
		data: function data() {
			return zoomedOut;
		},

		computed: {
			multiplyDaysByHeight: function multiplyDaysByHeight(dayHeight) {
				return function (days) {
					return days * dayHeight;
				};
			},
			startDay: function startDay(relevantEvents) {
				return relevantEvents[0].amd.start;
			},
			relevantEvents: function relevantEvents(timelineData, minimumLength) {
				return filterAndSort(timelineData, minimumLength);
			},
			axis: function axis(relevantEvents, snipSectionsLongerThan, snipBuffer) {
				return createTimelineAxis_1(relevantEvents, snipSectionsLongerThan, snipBuffer);
			},
			relevantEventsWithAxis: function relevantEventsWithAxis(axis, relevantEvents) {
				return addAxisPointsToTimelineData(axis, relevantEvents);
			},
			times: function times(relevantEventsWithAxis, startDay) {
				return addIndentAndAxisAfterStart(relevantEventsWithAxis.filter(function (_ref) {
					var type = _ref.type;
					return type === 'time';
				}), startDay);
			},
			otherEvents: function otherEvents(relevantEventsWithAxis, startDay) {
				return addIndentAndAxisAfterStart(relevantEventsWithAxis.filter(function (_ref2) {
					var type = _ref2.type;
					return !type;
				}), startDay);
			},
			distanceFromStartDay: function distanceFromStartDay(startDay) {
				return function (day) {
					return day - startDay;
				};
			},
			axisIsRelevant: function axisIsRelevant(hoveredEvent) {
				return function (amdDay) {
					return !!hoveredEvent && (hoveredEvent.amd.start === amdDay || hoveredEvent.amd.end === amdDay);
				};
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
			},
			toggleZoom: function toggleZoom() {
				if (this.get('zoomedIn')) {
					this.set(zoomedOut);
				} else {
					this.set(zoomedIn);
				}
			}
		}
	};
}();

function add_css() {
	var style = createElement('style');
	style.id = "svelte-885792027-style";
	style.textContent = "\n[svelte-885792027].timeline-container, [svelte-885792027] .timeline-container {\n\tdisplay: flex;\n\tflex-wrap: nowrap;\n\talign-items: flex-start;\n}\n[svelte-885792027].timeline-row, [svelte-885792027] .timeline-row {\n\tposition: relative;\n}\n[svelte-885792027].axis, [svelte-885792027] .axis {\n\tfont-size: 10px;\n\twidth: 100px;\n\ttext-align: right;\n}\n[svelte-885792027].axis[data-relevant=true], [svelte-885792027] .axis[data-relevant=true] {\n\tcolor: red;\n}\n[svelte-885792027].event, [svelte-885792027] .event {\n\twidth: 16px;\n\t-webkit-border-radius: 10px;\n\t-moz-border-radius: 10px;\n\tborder-radius: 10px;\n\n\tbackground-color: green;\n}\n[svelte-885792027].event:hover, [svelte-885792027] .event:hover {\n\tbackground-color: red;\n}\n\n[svelte-885792027].eventhover, [svelte-885792027] .eventhover {\n\tz-index: 1;\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tpadding: 10px;\n\tbackground-color: white;\n\tbackground-color: rgba(255, 255, 255, 0.8);\n}\n[svelte-885792027]#zoombutton, [svelte-885792027] #zoombutton {\n\tz-index: 1;\n\tposition: fixed;\n\ttop: 0;\t\n\tright: 0;\n}\n";
	appendNode(style, document.head);
}

function create_main_fragment(state, component) {
	var if_block = state.hoveredEvent && create_if_block(state, component);

	var text = createText("\n");
	var button = createElement('button');
	setAttribute(button, 'svelte-885792027', '');
	button.className = "btn-default";
	button.id = "zoombutton";

	function click_handler(event) {
		component.toggleZoom();
	}

	addEventListener(button, 'click', click_handler);
	appendNode(createText("Zoom "), button);

	function get_block(state) {
		if (state.zoomedIn) return create_if_block_2;
		return create_if_block_3;
	}

	var current_block = get_block(state);
	var if_block_2 = current_block(state, component);

	if_block_2.mount(button, null);
	var text_2 = createText("\n");
	var div = createElement('div');
	setAttribute(div, 'svelte-885792027', '');
	div.className = "timeline-container";
	var div_1 = createElement('div');
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
	var div_2 = createElement('div');
	appendNode(div_2, div);
	div_2.className = "timeline-row";
	div_2.style.cssText = "width: 50px";

	var events = new Events({
		target: div_2,
		_root: component._root,
		data: {
			timeline: state.times,
			dayHeight: state.dayHeight
		}
	});

	events.on('startHover', function (event) {
		component.startHover(event);
	});

	events.on('endHover', function (event) {
		component.endHover(event);
	});

	appendNode(createText("\n\t"), div);
	var div_3 = createElement('div');
	appendNode(div_3, div);
	div_3.className = "timeline-row";
	div_3.style.cssText = "width: 200px";

	var events_1 = new Events({
		target: div_3,
		_root: component._root,
		data: {
			timeline: state.otherEvents,
			dayHeight: state.dayHeight
		}
	});

	events_1.on('startHover', function (event) {
		component.startHover(event);
	});

	events_1.on('endHover', function (event) {
		component.endHover(event);
	});

	return {
		mount: function mount(target, anchor) {
			if (if_block) if_block.mount(target, anchor);
			insertNode(text, target, anchor);
			insertNode(button, target, anchor);
			insertNode(text_2, target, anchor);
			insertNode(div, target, anchor);
		},

		update: function update(changed, state) {
			if (state.hoveredEvent) {
				if (if_block) {
					if_block.update(changed, state);
				} else {
					if_block = create_if_block(state, component);
					if_block.mount(text.parentNode, text);
				}
			} else if (if_block) {
				if_block.destroy(true);
				if_block = null;
			}

			if (current_block !== (current_block = get_block(state))) {
				if_block_2.destroy(true);
				if_block_2 = current_block(state, component);
				if_block_2.mount(button, null);
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

			if ('times' in changed) events_changes.timeline = state.times;
			if ('dayHeight' in changed) events_changes.dayHeight = state.dayHeight;

			if (Object.keys(events_changes).length) events.set(events_changes);

			var events_1_changes = {};

			if ('otherEvents' in changed) events_1_changes.timeline = state.otherEvents;
			if ('dayHeight' in changed) events_1_changes.dayHeight = state.dayHeight;

			if (Object.keys(events_1_changes).length) events_1.set(events_1_changes);
		},

		destroy: function destroy(detach) {
			if (if_block) if_block.destroy(detach);
			removeEventListener(button, 'click', click_handler);
			if_block_2.destroy(false);

			destroyEach(each_block_iterations, false, 0);

			events.destroy(false);
			events_1.destroy(false);

			if (detach) {
				detachNode(text);
				detachNode(button);
				detachNode(text_2);
				detachNode(div);
			}
		}
	};
}

function create_if_block_1(state, component) {
	var text_1_value;

	var text = createText("(");
	var text_1 = createText(text_1_value = state.hoveredEvent.reference);
	var text_2 = createText(")");

	return {
		mount: function mount(target, anchor) {
			insertNode(text, target, anchor);
			insertNode(text_1, target, anchor);
			insertNode(text_2, target, anchor);
		},

		update: function update(changed, state) {
			if (text_1_value !== (text_1_value = state.hoveredEvent.reference)) {
				text_1.data = text_1_value;
			}
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(text);
				detachNode(text_1);
				detachNode(text_2);
			}
		}
	};
}

function create_if_block(state, component) {
	var text_value;

	var div = createElement('div');
	setAttribute(div, 'svelte-885792027', '');
	div.className = "eventhover";
	var text = createText(text_value = state.hoveredEvent.title);
	appendNode(text, div);
	appendNode(createText(" "), div);

	var if_block_1 = state.hoveredEvent.reference && create_if_block_1(state, component);

	if (if_block_1) if_block_1.mount(div, null);

	return {
		mount: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		update: function update(changed, state) {
			if (text_value !== (text_value = state.hoveredEvent.title)) {
				text.data = text_value;
			}

			if (state.hoveredEvent.reference) {
				if (if_block_1) {
					if_block_1.update(changed, state);
				} else {
					if_block_1 = create_if_block_1(state, component);
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
				detachNode(div);
			}
		}
	};
}

function create_if_block_2(state, component) {
	var text = createText("out");

	return {
		mount: function mount(target, anchor) {
			insertNode(text, target, anchor);
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(text);
			}
		}
	};
}

function create_if_block_3(state, component) {
	var text = createText("in");

	return {
		mount: function mount(target, anchor) {
			insertNode(text, target, anchor);
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(text);
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

	var div = createElement('div');
	div.className = "axis";
	setAttribute(div, 'data-relevant', div_data_relevant_value = state.axisIsRelevant(date.amd));

	function get_block(state, each_block_value, date, date_index) {
		if (date.type === 'snip') return create_if_block_4;
		return create_if_block_5;
	}

	var current_block = get_block(state, each_block_value, date, date_index);
	var if_block_3 = current_block(state, each_block_value, date, date_index, component);

	if_block_3.mount(div, null);

	return {
		mount: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			if (div_data_relevant_value !== (div_data_relevant_value = state.axisIsRelevant(date.amd))) {
				setAttribute(div, 'data-relevant', div_data_relevant_value);
			}

			if (current_block === (current_block = get_block(state, each_block_value, date, date_index)) && if_block_3) {
				if_block_3.update(changed, state, each_block_value, date, date_index);
			} else {
				if_block_3.destroy(true);
				if_block_3 = current_block(state, each_block_value, date, date_index, component);
				if_block_3.mount(div, null);
			}
		},

		destroy: function destroy(detach) {
			if_block_3.destroy(false);

			if (detach) {
				detachNode(div);
			}
		}
	};
}

function create_if_block_4(state, each_block_value, date, date_index, component) {
	var text_1_value;

	var text = createText("...snip (");
	var text_1 = createText(text_1_value = date.days);
	var text_2 = createText(" days)");

	return {
		mount: function mount(target, anchor) {
			insertNode(text, target, anchor);
			insertNode(text_1, target, anchor);
			insertNode(text_2, target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			if (text_1_value !== (text_1_value = date.days)) {
				text_1.data = text_1_value;
			}
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(text);
				detachNode(text_1);
				detachNode(text_2);
			}
		}
	};
}

function create_if_block_5(state, each_block_value, date, date_index, component) {
	var text_value;

	var text = createText(text_value = date.hebrew || date.amd);

	return {
		mount: function mount(target, anchor) {
			insertNode(text, target, anchor);
		},

		update: function update(changed, state, each_block_value, date, date_index) {
			if (text_value !== (text_value = date.hebrew || date.amd)) {
				text.data = text_value;
			}
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(text);
			}
		}
	};
}

function Main(options) {
	options = options || {};
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
	if (!document.getElementById("svelte-885792027-style")) add_css();
	this._renderHooks = [];

	this._fragment = create_main_fragment(this._state, this);
	if (options.target) this._fragment.mount(options.target, null);
	this._flush();
}

assign(Main.prototype, template.methods, proto);

Main.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign({}, oldState, newState);
	recompute(this._state, newState, oldState, false);
	dispatchObservers(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers(this, this._observers.post, newState, oldState);
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
	}
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
	}
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
	}
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
	"reference": "Revelation 6:1-2"
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
	"reference": "Revelation 4-5"
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
	"reference": "Revelation 6:3-4"
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
	"reference": "Revelation 6:5-6"
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
	"reference": "Revelation 6:7-8"
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
	"reference": "Revelation 6:9-11"
}, {
	"title": "Great Tribulation (Rome & Israel killing Christians)",
	"amd": {
		"start": 1483532,
		"end": 1485883
	}
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
	"reference": "Revelation 6:1-2; Rev 12:7-12"
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
	"reference": "Revelation 8:1-6; Rev 16:1"
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
	}
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
	}
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
	"type": "time"
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
	"reference": "Revelation 8:7"
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
	"reference": "Revelation 8:8-9"
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
	"reference": "Revelation 8:10-11"
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
	"reference": "Revelation 8:12-13"
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
	"reference": "Revelation 9:1"
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
	"reference": "Revelation 9:5, Rev 9:10"
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
	"type": "time"
}, {
	"title": "Great Wrath (Rome against Israel)",
	"amd": {
		"start": 1485295,
		"end": 1487959
	}
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
	}
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
	"reference": "Revelation 11:1, Rev 11:3-14"
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
	"reference": "REvelation 13:3"
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
	"reference": "Revelation 17:8-10"
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
	"reference": "Revelation 13:3"
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
	}
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
	"type": "time"
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
	}
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
	}
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
	}
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
	}
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
	}
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
	}
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
	}
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
	}
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
	}
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
	"reference": "Revelation 11:7-11"
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
	}
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
	"reference": "Revelation 11:7-11"
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
	"reference": "Rev. 11:11-19"
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
	}
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
	"type": "time"
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
	"reference": "Revelation 11:2; Rev 18:1-24"
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
	"type": "time"
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
	}
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
	}
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
	}
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
	}
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
	"reference": "Daniel 12:12"
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
	"type": "time"
}];

new Main({
	target: document.querySelector('#timeline'),
	data: {
		timelineData: timelineData
	}
});

}());
//# sourceMappingURL=bundle.js.map
