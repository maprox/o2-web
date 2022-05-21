Ext.define('O.mon.lib.command.param.Timestamp', {
	extend: 'O.mon.lib.command.param.Abstract',
	alias: 'widget.mon-lib-command-param-timestamp',

/**
	* @constructor
	*/
	constructor: function(options) {
		this.callParent(arguments);
	},

/**
	 * Returns field
	 */
	getField: function() {
		this.callParent(arguments);


		var params = this.fieldParams;

		params = Ext.apply(params, {
			format: O.format.Date,
			timeCfg: {
				width: 80
			},
			dateCfg: {
				width: 120
			}
		});

		var field = Ext.create('widget.datetime', params);

		return field;
	}
});
