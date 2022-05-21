/**
 *
 * @class O.common.act.package.tab.Props
 * @extends C.ui.Panel
 */
C.define('O.common.act.tariff.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.common-tariff-tab-props',

	iconCls: 'tariffseditor_props',

/** Props */
	grids: {},

/**
	* @constructor
	*/
	initComponent: function() {

		this.grids.modules = this.createGrid('x_module',
			_('Modules'), [{
				header: _('Name'),
				dataIndex: 'name',
				flex: 1
			}, {
				dataIndex: 'enabled',
				xtype: 'checkcolumn',
				width: 28,
				listeners: {
					checkchange: Ext.bind(this.onValueChange, this)
				}
			}]);

		this.grids.tariff_option = this.createGrid('x_tariff_option',
			_('Tariff options'), [{
				header: _('Name'),
				dataIndex: 'name',
				flex: 1
			}, {
				header: _('Amount'),
				dataIndex: 'value',
				format: '0',
				xtype: 'numbercolumn'
			}], true);

		this.grids.fee = this.createGrid('x_fee',
			_('Fees'), [{
				header: _('Name'),
				dataIndex: 'name',
				flex: 1
			}, {
				header: _('Cost'),
				//format: '0',
				dataIndex: 'amount',
				xtype: 'numbercolumn'
			}, {
				header: _('Free'),
				format: '0',
				useNull: true,
				dataIndex: 'no_fee_count',
				xtype: 'numbercolumn'
			}, {
				header: _('Is monthly'),
				dataIndex: 'is_monthly',
				xtype: 'checkcolumn',
				listeners: {
					checkchange: Ext.bind(this.onValueChange, this)
				}
			}], true);

		var padding = 10;
		Ext.apply(this, {
			title: _('Properties'),
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'panel',
				border: false,
				layout: 'hbox',
				defaults: {
					labelAlign: 'top'
				},
				items: [{
					xtype: 'combobox',
					name: 'id_package',
					fieldLabel: _('Package'),
					width: '40%',
					allowBlank: true,
					editable: false,
					valueField: 'id',
					displayField: 'name',
					store: C.getStore('x_package'),
					queryMode: 'local',
					listeners: {
						change: Ext.bind(this.onPackageSelect, this)
					}
				}, {
					xtype: 'tbspacer',
					width: padding
				}, {
					xtype: 'textfield',
					name: 'identifier',
					itemId: 'identifier',
					width: '20%',
					fieldLabel: _('Identifier')
				}, {
					xtype: 'tbspacer',
					width: padding
				}, {
					xtype: 'numberfield',
					name: 'free_days',
					itemId: 'free_days',
					fieldLabel: _('Free days count')
				}, {
					xtype: 'tbspacer',
					width: padding
				}, {
					xtype: 'numberfield',
					name: 'limitvalue',
					itemId: 'limit_value',
					fieldLabel: _('Limit value'),
					allowDecimals: true
				}]
			}, {
				xtype: 'tbspacer',
				height: padding
			}, {
				xtype: 'checkbox',
				itemId: 'individual',
				inputValue: '1',
				uncheckedValue: '0',
				labelAlign: 'left',
				fieldLabel: _('Individual'),
				name: 'individual'
			}, {
				xtype: 'tbspacer',
				height: padding
			}, {
				xtype: 'panel',
				flex: 1,
				border: false,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [
					this.grids.modules,
					this.grids.tariff_option,
					this.grids.fee
				]
			}]
		});
		this.callParent(arguments);
	},

	/**
	 * Grid witch checkbox creation
	 * @param {String} store Store alias
	 * @param {String} title Grid title
	 * @param {Object} columns Columns config
	 * @param {Boolean} editor Flag of need of the editor
	 * @return {Ext.grid.Panel} Created grid
	 */
	createGrid: function(store, title, columns, editor) {
		if (editor) {
			var plugins = [{
				ptype: 'rowediting',
				pluginId: 'editor-' + store,
				clicksToEdit: 1
			}];

			var listeners = {
				edit: Ext.bind(this.onValueEdit, this)
			};

			Ext.each(columns, function(column) {
				if (column.xtype == 'numbercolumn') {
					column.editor = {
						xtype: 'numberfield',
						allowBlank: false
					};
				}
			});
		} else {
			var plugins = [];
			var listeners = [];
		}

		return Ext.create('Ext.grid.Panel', {
			title: title,
			store: C.getStore(store),
			columns: columns,
			flex: 1,
			plugins: plugins,
			listeners: listeners
		});
	}
});
