/**
 * Billing history panel
 * @class O.lib.billing.tab.History
 * @extends Ext.panel.Panel
 */
C.define('O.lib.billing.tab.History', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-billing-tab-history',
	itemId: 'history',

/**
	* @constructor
	*/
	initComponent: function() {
		this.gridStore = Ext.create('storeBillingHistory');
		Ext.apply(this, {
			title: _('History'),
			iconCls: 'billing_history',
			layout: 'fit',
			items: [{
				xtype: 'gridpanel',
				store: this.gridStore,
				border: false,
				columnLines: false,
				columns: [{
					header: _('Date'),
					dataIndex: 'dt',
					width: 150,
					fixed: true,
					renderer: Ext.util.Format.localTimestamp
				}, {
					header: _('TID'),
					dataIndex: 'id',
					align: 'right',
					tooltip: _('Unique transaction identifier'),
					width: 80,
					fixed: true
				}, {
					header: _('Operation'),
					dataIndex: 'operation',
					align: 'center',
					tdCls: 'operation',
					width: 80,
					sortable: false,
					menuDisabled: true,
					fixed: true
				}, {
					header: _('Sum'),
					dataIndex: 'sum',
					align: 'right',
					renderer: Ext.util.Format.ruMoney,
					flex: 1
				}, {
					header: _('VAT'),
					dataIndex: 'vat',
					align: 'right',
					width: 40,
					sortable: false,
					menuDisabled: true,
					fixed: true
				}, {
					header: _('Note'),
					dataIndex: 'note',
					flex: 3
				}, {
					header: _('Balance'),
					dataIndex: 'balance',
					align: 'right',
					renderer: Ext.util.Format.ruMoney,
					flex: 1
				}],
				viewConfig: {
					emptyText: '<span class="emptyGrid">' +
						_('No billing history yet') + '</span>',
					getRowClass: function(record, rowIndex, p, store) {
						var sum = record.get('sum');
						if (sum < 0) {
							return 'debit';
						} else if (sum > 0) {
							return 'refill';
						} else {
							return 'actions';
						}
					}
				},
				plugins: [{
					ptype: 'headertooltip'
				}, {
					ptype: 'o-rowexpander',
					expandOnDblClick: false,
					//hideExpanderIcon: true,
					expandOnClick: true,
					/**
					 * Function that determines the need to expand the row
					 * @return Boolean true if expandable
					 */
					expandable: function(record) {
						return !Ext.isEmpty(record.get('details'));
					},
					// Row body template
					rowBodyTpl: new Ext.XTemplate(
						'<p style="text-align:left">',
							_('Debit date'),
							 ': <b>{[this.fmtDate(values.debitdt)]}</b><br/>',
							_('Total'),
							 ': <b>{[this.totalDebit(values)]}</b>',
						'</p>',
						'<table class="billinghistorydetails">',
						'<tr class="header">',
						  '<th class="t">{[_("Fee")]}</th>',
						  '<th class="t">{[_("Note")]}</th>',
						  '<th class="c">{[_("Total count")]}</th>',
						  '<th class="c">{[_("Payed count")]}</th>',
						  '<th class="m">{[_("Cost")]}</th>',
						  '<th class="m">{[_("Total")]}</th>',
						'</tr>',

						'<tpl for="details">',
						'<tr class="detail">',
						  '<td class="t">{[_(values.feename)]}</td>',
						  '<td class="t">{[_(values.note)]}</td>',
						  '<td class="c">{feecount}</td>',
						  '<td class="c">{payedcount}</td>',
						  '<td class="m">{[this.fmtMoney(values.cost)]}</td>',
						  '<td class="m">{[this.totalDetail(values)]}</td>',
						'</tr>',
						'</tpl>',

						'<tr class="total">',
						  '<td class="t" colspan="5">',
								'{[_("Total")]}',
						  '</td>',
						  '<td class="m">{[this.totalDebit(values)]}</td>',
						'</tr>',
						'</table>',
						{
							/**
							 * Formats value into money representation
							 * @param {Number} value
							 * @return String
							 */
							fmtMoney: function(value) {
								return Ext.util.Format.ruMoney(value);
							},

							/**
							 * Formats value into date representation
							 * @param {Date} value
							 * @return String
							 */
							fmtDate: function(value) {
								return C.utils.fmtDate(value, O.format.Date);
							},

							/**
							 * Returns total sum of debit
							 * @param {Object[]} values
							 * @return String
							 */
							totalDetail: function(values) {
								return this.fmtMoney(
									values.cost * values.payedcount);
							},

							/**
							 * Returns total sum of costs
							 * @param {Object[]} values
							 * @return String
							 */
							totalDebit: function(values) {
								var result = 0;
								Ext.each(values.details, function(fee) {
									result += fee.cost * fee.payedcount;
								});
								return this.fmtMoney(result);
							}
						}
					)
				}],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					items: [{
						text: _('Export') + '...',
						itemId: 'btnExport',
						iconCls: 'print'
					}]
				}, {
					xtype: 'pagingtoolbar',
					store: this.gridStore,
					dock: 'bottom',
					displayInfo: true
				}]
			}]
		});
		this.callParent(arguments);
		// set component access variables
		this.grid = this.down('gridpanel');
		this.btnExport = this.down('#btnExport');
	}
});
