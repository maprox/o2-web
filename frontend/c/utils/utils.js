/**
 * @class C.utils
 * @singleton
 */
Ext.define('C.utils', {
	singleton: true,

/**
	* Функции на предварительную обработку конфига
	*/
	preprocessorFunctions: [],

/**
	* Текст уведомления о закрытии сессии через 5 минут
 	* TODO ЭТО ТОЧНО ДОЛЖНО БЫТЬ ЗДЕСЬ?
 	*/
	lngTimeleft: 'Your session will be closed after',

/**
	* Было ли уже уведомление о закрытии сессии через 5 минут
 	* TODO ЭТО ТОЧНО ДОЛЖНО БЫТЬ ЗДЕСЬ?
	*/
	timelefted: false,

/**
	* Defining class.
	* If class is not defined yet it calls Ext.define method, otherwise
	* throws error.
	* @param {String} className name of class to define
	* @param {Object} config Config object
	* @param {Function} fn callback function
	*/
	define: function(className, config, fn) {
		for (var i = 0; i < this.preprocessorFunctions.length; i++) {
			var prefn = this.preprocessorFunctions[i];
			config = prefn.call(this, className, config, fn);
		}

		try {
			Ext.define(className, config, fn);
		} catch (e) {
			console.error('Error: "' + className + '" define! ' + e);
		}
	},

/**
	* Shortcut for
	* if (Ext.ClassManager.isCreated(className)) {
	*   Ext.override(Ext.ClassManager.get(className), config);
	* }
	* @param {String} className name of class to override
	* @param {Object} config Config object
	* @param {Object} supressWarning
	*/
	inherit: function(className, config, supressWarning) {
		if (Ext.ClassManager.isCreated(className)) {
			try {
				var cls = Ext.ClassManager.get(className);
				if (cls.prototype) {
					Ext.override(cls, config);
				} else {
					Ext.apply(cls, config);
				}
			} catch (e) {
				console.error('Error: "' + className + '" override! ' + e);
			}
		} else {
			if (!supressWarning) {
				console.warn('Warning: class "' + className + '" not found!');
			}
		}
	},

/**
	* Adds preprocessor.
	* @param {Function} fn preprocessor
	*/
	addPreprocessor: function(fn) {
		this.preprocessorFunctions.push(fn);
	},

	/**
	 * Always returns false.
	 */
	falseFn: function() {
		return false;
	},

/**
	* Loading of a JavaScript file from specified address
	* and calling a specified callback function after loading
	* @param {String} url Url of the script
	* @param {Function} callback Function wich will be called after loading
	*/
	loadScript: function(url, callback) {
		if (!this.loadedScripts) {
			this.loadedScripts = [];
		}
		// check if this script is already loaded
		// TODO There can be a situation, when loadScript is called twice
		// from different places in code, but requested script is not
		// yet loaded, so we must add second request to queue
		if (Ext.Array.indexOf(this.loadedScripts, url) >= 0) {
			if (callback) {
				callback();
			}
			return;
		} else {
			this.loadedScripts.push(url);
		}

		var s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.setAttribute('src', url);
		s.onload = function() { // not IE
			if (!s.onloadDone) {
				s.onloadDone = true;
				if (callback) {
					callback(true);
				}
			}
		};
		s.onerror = function() {
			if (callback) {
				callback(false);
			}
		};
		s.onreadystatechange = function() { // IE specific
			if (("complete" === s.readyState
				|| "loaded" === s.readyState)
				&& !s.onloadDone) {
				s.onloadDone = true;
				if (callback) {
					callback("complete" === s.readyState);
				}
			}
		};
		document.getElementsByTagName('head')[0].appendChild(s);
	},

/**
	* Loading of multiple scripts
	* @param {String[]} url The list of urls to be loaded
	* @param {Function} callback
	* @param {Boolean} parallel
	*/
	loadScripts: function(urls, callback, parallel) {
		if (!urls || !Ext.isArray(urls) || Ext.isEmpty(urls)) { return; }
		var me = this;
		if (parallel === false) {
			var closure = function(index) {
				if (index < urls.length) {
					me.loadScript(urls[index], function(success) {
						closure(++index);
					});
				} else {
					if (callback) {
						callback();
					}
				}
			};
			closure(0);
		} else {
			var loadedCount = 0;
			for (var i = 0; i < urls.length; i++) {
				this.loadScript(urls[i], function(success) {
					loadedCount++;
					if (loadedCount >= urls.length) {
						if (callback) {
							callback();
						}
					}
				});
			}
		}
	},

/**
	* Coordinates formatting
	* @param {Object} o Object with values of lat and lng
	* @param {Number} precision The number of decimal places
	*   to which to round the coordinate's values. Defaults to 4.
	* @return String
	*/
	fmtCoord: function(o, precision) {
		var p = precision || 5;
		return "(" +
			Ext.util.Format.round(o.latitude, p) + ", " +
			Ext.util.Format.round(o.longitude, p) +
		")";
	},

/**
	* Speed formatting
	* @param {Number} value Speed value
	* @return String
	*/
	fmtSpeedArray: ['{0} km/h', '{0} m/s', '{0} mph'],
	fmtSpeed: function(value) {
		return Ext.String.format(C.utils.fmtSpeedArray[0],
			Ext.util.Format.round(value, 0));
	},

/**
	* Distance formatting
	* @param {Number} value Distance in meters
	* @param {Number} fmtType Type of output format:
	*  - 0 = km
	*  - 1 = meters
	*  - 2 = miles
	* @return String
	*/
	fmtOdometerArray: ['{0} km', '{0} m', '{0} miles'],
	fmtOdometer: function(value, fmtType) {
		var type = fmtType || 0;
		var afmt = this.fmtOdometerArray;
		if (type > afmt.length - 1) {
			type = afmt.length - 1;
		}
		var fmt = afmt[type];
		var val = 0;
		switch (type) {
			case 0: val = value / 1000; break;
			case 1: val = value; break;
			case 2: val = value / 1609.344; break;
		}
		return Ext.String.format(fmt, Ext.util.Format.round(val, 1));
	},

/**
	* Volume formatting
	* @param {Number} value Volume in liters
	* @param {Number} fmtType Type of output format:
	*  - 0 = liters
	* @return String
	*/
	fmtVolumeArray: ['{0} L'],
	fmtVolume: function(value, fmtType) {
		var type = fmtType || 0;
		var afmt = this.fmtVolumeArray;
		if (type > afmt.length - 1) {
			type = afmt.length - 1;
		}
		var fmt = afmt[type];
		var val = 0;
		switch (type) {
			case 0: val = value; break;
		}
		return Ext.String.format(fmt, Ext.util.Format.round(val, 1));
	},

/**
	* Date formatting
	* @param {Date} dt Date
	* @return String
	*/
	fmtDate: function(dt, fmt) {
		if (typeof(fmt) === "undefined") {
			fmt = C.cfg.dbFormatDate;
		}
		return (dt) ? Ext.Date.format(dt, fmt) : '';
	},

/**
	* Format date to DB format, substract utc
	* @param {Date} dt Date
	* @return String
	*/
	fmtUtcDate: function(dt, fmt) {
		if (!dt) { return ''; }

		if (dt.pg_utc) {
			dt = dt.pg_utc(C.getSetting('p.utc_value'), true);
		}

		if (typeof(fmt) === "undefined") {
			fmt = C.cfg.dbFormatDate;
		}
		return Ext.Date.format(dt, fmt);
	},

/**
	* Format interval string to specified format
	* @param {String} time
	* @param {String} displayFormat [opt.] defaults to "H:i:s"
	* @return {String}
	*/
	fmtInterval: function(time, displayFormat) {
		if (!time) { return null; }
		var parts = time.split(':');
		time = displayFormat || 'H:i:s';
		var H = '00';
		var i = '00';
		var s = '00';
		if (parts.length == 3) {
			// H:i:s
			H = parts[0]; if (H.length < 2) { H = '0' + H; }
			i = parts[1]; if (i.length < 2) { i = '0' + i; }
			s = parts[2]; if (s.length < 2) { s = '0' + s; }
		} else if (parts.length == 2) {
			// H:i
			H = parts[0]; if (H.length < 2) { H = '0' + H; }
			i = parts[1]; if (i.length < 2) { i = '0' + i; }
			//s = parts[2]; if (s.length < 2) { s = '0' + s; }
		} else if (parts.length == 1) {
			// s
			//H = parts[0]; if (H.length < 2) { H = '0' + H; }
			//i = parts[0]; if (i.length < 2) { i = '0' + i; }
			s = parts[0]; if (s.length < 2) { s = '0' + s; }
		}
		time = time.replace('H', H);
		time = time.replace('i', i);
		time = time.replace('s', s);
		return time;
	},

/**
	* Parse unit like On/Off
	* @param {String} unit
	* @return {Array/Boolean} returns false if parse failed
	*/
	parseUnit: function(unit) {
		if (!unit) {
			return false;
		}

		unit = unit.trim();

		if (!unit.length) {
			return false;
		}

		unit = unit.trim();
		var i = unit.indexOf(C.cfg.unitDelimiter);
		if (i !== -1) {
			var splits = [
				unit.slice(0, i).trim(),
				unit.slice(i+1).trim()
			];
		}

		// If unit splitted
		if (splits && splits[0] && splits[1] && splits[0].length
			&& splits[1].length)
		{
			return splits;
		}

		return false;
	},

/**
	* Calculates lighter or darker hex color
	* @param {String} hex a hex color value such as "#abc" or "#123456"
	* (the hash is optional)
	* @param {Double} lum the luminosity factor, i.e. -0.1 is 10% darker,
	* 0.2 is 20% lighter, etc.
	*/
	colorLuminance: function(hex, lum) {
		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;
		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}
		return rgb;
	},

/**
	 * Converts any string to color
	 * @param {String} str
	 */
	stringToColor: function(str) {
		var i, hash, colour;
		// str to hash
		for (i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

		// int/hash to hex
		for (i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

		return colour;
	},

/**
	* Cloning of an object.
	* For deep coping @see C.utils.copy
	* http://oranlooney.com/functional-javascript/
	* @param {Object} obj Cloning object
	* @return {Object}
	*/
	clone: function(obj) {
		function Clone() {}
		Clone.prototype = obj;
		return new Clone();
	},

/**
	* Deep copy
	* http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
	* @param {Object} obj Copying object
	* @return {Object}
	*/
	copy: function(obj) {
		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			var copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			var copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = C.utils.copy(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			var copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = C.utils.copy(obj[attr]);
				}
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	},

/**
	* Returns count of object properties
	* @param {Object} obj JSON object
	* @return {Number}
	*/
	count: function(obj) {
		var length = 0;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				length++;
			}
		}
		return length;
	},

/**
	* Reads Falcon_Answer JSON from back-end
	* @param {String} content JSON text from server
	* @return {Object|null} packet JSON object of answer
	*/
	getJSON: function(content, opts) {
		var packet = {};
		try
		{
			packet = Ext.decode(content);
			if (!packet.success && (!opts || (opts && !opts.silent))) {
				O.msg.error(packet);
			}
			// notification of logoff in 5 minutes, if needed
			if (packet.timeleft && !this.timelefted) {
				this.timeleftMsg(packet.timeleft);
			}
		}
		catch (e)
		{
			if (!opts) {
				packet = {
					success: false,
					errors: [{code: 3, params: [content]}]
				};
			} else {
				packet = {
					success: false,
					errors: [{
						code: 4,
						params: [
							opts.url,
							JSON.stringify(opts.params),
							content
						]
					}]
				};
			}
			O.msg.error(packet);
		}
		return packet;
	},

/**
	* Changing of current theme
	* @param {String} themeId Theme string identifier
	*/
	setTheme: function(themeId) {
		console.error('C.utils.setTheme() doesn\'t work properly!');
		/*
		var css = Ext.String.format(C.cfg.themes.path, themeId || 'default');
		Ext.util.CSS.swapStyleSheet(C.cfg.themes.stateId, css);
		if (Ext.state.Manager.getProvider()) {
			Ext.state.Manager.set(C.cfg.themes.stateId, themeId);
		}
		*/
	},

/**
	* Reload application
	*/
	reload: function() {
		window.location.reload();
	},

/**
	* Aliases for virtual groups identifiers
	* @type Object
	*/
	virtualGroups: {
		ALL: -1,
		NOTGROUPED: -2,
		SELECTED: -3,
		SEARCHRESULTS: -4,
		MOVING: -5,
		STILL: -6,
		LOST: -7,
		CONNECTED: -8,
		ZONE_GEOFENCE: -18,
		ZONE_POINT: -19,
		ZONE_WAREHOUSE: -20,
		NOTEMPTYZONE: -21,
		EMPTYZONE: -22,
		WITH_ERRORS: -31,
		WITHOUT_ERRORS: -32
	},

/**
	* Uppercase first char
	* @param {String} str Source string
	* @return {String} Formatted string
	*/
	ucfirst: function(str) {
		return str.charAt(0).toUpperCase() + str.substr(1, str.length - 1);
	},

/**
	* Returns visible part of page size object
	* @return {Object} size = {w: width, h: height};
	*/
	getPageSize: function() {
		var size = {w: 0, h: 0};
		if (typeof(window.innerWidth) == 'number') {
			//Non-IE
			size.w = window.innerWidth;
			size.h = window.innerHeight;
		} else if (document.documentElement &&
			(document.documentElement.clientWidth ||
			 document.documentElement.clientHeight)) {
			//IE 6+ in 'standards compliant mode'
			size.w = document.documentElement.clientWidth;
			size.h = document.documentElement.clientHeight;
		} else if (document.body &&
			(document.body.clientWidth ||
			 document.body.clientHeight)) {
			//IE 4 compatible
			size.w = document.body.clientWidth;
			size.h = document.body.clientHeight;
		}
		return size;
	},

/**
	* Generates random string, similar to guid
	* @return {String}
	*/
	generateUid: function() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	},

