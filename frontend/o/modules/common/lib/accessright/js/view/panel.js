/**
 * Access right editor panel view
 * @class O.accessright.Panel
 * @extends C.ui.Panel
 */

C.define('O.accessright.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-lib-right-panel',

/**
	* @constructor
	*/
	initComponent: function() {

		this.store = C.getStore('x_right');
		this.serviceNumber = Math.ceil(
			Math.log(this.store.max('service'))/Math.log(2));

		this.serviceText = [
			_('Observer'),
			_('Docsnet'),
			_('Service desk')
		];

		this.localStore = Ext.create('Ext.data.Store', {
			fields: this.getStoreFields(),
			data: this.getStoreData(),
			sorters: ['name']
		});

		var columns = this.getGridColumns();

		this.editor = Ext.create('Ext.grid.plugin.RowEditing', {
			errorSummary: false,
			clicksToEdit: 2,
			autoCancel: false
		});

		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'grid',
				layout: 'fit',
				store: this.localStore,
				border: false,
				columns: columns,
				dockedItems: [{
					xtype: 'toolbar',
					items: this.createButtons()
				}],
				selType: 'rowmodel',
				plugins: [this.editor]
			}]
		});

		this.localStore.on({
			update: this.storeUpdate,
			remove: this.storeRemove,
			scope: this
		});

		this.editor.on({
			edit: this.checkSelection,
			canceledit: this.removeIfNew,
			scope: this
		});

		this.callParent(arguments);

		this.grid = this.down('gridpanel');

		this.grid.on({
			select: this.checkSelection,
			scope: this
		});
	},

/**
	 * Создает конфиг модели, в зависимости от того, сколько сервисов надо покрыть
	 * @return {String[]}
	 */
	getStoreData: function() {
		var data = [];
		this.store.each(function(record) {
			var row = {
				id: record.get('id'),
				name: record.get('name'),
				description: record.get('description'),
				alias: record.get('alias'),
				read: !!(record.get('type') & 1),
				write: !!(record.get('type') & 2),
				create: !!(record.get('type') & 4)
			};

			for (var i = 0; i < this.serviceNumber; i++) {
				row['service' + (i + 1)] =
					!!(record.get('service') & Math.pow(2, i));
			}

			data.push(row);
		}, this);

		return data
	},

/**
	* Returns an array of store fields
	* @return {Array}
	*/
	getStoreFields: function() {
		var fields = ['id', 'name', 'description', 'alias',
			'read', 'write', 'create'];
		for (var i = 0; i < this.serviceNumber; i++) {
			fields.push('service' + (i + 1));
		}

		return fields;
	},

/**
	 * Returns the grid column config
	 * @return {Object[]}
	 */
	getGridColumns: function() {
		var columns = [{
			dataIndex: 'name',
			text: _('Name'),
			flex: 3,
			editor: 'textfield'
		}, {
			dataIndex: 'description',
			text: _('Description'),
			flex: 8,
			editor: 'textfield'
		}, {
			dataIndex: 'alias',
			text: _('Alias'),
			flex: 3,
			editor: 'textfield'
		}, {
			xtype: 'checkcolumn',
			flex: 1,
			dataIndex: 'read',
			text: _('Read right'),
			editor: {
				xtype: 'checkbox',
				cls: 'x-grid-checkheader-editor'
			}
		}, {
			xtype: 'checkcolumn',
			flex: 1,
			dataIndex: 'write',
			text: _('Write right'),
			editor: {
				xtype: 'checkbox',
				cls: 'x-grid-checkheader-editor'
			}
		}, {
			xtype: 'checkcolumn',
			flex: 1,
			dataIndex: 'create',
			text: _('Create right'),
			editor: {
				xtype: 'checkbox',
				cls: 'x-grid-checkheader-editor'
			}
		}];

		for (var i = 0; i < this.serviceNumber; i++) {
			columns.push({
				xtype: 'checkcolumn',
				flex: 1,
				dataIndex: 'service' + (i + 1),
				text: this.serviceText[i],
				editor: {
					xtype: 'checkbox',
					cls: 'x-grid-checkheader-editor'
				}
			});
		}

		return columns;
	},

/**
	 * Создает кнопки для тулбара
	 * @return {Ext.Action[]}
	 */
	createButtons: function() {
		this.buttonCreate = Ext.create('Ext.Action', {
			iconCls: 'n-create',
			text: _('Create'),
			handler: Ext.bind(this.actionCreate, this)
		});

		this.buttonEdit = Ext.create('Ext.Action', {
			iconCls: 'n-edit',
			text: _('Edit'),
			disabled: true,
			handler: Ext.bind(this.actionEdit, this)
		});

		this.buttonDelete = Ext.create('Ext.Action', {
			iconCls: 'n-delete',
			text: _('Delete'),
			disabled: true,
			handler: Ext.bind(this.actionDelete, this)
		});

		return [
			this.buttonCreate,
			this.buttonEdit,
			this.buttonDelete
		];
	}
});
