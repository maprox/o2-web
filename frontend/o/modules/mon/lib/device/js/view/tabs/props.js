/**
 * @class O.mon.lib.device.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.lib.device.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-lib-device-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		// Images store
		this.storeAvailableImages = C.getStore('images');

		this.ownerStore = Ext.create('Ext.data.Store', {
			model: 'Ownerinfo'
		});

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
						xtype: 'combobox',
						name: 'protocol',
						itemId: 'protocol',
						fieldLabel: _('Type (protocol)'),
						store: C.getStore('mon_device_protocol'),
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						editable: false,
						queryMode: 'local'
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
					}, {
						xtype: 'button',
						itemId: 'configureByKey',
						text: _('Configure by settings key')
					}, {
						fieldLabel: _('Enter settings key'),
						xtype: 'textfield',
						itemId: 'settingsKey',
						name: 'settingsKey',
						hidden: true,
						isFormField: false
					}, {
						xtype: 'button',
						itemId: 'sendSettingsKey',
						text: _('Set settings'),
						hidden: true
					}]
				}, {
					flex: 1,
					border: false,
					layout: 'anchor',
					margin: '0 0 0 30',
					items: [{
						xtype: 'fieldset',
						hidden: true,
						itemId: 'deviceOwner',
						anchor: '100%',
						title: _('Device owner'),
						items: [{
							xtype: 'dataview',
							itemId: 'ownerView',
							cls: 'ownerview',
							itemSelector: 'div.ownerinfo',
							border: false,
							store: this.ownerStore,
							tpl: new Ext.XTemplate(
								'<div class="ownerinfo">',
								'<tpl for=".">',
									'<div>',
										'<strong>',
											_('Owner'),
										':</strong>',
										' {firm_name}',
									'</div>',
									'<div>',
										'<strong>',
											_('Access from'),
										'</strong>',
										' {[this.convTime(values.sdt)]} ',
										' {[this.edtTime(values.edt)]}',
									'</div>',
									'<tpl if="values.granted_by.length">',
										'<div>',
											'<strong>',
												_('Granted by'),
											':</strong>',
											' {granted_by}',
										'</div>',
									'</tpl>',
									'<tpl if="values.dt">',
										'<div>',
											'<strong>',
												_('Granted at'),
											':</strong>',
											' {[this.convTime(values.dt)]}',
										'</div>',
									'</tpl>',
								'</tpl>',
								'</div>',
								{
									convTime: function(time) {
										return me.convertTime(time);
									},

									edtTime: function(time) {
										if (time == null) {
											return '';
										} else {
											return '<strong>'
												+ _('till')
												+ '</strong> '
												+ me.convertTime(time);
										}
									}
								}
							)
						}]
					}, {
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
		// save component links
		this.protocol = this.down('#protocol');
		this.deviceOwner = this.down('#deviceOwner');
		this.configureByKey = this.down('#configureByKey');
		this.sendSettingsKey = this.down('#sendSettingsKey');
		this.settingsKey = this.down('#settingsKey');
	}
});
