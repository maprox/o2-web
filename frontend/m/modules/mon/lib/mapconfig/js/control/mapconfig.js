/**
 * Map config panel controller
 * @class O.app.view.MapConfigPanelControl
 * @extand O.app.view.MapConfigPanel
 */
Ext.define('O.app.view.MapConfigPanelControl', {
	override: 'O.app.view.MapConfigPanel',

	/**
	 * @event change
	 * Option change
	 */

	/**
	 * @construct
	 * @override
	 */
	initialize: function() {
		// call overridden
		this.callParent(arguments);
		this.btnConfigClose.on('tap', 'hide', this);
		var options = this.query('component[option]');
		Ext.each(options, function(option) {
			option.on('change', 'onOptionChange', this);
		}, this);
	},

/**
	* Option change handler
	* @param {Object} field
	*/
	onOptionChange: function(field) {
		this.fireChange(field.config.option, field.getValue());
	},

/**
	* Fire events on settings change
	* @param key Setting alias
	* @param value Value
	*/
	fireChange: function(key, value) {
		if (!key) { return; }
		var data = {};
		data[key] = value;
		this.fireEvent('change', data);
	},

/**
	* Gets options values for this panel
	* @return {Object}
	*/
	getOptions: function() {
		return {
			followselected: this.fieldFollowSelected.getValue(),
			showpath: this.fieldShowPath.getValue(),
			showlabels: this.fieldShowLabels.getValue()
		};
	},

/**
	* Sets options values for this panel
	* @param {Object} options
	*/
	setOptions: function(options) {
		for (var option in options) {
			if (!options.hasOwnProperty(option)) { continue; }
			this.setOption(option, options[option]);
		}
	},

/**
	* Set option value
	* @param {String} name Option name
	* @param {Object} value Option value
	*/
	setOption: function(name, value) {
		var field = this.down('component[option=' + name + ']');
		if (!field) { return; }
		if (field.setValue) {
			field.setValue(value);
		}
	}
});
