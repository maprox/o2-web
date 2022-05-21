/**
 * O.mon.sim.card.List
 * @class O.mon.sim.card.List
 * @extends O.common.lib.modelslist.List
 */
C.define('O.mon.sim.card.List', {
	extend: 'O.common.lib.modelslist.List',
	alias: 'widget.mon-sim-card-list',
	itemId: 'simcardsList',
	managerAlias: 'mon_sim_card',
	model: 'Mon.Sim.Card',

	hideHeaders: false,
	border: false,
	enableSearch: true,
	enableShowDeleted: false,
	disabled: false,

/**
	* Set true to enable loading of store data after render.
	* Defaults to true
	* @type {Boolean}
	*/
	autoLoadStore: false,

/**
	* @constructs
	*/
	initComponent: function() {

		var me = this;
		this.protocolStore = C.getStore('mon_device_protocol');
		this.protocolStore.insert(0, {
			id: 0, name: _('Model is not selected')
		});

		this.providerStore = Ext.data.StoreManager.lookup('store-x_provider');

		Ext.apply(this, {
			columns: [{
				dataIndex: 'creation_date',
				xtype: 'datecolumn',
				format: O.format.Timestamp,
				text: _('Creation date'),
				flex: 1,
				field: {
					xtype: 'datefield',
					disabled: true,
					allowBlank: true,
					format: O.format.Timestamp
				}
			}, {
				dataIndex: 'account_number',
				text: _('Account number'),
				flex: 1,
				field: {
					allowBlank: true
				}
			}, {
				dataIndex: 'phone_number',
				text: _('Phone number'),
				flex: 1,
				field: {
					vtype: 'phone',
					allowBlank: true
				}
			}, {
				dataIndex: 'tariff',
				text: _('Tariff'),
				flex: 1,
				field: {
					allowBlank: true
				}
			}, {
				dataIndex: 'imei_sim',
				text: _('Sim card IMEI'),
				flex: 1,
				field: {
					allowBlank: false
				}
			}, {
				dataIndex: 'imei_tracker',
				text: _('Tracker IMEI'),
				flex: 1,
				field: {
					allowBlank: true
				}
			}, {
				dataIndex: 'id_device_protocol',
				text: _('Tracker model'),
				flex: 1,
				renderer: function(value) {
					var record = me.protocolStore.getById(value);

					if (Ext.isEmpty(record)) {
						return value;
					}

					return record.get('name');
				},
				editor: {
					xtype: 'combo',
					store: this.protocolStore,
					triggerAction: 'all',
					lastQuery: '',
					valueField: 'id',
					displayField: 'name',
					queryMode: 'local',
					editable: false,
					forceSelection: true
				}
			}, {
				dataIndex: 'provider',
				text: _('Mobile network operator'),
				flex: 1,
				renderer: function(value) {
					var record = me.providerStore.getById(value);

					if (Ext.isEmpty(record)) {
						return value;
					}

					return record.get('name');
				},
				editor: {
					xtype: 'combo',
					store: 'store-x_provider',
					triggerAction: 'all',
					lastQuery: '',
					valueField: 'id',
					displayField: 'name',
					queryMode: 'local',
					editable: false,
					forceSelection: true
				}
			}, {
				dataIndex: 'connection_date',
				xtype: 'datecolumn',
				format: O.format.Timestamp,
				text: _('Connection date'),
				flex: 1,
				field: {
					xtype: 'datefield',
					disabled: true,
					allowBlank: true,
					format: O.format.Timestamp
				}
			}, {
				dataIndex: 'x_company.name',
				text: _('Client'),
				flex: 1,
				field: {
					disabled: true,
					allowBlank: true
				}
			}, {
				dataIndex: 'settings_key',
				text: _('Settings key'),
				flex: 1,
				field: {
					disabled: true,
					allowBlank: true
				}
			}, {
				dataIndex: 'note',
				text: _('Note'),
				flex: 1,
				field: {
					allowBlank: true
				}
			}]
		});

		this.store = C.getStore('mon_sim_card', {
			remoteFilter: true,
			remoteSort: true,
			sorters: [{
				property: 'id',
				direction: 'DESC'
			}],
			proxy: {
				type: 'ajax',
				url: '/mon_sim_card',
				isRest: true,
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'count'
				},
				extraParams: {
					'$joined': 1,
					'$showtotalcount': 1
				}
			},
			pageSize: 50,
			autoLoad: false,
			preventInitialLoad: true
		});

		this.callParent(arguments);
	},

/**
	* Docked items initialization
	* @protected
	*/
	initDockedItems: function() {
		this.callParent(arguments);
		// Add paging toolbar
		this.dockedItems.push({
			xtype: 'pagingtoolbar',
			store: this.store,
			dock: 'bottom',
			displayInfo: true/*,
			doRefresh: function() {
				var me = this,
					current = me.store.currentPage;

				if (me.fireEvent('beforechange', me, current) !== false) {
					me.store.loadPage(current);
				}
			}*/
		});
	},

	/**
	 * Returns toolbar buttons configuration
	 * @return {Array}
	 */
	getToolbarButtons: function() {
		return [{
			itemId: 'btnAdd',
			text: _('Add'),
			iconCls: 'btn-create'
		}, {
			itemId: 'btnEdit',
			text: _('Edit'),
			iconCls: 'modelseditor_edit'
		}, {
			itemId: 'btnCopy',
			text: _('Copy'),
			iconCls: 'modelseditor_copy'
		}, {
			itemId: 'btnOnOff',
			text: _('Disable'),
			iconCls: 'modelseditor_off'
		}, {
			itemId: 'btnSendSettings',
			text: _('Configure by SMS'),
			disabled: true,
			iconCls: 'btn-sms-configure'
		}, {
			xtype: 'tbfill'
		}, {
			itemId: 'btnRemove',
			text: _('Remove'),
			iconCls: 'btn-delete'
		}];
	}
});