/**
	 * Generates random [a-zA-Z0-9] string of specified length
	 * @return {String}
	 */
	randomString: function(len) {
		len = len || 8;
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			+ "abcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < len; i++) {
			text += possible.charAt(
				Math.floor(Math.random() * possible.length)
			);
		}

		return text;
	},

/**
	* Waits until while fn() returns true, then calls callback
	* <pre>
	* var x = 0;
	* C.utils.wait(function() {
	*	x++;
	*	return (x > 2);
	* }, {
	*	sleepTime: 200,
	*	attempts: 20,
	*	callback: function(success) {
	*		alert(success);
	*	}
	* });
	* </pre>
	* @param {Function} fn
	* @param {Object} options
	*/
	wait: function(fn, options) {
		if (!options) {
			options = {};
		}
		if (!options.callback) {
			options.callback = Ext.emptyFn;
		}
		var sleepTime = options.sleepTime || 500;
		var numberOfTry = 0;
		var maxCountOfAttempts = options.attempts || 10;
		var waitFn = function() {
			numberOfTry++;
			if (numberOfTry > maxCountOfAttempts) {
				options.callback(false)
				return;
			}
			if (fn && fn()) {
				options.callback(true);
			} else {
				Ext.defer(waitFn, sleepTime);
			}
		};
		waitFn();
	},

