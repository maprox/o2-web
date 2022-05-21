/*
 * IE < 8.0 "console" patch
 */
// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

if (!Function.prototype.bind) {

	/**
	 * Opera fix for instanceof function
	 * @param {Object} V
	 * @param {Object} F
	 * @return {Boolean}
	 *//*
	function instance_of(V, F) {
		var O = F.prototype;
		V = V.__proto__;
		while (true) {
			if (V === null)
				return false;
			if (O === V)
				return true;
			V = V.__proto__;
		}
	}

	Function.prototype.bind = (function () {}).bind || function (b) {
		if (typeof this !== "function") {
			throw new TypeError("Function.prototype.bind - what is " +
				" trying to be bound is not callable");
		}

		function c() {}
		var a = [].slice,
			f = a.call(arguments, 1),
			e = this,
			d = function () {
				return e.apply(instance_of(this, c) ? this : b || window,
					f.concat(a.call(arguments)));
			};
		c.prototype = this.prototype;
		d.prototype = new c();
		return d;
	}*/
/*
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError("Function.prototype.bind - " +
				"what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP && oThis
						? this
						: oThis,
					  aArgs.concat(Array.prototype.slice.call(arguments)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
*/
}