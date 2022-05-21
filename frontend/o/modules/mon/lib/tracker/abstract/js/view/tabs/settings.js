/**
 * @class O.mon.lib.tracker.abstract.tab.Settings
 * @extends O.mon.lib.tracker.abstract.tab.Abstract
 */

Ext.define('O.mon.lib.tracker.abstract.tab.Settings', {
	extend: 'O.mon.lib.tracker.abstract.tab.Abstract',
	alias: 'widget.mon-lib-tracker-abstract-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {

		// stores' config
		var config = {
			fields: ['id', 'name'],
			sorters: [{
				sorterFn: function(o1, o2){
					return !o1.get('id') || (o1.get('name') < o2.get('name')) ?
						-1 : 1;
				}
			}],
			sortOnLoad: true
		};

		// Ignition store
		this.ignitionStore = Ext.create('Ext.data.Store', C.utils.copy(config));

		var monthData = [];
		Ext.each(Ext.Date.monthNames, function(name, value){
			monthData.push({value: value + 1, name: name});
		});
		monthData = Ext.create('Ext.data.Store', {
			fields: ['value', 'name'],
			data : monthData
		});

		this.sensorStore = Ext.create('Ext.data.Store', C.utils.copy(config));
		this.momentaryStore = Ext.create('Ext.data.Store', C.utils.copy(config));
		this.absoluteStore = Ext.create('Ext.data.Store', C.utils.copy(config));

		var padding = 10;
		Ext.apply(this, {
			title: _('Settings'),
			layout: 'anchor',
			defaults: {
				anchor: '100%'
			},
			items: [{
				xtype: 'combobox',
				name: 'common.ignition',
				itemId: 'ignition',
				labelWidth: 150,
				maxWidth: 400,
				fieldLabel: _('Ignition sensor'),
				store: this.ignitionStore,
				displayField: 'name',
				valueField: 'id',
				editable: false,
				emptyText: _('Not defined'),
				queryMode: 'local'
			}, {
				xtype: 'tbspacer',
				height: padding
			}, {
				xtype: 'fieldset',
				title: _('Fuel Expense'),
				items: [{
					xtype: 'container',
					anchor: '100%',
					layout: 'column',
					items: [{
						xtype: 'container',
						columnWidth:.5,
						layout: 'anchor',
						defaults: {
							xtype: 'numberfield',
							labelWidth: 250,
							minValue: 0,
							anchor:'95%',
							maxWidth: 400
						},
						items: [{
							fieldLabel: _('Summer fuel expense') +
								', ' + _('l/100km'),
							name: 'common.fuel_expense_summer'
						}, {
							fieldLabel: _('Winter fuel expense') +
								', ' + _('l/100km'),
							name: 'common.fuel_expense_winter'
						}, {
							fieldLabel: _('Summer fuel expense per hour') +
								', ' + _('l/hour'),
							name: 'common.fuel_expense_per_hour_summer'
						}, {
							fieldLabel: _('Winter fuel expense per hour') +
								', ' + _('l/hour'),
							name: 'common.fuel_expense_per_hour_winter'
						}]
					}, {
						xtype: 'container',
						columnWidth:.3,
						layout: 'anchor',
						defaults: {
							xtype: 'numberfield',
							labelWidth: 150,
							value: 1,
							minValue: 1,
							maxValue: 31,
							anchor:'95%'
						},
						items: [{
							fieldLabel: _('Winter period from'),
							name: 'common.fuel_winter_from_day',
							itemId: 'fromDay'
						}, {
							fieldLabel: _('to'),
							name: 'common.fuel_winter_to_day',
							itemId: 'toDay'
						}]
					}, {
						xtype: 'container',
						columnWidth:.2,
						layout: 'anchor',
						defaults: {
							xtype: 'combobox',
							hideLabel: true,
							store: monthData,
							valueField: 'value',
							displayField: 'name',
							value: 1,
							forceSelection: true,
							editable: false,
							anchor:'95%',
							queryMode: 'local',
							maxWidth: 120
						},
						items: [{
							name: 'common.fuel_winter_from_month',
							itemId: 'fromMonth'
						}, {
							name: 'common.fuel_winter_to_month',
							itemId: 'toMonth'
						}]
					}]
				}]
			}, {
				xtype: 'container',
				layout: 'hbox',
				defaults: {
					xtype: 'fieldset',
					flex: 1
				},
				items: [{
					title: _('Fuel tank 1'),
					defaults: {
						xtype: 'numberfield',
						labelWidth: 220,
						decimalPrecision: 1,
						anchor: '100%',
						maxWidth: 400
					},
					items: [{
						xtype: 'combobox',
						fieldLabel: _('Fuel level sensor'),
						name: 'common.fuel_level_sensor',
						store: this.sensorStore,
						itemId: 'fuelLevelSensorTank1',
						labelWidth: 150,
						valueField: 'id',
						displayField: 'name',
						editable: false,
						queryMode: 'local',
						emptyText: _('Not defined'),
						forceSelection: true
					}, {
						fieldLabel: _('Minimum refuel volume') + ', ' + _('l'),
						name: 'common.minimal_refuel'
					}, {
						fieldLabel: _('Minimum drain volume') + ', ' + _('l'),
						name: 'common.minimal_drain'
					}]
				}, {
					xtype: 'tbspacer',
					width: padding,
					flex: null
				}, {
					title: _('Fuel tank 2'),
					defaults: {
						xtype: 'numberfield',
						labelWidth: 220,
						decimalPrecision: 1,
						anchor: '100%',
						maxWidth: 400
					},
					items: [{
						xtype: 'combobox',
						fieldLabel: _('Fuel level sensor'),
						name: 'common.fuel_level_sensor_tank2',
						store: this.sensorStore,
						itemId: 'fuelLevelSensorTank2',
						labelWidth: 150,
						valueField: 'id',
						displayField: 'name',
						editable: false,
						queryMode: 'local',
						emptyText: _('Not defined'),
						forceSelection: true
					}, {
						fieldLabel: _('Minimum refuel volume') + ', ' + _('l'),
						name: 'common.minimal_refuel_tank2'
					}, {
						fieldLabel: _('Minimum drain volume') + ', ' + _('l'),
						name: 'common.minimal_drain_tank2'
					}]
				}]
			}]
		});

		/*, {
				fieldLabel: _('Fuel momentary consumption sensor'),
				store: this.momentaryStore,
				name: 'common.fuel_momentary_consumption_sensor',
				itemId: 'momentarySensor'
			}, {
				fieldLabel: _('Fuel absolute consumption sensor'),
				store: this.absoluteStore,
				name: 'common.fuel_absolute_consumption_sensor',
				itemId: 'absoluteSensor'
			}*/


		this.callParent(arguments);

		this.fromMonthField = this.down('#fromMonth');
		this.fromDayField = this.down('#fromDay');
		this.toMonthField = this.down('#toMonth');
		this.toDayField = this.down('#toDay');
		this.fuelLevelSensorTank1Field = this.down('#fuelLevelSensorTank1');
		this.fuelLevelSensorTank2Field = this.down('#fuelLevelSensorTank2');
		//this.momentarySensorField = this.down('#momentarySensor');
		//this.absoluteSensorField = this.down('#absoluteSensor');
		this.fieldIgnition = this.down('#ignition');
	}
});