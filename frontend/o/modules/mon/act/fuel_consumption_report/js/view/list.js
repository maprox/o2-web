/**
 * @class O.mon.waylist.List
 * @extends O.common.lib.modelslist.List
 */
C.define('O.mon.fuel.consumption.report.List', {
	extend: 'O.common.lib.modelslist.RemoteList',
	alias: 'widget.mon_fuel_consumption_report_list',

/*  Configuration */
	columnLines: false,

/**
	* Inner state id postfix
	* @type {String}
	*/
	innerStateId: null,
	border: false,
	enableSearch: false,

/**
	* Rest controller name
	* @type {String}
	*/
	managerAlias: 'mon_fuel_consumption_report',

/**
	* @constructor
	*/
	constructor: function() {
		Ext.apply(this, {
			features: [{
				ftype: 'grouping',
				//hideGroupedHeader: true,
				groupHeaderTpl: '{name} ({rows.length})'
			}]
		});
		this.callParent(arguments);
	},

/**
	* @constructor
	*/
	initComponent: function() {
		this.store = C.getStore('mon_fuel_consumption_report', {
			remoteFilter: true,
			remoteSort: true,
			sorters: [{
				property: 'dt',
				direction: 'DESC'
			}],
			proxy: {
				type: 'ajax',
				url: '/mon_fuel_consumption_report',
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
			//pageSize: 3,
			autoLoad: false
		});
		// init component view
		Ext.apply(this, {
			stateful: this.stateful || true,
			stateId: 'mon-fuel-consumption-report-list-'
				+ (this.innerStateId || 'main'),
			stateEvents: ['groupchange'],
			columns: {
				defaults: {
					menuDisabled: true,
					groupable: false
				},
				items: [{
					xtype: 'datecolumn',
					header: _('Date'),
					dataIndex: 'dt',
					width: 150,
					fixed: true,
					format: 'F, Y',
					align: 'right'
				}, {
					header: _('Division'),
					dataIndex: 'id_division$name',
					menuDisabled: false,
					groupable: true,
					flex: 1
				}]
			},
			viewConfig: {
				emptyText: '<span class="emptyGrid">' +
					_('No consumption reports') + '</span>',
				getRowClass: function(record, rowIndex, p, store) {
					var cls = '';
					cls += ' row-report-status-' + record.get('status');
					return cls;
				}
			},
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: this.store,
				dock: 'bottom',
				displayInfo: true
			}]
		});
		this.callParent(arguments);

		if (this.actionToolbar) {
			// btn close
			this.actionToolbar.insert(4, {
				xtype: 'button',
				itemId: 'btnClose',
				text: _('Close'),
				iconCls: 'fcr_close'
			});

			// btn print
			this.actionToolbar.insert(5, {
				itemId: 'btnPrint',
				text: _('Print'),
				iconCls: 'print'
			});

			// btn print consolidated
			this.actionToolbar.insert(6, {
				itemId: 'btnPrCons',
				text: _('Print consolidated report'),
				iconCls: 'print'
			});
		}
		// set component access variables
		this.btnAdd.setText(_('Create consumption report'));
		this.btnClose = this.down('#btnClose');
		this.btnPrint = this.down('#btnPrint');
		this.btnPrintСonsolidated = this.down('#btnPrCons');
	}
});