/**
	* Checks if object is empty
	* @param {Object} obj
	*/
	isEmptyObject: function(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	},

/**
	* Tests if variable is defined by its string representation
	* @param {String} value
	* @return Boolean
	*/
	isset: function(variableName) {
		var parts = variableName.split('.');
		var obj = null;
		for (var i = 0; i < parts.length; i++) {
			var p = parts[i];
			if (obj === null) {
				if (window[p] === undefined) {
					return false;
				}
			} else if (obj[p] === undefined) {
				return false;
			}
			obj = (obj === null) ? window[p] : obj[p];
		}
		return true;
	},

/**
	* Iterates throw each item of an object
	* @param {Object} o Object
	* @param {Function} fn Callback function
	* @param {Object} scope Callback function scope [optional]
	*/
	each: function(o, callback, scope) {
		for (var key in o) {
			if (!o.hasOwnProperty(key)) { continue; }
			callback.call(scope || this, o[key], key, o);
		}
	},

/**
	* Returns true if objects are equal
	* @param {Object} o1
	* @param {Object} o2
	* @return {Boolean}
	*/
	equals: function(o1, o2) {
		// types MUST be equal
		if (typeof(o1) != typeof(o2)) { return false; }
		// typeof Null is 'object', check for Null explicitly
		if ((o1 === null) != (o2 === null)) { return false; }
		// simple check
		if (o1 == o2) { return true; }
		// complex check
		switch (typeof(o1)) {
			case 'function':
				return o1.toString() == o2.toString();
			case 'object':
				if (Ext.isDate(o1)) {
					if (Ext.isDate(o2)) {
						return o1.getTime() === o2.getTime();
					} else {
						return false;
					}
				}
				if (Ext.isArray(o1)) {
					if (Ext.isArray(o2)) {
						if (o1.length !== o2.length) {
							return false;
						}
						for (var i = 0; i < o1.length; i++) {
							if (!C.utils.equals(o1[i], o2[i])) {
								return false;
							}
						}
					} else {
						return false;
					}
				}
				for (var key in o1) {
					if (!o1.hasOwnProperty(key)) { continue; }
					if ((typeof(o2[key]) == 'undefined')
						&& (typeof(o1[key]) != 'undefined')
					) {
						return false;
					}
					if (!C.utils.equals(o1[key], o2[key])) {
						return false;
					}
				}
				break;
			default:
				return o1 === o2;
		}
		return true;
	},

