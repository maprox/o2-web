/**
 * @class O.common.lib.shareaccess.tab.Acces
 * @extends O.common.lib.modelslist.Tab
 */

Ext.define('O.common.lib.shareaccess.tab.Access', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.common-lib-shareacces-tab-access',

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		// x_access store
		this.accessStore = Ext.create('Ext.data.Store', {
			model: 'X.Access',
			sorters: [{
				//property: 'edt',
				//direction: 'DESC'
				sorterFn: function(o1, o2) {
					if (o1.get('edt') === o2.get('edt')) {
						return 0;
					}

					if (o1.get('edt') == null) {
						return -1;
					}

					if (o2.get('edt') == null) {
						return 1;
					}

					if (o1.get('edt') > o2.get('edt')) {
						return -1;
					} else {
						return 1;
					}
				}
			}],
			filters: [
				function(item) {
					return item.get('id_firm') > 0;
				}
			]
		});

		var utcval = C.getSetting('p.utc_value');
		Ext.apply(this, {
			title: _('Access'),
			itemId: 'access',
			layout: 'fit',
			bodyPadding: 0,
			defaults: {
			},
			items: [{
				xtype: 'grid',
				itemId: 'accessGrid',
				store: this.accessStore,
				border: false,
				selType: 'rowmodel',
				viewConfig: {
					getRowClass: function(record) {
						if (me.isAccessExpired(record)) {
							return 'access_expired';
						}
						return 'access_actual';
					}
				},
				columns: [{
					header: _('Firm'),
					dataIndex: 'id_firm',
					hidden: true,
					flex: 2
				}, {
					header: _('Firm'),
					dataIndex: 'firm_name',
					flex: 2
				}, {
					header: _('Full access'),
					dataIndex: 'writeable',
					xtype: 'checkcolumn',
					itemId: 'columnWriteable',
					flex: 1,
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
					//renderer: function(value) {
					//	return value ? _('Yes') : _('No')
					//}
				}, {
					header: _('Start'),
					xtype: 'datecolumn',
					dataIndex: 'sdt',
					flex: 2,
					renderer: function(value) {
						if (value) {
							return Ext.Date.format(value.pg_utc(utcval),
								O.format.Date + ' ' + O.format.TimeShort);
						}
						return value;
					},
					editor: {
						xtype: 'datetime',
						format: O.format.Timestamp,
						allowBlank: false,
						dateCfg: {
							flex: 2
						},
						timeCfg: {
							flex: 1
						}
					}
				}, {
					header: _('End'),
					xtype: 'datecolumn',
					dataIndex: 'edt',
					flex: 2,
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
						allowBlank: false,
						dateCfg: {
							flex: 2
						},
						timeCfg: {
							flex: 1
						}
					}
				}, {
					header: _('Status'),
					dataIndex: 'status',
					flex: 2,
					renderer: function(value) {
						if (value === C.cfg.STATUS_ACTIVE) {
							return _('Confirmed');
						}

						if (value == C.cfg.STATUS_PENDING) {
							return _('Awaiting approval');
						}

						if (value == C.cfg.STATUS_REJECTED) {
							return _('Rejected');
						}

						return _('Awaiting approval');
					}
				}],
				plugins: [{
					ptype: 'rowediting',
					pluginId: 'editor',
					clicksToEdit: 2
				}]
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				items: [{
					xtype: 'button',
					itemId: 'btnGrant',
					text: _('Grant access'),
					iconCls: 'add_btn'
				}, {
					xtype: 'button',
					itemId: 'btnRevoke',
					text: _('Revoke access'),
					iconCls: 'remove_btn',
					disabled: true
				}, {
					xtype: 'button',
					itemId: 'btnTransfer',
					text: _('Transfer'),
					iconCls: 'transfer_btn',
					hidden: !C.userHasRight('transfer_object'),
					disabled: false
				}, {
					xtype: 'tbfill'
				}, {
					xtype: 'button',
					itemId: 'btnShowClosed',
					text: _('Show closed'),
					iconCls: 'btn_show_closed',
					enableToggle: true,
					stateful: true,
					stateId: 'access_btnshowdisabled',
					stateEvents: ['toggle'],
					getState: function() {
						return {
							pressed: this.pressed
						}
					}
				}]
			}]
		});

		this.callParent(arguments);
	}
});
