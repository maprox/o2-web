/**
 * @class O.dn.worker_post.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.dn.worker_post.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.dn-worker-post-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		var postStore = C.getStore('dn_worker_post');
		postStore.insert(0, {id: 0, name: _('No superior')});

		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			bodyPadding: 10,
			layout: 'anchor',
			autoScroll: true,
			defaultType: 'textfield',
			items: [{
				xtype: 'panel',
				border: false,
				defaults: {
					xtype: 'textfield',
					labelAlign: 'top',
					width: 400
				},
				items: [{
					name: 'name',
					fieldLabel: _('Name'),
					allowBlank: false
				}, {
					xtype: 'combobox',
					name: 'id_superior',
					fieldLabel: _('Superior'),
					allowBlank: true,
					editable: false,
					valueField: 'id',
					displayField: 'name',
					store: postStore,
					queryMode: 'local'
				}, {
					xtype: 'fieldset',
					id: 'specCheckboxes',
					title: _('Specialization'),
					labelAlign: 'left',
					layout: 'hbox',
					anchor: null,
					width: 300,
					defaults: {
						xtype: 'checkbox',
						flex: 1,
						inputValue: '1',
						uncheckedValue: '0'
					},
					items: [{
						boxLabel: _('Driver'),
						name: 'spec_driver'
					}, {
						boxLabel: _('Engineer'),
						name: 'spec_engineer'
					}, {
						boxLabel: _('Dispatcher'),
						name: 'spec_dispatcher'
					}]
				}]
			}]
		});
		this.callParent(arguments);
		this.specCheckboxes= this.down('#specCheckboxes');
	}
});