/**
	* Converts value to Date if it is String.
	* @param {Date/String} value
	* @return {Date}
	*/
	toDate: function(value) {
		if (!Ext.isDate(value)) {
			value = new Date().pg_fmt(value);
		}
		return value;
	},

/**
	* Replaces such text as [SOMEURL] with <a href="[SOMEURL]">[SOMEURL]</a>
	* @param {String} text
	* @return {String}
	*/
	replaceURLWithHTMLLinks: function(text) {
		var expression = new RegExp([
			"(\\b(https?|ftp|file)://",
			"[-A-Z0-9+&@#/%?=~_|!:,.;]*",
			"[-A-Z0-9+&@#/%=~_|])"].join(""), 'ig');
		return text.replace(expression,
			"<a href='$1' target='_blank'>$1</a>");
	}


});

/**
 * @class Ext.util.MixedCollection
 */
C.utils.inherit('Ext.util.MixedCollection', {
/**
	* Returns an array of objects by specified keys
	* @param {Object[]} keys Array of keys
	* @return {Object[]}
	*/
	getByKeys: function(keys) {
		var result = [];
		if (!Ext.isArray(keys)) { return []; }
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (this.containsKey(key)) {
				result.push(this.get(key));
			}
		}
		return result;
	},

/**
	* Retuns a list of mixedcollection keys
	* @return {Object[]}
	*/
	getKeys: function() {
		var list = [];
		this.eachKey(function(key) {
			list.push(key);
		});
		return list;
	}
});

