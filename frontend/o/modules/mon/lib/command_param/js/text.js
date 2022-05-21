Ext.define('O.mon.lib.command.param.Text', {
	extend: 'O.mon.lib.command.param.Abstract',
	alias: 'widget.mon-lib-command-param-text',

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

		var field = Ext.create('Ext.form.field.Text', this.fieldParams);

		return field;
	}
});
