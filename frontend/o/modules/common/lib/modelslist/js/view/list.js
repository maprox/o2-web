/**
 *
 * @class O.common.lib.modelslist.List
 * @extends Ext.grid.Panel
 */

C.define('O.common.lib.modelslist.List', {
	extend: 'Ext.grid.Panel',
	mixins: ['C.ui.Panel'],
	alias: 'widget.common-lib-modelslist-list',

	offCls: 'modelseditor_off',
	onCls: 'modelseditor_on',

	model: null,
	managerAlias: null,

/**
	* Flag, wich specifies in wich position would be inserted new record.
	* If false, adds record at the end of the list.
	* Defaults to true.
	* @type {Boolean}
	*/
	newRecordIsFirst: true,

/**
	* Set true to enable loading of store data after render.
	* Defaults to true
	* @type {Boolean}
	*/
	autoLoadStore: true,

/** Props */
	border: false,
	hideHeaders: true,
	columns: [{
		dataIndex: 'name',
		flex: 1,
		renderer: Ext.util.Format.htmlEncode,
		field: {
			allowBlank: false
		}
	}],

/**
	* Show or hide search field
	* @type {Boolean}
	*/
	enableSearch: true,

/**
	* Enable case-insensitive earch
	* @type {Boolean}
	*/
	caseInsensitive: true,

/**
	* Field name to filter by
	* If null, will filter by first column of list
	* @type {String}
	*/
	filterField: null,

/**
	* Display show deleted button
	* @type {Boolean}
	*/
	enableShowDeleted: true,

/**
	* True to show edit button
	* @type {Boolean}
	*/
	showEditButton: false,

/**
	* True to show edit button
	* @type {Boolean}
	*/
	showOnOffButton: true,

/**
	* True to show edit button
	* @type {Boolean}
	*/
	showCopyButton: false,

/**
	* True to show create new record button
	* @type {Boolean}
	*/
	showCreateNewRecordButton: true,

/**
	* True to display messages on succesful creation/update
	* @type {Boolean}
	*/
	displaySuccessMessages: true,

/**
	* True to show buttons toolbar
	* @type {Boolean}
	*/
	showButtonsToolbar: true,

/**
	 * Do not allow edit list items
	 * @type {Boolean}
	 */
	disallowEditing: false,

/**
	* @constructor
	* @protected
	*/
	constructor: function(config) {
		// :-( we need to init plugins here. Not in initComponent
		this.initPlugins();
		this.callParent(arguments);
	},

/**
	* Component initialization
	* @protected
	*/
	initComponent: function() {
		this.initDockedItems();
		this.initGridStore();

		Ext.apply(this, {
			store: this.store,
			viewConfig: Ext.apply({
				getRowClass: this.getRecordRowClass
			}, this.viewConfig)
		});
		this.callParent(arguments);
		// init component links
		this.btnAdd = this.down('#btnAdd');
		this.btnEdit = this.down('#btnEdit');
		this.btnCopy = this.down('#btnCopy');
		this.btnOnOff = this.down('#btnOnOff');
		this.btnRemove = this.down('#btnRemove');
		this.btnRestore = this.down('#btnRestore');
		this.fieldSearch = this.down('#fieldSearch');
		this.btnShowDeleted = this.down('#btnShowDeleted');

		// toolbars
		this.actionToolbar = this.down('toolbar[action=control]');
		this.restoreToolbar = this.down('toolbar[action=restore]');
	},

/**
	* Plugins initialization
	* @protected
	*/
	initPlugins: function() {
		if (!this.plugins) {
			this.plugins = [];
		}
		// TODO? check if plugin with id 'editor' already exists
		// ----------
		this.plugins.push({
			ptype: 'rowediting',
			pluginId: 'editor',
			clicksToEdit: 2
		});
	},

/**
	* Docked items initialization
	* @protected
	*/
	initDockedItems: function() {
		if (!this.dockedItems) {
			this.dockedItems = [];
		}
		this.dockedItems.push({
			xtype: 'toolbar',
			dock: 'top',
			action: 'control',
			enableOverflow: true,
			hidden: !this.showButtonsToolbar,
			border: false,
			defaults: {
				xtype: 'button'
			},
			items: this.getToolbarButtons()
		});
		this.dockedItems.push({
			xtype: 'toolbar',
			dock: 'top',
			action: 'restore',
			enableOverflow: true,
			border: false,
			hidden: true,
			items: [{
				xtype: 'tbfill'
			}, {
				xtype: 'button',
				itemId: 'btnRestore',
				text: _('Restore'),
				iconCls: 'modelseditor_on'
			}]
		});
		this.dockedItems.push({
			xtype: 'toolbar',
			dock: 'bottom',
			hidden: !this.enableSearch && !this.enableShowDeleted,
			items: [{
				xtype: 'button',
				itemId: 'btnShowDeleted',
				tooltip: _('Show deleted'),
				enableToggle: true,
				iconCls: 'modelseditor_showdeleted',
				hidden: !this.enableShowDeleted
			}, {
				itemId: 'fieldSearch',
				xtype: 'textfield',
				enableKeyEvents: true,
				emptyText: _('Search'),
				cls: 'modelseditor_fieldsearch',
				flex: 1,
				hidden: !this.enableSearch
			}]
		});
	},

	/**
	 * Returns toolbar buttons configuration
	 * @return {Array}
	 */
	getToolbarButtons: function() {
		return [{
			itemId: 'btnAdd',
			text: _('Add'),
			iconCls: 'btn-create'
		}, {
			itemId: 'btnEdit',
			text: _('Edit'),
			iconCls: 'modelseditor_edit'
		}, {
			itemId: 'btnCopy',
			text: _('Copy'),
			iconCls: 'modelseditor_copy'
		}, {
			itemId: 'btnOnOff',
			text: _('Disable'),
			iconCls: 'modelseditor_off'
		}, {
			xtype: 'tbfill'
		}, {
			itemId: 'btnRemove',
			text: _('Remove'),
			iconCls: 'btn-delete'
		}];
	},

/**
	* Grid store initialization
	*/
	initGridStore: function() {
		// store initialization
		if (!this.store) {
			if (this.managerAlias) {
				this.store = C.getStore(this.managerAlias);
			} else {
				this.simpleStore = true;
				this.autoLoadStore = false;
				if (!this.model) {
					this.model = 'O.data.common.lib.ListAction';
				}
				this.store = Ext.create('Ext.data.Store', {
					model: this.model,
					proxy: {type: 'memory'}
				});

				/*

				TODO: Apply custom vtype

				This code is not working properly:
				If there is more then one grid with this model on the page,
				vtype is changing on all grids :-(

				if (this.vtype && this.columns && this.columns.length > 0) {
					this.columns[0].field.vtype = this.vtype;
				}

				*/
			}
		}

		// save store link
		this.grid = this;
		this.gridStore = this.grid.getStore();
	},

/**
	* Returns record row class
	* @param {Ext.data.Model} record
	* @return {String}
	*/
	getRecordRowClass: function(record) {
		var cls = '',
			state = record.get('state');

		if (state && state != C.cfg.RECORD_IS_ENABLED) {
			cls += ' is_disabled';
		}
		if (state == C.cfg.RECORD_IS_TRASHED) {
			cls += ' is_trashed';
		}
		if (record.get('used') === false) {
			cls += ' is_not_used';
		}
		if (record.get('iseditable') === false) {
			cls += ' readonly';
		}
		if (record.get('foreign')) {
			cls += ' foreign';
		}

		return cls;
	}
});