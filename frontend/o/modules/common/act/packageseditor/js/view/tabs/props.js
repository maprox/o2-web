/**
 *
 * @class O.common.act.package.tab.Props
 * @extends C.ui.Panel
 */
C.define('O.common.act.package.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.common-package-tab-props',

	iconCls: 'packageseditor_props',

/** Props */
	grids: {},

/**
	* @constructor
	*/
	initComponent: function() {
		this.grids.module = this.createGrid('x_module', _('Modules'));
		this.grids.right_level = this.createGrid('x_right_level',
			_('Access levels'), 2, true);
		this.grids.fee = this.createGrid('x_fee', _('Fees'));
		this.grids.tariff_option = this.createGrid('x_tariff_option',
			_('Tariff options'));

		Ext.apply(this, {
			title: _('Properties'),
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			bodyPadding: 0,
			items: [
				this.grids.module,
				this.grids.right_level,
				this.grids.fee,
				this.grids.tariff_option
			]
		});
		this.callParent(arguments);
	},

	/**
	 * Grid witch checkbox creation
	 * @param {String} store Store alias
	 * @param {String} title Grid title
	 * @param {Number} flex
	 * @param {Boolean} addDescription Flag of need of description column
	 * @return {Ext.grid.Panel} Created grid
	 */
	createGrid: function(store, title, flex, addDescription) {
		if (!flex) {
			flex = 1;
		}
		var cols = [{
			dataIndex: 'enabled',
			xtype: 'checkcolumn',
			width: 28,
			listeners: {
				checkchange: Ext.bind(this.onCheckChange, this)
			}
		}];
		if (addDescription) {
			cols.push({
				dataIndex: 'name',
				width: 100
			});
			cols.push({
				dataIndex: 'description',
				flex: 1
			});
		} else {
			cols.push({
				dataIndex: 'name',
				flex: 1
			});
		}
		return Ext.widget('gridpanel', {
			title: title,
			store: C.getStore(store),
			hideHeaders: true,
			columns: cols,
			flex: flex
		});
	}
});
