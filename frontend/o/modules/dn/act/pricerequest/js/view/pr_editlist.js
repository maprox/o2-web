/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.EditorList', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequest_editorlist',

/**
	* Display empty warehouses button text
	* @cfg {String}
	*/
	displayEmpty: 'Display empty',

/**
	* Column names
	*/
	colWarehouse: 'Warehouse',
	colAddress: 'Address',

/**
	* Search phrase
	*/
	searchTitle: 'Search:',

/**
	* Component initialization
	*/
	initComponent: function() {
		var renderer = function(value, scope, record) {
			if (record.get('amount')) {
				return '<b>' + value + '</b>';
			}
			return value;
		}

		var me = this;
		me.emptyButton = Ext.create('Ext.button.Button', {
			text: this.displayEmpty,
			pressed: true,
			enableToggle: true,
			stateful: true,
			stateId: 'editlist-hide-empty',
			stateEvents: ['toggle'],
			getState: function() {
				return {
					pressed: this.pressed
				}
			}
		});

		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'osearchgrid',
				store: 'pricesrequestedit',
				searchTitle: this.searchTitle,
				searchProperties: ["name", "address"],
				defaultPaging: false,

				toolbarAddItems: [me.emptyButton],

				columns: [{
					text: this.colWarehouse,
					flex: 1,
					dataIndex: 'name',
					renderer: renderer
				}, {
					text: this.colAddress,
					flex: 2,
					dataIndex: 'address',
					renderer: renderer
				}],
				plugins: []
			}]
		});

		this.callParent(arguments);
	}

});
