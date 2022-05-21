/**
 * @class O.dn.act.supplier.MailingWindow
 * @extends Ext.window.Window
 */
C.define('O.dn.act.supplier.MailingWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.dn_supplier_mailingwindow',

/**
	* @constructor
	*/
	initComponent: function() {
		var storeAlias = 'dn_supplier'
		var columns = [{
			dataIndex: 'name',
			flex: 1
		}];
		var store = C.getStore(storeAlias);
		var title = _('Suppliers');
		var supplierGrid = Ext.widget('gridpanel', {
			title: title,
			split: true,
			header: false,
			store: store,
			link: storeAlias,
			hideHeaders: true,
			selModel: {
				xtype: 'checkboxmodel',
				mode: 'MULTI'
			},
			selType: 'checkboxmodel',
			columns: columns,
			flex: 1,
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'button',
					arrowAlign: 'right',
					text: _('Select'),
					menu: [{
						text: _('All'),
						itemId: 'checkAll',
						link: storeAlias,
						iconCls: 'check-all',
						action: 'check-all'
					}, {
						text: _('None'),
						itemId: 'checkNone',
						link: storeAlias,
						iconCls: 'check-none',
						action: 'check-none'
					}]
				}, {
					xtype: 'textfield',
					itemId: 'supplierListSearch',
					action: 'search',
					enableKeyEvents: true,
					emptyText: _('Search'),
					cls: 'modelseditor_fieldsearch',
					link: storeAlias,
					flex: 1
				}]
			}]
		});
		this.supplierGrid = supplierGrid;

		var form = Ext.widget('form', {
			bodyPadding: 10,
			preventHeader: true,
			border: false,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				labelAlign: 'top',
				border: false
			},
			items: [{
				xtype: 'textfield',
				itemId: 'subjectfield',
				fieldLabel: _('Title'),
				name: 'title'
			}, {
				xtype: 'panel',
				xtype: 'htmleditor',
				itemId: 'textfield',
				fieldLabel: _('Message'),
				flex: 1,
				name: 'message'
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					xtype: 'tbfill'
				}, {
					itemId: 'btnSend',
					disabled: true,
					xtype: 'button',
					text: _('Send')
				}]
			}]
		});
		this.form = form;

		Ext.apply(this, {
			title: _('Sending message to suppliers'),
			width: 670,
			height: 400,
			border: false,
			resizable: true,
			modal: true,
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [supplierGrid, {
				xtype: 'splitter'
			}, {
				xtype: 'panel',
				layout: 'fit',
				flex: 2,
				items: [form]
			}]
		});

		var sm = supplierGrid.getSelectionModel();
		this.callParent(arguments);
	}
});