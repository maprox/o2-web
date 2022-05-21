/**
 * @class O.dn.lib.analytics.tab.Settings
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.dn.lib.analytics.tab.Settings', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.dn-analytics-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		var padding = 4;
		Ext.apply(this, {
			title: _('Settings'),
			itemId: 'settings',
			iconCls: 'dn-analytics-settings',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			bodyPadding: padding,
			defaults: {
				xtype: 'tbspacer',
				border: false
			},
			items: [
				this.createGrid('dn_supplier', _('Suppliers')),
				{ width: padding },
				{
					xtype: 'panel',
					flex: 1,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						this.createGrid('dn_region', _('Regions'), 3),
						{
							xtype: 'tbspacer',
							border: false,
							height: padding
						},
						this.createGrid('dn_warehouse', _('Warehouses'), 2)
					]
				},
				{ width: padding },
				this.createGrid('dn_product', _('Products'), 2)
			],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [_('Period of data actuality: from'), {
					xtype: 'datefield',
					name: 'period_sdt',
					format: O.format.Date,
					submitFormat: 'Y-m-d',
					width: 100
				}, _('to'), {
					xtype: 'datefield',
					name: 'period_edt',
					format: O.format.Date,
					submitFormat: 'Y-m-d',
					width: 100
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.fieldPeriod_sdt = this.findField('period_sdt');
		this.fieldPeriod_edt = this.findField('period_edt');
	},

	/**
	 * Grid witch checkbox creation
	 * @param {String} storeAlias Store alias
	 * @param {String} title Grid title
	 * @param {Number} flex
	 * @return {Ext.grid.Panel} Created grid
	 */
	createGrid: function(storeAlias, title, flex) {
		if (!this.grids) { this.grids = {}; }
		var columns = [{
			dataIndex: 'name',
			flex: 1
		}];
		if (storeAlias === 'dn_product') {
			columns = [{
				header: _('Product'),
				dataIndex: 'name',
				flex: 3
			}, {
				header: _('Code'),
				dataIndex: 'code',
				flex: 1
			}];
		}
		this.grids[storeAlias] = Ext.widget('gridpanel', {
			title: title,
			store: C.getStore(storeAlias),
			link: storeAlias,
			hideHeaders: (storeAlias !== 'dn_product'),
			selModel: {
				xtype: 'checkboxmodel',
				mode: 'MULTI'
			},
			selType: 'checkboxmodel',
			columns: columns,
			flex: flex || 1,
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'button',
					arrowAlign: 'right',
					text: _('Select'),
					menu: [{
						text: _('All'),
						link: storeAlias,
						iconCls: 'check-all',
						action: 'check-all'
					}, {
						text: _('None'),
						link: storeAlias,
						iconCls: 'check-none',
						action: 'check-none'
					}]
				}, {
					xtype: 'textfield',
					action: 'search',
					enableKeyEvents: true,
					emptyText: _('Search'),
					cls: 'modelseditor_fieldsearch',
					link: storeAlias,
					flex: 1
				}]
			}]
		});
		return this.grids[storeAlias];
	}
});
