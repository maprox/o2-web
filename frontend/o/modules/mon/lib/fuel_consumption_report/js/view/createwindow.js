/**
 * @class O.mon.lib.fuel.consumption.report.CreateWindow
 * @extends O.common.lib.modelslist.EditorWindow
 */
C.define('O.mon.lib.fuel.consumption.report.CreateWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.mon_fuel_consumption_report-createwindow',

	modal: true,
	bodyPadding: 10,
	border: false,

/**
	* @constructor
	*/
	initComponent: function() {
		var padding = 10;
		Ext.apply(this, {
			title: _('Create report'),
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
				allowBlank: false,
				labelWidth: 110,
				anchor: '100%'
			},  {
				xtype: 'tbspacer',
				width: padding
			}, {
				xtype: 'combobox',
				name: 'id_division',
				itemId: 'fieldDivision',
				store: C.getStore('dn_division'),
				fieldLabel: _('Division'),
				editable: false,
				queryMode: 'local',
				valueField: 'id',
				displayField: 'name',
				allowBlank: false,
				forceSelection: true,
				labelWidth: 110,
				anchor: '100%'
			}],
			buttonAlign: 'center',
			buttons: [{
				text: _('Create'),
				itemId: 'btnCreate',
				iconCls: 'btn-ok'
			}, {
				text: _('Cancel'),
				itemId: 'btnCancel',
				iconCls: 'cancel'
			}]
		});
		this.callParent(arguments);
		// init local variables
		this.btnCreate = this.down('#btnCreate');
		this.btnCancel = this.down('#btnCancel');
		this.fieldDate = this.down('#fieldDate');
		this.fieldDivision = this.down('#fieldDivision');
	}
});