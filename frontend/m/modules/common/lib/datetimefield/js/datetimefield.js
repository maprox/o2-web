/**
 * DateTimeField
 * @extends Ext.field.DatePicker
 */
Ext.define('O.lib.DateTimeField', {
	extend: 'Ext.field.DatePicker',
	alias: 'widget.datetimefield',

/**
	* Component initialization
	* @construct
	*/
	initialize: function() {
		this.setWidth(140);
		this.setDateFormat(O.format.Date);
		this.callParent(arguments);
	}
});
