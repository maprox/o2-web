/**
 * @class O.mon.vehicle.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.mon.vehicle.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-vehicle-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		this.workerStore = C.getStore('dn_worker');
		var license = [
			[0, _('No license')],
			[1, _('Standart license')],
			[2, _('Restricted license')]
		];

		var engine = Ext.create('Ext.data.Store', {
			fields: ['engine'],
			data: [
				{"engine": _('Petrol')},
				{"engine": _('Diesel')}
			],
			idIndex: 0
		});

		var powerMeasure = [
			[0, _('Not specified')],
			[10, _('hp')],
			[1101, _('kW')]
		];

		var devicesStore = C.getStore('mon_device');
		devicesStore.insert(0, {id: null, name: _('Unspecified')});

		this.divisionStore = C.getStore('dn_division');
		this.divisionStore.insert(0, {id: 0, name: _('No division')});

		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			bodyPadding: 10,
			autoScroll: true,
			defaultType: 'textfield',
			items: [{
				xtype: 'panel',
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				width: 500,
				border: false,
				defaults: {
					xtype: 'textfield',
					labelAlign: 'top',
					anchor: '100%'
				},
				items: [{
					name: 'name',
					fieldLabel: _('Name'),
					allowBlank: false,
					disabled: true
				}, {
					name: 'license_number',
					fieldLabel: _('License number')
				}, {
					xtype: 'combobox',
					name: 'id_division',
					store: this.divisionStore,
					fieldLabel: _('Division'),
					//editable: false,
					queryMode: 'local',
					typeAhead: true,
					valueField: 'id',
					displayField: 'name'
				}, {
					name: 'garage_number',
					fieldLabel: _('Garage number')
				}, {
					xtype: 'combobox',
					name: 'id_fuel',
					store: C.getStore('mon_fuel'),
					fieldLabel: _('Fuel name'),
					//editable: false,
					queryMode: 'local',
					typeAhead: true,
					valueField: 'id',
					displayField: 'name'
				}, {
					xtype: 'numberfield',
					name: 'fuel_expense',
					minValue: 0,
					fieldLabel: _('Avarage fuel expense (per 100 km), l')
				}, {
					xtype:'fieldset',
					title: _('License card'),
					itemId: 'licenseFieldset',
					collapsible: true,
					defaultType: 'textfield',
					defaults: {
						anchor: '100%',
						labelAlign: 'top'
					},
					layout: 'anchor',
					items :[{
						xtype: 'combobox',
						name: 'bus_license_type',
						fieldLabel: _('License type'),
						editable: false,
						valueField: 'id',
						displayField: 'name',
						store: license

					}, {
						name: 'bus_license_reg_num',
						fieldLabel: _('Registration number')
					}, {
						name: 'bus_license_series',
						fieldLabel: _('License series')
					}, {
						name: 'bus_license_number',
						fieldLabel: _('License card number')
					}]
				}, {
					xtype: 'combobox',
					name: 'id_driver',
					itemId: 'driverCombobox',
					fieldLabel: _('Driver'),
					valueField: 'id',
					displayField: 'fullname',
					queryMode: 'local',
					editable: false,
					store: this.workerStore,
					triggerAction: 'all',
					lastQuery: ''
				}, {
					xtype: 'combobox',
					name: 'id_responsible',
					itemId: 'responsibleCombobox',
					fieldLabel: _('Responsible for the operation'),
					valueField: 'id',
					displayField: 'fullname',
					queryMode: 'local',
					editable: false,
					store: this.workerStore,
					triggerAction: 'all',
					lastQuery: ''
				}, {
					xtype: 'combobox',
					name: 'id_device',
					fieldLabel: _('Device'),
					valueField: 'id',
					displayField: 'name',
					store: devicesStore,
					forceSelection: true,
					editable: false,
					queryMode: 'local'
				}, {
					xtype:'fieldset',
					title: _('Vehicle registration certificate'),
					itemId: 'vrcFieldset',
					collapsible: true,
					defaultType: 'textfield',
					defaults: {
						anchor: '100%',
						labelAlign: 'top'
					},
					layout: 'anchor',
					items :[{
						name: 'vin',
						fieldLabel: _('Vehicle identification number (VIN)'),
						allowBlank: true,
						minLength: 17,
						maxLength: 17
					}, {
						name: 'car_model',
						fieldLabel: _('Car model')
					}, {
						name: 'car_type',
						fieldLabel: _('Car type')
					}, {
						xtype: 'fieldcontainer',
						fieldLabel: _('Car category'),
						defaultType: 'radiofield',
						defaults: {
							flex: 0.1
						},
						layout: 'hbox',
						items: [
							{
								boxLabel: _('Not specified'),
								name: 'category',
								inputValue: 0,
								id: 'category0',
								flex: 0.2
							}, {
								boxLabel: _('A'),
								name: 'category',
								inputValue: 1,
								id: 'category1'
							}, {
								boxLabel: _('B'),
								name: 'category',
								inputValue: 2,
								id: 'category2'
							}, {
								boxLabel: _('C'),
								name: 'category',
								inputValue: 3,
								id: 'category3'
							}, {
								boxLabel: _('D'),
								name: 'category',
								inputValue: 4,
								id: 'category4'
							}, {
								boxLabel: _('Trailer'),
								name: 'category',
								inputValue: 5,
								id: 'category5',
								flex: 0.3
							}
						]
					}, {
						xtype: 'datefield',
						format: O.format.Date,
						name: 'dt_production',
						fieldLabel: _('Production date')
					}, {
						name: 'engine',
						fieldLabel: _('Engine model, №')
					}, {
						name: 'frame',
						fieldLabel: _('Frame №')
					}, {
						name: 'body',
						fieldLabel: _('Body (cab, trailer) №')
					}, {
						name: 'body_color',
						fieldLabel: _('Body color')
					}, {
						xtype: 'numberfield',
						minValue: 0,
						name: 'engine_power',
						fieldLabel: _('Engine power, hp (kW)')
					}, {
						xtype: 'combobox',
						name: 'engine_power_measure',
						fieldLabel: _('Unit of power'),
						editable: false,
						valueField: 'id',
						displayField: 'name',
						store: powerMeasure
					}, {
						xtype: 'numberfield',
						minValue: 0,
						name: 'engine_displacement',
						fieldLabel: _('Engine displacement')
					}, {
						xtype: 'combobox',
						name: 'engine_type',
						fieldLabel: _('Engine type'),
						mode: 'local',
						simpleText: true,
						forceSelection: false,
						triggerAction: 'all',
						valueField: 'engine',
						displayField: 'engine',
						store: engine
					}, {
						xtype: 'numberfield',
						minValue: 0,
						name: 'max_mass',
						fieldLabel: _('Maximum authorised mass')
					}, {
						xtype: 'numberfield',
						minValue: 0,
						name: 'unladen_mass',
						fieldLabel: _('Unladen mass')
					}]
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.driverCombobox = this.down('#driverCombobox');
		this.responsibleCombobox = this.down('#responsibleCombobox');
		this.licenseFieldset = this.down('#licenseFieldset');
	}
});
