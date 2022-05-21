/**
 *
 * @class O.dn.act.pricerequest.List
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.List', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequests_list',

/**
	* Column names
	*/
	colNum: '№',
	colDateStart: 'Creation date',
	colDateEnd: 'End date',
	colStatus: 'Status',

/**
	* Button names
	*/
	msgCreate: 'Create',
	msgDelete: 'Delete',
	msgAccept: 'Accept',

/**
	* Confirmation alert
	*/
	msgAskDelete: 'Do you realy want to delete selected tender?',
	msgAskAccept: 'Do you really want to approve selected tender?',
	msgAlertNoDate: 'You can\'t approve a tender, without setting its date',
	msgAlertOldDate: 'You can\'t approve a tender, with end date less then today',

/**
	* Component initialization
	*/
	initComponent: function() {

		this.createAction = Ext.create('Ext.Action', {
			iconCls: 'a-create',
			text: this.msgCreate,
			handler: Ext.bind(this.actionCreate, this)
		});

		this.acceptAction = Ext.create('Ext.Action', {
			iconCls: 'a-accept',
			text: this.msgAccept,
			disabled: true,
			handler: Ext.bind(this.actionAccept, this)
		});

		this.deleteAction = Ext.create('Ext.Action', {
			iconCls: 'a-delete',
			text: this.msgDelete,
			disabled: true,
			handler: Ext.bind(this.actionDelete, this)
		});

		var contextMenu = Ext.create('Ext.menu.Menu', {
			items: [
				this.createAction,
				this.acceptAction, {
					xtype: 'tbseparator'
				},
				this.deleteAction
			]
		});

		var utcval = C.getSetting('p.utc_value');

		Ext.apply(this, {
			layout: 'fit',
			title: _('Tenders list'),
			items: [{
				xtype: 'grid',
				store: 'pricesrequests',
				viewConfig: {
					trackOver: false,
					listeners: {
						itemcontextmenu: function(view, rec, node, index, e) {
							e.stopEvent();
							contextMenu.showAt(e.getXY());
							return false;
						}
					},
					getRowClass: function(record) {
						var now = new Date().pg_utc(utcval, true);
						var edt = record.get('edt');
						if (edt && (edt < now)) {
							return 'request_expired';
						}
						return 'request_actual';
					}
				},
				columns: [{
					text: this.colNum,
					align: 'right',
					xtype: 'numbercolumn',
					dataIndex: 'num',
					format: '0,000',
					flex: 1
				}, {
					text: this.colDateStart,
					xtype: 'datecolumn',
					dataIndex: 'sdt',
					width: 160,
					sortable: true,
					renderer: function(value) {
						if (value) {
							return Ext.Date.format(value.pg_utc(utcval),
								O.format.Date + ' ' + O.format.TimeShort);
						}
						return value;
					},
					editor: {
						xtype: 'datetime',
						format: O.format.Date,
						allowBlank: false
					}
				}, {
					text: this.colDateEnd,
					xtype: 'datecolumn',
					dataIndex: 'edt',
					width: 160,
					sortable: true,
					renderer: function(value) {
						if (value) {
							return Ext.Date.format(value.pg_utc(utcval),
								O.format.Date + ' ' + O.format.TimeShort);
						}
						return value;
					},
					editor: {
						xtype: 'datetime',
						format: O.format.Date,
						allowBlank: false
					}
				}, {
					text: this.colStatus,
					dataIndex: 'status',
					xtype: 'templatecolumn',
					tpl: '<img src="' + STATIC_PATH + '/img/docsnet/price-' +
						'{[values.status > 1 ? "sent" : "new"]}' +
						'.png" class="grid-status" />',
					flex: 1,
					sortable: true
				}],
				selType: 'rowmodel',
				plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
					pluginId: 'editor',
					clicksToEdit: 2
				})],
				dockedItems: [{
					xtype: 'toolbar',
					items: [
						this.createAction,
						this.acceptAction,
						this.deleteAction
					]
				}]
			}]
		});

		this.callParent(arguments);
	}

});
