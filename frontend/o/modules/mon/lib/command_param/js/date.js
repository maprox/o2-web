Ext.define('O.mon.lib.command.param.Date', {
	extend: 'O.mon.lib.command.param.Abstract',
	alias: 'widget.mon-lib-command-param-date',

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
			submitFormat: 'Y-m-d'
		});

		var field = Ext.create('Ext.form.field.Date', params);

		return field;
	}
});
