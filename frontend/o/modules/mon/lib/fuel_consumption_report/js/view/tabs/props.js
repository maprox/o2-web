/**
 * @class O.mon.lib.fuel.consumption.report.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.mon.lib.fuel.consumption.report.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-fuel-consumption-report-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		// store init
		this.companyStore = C.getStore('x_company');
		this.pointStore = C.getStore('mon_geofence');
		this.driverStore = C.getStore('dn_worker');
		this.dispatcherStore = C.getStore('dn_worker');
		this.mechanicStore = C.getStore('dn_worker');

		// init component view
		var padding = 10; // default field padding
		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			autoScroll: true,
			layout: 'anchor',
			items: [{
				border: false,
				//height: 470,
				anchor: '100%',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				defaults: {
					//autoScroll: true,
					border: false,
					bodyPadding: padding,
					layout: 'anchor'
				},
				items: [{
					defaults: {
						// xtype: 'fieldcontainer' has a bug while rendering
						// when this panel is not visible
						xtype: 'panel',
						layout: 'hbox',
						anchor: '100%',
						border: false,
						labelAlign: 'top'
					},
					flex: 1,
					items: [{
						defaults: {
							xtype: 'textfield',
							labelAlign: 'top',
							labelWidth: 50,
							width: 220
						},
						items: [{
							xtype: 'monthfield',
							format: 'F, Y',
							name: 'dt',
							fieldLabel: _('Date'),
							allowBlank: false,
							width: 200
						},  {
							xtype: 'tbspacer',
							width: padding
						}, {
							xtype: 'combobox',
							name: 'id_division',
							store: C.getStore('dn_division'),
							fieldLabel: _('Division'),
							editable: false,
							queryMode: 'local',
							valueField: 'id',
							displayField: 'name',
							allowBlank: false,
							width: 200
						}]
					}]
				}]
			}]
		});
		this.callParent(arguments);
	}
});
