/**
 * @class O.dn.act.priceresponse.List
 * @extends C.ui.Panel
 */
C.define('O.dn.act.priceresponse.List', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesresponses_list',

	title: 'List of prices Responses',

/**
	* Column names
	*/
	colNum: '№',
	colDateStart: 'Creation date',
	colDateEnd: 'End date',
    colStatus: 'Status',

/**
	* Component initialization
	*/
	initComponent: function() {

		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'grid',
				store: 'pricesResponses',
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
					format: 'd.m.Y',
					dataIndex: 'sdt',
					flex: 3,
					sortable: true
				}, {
					text: this.colDateEnd,
					xtype: 'datecolumn',
					format: 'd.m.Y',
					dataIndex: 'edt',
					flex: 3,
					sortable: true
				}, {
					text: this.colStatus,
					dataIndex: 'status',
					xtype: 'templatecolumn',
					tpl: '<img src="'+STATIC_PATH+'/img/docsnet/response-'+
						'{[values.status > 1 ? '+
							'values.status > 2 ? "sent" : "edit"'+
						' : "new"]}'+
						'.png" class="grid-status" />',
					flex: 1,
					sortable: true
				}],
				dockedItems: [{
					xtype: 'toolbar',
					items: [{
						id:  'btnAccept',
						iconCls: 'a-accept',
						text: _('Respond'),
						disabled: true
					}]
				}]
			}]
		});

		this.callParent(arguments);
	}

});
