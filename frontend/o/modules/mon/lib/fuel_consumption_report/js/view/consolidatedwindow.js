/**
 * @class O.mon.lib.fuel.consumption.report.ConsolidatedWindow'
 * @extends O.common.lib.modelslist.EditorWindow
 */
C.define('O.mon.lib.fuel.consumption.report.ConsolidatedWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.mon_fuel_consumption_report-consolidatedwindow',

	modal: true,
	bodyPadding: 10,
	border: false,

/**
	* @constructor
	*/
	initComponent: function() {
		var padding = 10;
		Ext.apply(this, {
			title: _('Print consolidated report'),
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			resizable: false,
			bodyPadding: padding,
			width: 350,
			closeAction: 'hide',
			plain: true,
			items: [{
				xtype: 'monthfield',
				itemId: 'fieldDate',
				format: 'F, Y',
				name: 'dt',
				fieldLabel: _('Date'),
				labelWidth: 40,
				anchor: '100%',
				allowBlank: false
			}],
			buttonAlign: 'center',
			buttons: [{
				text: _('Print'),
				itemId: 'btnPrint',
				iconCls: 'print'
			}, {
				text: _('Cancel'),
				itemId: 'btnCancel',
				iconCls: 'cancel'
			}]
		});
		this.callParent(arguments);
		// init local variables
		this.btnPrint = this.down('#btnPrint');
		this.btnCancel = this.down('#btnCancel');
		this.fieldDate = this.down('#fieldDate');
	}
});