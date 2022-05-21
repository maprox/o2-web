/**
 * @class O.dn.lib.warehouse.EditorWindow
 * @extends O.common.lib.modelslist.EditorWindow
 */
C.define('O.dn.lib.warehouse.EditorWindow', {
	extend: 'O.common.lib.modelslist.EditorWindow',
	alias: 'widget.dn-warehouse-editorwindow',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Warehouse editor'),
			panelConfig: {
				xtype: 'dn-lib-warehouse-tabs',
				tabsAliases: [
					'dn-warehouse-tab-props',
					'dn-warehouse-tab-map'
				]
			},
			model: 'Dn.Warehouse',
			managerAlias: 'dn_warehouse'
		});
		this.callParent(arguments);
	}
});