/**
 * @class Ext.data.Types
 */
C.utils.inherit('Ext.data.Types', {
	/**
	 * @property {Object} UTC_DATE
	 * This data type means that the raw data is converted into a Date using
	 * user utc settings before it is placed into a Record.
	 * The date format is specified in the constructor
	 * of the {@link Ext.data.Field} to which this type is being applied.
	 */
	UTCDATE: {
		convert: function(v) {
			v = Ext.data.Types.DATE.convert.call(this, v);

			if (v instanceof Date && !v.utcApplied) {
				v = v.pg_utc(C.getSetting('p.utc_value'));
				v.utcApplied = true;
			}

			return v;
		},
		sortType: Ext.data.SortTypes.asDate,
		type: 'utcDate'
	},

	/**
	 * @property {Object} OBJECT
	 * This data type means that the raw data is converted into a Date using
	 * user utc settings before it is placed into a Record.
	 * The date format is specified in the constructor
	 * of the {@link Ext.data.Field} to which this type is being applied.
	 */
	OBJECT: {
		convert: function(v) {
			//
			return v;
		},
		sortType: function(v) {
			return v;  // When sorting, order by default
		},
		type: 'object'
	},

	/**
	 * @property {Object} ADDRESS
	 * This data type means that the data is added to address store and retrieved by id as necessary.
	 */
	ADDRESS: {
		fullName: null,
		sortType: Ext.data.SortTypes.none,
		convert: function(v, rec) {
			v = v !== undefined && v !== null && v !== '' ?
				parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) :
				(this.useNull ? null : 0);
			if (v > 0) {
				var fullName = this.fullName ? this.fullName :
					this.name + '$fullname';
				fullName = rec.get(fullName);
				C.getStore('a_address').addItem({id: v, fullname: fullName});
			}
			return v;
		},
		useNull: true,
		type: 'address'
	}
});


/**
 * @class Date
 */
Ext.apply(Date.prototype, {
/**
	* Cloning of a Date object
	* @return Date
	*/
	clone: function() {
		return Ext.Date.clone(this);
	},

/**
	* Change value
	* @return Date
	*/
	add: function(type, value) {
		return Ext.Date.add(this, type, value);
	},

/**
	* Sets time to 00:00:00
	* @param {Boolean} cloneFlag If true clones Date object
	* @return Date
	*/
	clearTime: function(cloneFlag) {
		return Ext.Date.clearTime(this, cloneFlag);
	},

/**
	* Gets the first day of date month
	* @return Date
	*/
	getFirstDateOfMonth: function() {
		return Ext.Date.getFirstDateOfMonth(this);
	},

/**
	* Date shift according to given UTC in fmt param as in PostgreSQL.
	* Let me remind you that the format is as follows: X + interval '-1:30 hour'
	* Value '-1:30 hour' must be given as fmt parameter.
	* <i>By now is implemented only "hour" shift.</i>
	* @param {String} fmt Shift format
	* @param {Boolean} reverse Reversed shift
	* @return Date
	*/
	pg_utc: function(fmt, reverse) {
		var dt = this.clone();
		var res = /((-|\+)?\d+)(:(\d+))?\s(\w+)/i.exec(fmt);
		if (res.length == 0) { return dt; }

		var h = parseInt(res[1]);
		var m = parseInt(res[4]);
		dt = dt.add(Ext.Date.HOUR, (reverse) ? -h : h);
		if (typeof(m) !== 'undefined') {
			dt = dt.add(Date.MINUTE, (reverse) ? -m : m);
		}
		dt.utc_used = true;
		return dt;
	},

/**
	* Get Date object from Postgresql date string
	* @param {String} value String representation of the date
	* @return {Date}
	*/
	pg_fmt: function(value) {
		return Ext.Date.parseDate(value, C.cfg.dbFormatDate, false);
	},

/**
	* Date comparition
	* @param {Date} dt Compared date
	* @return Boolean
	*/
	equal: function(dt) {
		if (!Ext.isDate(dt)) { return false; }
		return (this.getTime() === dt.getTime());
	},

/**
	* Clears time for the Date {#link clearTime}
	* @param {Date} dt Date object
	* @param {Boolean} cloneFlag If true clones Date object
	* @return {Date} dt or its clone
	*/
	setStartOfADay: function(cloneFlag) {
		return this.clearTime(cloneFlag);
	},

/**
	* Set time of date object to 23:59:59.999
	* @param {Boolean} cloneFlag If true clones Date object
	* @return {Date} dt or its clone
	*/
	setEndOfADay: function(cloneFlag) {
		if (cloneFlag) {
			return this.clone().setEndOfADay();
		}
		this.setHours(23);
		this.setMinutes(59);
		this.setSeconds(59);
		this.setMilliseconds(999);
		return this;
	},

/**
	* Local time To UTC
	* @return {Date} Shifted date
	*/
	toUtc: function() {
		return new Date(this.getTime() + this.getTimezoneOffset() * 60 * 1000);
	}
});

