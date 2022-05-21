/**
 * Класс панели настроек карты
 * @class O.comp.settings.personal.Map
 * @extends O.comp.SettingsPanel
 */

C.define('O.comp.settings.map.Base', {
	extend: 'O.comp.SettingsPanel',
	itemId: 'map',

	title: 'Map',
	tabTip: 'Editing of map settings',
	msgDeviceBase: 'Device draw settings',
	msgDeviceLabels: 'Device label settings',
	msgLabelPosition: 'Device label position',
	msgLabelRow1: 'Device label first row',
	msgLabelRow2: 'Device label second row',
	msgLabelRow3: 'Device label third row',
	msgDeviceHistory: 'Device history settings',
	msgEventsPeriod: 'Show events for last',

	initComponent: function() {
		var propStore = Ext.data.StoreManager.lookup('devicePropsStore');
		//Загружаем свойства датчиков
		propStore.add(C.get('props').getRange());
		Ext.apply(this, {
			layout: {
				type: 'anchor'
			},
			defaults: {
				width: 500,
				collapsible: true
			},
			items: [{
				xtype: 'fieldset',
				title: this.msgDeviceBase,
				defaults: {
					//labelWidth: 100,
					anchor: '100%',
					labelAlign: 'top',
					allowBlank: false
				},
				items: [{
					xtype: 'numberfield',
					minValue: 0,
					name: 'p.pointscount',
					itemId: 'p.pointscount',
					fieldLabel: _('Maximum points count on device last track')
				}, {
					name: 'p.eventsperiodlength',
					itemId: 'p.eventsperiodlength',
					fieldLabel: this.msgEventsPeriod,
					xtype: 'combo',
					queryMode: 'local',
					store: Ext.data.StoreManager.lookup('eventsPeriodsStore'),
					displayField: 'text',
					valueField: 'value',
					editable: false,
					triggerAction: 'all'
				}]
			}, {
				xtype: 'fieldset',
				itemId: 'labelSet',
				title: this.msgDeviceLabels,
				defaults: {
					labelWidth: 100,
					anchor: '100%'
				},
				items: [{
					xtype: 'combo',
					queryMode: 'local',
					store: Ext.data.StoreManager.lookup('deviceLabelPositionsStore'),
					displayField: 'position',
					valueField: 'id',
					name: 'p.labelpos',
					editable: false,
					fieldLabel: this.msgLabelPosition,
					allowBlank: false,
					triggerAction: 'all'
				}, {
					xtype: 'iconcombo',
					queryMode: 'local',
					store: propStore,
					displayField: 'name',
					valueField: 'id',
					name: 'p.labelrow1',
					editable: false,
					fieldLabel: this.msgLabelRow1,
					allowBlank: false,
					triggerAction: 'all'
				}, {
					xtype: 'iconcombo',
					queryMode: 'local',
					store: propStore,
					displayField: 'name',
					valueField: 'id',
					name: 'p.labelrow2',
					editable: false,
					fieldLabel: this.msgLabelRow2,
					allowBlank: false,
					triggerAction: 'all'
				}, {
					xtype: 'iconcombo',
					queryMode: 'local',
					store: propStore,
					displayField: 'name',
					valueField: 'id',
					name: 'p.labelrow3',
					editable: false,
					fieldLabel: this.msgLabelRow3,
					allowBlank: false,
					triggerAction: 'all'
				}]
			}]
		});
		this.callParent(arguments);
	}
});

Ext.data.StoreMgr.add('map.base', {
	type: O.comp.settings.map.Base,
	accessible: function() {
		return C.userHasRight('module_map');
	}
});
