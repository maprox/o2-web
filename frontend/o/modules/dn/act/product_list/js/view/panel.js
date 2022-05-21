/**
 * @fileOverview Product list panel
 *
 * @class O.act.panel.ProductList
 * @extends C.ui.Panel
 */
C.define('O.act.panel.ProductList', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_productlist',

/**
	* Column names
	*/
	colName: 'Name',
	colFullName: 'Full name',
	colCode: 'Code',
	colNomenclatura: 'Nomenclatura',
	colNtd: 'Documentation',
	colShipmentTime: 'Max shipment time',
	colExpires: 'Expires in',
	colInUse: 'Is in use',

/**
	* Buttons
	*/
	msgCreate: 'Add new',
	msgClone: 'Copy',
	msgDelete: 'Delete',

/**
	* Messages
	*/
	msgConfirmation: 'Confirmation',
	msgAskDelete: 'Do you realy want to delete selected product?',

	searchTitle: 'Search:',

/**
	* @constructs
	*/
	initComponent: function() {
		this.createAction = Ext.create('Ext.Action', {
			iconCls: 'p-create',
			text: this.msgCreate,
			handler: Ext.bind(this.actionCreate, this)
		});

		this.cloneAction = Ext.create('Ext.Action', {
			iconCls: 'p-clone',
			text: this.msgClone,
			disabled: true,
			handler: Ext.bind(this.actionClone, this)
		});

		this.deleteAction = Ext.create('Ext.Action', {
			iconCls: 'p-delete',
			text: this.msgDelete,
			disabled: true,
			handler: Ext.bind(this.actionDelete, this)
		});

		var contextMenu = Ext.create('Ext.menu.Menu', {
			items: [
				this.createAction,
				this.cloneAction,{
					xtype: 'tbseparator'
				},
				this.deleteAction
			]
		});

		this.comboStore = C.getStore('dn_measure');
		this.comboStore.filter({
			filterFn: function(record){
				return record.get('id_base') == 0;
			}
		});

		var me = this;
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				border: false,
				xtype: 'osearchgrid',
				store: 'productInline',
				searchTitle: this.searchTitle,
				searchProperties: ["name", "fullname", "code"],
				groupButtons: [],
				toolbarAddItems: [
					this.createAction,
					this.cloneAction,
					this.deleteAction
				],

				viewConfig: {
					trackOver: false,
					listeners: {
						itemcontextmenu: function(view, rec, node, index, e) {
							e.stopEvent();
							contextMenu.showAt(e.getXY());
							return false;
						}
					}
				},
				columns: [{
					text: this.colName,
					dataIndex: 'name',
					flex: 3,
					editor: {
						allowBlank: false
					}
				}, {
					text: this.colFullName,
					dataIndex: 'fullname',
					flex: 4,
					editor: {
						allowBlank: true
					}
				}, {
					text: this.colCode,
					dataIndex: 'code',
					flex: 1,
					editor: {
						allowBlank: false
					}
				}, {
					text: this.colNomenclatura,
					dataIndex: 'id_measure',
					flex: 1,
					renderer: function(value) {
						var record = me.comboStore.getById(value);

						if (Ext.isEmpty(record)) {
							return value;
						}

						return record.get('name');
					},
					editor: {
						allowBlank: false,
						xtype: 'combo',
						store: this.comboStore,
						displayField: 'name',
						valueField: 'id',
						queryMode: 'local',
						triggerAction: 'all',
						editable: false,
						forceSelection: true
					}
				}, {
					text: this.colNtd,
					dataIndex: 'ntd',
					flex: 1,
					editor: {
						allowBlank: true
					}
				}, {
					text: this.colShipmentTime,
					dataIndex: 'shipmenttime',
					flex: 1,
					editor: {
						allowBlank: true
					}
				}, {
					text: this.colExpires,
					dataIndex: 'shelflife',
					flex: 1,
					editor: {
						allowBlank: true
					}
				}, {
					text: this.colInUse,
					dataIndex: 'used',
					xtype: 'templatecolumn',
					tpl: '{[values.used ? '+
						'"<img src='+STATIC_PATH+'/img/docsnet/no_edit.png />" : '+
						'"<img src='+STATIC_PATH+'/img/docsnet/blank.png />"]}',
					flex: 1
				}],
				selType: 'rowmodel',
				plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
					pluginId: 'editor',
					errorSummary: false,
					clicksToEdit: 2,
					autoCancel: false
				})]
			}]
		});

		this.callParent(arguments);
	}
});