/**
 * Set up for default Store.pageSize
 * @class Ext.data.Store
 */
C.utils.inherit('Ext.data.Store', {
	pageSize: C.cfg.defaultPageSize
});

/**
 * @class Array
 */
Ext.apply(Array.prototype, {

/**
	* Cloning an array
	* @return {Array}
	*/
	clone: function() {
		return [].concat(this);
	},

/**
	* Converts array items to numbers
	* @return {Array}
	*/
	toNumbers: function() {
		var list = this.clone();
		this.splice(0, this.length); // remove all items
		for (var i = 0; i < list.length; i++) {
			this.push(Number(list[i]));
		}
		return this;
	},

/**
	* Compares if this array equal to suplied array in parameter
	* @param {Array} arr
	* @param {Boolean} anyOrder True to compare in any order
	* @return {Boolean}
	*/
	equals: function(arr, anyOrder) {
		if (!arr || (this.length != arr.length)) { return false; }
		if (anyOrder) {
			// TODO needs optimization?
			return (
				(Ext.Array.difference(this, arr).length == 0) &&
				(Ext.Array.difference(arr, this).length == 0)
			);
		}
		for (var i = 0; i < arr.length; i++) {
			if (this[i].equals) { // likely nested array
				if (!this[i].equals(arr[i])) {
					return false;
				} else {
					continue;
				}
			}
			if (typeof this[i] == 'object') {
				if (!C.utils.equals(this[i], arr[i])) {
					return false;
				} else {
					continue;
				}
			}
			if (this[i] != arr[i]) { return false; }
		}
		return true;
	}
});

/**
 * @class Ext.util.Format
 */
Ext.apply(Ext.util.Format, {
	decimalSeparator: '.',
	thousandSeparator: ',',

/**
	* Format a number as RU currency
	* @param {Number/String} value The numeric value to format
	* @return {String} The formatted currency string
	*/
	ruMoney: function(v) {
		return Ext.util.Format.currency(v, ' rub.', 2, true);
	},

/**
	* Formats Date value with user Locale and UTC config
	* @param {Date} value The date value to format
	* @return {String} The formatted date string
	*/
	localDate: function(v) {
		/** Correct recieved value with UTC settings */
		if (!v) {
			return v;
		}
		var dt = v.pg_utc(C.getSetting('p.utc_value'));
		return Ext.util.Format.date(dt, O.format.Date);
	},

/**
	* Formats Date value with user Locale and UTC config
	* @param {Date} value The date value to format
	* @return {String} The formatted date string
	*/
	localTimestamp: function(v) {
		/** Correct recieved value with UTC settings */
		if (!v) {
			return v;
		}
		var dt = v.pg_utc(C.getSetting('p.utc_value'));
		return Ext.util.Format.date(dt, O.format.Timestamp);
	},

/**
	* Rounds the passed number to the required decimal precision.
	* @param {Number/String} value The numeric value to round.
	* @param {Number} precision The number of decimal places
	*   to which to round the first parameter's value.
	* @return {Number} The rounded value.
	*/
	round: function(value, precision) {
		var result = Number(value);
		if (typeof precision == 'number') {
			precision = Math.pow(10, precision);
			result = Math.round(value * precision) / precision;
		}
		return result;
	},

/**
	* Translates input value
	* @param {String} value The text to translate
	* @return {String} Translated string (or original if no translation)
	*/
	translate: function(v) {
		return _(v);
	}

});

/**
 * @class Ext.data.Store
 */
C.utils.inherit('Ext.data.Store', {
/**
	* Store copy
	* @return {Ext.data.Store}
	*/
	copy: function() {
		var records = [];
		var newStore = new Ext.data.Store({model: this.model});
		this.store.each(function(r) {
			records.push(r.copy());
		});
		newStore.loadRecords(records);
		return newStore;
	}
});

/**
 * @class Ext.Component
 */
