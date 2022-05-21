/**
 * @class O.x.notification.action.User
 * @extends O.x.notification.action.AbstractList
 */
Ext.define('O.x.notification.action.AbstractGrid', {
	extend: 'O.x.notification.action.Abstract',

	/**
	 * @constructor
	 */
	initComponent: function() {
		this.grids = {};
		this.grids.grid = this.createGrid(this.gridAlias,
		_(this.gridTitle), [{
			header: _('Name'),
			dataIndex: this.gridNameDataIndex,
			flex: 1
		}, {
			dataIndex: 'enabled',
			xtype: 'checkcolumn',
			width: 28
		}]);

		this.gridStore = this.grids.grid.getStore();

		Ext.apply(this, {
			title: _(this.title),
			actionType: this.actionType,
			layout: 'anchor',
			items: [{
				xtype: 'panel',
				flex: 1,
				border: false,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [
					this.grids.grid
				]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.checkcolumn = this.down('checkcolumn');
		//this.list = this.down('common-lib-modelslist-list');
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

		var gridStore = C.getStore(store);
		gridStore.sort('enabled', 'DESC');

		return Ext.create('Ext.grid.Panel', {
			title: title,
			store: gridStore,
			columns: columns,
			width: 400,
			plugins: plugins,
			listeners: listeners,
			hideHeaders: true
		});
	}
});