/**
 * Language manager
 * @class C.manager.Lang
 * @singleton
 */
Ext.define('C.manager.Lang', {
	singleton: true,

/**
	* Collection of translations
	* @type Ext.util.MixedCollection
	*/
	_lang: new Ext.util.MixedCollection(),

/**
	* Translates input sentence
	* @param {String} key
	* @return {String}
	*/
	getTranslation: function(key) {
		return this._lang.get(key) || key;
	},

/**
	* Adds a translation
	* @param {String/Object} key English text or an Object {'yes': 'oui', ...}
	* @param {String} value Localized text
	*/
	addTranslation: function(key, value) {
		if (Ext.isObject(key)) {
			for (var param in key) {
				if (key.hasOwnProperty(param)) {
					this._lang.add(param, key[param]);
				}
			}
		} else {
			this._lang.add(key, value);
		}
	},

/**
	* Returns or set translation according to input parameters
	* @param {String/Object} key English text or an Object {'yes': 'oui', ...}
	* @param {String} value Localized text
	* @return {String}
	*/
	exec: function(key, value) {
		if (Ext.isObject(key) || typeof(value) !== 'undefined') {
			return C.manager.Lang.addTranslation(key, value);
		} else {
			if (Ext.isString(key)) {
				return C.manager.Lang.getTranslation(key);
			} else {
				return key;
			}
		}
	}

}, function() {

	// Language gettext compliant
	if (typeof(window._) === 'undefined') {
		window._ = this.exec;
	}

});