C.utils.inherit('Ext.Component', {

/**
	* Shows this Component as an overlay in specified container
	* @param {Ext.Component/Ext.Element} container Container panel
	* @param {Ext.Component/Ext.Element} alignTo The Element or Component to align to
	*/
	showInContainer: function(container, alignTo) {
		var tabpanel = container.up('otabpanel');
		if (tabpanel) {
			if (!tabpanel.getOverlaysObject) { return; }
			var overlays = tabpanel.getOverlaysObject();
			// TODO check for memory leak - we never clear overlays array!
			if (!overlays[container.id]) {
				overlays[container.id] = [];
			}
			var list = overlays[container.id];
			if (Ext.Array.indexOf(list, this) < 0) {
				list.push(this);
			}
		}
		this.__containerPanel = container;
		this.__wasAlignedTo = alignTo;
		if (alignTo) {
			this.showBy(alignTo);
		} else {
			this.show();
		}
	}

});


/**
 * @class Ext.String
 */
Ext.apply(Ext.String, {

/**
	* Allows you to define a tokenized string and pass an array of parameters
	* to replace the tokens.
	* @param {String} format The tokenized string to be formatted
	* @param {Array} arr Array of parameters
	* @return {String} The formatted string
	*/
	formatA: function(format, arr) {
		return format.replace(Ext.String.formatRe, function(m, i) {
			return arr[i];
		});
	},

/**
	* Lowercases first symbol in a string.
	* @param {String} string
	* @return {String}
	*/
	decapitalize: function(string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	}

});


if (C.utils.isset('Ext.form.field.VTypes')) {
	Ext.apply(Ext.form.field.VTypes, {
/**
		* Date range type
		*/
		daterange: function(val, field) {
			var date = field.parseDate(val);
			if (!date) {return;}
			if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
				this.dateRangeMax = date;
				var start = Ext.getCmp(field.startDateField);
				start.setMaxValue(date);
				start.validate();
			}
			else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
				this.dateRangeMin = date;
				var end = Ext.getCmp(field.endDateField);
				end.setMinValue(date);
				end.validate();
			}
			return true;
		},

/**
		* Password validator
		*/
		password: function(val, field) {
			if (field.initialPassField) {
				var pwd = Ext.getCmp(field.initialPassField);
				return (val == pwd.getValue());
			}
			return true;
		},
		passwordText: 'Passwords do not match',

/**
		* Phone validator
		*/
		phone: function(val, field) {
			var re = /^\+?[ \(\)\d\.,-]{11,}$/;
			return re.test(val);
		},
		phoneText: 'Must be a phone number',
		phoneValMask: /[ \+\(\)\d\.,-]/,

/**
		* Float validator
		*/
		floatVal: function(val, field) {
			var re = /^\d+(\.\d+)?$/;
			return re.test(val);
		},
		floatValText: 'Must be a number or a float',
		floatValMask: /[\d\.]/,

/**
		* Positive int validator
		*/
		intVal: function(val, field) {
			var re = /^\d+$/;
			return re.test(val);
		},
		intValText: 'Must be a number',
		intValMask: /[\d]/,

/**
		* Int validator
		*/
		intValSigned: function(val, field) {
			var re = /^-?\d+$/;
			return re.test(val);
		},
		intValSignedText: 'Must be a number',
		intValSignedMask: /[\d-]/
	});
}

/**
 * @class Number
 */
Ext.apply(Number.prototype, {
/**
	* Transforms Number into radius representation
	* @return Number
	*/
	toRad: function() {
		return this * Math.PI / 180;
	}
});

if (typeof(String.prototype.toRad) === "undefined") {
/**
	* Transforms String into radius representation
	* @class String
	*/
	String.prototype.toRad = function() {
		return parseFloat(this) * Math.PI / 180;
	}
}

if (typeof(String.prototype.trim) === "undefined") {
/**
	* Removes whitespace from both ends of the string.
	* Does not affect the value of the string itself.
	* The following example displays the lowercase string "foo":
	* NOTE: This method is part of the ECMAScript 5 standard.
	* @class String
	*/
	String.prototype.trim = function() {
		return Ext.String.trim(this);
	}
}

if (typeof(Array.prototype.indexOf) === "undefined") {
/**
	* Get the index of the provided item in the given array, a
	* supplement for the missing arrayPrototype.indexOf in Internet Explorer.
	* @class Array
	*/
	Array.prototype.indexOf = function(item, from) {
		return Ext.Array.indexOf(this, item, from);
	}
}

/*
 * ======================================
 *              SHORTCUTS
 * ======================================
 */
/**
 * @class O
 * @singleton
 */
