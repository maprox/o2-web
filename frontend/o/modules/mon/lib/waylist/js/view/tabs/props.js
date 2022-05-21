/**
 * @class O.mon.lib.waylist.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.mon.lib.waylist.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-waylist-tab-props',

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
		//this.seriesStore = Ext.getStore('mon_waylist_series');
		var storeCompanyOwner = [
			[C.getSetting("f.id"), C.getSetting("f.name")]
		];
		// init component view
		var padding = 10; // default field padding
		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			autoScroll: true,
			layout: 'anchor',
			items: [{
				border: false,
				height: 470,
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
					flex: 4,
					items: [{
						defaults: {
							xtype: 'textfield',
							labelAlign: 'top',
							labelWidth: 50,
							width: 120
						},
						items: [{
							fieldLabel: _('Series'),
							name: 'serial_num'
							//xtype: 'combobox',
							//store: this.seriesStore,
							//queryMode: 'local',
							//displayField: 'name',
							//valueField: 'name'
						}, {
							xtype: 'tbspacer',
							width: padding
						}, {
							fieldLabel: _('Number'),
							xtype: 'numberfield',
							allowBlank: false,
							name: 'num'
						}, {
							xtype: 'tbspacer',
							width: padding
						}, {
							fieldLabel: _('Issue date'),
							xtype: 'datefield',
							name: 'dt',
							allowBlank: false,
							format: O.format.Date,
							altFormats: 'c',
							width: 100
						}, {
							xtype: 'tbspacer',
							width: padding
						}, {
							xtype: 'combobox',
							name: 'id_type',
							store: C.getStore('mon_waylist_type'),
							fieldLabel: _('Type'),
							editable: false,
							queryMode: 'local',
							valueField: 'id',
							displayField: 'name',
							width: 200
						}]
					}, {
						xtype: 'tbspacer',
						height: padding
					}, {
						defaults: {
							xtype: 'textfield',
							labelWidth: 50,
							width: 120,
							labelAlign: 'top'
						},
						items: [{
							fieldLabel: _('Vehicle'),
							xtype: 'combobox',
							name: 'id_vehicle',
							itemId: 'vehicleField',
							flex: 1,
							store: C.getStore('mon_vehicle'),
							editable: false,
							queryMode: 'local',
							displayField: 'fullname',
							valueField: 'id'
						}, {
							xtype: 'tbspacer',
							width: padding
						}, {
							xtype: 'combobox',
							itemId: 'fuelTypeField',
							name: 'id_fuel',
							store: C.getStore('mon_fuel'),
							fieldLabel: _('Fuel type'),
							editable: false,
							disabled: true,
							queryMode: 'local',
							valueField: 'id',
							displayField: 'name'
						}, {
							xtype: 'tbspacer',
							width: padding
						}, {
							fieldLabel: _('Driver'),
							xtype: 'combobox',
							name: 'id_driver',
							itemId: 'driverField',
							flex: 1,
							store: this.driverStore,
							editable: false,
							queryMode: 'local',
							displayField: 'shortname',
							valueField: 'id'
						}]
					}, {
						xtype: 'tbspacer',
						height: padding
					}, {
						defaults: {
							xtype: 'panel',
							border: false,
							layout: 'anchor',
							flex: 1
						},
						items: [{
							defaults: {
								// xtype: 'fieldcontainer' has a bug while
								// rendering when this panel is not visible
								xtype: 'panel',
								bodyPadding: padding,
								//border: false,
								layout: 'hbox',
								defaults: {
									flex: 1,
									labelAlign: 'top'
								}
							},
							items: [{
								title: _('Departure'),
								flex: 2,
								layout: 'anchor',
								defaults: {
									xtype: 'panel',
									border: false,
									layout: 'hbox',
									anchor: '100%',
									defaults: {
										labelAlign: 'top',
										flex: 1
									}
								},
								items: [{
									items: [{
										fieldLabel: _('Place of submission'),
										xtype: 'combobox',
										flex: null,
										width: 200,
										name: 'id_point_submission',
										hiddenName: 'id_point_submission$new',
										store: this.pointStore,
										editable: true,
										queryMode: 'local',
										displayField: 'name',
										valueField: 'id',
										listConfig: {
											itemTpl: Ext.create('Ext.XTemplate',
												'<tpl if="address">',
													'<b>{name}</b>',
													'<br/>{address}',
												'<tpl else>',
													'{name}',
												'</tpl>'
											)
										}
									}, {
										xtype: 'tbspacer',
										flex: null,
										width: padding
									}, {
										fieldLabel: _('Speedometer'),
										xtype: 'numberfield',
										flex: null,
										width: 180,
										name: 's_odometer_km',
										itemId: 'sOdometerField'
									}, {
										xtype: 'tbspacer',
										flex: null,
										width: padding
									}, {
										fieldLabel: _('Fuel amount'),
										xtype: 'numberfield',
										flex: null,
										width: 180,
										name: 's_fuel'
									}, {
										xtype: 'tbspacer',
										flex: null,
										width: padding
									}, {
										xtype: 'numberfield',
										name: 'fuel_expense',
										minValue: 0,
										flex: null,
										width: 240,
										fieldLabel: _('Avarage fuel expense (per 100 km), l')
									}]
								}, {
									xtype: 'tbspacer',
									height: padding
								}, {
									items: [{
										fieldLabel: _('Disposal company'),
										xtype: 'combobox',
										flex: null,
										width: 200,
										name: 'id_company_disposal',
										store: this.companyStore,
										editable: true,
										queryMode: 'local',
										displayField: 'name',
										valueField: 'id'
									}, {
										xtype: 'tbspacer',
										flex: null,
										width: padding
									}, {
										fieldLabel: _('Refuel list number'),
										xtype: 'textfield',
										flex: null,
										width: 180,
										name: 'refuel_list_number'
									}, {
										xtype: 'tbspacer',
										flex: null,
										width: padding
									}, {
										fieldLabel: _('Refuel amount'),
										xtype: 'numberfield',
										flex: null,
										width: 180,
										name: 'refuel_amount'
									}]
								}]
							}, {
								xtype: 'tbspacer',
								height: padding
							}, {
								title: _('Return'),
								layout: 'hbox',
								items: [{
									fieldLabel: _('Speedometer'),
									xtype: 'numberfield',
									flex: null,
									width: 180,
									name: 'e_odometer_km',
									itemId: 'eOdometerField'
								}, {
									xtype: 'tbspacer',
									flex: null,
									width: padding
								}, {
									fieldLabel: _('Fuel amount'),
									xtype: 'numberfield',
									flex: null,
									width: 180,
									name: 'e_fuel'
								}, {
									fieldLabel: _('Close on return'),
									xtype: 'checkbox',
									name: 'auto_close_fence',
									flex: null,
									width: 400,
									margin: '0 10px'
								}, {
									xtype: 'tbspacer',
									flex: 1
								}]
							}]
						}]
					}, {
						xtype: 'tbspacer',
						height: padding
					}, {
						xtype: 'textarea',
						fieldLabel: _('Note'),
						height: 100,
						anchor: '100%',
						maxWidth: 600,
						name: 'note'
					}]
				}, {
					defaults: {
						xtype: 'combobox',
						editable: false,
						forceSelection: true,
						queryMode: 'local',
						labelWidth: 50,
						labelAlign: 'top',
						valueField: 'id'
					},
					width: 200,
					items: [{
						fieldLabel: _('Issued by'),
						name: 'id_company_owner',
						itemId: 'issuedField',
						flex: 1,
						store: storeCompanyOwner,
						disabled: true,
						displayField: 'name'
					}, {
						fieldLabel: _('Departure time'),
						xtype: 'datetime',
						name: 'sdt',
						itemId: 'sdtField',
						width: 200,
						format: O.format.Date
					}, {
						fieldLabel: _('Depart from'),
						store: Ext.data.StoreManager.lookup('mon_geofence_garage'),
						itemId: 'departField',
						name: 's_point',
						flex: 1,
						displayField: 'name'
					}, {
						fieldLabel: _('Return time'),
						xtype: 'datetime',
						name: 'edt',
						itemId: 'edtField',
						width: 200,
						format: O.format.Date
					}, {
						fieldLabel: _('Return to'),
						store: Ext.data.StoreManager.lookup('mon_geofence_garage'),
						itemId: 'returnField',
						name: 'e_point',
						flex: 1,
						displayField: 'name'
					}, {
						fieldLabel: _('Dispatcher'),
						name: 's_id_dispatcher',
						flex: 1,
						store: this.dispatcherStore,
						displayField: 'shortname'
					}, {
						fieldLabel: _('Mechanic'),
						name: 's_id_mechanic',
						flex: 1,
						store: this.mechanicStore,
						displayField: 'shortname'
					}, {
						fieldLabel: _('Medic'),
						xtype: 'textfield',
						name: 'medician',
						flex: 1
					}]
				}]
			}]
		});
		this.callParent(arguments);

		// init variables
		this.departField = this.down('#departField');
		this.returnField = this.down('#returnField');
		this.issuedField = this.down('#issuedField');
		this.vehicleField = this.down('#vehicleField');
		this.fuelTypeField = this.down('#fuelTypeField');
		this.sOdometerField = this.down('#sOdometerField');
		this.eOdometerField = this.down('#eOdometerField');
		this.sdtField = this.down('#sdtField');
		this.edtField = this.down('#edtField');
		this.driverField = this.down('#driverField');
	}
});
