Ext.define('O.mon.lib.command.param.Abstract', {
	extend: 'Ext.Base',
	alias: 'widget.mon-lib-command-param-abstract',

/**
	* @constructor
	*/
	constructor: function(options) {
		this.callParent(arguments);
		Ext.apply(this, options || {});

		// Base field params
		this.fieldParams = Ext.apply({
			name: this.params.name,
			labelAlign: 'top',
			fieldLabel: _(this.params.description),
			allowBlank: false
		});

		// Parse info
		if (this.params.info) {
			var info = Ext.JSON.decode(this.params.info);
			this.info = info;

			// If restrictions exists
			if (info.restrictions) {
				// Max value
				if (info.restrictions.max !== undefined) {
					this.fieldParams.maxValue = info.restrictions.max;
				}

				// Min value
				if (info.restrictions.min !== undefined) {
					this.fieldParams.minValue = info.restrictions.min;
				}
			}
		}
	},

/**
	 * Returns field
	 */
	getField: function() {
		// Not implemented
	}
});