Ext.apply(C, {
/**
	* Shortcut for getting proxy store
	* @see O.manager.Model.getProxy({type}).getStore()
	*/
	getStore: function(type, storeConfig) {
		var proxy = O.manager.Model.getProxy(type);
		if (!proxy) {
			console.error('Proxy "' + type + '" not exists');
		}
		return proxy ? proxy.getStore(storeConfig) : null;
	},

/**
	* Shortcut to {@link O.manager.Model#getSettings}.
	* Returns user settings array
	*/
	getSettings: function() {
		return O.manager.Model.getSettings();
	},

/**
	* Shortcut to {@link O.manager.Model#getSetting}.
	* Return user option by its name
	*/
	getSetting: function(name, list, noError) {
		return O.manager.Model.getSetting(name, list, noError);
	},

/**
	* Shortcut to {@link O.manager.Model#get}.
	* Return objects by type
	*/
	get: function(type, fn, scope, params) {
		return O.manager.Model.get(type, fn, scope, params);
	},

/**
	* Shortcut for binding function to a proxy store.
	* Example:
	* <pre>
	* Old code:
	*	O.manager.Model.getCurator('settings').addListener(
	*		'update', this.onUpdateSettings, this);
	* New code:
	*	C.bind('settings', this);
	* </pre>
	* In this case object must have function called onUpdateSettings
	* @param {String} curatorName The name of curator
	* @param {Object} object An instance of object wich has approp. function
	*/
	bind: function(curatorName, object) {
		if (Ext.isArray(curatorName)) {
			for (var i = 0; i < curatorName.length; i++) {
				C.bind(curatorName[i], object);
			}
			return;
		}
		var functionName = 'onUpdate' + C.utils.ucfirst(curatorName);
		var fn = object[functionName];
		if (fn) {
			O.manager.Model.getCurator(curatorName).addListener(
				'update', fn, object);
		}
	},

/**
	* Shortcut for retrieving user right
	* Example:
	* <pre>
	* Old code:
	*	C.manager.Auth.hasRight('module_map');
	* New code:
	*	C.userHasRight('module_map');
	* </pre>
	* @param {String} rightName The name of the right
	* @param {Number} type Type of right
	* @see C.manager.Auth.hasRight(rightAlias)
	*/
	userHasRight: function(rightAlias, type) {
		return C.manager.Auth.hasRight(rightAlias, type);
	},

/**
	* Lock desktop to prevent tab change
	*/
	lockDesktop: function() {
		O.ui.Desktop.setLocked(true);
	},

/**
	* Unlock desktop to allow tab change
	*/
	unlockDesktop: function() {
		O.ui.Desktop.setLocked(false);
	},

/**
	* Return true if we are using Sencha Touch framework
	* @return Boolean
	*/
	isMobile: function() {
		return (USERAGENT_INFO['deviceType'] === 'mobile');
	},

/**
	* Displays todo warning in console
	* @param {String} msg Message to display
	*/
	todo: function(msg) {
		console.warn('Not implemented! ' + (msg || ''));
		console.trace();
	},

/**
	* Shortcut to {@link C.utils#define}.
	*/
	define: function(className, config, fn) {
		return C.utils.define(className, config, fn);
	},

/**
	* Shortcut to {@link C.utils#inherit}.
	*/
	inherit: function(className, config) {
		return C.utils.inherit(className, config);
	},

/**
	* Shortcut to {@link Ext#onReady}.
	* Add function wich whould be executed after loading of all script pieces,
	* including language files.
	* @param {Function} fn
	* @param {Object} scope [opt.]
	* @param {Object} params [opt.]
	*/
	onload: function(fn, scope, params) {
		Ext.onReady(fn, scope, params);
	},

	/**
	 * Add function wich whould be executed after boot is finished and splash screen is removed.
	 * @param {Function} fn
	 * @param {Object} scope [opt.]
	 */
	onready: function(fn, scope) {
		this.onload(function(){
			if (O.app.getController) {
				O.app.getController('Desktop').on('loaded', fn, scope);
				return;
			}

			if (!O.app.onLoaded) {
				O.app.onLoaded = [];
			}
			O.app.onLoaded.push({fn: fn, scope: scope});
		});
	}

});

// replace alert function with writing into
// console for ymaps "invalid key" issue and others
if (!C.cfg.debug) {
	window.alert = function(msg) {
		console.log(msg);
	}
	console.debug = Ext.emptyFn;
} else {
	if (!Function.prototype.bind) {
		console.debug = Ext.emptyFn;
	} else {
		console.debugCopy = console.debug.bind(console);
		console.debug = function() {
			if (arguments.length) {
				//var timestamp = '[' + new Date().toUTCString() + '] ';
				var diff = ((new Date).getTime() - window.startTime) / 1000;
				var timestamp = '[' + diff + '] ';
				console.debugCopy(timestamp, arguments);
			}
		}
	}
}

if (typeof(JSON) === "undefined") {
	// JSON loading for IE < 8
	C.utils.loadScript(STATIC_PATH + '/js/json2.min.js');
}
