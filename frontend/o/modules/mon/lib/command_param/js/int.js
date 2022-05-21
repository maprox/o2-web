Ext.define('O.mon.lib.command.param.Int', {
	extend: 'O.mon.lib.command.param.Abstract',
	alias: 'widget.mon-lib-command-param-int',

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
		params.allowDecimals = false;

		var field = Ext.create('Ext.form.field.Number', params);

		return field;
	}
});
