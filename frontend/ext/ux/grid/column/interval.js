/**
 * Postgresql "interval" column
 * @class Ext.ux.grid.column.Interval
 * @extends Ext.grid.column.Template
 */
Ext.define('Ext.ux.grid.column.Interval', {
	extend: 'Ext.grid.column.Template',
	alias: 'widget.intervalcolumn',
	format: 'H:i',

/**
	* Component initialization
	*/
	initComponent: function() {
		var fmt = this.format;
		this.tpl = new Ext.XTemplate(
			'{[this.fmtInterval(values.' + this.dataIndex + ')]}',
			{
				fmtInterval: function(value) {
					return C.utils.fmtInterval(value, fmt) || '';
				}
			}
		);
		this.callParent(arguments);
	}
});