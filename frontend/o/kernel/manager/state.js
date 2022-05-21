/**
 * @copyright  2012, Maprox LLC
 */
/**
 * State manager
 * @class O.manager.State
 * @singleton
 */
Ext.define('O.manager.State', {
	singleton: true,

	config: {
		eventPrefix: 'statechange_'
	},

	cfg: {
		pref: 'state',
		maxAge: 60 * 60 * 24 * 365,
		path: null,
		domain: null,
		secure: null
	},

	getEventPrefix: function() {
		return this.config.eventPrefix;
	},

/**
	* Returns an event name with prefix
	* @param {String} stateOptionName
	* @return String
	*/
	getEventName: function(stateOptionName) {
		return this.getEventPrefix() + stateOptionName;
	},

/**
	* Returns a state option name by event name
	* @param {String} eventName
	* @return String
	*/
	getStateOptionName: function(eventName) {
		return eventName.substring(this.getEventPrefix().length);
	},

/**
	* Returns state object from stateData by eventName (with prefix)
	* @param {Object[]} stateData
	* @param {String} eventName Name of an event with prefix
	*/
	getStateObj: function(stateData, eventName) {
		return stateData[this.getStateOptionName(eventName)];
	},

/**
	* Get cookie
	* @param {String} key Cookie key
	* @return {Mixed} Cookie value
	*/
	getCookie: function(key) {
		key = Ext.String.escapeRegex(key);
		var re = new RegExp('(?:^|; )' + key + '=([^;]*)'),
			matches = document.cookie.match(re);
		return matches ? Ext.JSON.decode(decodeURIComponent(matches[1])) : null;
	},

/**
	* Set cookie
	* @param {String} key Cookie key
	* @param {Mixed} value Cookie value
	*/
	setCookie: function(key, value) {
		document.cookie = key.toString() + '=' + escape(Ext.JSON.encode(value))
			+ (this.cfg.maxAge ? ('; max-age=' + this.cfg.maxAge) : '')
			+ (this.cfg.path ?   ('; path =' + this.cfg.path) : '')
			+ (this.cfg.domain ? ('; domain=' + this.cfg.domain) : '')
			+ (this.cfg.secure ? ('; secure =' + this.cfg.secure) : '');
	},

/**
	* Init watching to saving state
	* @param {Object} cmp Component/Controller
	*/
	watch: function(cmp) {
		if (!cmp.id) {
			console.log(cmp)
			console.warn('O.manager.State::watch | Component id no found');
			return;
		}
		var listeners = {
			scope: this
		};
		for (var stateOptionName in cmp.state) {
			var eventName = this.getEventName(stateOptionName);
			if (!cmp.state.hasOwnProperty(stateOptionName)) { continue; }
			var Prop = Ext.String.capitalize(stateOptionName),
				value = this.getCookie(this.cfg.pref + cmp.id + Prop);
			if (value) {
				var stateObj = this.getStateObj(cmp.state, eventName);
				if (stateObj) {
					stateObj.set.call(cmp, value);
				}
			}
			listeners[eventName] = Ext.bind(this.onFireEvent,
				this, [cmp, eventName]);
		}
		cmp.on(listeners);
	},

/**
	* On watched components fire events
	* @param {Object} cmp Component/Controller
	* @param {String} eventName Fired event
	*/
	onFireEvent: function(cmp, eventName) {
		var stateObj = this.getStateObj(cmp.state, eventName);
		if (!stateObj) { return; }
		var Prop = Ext.String.capitalize(this.getStateOptionName(eventName)),
			value = stateObj.get.call(cmp);
		this.setCookie(this.cfg.pref + cmp.id + Prop, value);
	}
});
