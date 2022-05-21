/**
 */
/**
 * OpenLayers extended functionality
 * @class O.map.OpenLayersExtender
 * @singleton
 */
Ext.define('C.lib.map.openlayers.Extender', {
	extend: 'Ext.Component',

	singleton: true,

	initComponent: function() {
		this.callParent(arguments);
		this.addEvents('switchlayer');
	},

/**
	* List of the creation functions of an extensions
	* @type Array
	* @private
	*/
	fnList: [],

/**
	* Adds a creation function of an extension
	* @param {Function} fn
	*/
	add: function(fn) {
		this.fnList.push(fn);
	},

/**
	* Recreates all extensions
	*/
	recreate: function() {
		if (this.isLoaded()) { return; }
		for (var i = 0; i < this.fnList.length; i++) {
			var fn = this.fnList[i];
			if (Ext.isFunction(fn)) {
				fn();
			}
		}
	},

/**
	* Checks if extensions are loaded
	* @return {Boolean}
	*/
	isLoaded: function() {
		return false;
	}
});
