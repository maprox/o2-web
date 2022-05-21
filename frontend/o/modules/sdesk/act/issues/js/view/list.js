/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * @class O.sdesk.issues.List
 * @extends C.ui.Panel
 */
C.define('O.sdesk.issues.List', {
	extend: 'C.ui.Panel',
	alias: 'widget.sdesk_issues_list',

/**
	* Inner state id postfix
	* @type {String}
	*/
	innerStateId: null,

/**
	* @constructor
	*/
	initComponent: function() {
		// let's create grid store
		this.gridStore = C.getStore('sdesk_issue', {
			remoteFilter: true,
			remoteSort: true,
			sorters: [{
				property: 'create_dt',
				direction: 'DESC'
			}],
			proxy: {
				type: 'ajax',
				url: '/sdesk_issue',
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'count'
				},
				extraParams: {
					'$showtotalcount': 1
				}
			}
		});
		// init component view
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'gridpanel',
				stateful: this.stateful,
				stateId: 'sdesk-issues-list-' + this.innerStateId,
				store: this.gridStore,
				border: false,
				columnLines: false,
				columns: {
					defaults: {
						menuDisabled: true,
						groupable: false
					},
					items: [{
						header: _('Issue source'),
						cls: 'column-icon source',
						dataIndex: 'source',
						tooltip: _('Issue source'),
						width: 24,
						fixed: true,
						renderer: function(value) {
							var res = '<div class="grid-icon source {0}">' +
								'{0}</div>';
							return Ext.String.format(res, value || 'unknown');
						}
					}, {
						header: _('UIN'),
						cls: 'column-icon number',
						dataIndex: 'num',
						tooltip: _('Unique issue number'),
						width: 35,
						align: 'right'
					}, {
						header: _('Attachments'),
						cls: 'column-icon attachment',
						dataIndex: 'attachments_count',
						tooltip: _('Issue attachments'),
						width: 24,
						fixed: true,
						renderer: function(value) {
							var res = '';
							if (value > 0) {
								res = '<div class="grid-icon attachment">' +
									value + '</div>';
							}
							return res;
						}
					}, {
						header: _('Creation date'),
						dataIndex: 'create_dt',
						width: 130,
						fixed: true,
						renderer: Ext.util.Format.localTimestamp,
						align: 'right'
					}, {
						header: _('Client'),
						dataIndex: 'clientfirm',
						menuDisabled: false,
						groupable: true,
						flex: 1
					}, {
						header: _('Contact person'),
						dataIndex: 'contactperson',
						cls: 'column-icon person',
						menuDisabled: false,
						groupable: true,
						flex: 1
					}, {
						header: _('Content'),
						dataIndex: 'description',
						menuDisabled: false,
						flex: 4
					}, {
						header: _('State'),
						dataIndex: 'statename',
						menuDisabled: false,
						groupable: true,
						width: 100
					}, {
						header: _('Issue type'),
						dataIndex: 'issuetype',
						menuDisabled: false,
						groupable: true,
						flex: 1
					}, {
						header: _('Service'),
						dataIndex: 'servicename',
						menuDisabled: false,
						groupable: true,
						flex: 1
					}, {
						header: _('Priority'),
						dataIndex: 'priorityposition_display',
						menuDisabled: false,
						groupable: true,
						flex: 1
					}]
				},
				viewConfig: {
					emptyText: '<span class="emptyGrid">' +
						_('No issues') + '</span>',
					getRowClass: function(record, rowIndex, p, store) {
						var cls = '';
						cls += ' priority' + record.get('priorityposition');
						cls += ' statetype' + record.get('statetype');
						return cls;
					}
				},
				features: [{
					ftype: 'grouping',
					//hideGroupedHeader: true,
					groupHeaderTpl: '{name} ({rows.length})'
				}],
				plugins: [{
					ptype: 'headertooltip'
				}, {
					ptype: 'o-rowexpander',
					expandOnDblClick: true,
					//hideExpanderIcon: true,
					expandOnClick: false,
					// Function that determines the need to expand the row
					// @return Boolean true if expandable
					expandable: function(record) {
						return true;
						//return !Ext.isEmpty(record.get('details'));
					},
					// Row body template
					rowBodyTpl: new Ext.XTemplate(
						'<p style="text-align:left;color:#888">',
							'Тут можно разместить дополнительную информацию. ',
							'Типа телефона, полного текста сообщения, кнопки ',
							'перевода в состояние, комментарии и т.д., ',
							' — в приниципе, ограничено только фантазией.',
						'</p>',
						{
							// Formats value into money representation
							// @param {Number} value
							// @return String
							fmtMoney: function(value) {
								return Ext.util.Format.ruMoney(value);
							},

							// Formats value into date representation
							// @param {Date} value
							// @return String
							fmtDate: function(value) {
								return C.utils.fmtDate(value, O.format.Date);
							},

							// Returns total sum of debit
							// @param {Object[]} values
							// @return String
							totalDetail: function(values) {
								return 0;
								//return this.fmtMoney(
								//	values.cost * values.payedcount);
							},

							// Returns total sum of costs
							// @param {Object[]} values
							// @return String
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
	}
});
