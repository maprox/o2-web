/**
 * @class O.mon.device.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.device.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-device-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {

		// Images store
		this.storeAvailableImages = C.getStore('images');

		var deviceConfiguredStatusText = {
			0: _('Not yet configured'),
			1: _('SMS with the settings has been sent'),
			2: _('SMS with the settings has been recieved, wait for packages'),
			3: _('SMS with the settings is lost, please try again'),
			4: _('Device is online'),
			5: _('Packets were not received, please re-configure the device')
		};

		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			defaults: {
				labelAlign: 'top'
			},
			layout: 'anchor',
			autoScroll: true,
			items: [{
				// hbox layout panel
				xtype: 'panel',
				anchor: '100%',
				border: false,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [{
					// Properties panel
					xtype: 'panel',
					width: 400,
					border: false,
					//html: 'testpanel',
					defaults: {
						xtype: 'textfield',
						labelAlign: 'top',
						width: 400
					},
					items: [{
						name: 'name',
						fieldLabel: _('Name'),
						allowBlank: false
					}, {
						xtype: 'textarea',
						name: 'note',
						fieldLabel: _('Note')
					}, {
						xtype: 'numberfield',
						name: 'odometer',
						minValue: 0,
						fieldLabel: _('Odometer, km')
					}, {
						labelAlign: 'left',
						labelWidth: 120,
						xtype: 'displayfield',
						name: 'configured',
						fieldLabel: _('Device status'),
						renderer: function(value, cmp) {
							var deviceConfiguredStatusStyle = {
								0: 'color: red',
								1: 'color: blue',
								2: 'color: blue',
								3: 'color: red',
								4: 'color: green',
								5: 'color: gray'
							};
							cmp.setFieldStyle(deviceConfiguredStatusStyle[value]);
							return deviceConfiguredStatusText[value];
						}
					}]
				// Images panel
				}, {
					flex: 1,
					border: false,
					layout: 'anchor',
					margin: '0 0 0 30',
					items: [{
						xtype: 'fieldset',
						anchor: '100%',
						title: _('Device icon'),
						items: [{
							xtype: 'imageselect',
							name: 'imagealias',
							store: this.storeAvailableImages
						}]
					}]
				}]
			}]
		});

		this.callParent(arguments);
	}
});
