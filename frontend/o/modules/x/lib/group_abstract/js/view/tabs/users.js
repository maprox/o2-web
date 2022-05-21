/**
 * @class O.x.lib.group_abstract.tab.Users
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.lib.group_abstract.tab.Users', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-group-abstract-tab-users',

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		this.grids = {};

		this.grids.user = this.createGrid('x_user',
			_('Users'), [{
				header: _('Name'),
				dataIndex: 'shortname',
				flex: 1
			}, {
				dataIndex: 'enabled',
				xtype: 'checkcolumn',
				width: 28
			}]);


		Ext.apply(this, {
			title: _('Users'),
			itemId: 'users',
			bodyPadding: 10,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'panel',
				flex: 1,
				border: false,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [
					this.grids.user
				]
			}]
		});

		this.callParent(arguments);

		this.checkcolumn = this.down('checkcolumn');
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
			width: 400,
			plugins: plugins,
			listeners: listeners,
			hideHeaders: true
		});
	}
});