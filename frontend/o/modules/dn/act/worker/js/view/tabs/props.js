/**
 * @class O.dn.workers.tab.Props
 * @extends C.ui.Panel
 */
C.define('O.dn.workers.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.dn-workers-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			autoScroll: true,
			layout: 'anchor',
			items: [{
				border: false,
				anchor: '100%',
				height: 300,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				defaults: {
					border: false,
					bodyPadding: 10,
					layout: 'anchor',
					flex: 1
				},
				items: [{
					defaults: {
						labelAlign: 'top',
						labelWidth: 140,
						anchor: '100%',
						collapsible: true,
						xtype: 'textfield'
					},
					items: [{
						xtype: 'combobox',
						fieldLabel: _('Post'),
						name: 'id_post',
						displayField: 'name',
						valueField: 'id',
						editable: true,
						store: C.getStore('dn_worker_post', {
							sorters: [{
								property: 'name',
								direction: 'ASC'
							}],
							sortOnLoad: true
						}),
						queryMode: 'local',
						typeAhead: true
					}, {
						xtype: 'numberfield',
						fieldLabel: _('Employee number'),
						name: 'employee_number',
						width: 200
					}]
				}]
			}]
		});
		this.callParent(arguments);

		// load employee posts
		C.get('dn_worker_post');
	}
});
