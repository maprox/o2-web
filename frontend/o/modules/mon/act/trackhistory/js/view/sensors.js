/**
 * Track history detailed report panel
 * @class O.comp.DetailedReport
 * @extends Ext.grid.Panel
 */
C.define('O.mon.trackhistory.Sensors', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.historysensors',

	border: false,

	/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;
		// Grid configuration
		var gridConfig = {
			flex: 1
		};

		this.offCls = 'modelseditor_off';
		this.onCls = 'modelseditor_on';
		this.remCls = 'devicestabsensors_remove';

		this.conditionStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
			sorters: [{
				property: 'name',
				direction: 'ASC'
			}],
			sortOnLoad: true
		});

		// Sensor field
		/*this.sensorField = Ext.widget('combobox', {
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			editable: false,
			//editable: true,
			forceSelection: true,
			store: this.conditionStore,
			queryMode: 'local',
			triggerAction: 'all'
		});*/

		// Editor plugin
		this.editor = Ext.create('Ext.grid.plugin.RowEditing', {
			parent: this,
			clicksToEdit: 2
		});
		gridConfig.editor = this.editor;

		// List of columns
		gridConfig.columns = [{
			header: '',
			dataIndex: 'display',
			xtype: 'checkcolumn',
			itemId: 'columnDisplay',
			editor: {
				xtype: 'checkbox',
				cls: 'x-grid-checkheader-editor'
			},
			width: 50
		}, {
			header: _('Sensor'),
			dataIndex: 'name',
			flex: 2
		}, {
			header: _('Filtering condition'),
			dataIndex: 'condition',
			field: {
				xtype: 'combobox',
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				editable: false,
				forceSelection: true,
				store: this.conditionStore,
				queryMode: 'local',
				triggerAction: 'all'
			},
			renderer: function(value, meta, record) {
				// Digital
				if (record.get('is_digital')) {
					var unitParts = C.utils.parseUnit(record.get('unit'));
					if (value === '0') {
						return unitParts[1];
					} else {
						return unitParts[0];
					}
				}

				// No digital
				var newVal = value;
				Ext.Array.each(me.defaultConditions, function(c) {
					if (c.id === value) {
						newVal = c.name;
						return false;
					}
				});

				return newVal;
			}
		}, {
			header: _('Value'),
			dataIndex: 'value',
			itemId: 'value',
			field: {
				xtype: 'numberfield',
				allowBlank: true
			}
		}];

		// Sensor store
		gridConfig.store = Ext.create('Ext.data.Store', {
			fields: [
				// Hidden fields
				{name: 'id', type: 'int'},
				{name: 'id_sensor', type: 'int'},
				{name: 'unit', type: 'string'},
				{name: 'is_digital', type: 'bool'},

				// Display fields
				{name: 'display', type: 'bool'},
				{name: 'name', type: 'string'},
				{name: 'condition', type: 'string'},
				{name: 'value', type: 'string'} // number field?
			],
			data: [],
			autoLoad: false,
			sorters: [{
				property: 'name'
			}]
		});
		// Set grid store
		this.gridStore = gridConfig.store;

		gridConfig.viewConfig = {
			// disabled sensors
			getRowClass: function(record) {
				if (record.get('state') == C.cfg.RECORD_IS_TRASHED) {
					return 'is_trashed';
				}
				if (record.get('state') == C.cfg.RECORD_IS_DISABLED) {
					return 'is_disabled';
				}
			}
		};
		gridConfig.plugins = [
			gridConfig.editor
		];
		gridConfig.border = false;

		// Sensors grid
		this.sensorsGrid = Ext.create('Ext.grid.Panel', gridConfig);

		Ext.apply(this, {
			itemId: 'history_sensors',

			//layout: 'fit',

			layout: {
				type: 'vbox',
				align: 'stretch'
			},

			bodyPadding: 0,
			defaults: {
			},

			items: [
				this.sensorsGrid,
				{
					xtype: 'panel',
					itemId: 'noticePanel',
					bodyCls: 'sensors-notice-panel',
					html: '<div class="sensors-notice-panel-inner">'
						+ _('To display sensors on map' +
							' you have to select at least one track')
						+ '</div>',
					border: false,
					hidden: true
				}
			]
		});

		this.callParent(arguments);

		this.columnDisplay = this.down('#columnDisplay');
		this.noticePanel = this.down('#noticePanel');
	}
});