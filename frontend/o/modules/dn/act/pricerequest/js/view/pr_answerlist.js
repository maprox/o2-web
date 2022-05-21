/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.AnswerList', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequest_answerlist',

/**
	* Column names
	*/
	colFirm: 'Responded firm',
	colDate: 'Date of response',

	statics: {
		getGroupHeader: function (values) {
			if (!values.rows) { return ''; }

			var item = null;
			Ext.each(values.rows, function(record) {
				if (record.get(values.groupField) == values.groupValue) {
					item = record;
					return false; // exit from the loop
				}
			});

			if (!item) { return ''; }

			var dt = item.get("dt"),
				firm = item.get("firm"),
				date = dt.getDay() + '.' + (dt.getMonth() + 1) + '.' +
					dt.getFullYear();

			date = date.replace(/(^|\.)(\d\.)/g, "$10$2")

			return date + ', "' + firm + '"';
		}
	},

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'grid',
				itemId: 'pricesrequest_answer',
				flex: 1,
				store: 'pricesrequestanswer',
				hideHeaders: true,
				columns: [{
					text: this.colFirm,
					dataIndex: 'firm',
					sortable: false,
					hidden: true
				}, {
					text: this.colDate,
					xtype: 'datecolumn',
					format: 'd.m.Y',
					dataIndex: 'dt',
					sortable: false,
					hidden: true
				}, {
					text: this.Warehouse,
					dataIndex: 'id_place',
					renderer: O.convert.warehouse,
					flex: 1,
					sortable: false
				}],
				selType: 'rowmodel',
				features: [{
					ftype: 'grouping',
					enableGroupingMenu: false,
					startCollapsed: true,
					groupHeaderTpl: '{[O.dn.act.pricerequest.AnswerList'+
						'.getGroupHeader(values)]}'
				}]
			}]
		});

		this.callParent(arguments);
	}

});
