/**
 * Postgresql "interval" column type editor field
 * @class Ext.ux.form.field.Interval
 * @extends Ext.form.field.ComboBox
 */
Ext.define('Ext.ux.form.field.Interval', {
	extend: 'Ext.form.field.ComboBox',
	alias: ['widget.interval', 'widget.intervalfield'],

/**
	* Intervals list to fill combobox
	*/
	intervals: [
		'00:00:00',
		'00:05:00',
		'00:10:00',
		'00:15:00',
		'00:20:00',
		'00:30:00',
		'00:45:00',
		'01:00:00',
		'01:30:00',
		'02:00:00',
		'02:30:00',
		'03:00:00',
		'04:00:00',
		'05:00:00',
		'06:00:00',
		'07:00:00',
		'08:00:00',
		'09:00:00',
		'12:00:00',
		'24:00:00'
	],

	simpleText: true,
	queryMode: 'local',
	format: 'H:i',
	regex: /^\d+(:([0-5][0-9])|([0-9])){0,2}$/,

/**
	* Component initialization
	*/
	initComponent: function() {
			var fmt = this.format;
			this.store = Ext.create('Ext.data.Store', {
				fields: [
					{name: 'interval', type: 'string'},
					{name: 'display', type: 'string',
						convert: function(v, r) {
							return C.utils.fmtInterval(r.get('interval'), fmt);
						}}
				]
			});

			for (var i = 0; i < this.intervals.length; i++) {
				this.store.add({'interval': this.intervals[i]});
			}

			this.valueField = 'interval';
			this.displayField = 'display';
			this.displayTpl = new Ext.XTemplate(
				'<tpl for=".">' +
					'{[typeof values === "string" ? ' +
						'values : this.formatInterval(values["' +
							this.displayField + '"])]}' +
				'</tpl>', {
				formatInterval: function(value) {
					return C.utils.fmtInterval(value, fmt) || '';
				}
			});
			this.callParent(arguments);
	}
});