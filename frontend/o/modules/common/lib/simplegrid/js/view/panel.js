/**
 * Simple edit grid
 * @class O.common.lib.SimpleGrid
 * @extends Ext.grid.Panel
 */
C.define('O.common.lib.SimpleGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.common-simplegrid',

/**
	* @constructor
	*/
	initComponent: function() {
		// Note store
		this.noteStore = Ext.create('Ext.data.Store', {
			fields: ['note'],
			data: [
				{"note": _('Work')},
				{"note": _('Home')}
			],
			idIndex: 0
		});

		this.editor = Ext.PluginManager.create({
			ptype: 'rowediting',
			clicksToEdit: 2,
			noEdit: false
		});

		Ext.apply(this, {
			itemId: this.alias + 'Grid',
			flex: 1,
			store: Ext.create('Ext.data.Store', {
				fields: [
					{name: 'note', type: 'string', defaultValue: ''},
					{name: this.prop, type: 'string'},
					{name: 'isprimary', type: 'int', defaultValue: false}
				],
				proxy: {
					type: 'memory'
				}
			}),
			hideHeaders: true,
			multiSelect: true,
			height: 200,
			autoScroll: true,
			viewConfig: {
				getRowClass: function(record) {
					return record.get('isprimary') == 1 ? 'row-primary' : '';
				}
			},
			columns: [{
				dataIndex: 'note',
				flex: 3,
				editor: {
					xtype: 'combo',
					store: this.noteStore,
					displayField: 'note',
					valueField: 'note',
					mode: 'local',
					simpleText: true,
					triggerAction: 'all',
					forceSelection: false
				}
			}, {
				dataIndex: this.prop,
				flex: 4,
				field: {
					allowBlank: false,
					vtype: this.vtype || ''
				}
			}, {
				flex: 2,
				renderer: function(value, meta, record) {
					if (record.get('isprimary') === 1) {
						return _('Primary');
					}
					return '';
				}
			}],
			plugins: [this.editor],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				defaults: {
					xtype: 'button'
				},
				items: [{
					itemId: 'btnAdd',
					text: _('Add'),
					iconCls: 'add_btn'
				}, {
					itemId: 'btnMakePrimary',
					text: _('Make primary'),
					iconCls: 'finish_btn',
					disabled: true
				}, {
					xtype: 'tbfill'
				}, {
					itemId: 'btnRemove',
					text: _('Remove'),
					iconCls: 'remove_btn',
					disabled: true
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.btnAdd = this.down('#btnAdd');
		this.btnRemove = this.down('#btnRemove');
		this.btnMakePrimary = this.down('#btnMakePrimary');
	}
});
