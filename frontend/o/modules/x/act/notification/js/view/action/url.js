/**
 * @class .x.notification.action.Url
 * @extends O.x.notification.action.AbstractList
 */
Ext.define('O.x.notification.action.Url', {
	extend: 'O.x.notification.action.Abstract',
	alias: 'widget.x-notification-action-url',

/**
	* @constructor
	*/
	initComponent: function() {
		// Method store
		this.methodStore = Ext.create('Ext.data.Store', {
			fields: ['name'],
			sorters: [{
				property: 'name',
				direction: 'ASC'
			}],
			data: [{
				name: 'POST'
			}, {
				name: 'GET'
			}],
			sortOnLoad: true
		});

		Ext.apply(this, {
			title: _('Request URL'),
			actionType: 10,
			height: 500,
			layout: 'border',
			items: [{
				region:'west',
				xtype: 'common-lib-modelslist-list',
				itemId: 'list-url',
				model: 'O.x.notification.model.Url',
				hideHeaders: false,
				showEditButton: true,
				enableShowDeleted: false,
				enableSearch: false,
				vtype: this.vtype || '',
				width: 300,
				split: true,
				columns: {
					defaults: {
						menuDisabled: true,
						flex: 1
					},
					items: [{
						header: _('URL'),
						dataIndex: 'url',
						editor: {
							allowBlank: false
						}
					}, {
						header: _('Method'),
						dataIndex: 'method',
						editor: {
							xtype: 'combobox',
							store: this.methodStore,
							displayField: 'name',
							valueField: 'name',
							queryMode: 'local',
							editable: false,
							allowBlank: false
						}
					}]
				}
			}, {
				region: 'center',
				xtype: 'common-lib-modelslist-list',
				disabled: true,
				itemId: 'list-param',
				model: 'O.x.notification.model.UrlParam',
				hideHeaders: false,
				showEditButton: true,
				enableShowDeleted: false,
				enableSearch: false,
				vtype: this.vtype || '',
				//width: 300,
				flex: 1,
				split: true,
				columns: {
					defaults: {
						menuDisabled: true,
						flex: 1
					},
					items: [{
						header: _('Parameter'),
						dataIndex: 'param',
						editor: {
							allowBlank: false
						}
					}, {
						header: _('Value'),
						dataIndex: 'value',
						editor: {
							allowBlank: false
						}
					}]
				}
			}]
		});
		this.callParent(arguments);

		// init variables
		this.listUrl = this.down('#list-url');
		this.listParam = this.down('#list-param');
	}
});