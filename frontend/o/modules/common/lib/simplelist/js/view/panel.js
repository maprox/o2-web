/**
 * Simple edit grid with one column
 * @class O.common.lib.SimpleList
 * @extends Ext.grid.Panel
 */
C.define('O.common.lib.SimpleList', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.common-simplelist',

	autoScroll: true,
	hideHeaders: true,
	multiSelect: true,

/**
	* @constructor
	*/
	initComponent: function() {
		this.editor = Ext.PluginManager.create({
			ptype: 'rowediting',
			clicksToEdit: 2
		});

		if (!this.store) {
			this.prop = 'value';
			this.store = Ext.create('Ext.data.Store', {
				fields: [
					{name: this.prop, type: 'string'}
				],
				proxy: {
					type: 'memory'
				}
			});
		}

		Ext.apply(this, {
			columns: [{
				dataIndex: this.prop,
				field: {
					allowBlank: false,
					vtype: this.vtype || ''
				}
			}],
			plugins: [this.editor],
			viewConfig: {
				emptyText: '<span class="emptyGrid">' +
					_('No data') +
				'</span>'
			},
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
					iconCls: 'list_add'
				}, {
					itemId: 'btnCopy',
					text: _('Copy'),
					iconCls: 'list_copy'
				}, {
					xtype: 'tbseparator'
				}, {
					itemId: 'btnEdit',
					text: _('Edit'),
					iconCls: 'list_edit'
				}, {
					xtype: 'tbfill'
				}, {
					itemId: 'btnRemove',
					text: _('Remove'),
					iconCls: 'list_remove'
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.btnAdd = this.down('#btnAdd');
		this.btnCopy = this.down('#btnCopy');
		this.btnEdit = this.down('#btnEdit');
		this.btnRemove = this.down('#btnRemove');
	}
});
