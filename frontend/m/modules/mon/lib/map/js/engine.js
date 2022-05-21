/**
 * @fileOverview Abstract map monitoring engine
 */
/**
 * @class C.lib.map.Engine
 */
C.utils.inherit('C.lib.map.Engine', {

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	constructor: function(config) {
		this.on({
			painted: this.onPainted,
			scope: this
		});

		this.callParent(arguments);
	},

/**
	* Painted handler
	* Renders map.
	*/
	onPainted: function() {
		if (!this.alreadyPainted) {
			this.alreadyPainted = true;
			this.renderMap();
		}
	},

/**
	* Map rendering
	* @private
	*/
	renderMap: Ext.emptyFn
});
