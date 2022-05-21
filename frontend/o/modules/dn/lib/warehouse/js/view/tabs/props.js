/**
 * @class O.dn.lib.warehouse.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.dn.lib.warehouse.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.dn-warehouse-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		this.regionStore = C.getStore('dn_region');
		this.regionStore.sort([
			{property : 'important', direction: 'DESC'},
			{property : 'name',      direction: 'ASC'}
		]);
		// init component view
		var padding = 10; // default field padding
		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			iconCls: 'dn-warehouse-props',
			autoScroll: true,
			layout: 'anchor',
			items: [{
				border: false,
				height: 250,
				anchor: '100%',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				defaults: {
					// xtype: 'fieldcontainer' has a bug while rendering
					// when this panel is not visible
					xtype: 'panel',
					//autoScroll: true,
					border: false,
					flex: 1,
					bodyPadding: padding,
					layout: 'anchor',
					defaults: {
						labelAlign: 'top',
						anchor: '100%'
					}
				},
				items: [{
					items: [{
						xtype: 'textfield',
						fieldLabel: _('Name'),
						allowBlank: false,
						name: 'name'
					}, {
						xtype: 'combobox',
						fieldLabel: _('Region'),
						name: 'id_region',
						store: this.regionStore,
						forceSelection: true,
						queryMode: 'local',
						displayField: 'name',
						valueField: 'id',
						editable: false
					}, {
						xtype: 'textarea',
						fieldLabel: _('Address'),
						name: 'address'
					}, {
						xtype: 'button',
						itemId: 'btnFindOnMap',
						text: _('Find on map'),
						anchor: null,
						width: 100
					}]
				}, {
					items: [{
						xtype: 'textarea',
						fieldLabel: _('Note'),
						height: 150,
						name: 'note'
					}, {
						xtype: 'checkbox',
						labelAlign: 'left',
						boxLabel: _('Is distributed'),
						name: 'distributed'
					}]
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		var form = this.getForm();
		this.fieldAddress = form.findField('address');
		this.fieldDistributed = form.findField('distributed');
		this.btnFindOnMap = this.down('#btnFindOnMap');
	}
});
