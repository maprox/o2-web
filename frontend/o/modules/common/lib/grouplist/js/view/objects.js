/**
 *
 * Panel with list of objects in group
 * @class O.lib.grouplist.Objects
 * @extends C.ui.Panel
 */
C.define('O.lib.grouplist.Objects', {
	extend: 'C.ui.Panel',
	alias: 'widget.groupslist_objects',

	config: {
		/**
		 * List of selected objects ids
		 * @cfg {Number[]}
		 */
		selected: [],
		/**
		 * Objects data
		 * @type {Ext.util.MixedCollection}
		 */
		collection: null,
		/**
		 * Allow selecting of multiple objects (defaults to true)
		 * @type {Boolean}
		 */
		multiSelect: true,
		/**
		 * Display "select all" button
		 * @type {Boolean}
		 */
		showSelectAll: true,
		/**
		 * Display switcher that hides disabled objects
		 * @type {Boolean}
		 */
		showDisableSwitcher: true,
		/**
		 * Data class alias
		 * @type {String}
		 */
		classAlias: '',
		/**
		 * Filter for hiding disabled objects
		 * @type {Object}
		 */
		disabledFilter: {property: 'disabled', value: false},
		/**
		 * Default sorter config
		 * @type {Object}
		 */
		nameSort: {property: 'name', direction: 'ASC'},
		/**
		 * Grouped object model
		 * @type {String}
		 */
		groupedObjectModel: 'O.lib.grouplist.model.Object'
	},

	getRowClass: Ext.emptyFn,

	statics: {
		countDisabledButtons: 0
	},

/**
	* Columns initialization
	*/
	getColumns: function() {
		var columns = [];
		if (this.multiSelect) {
			columns.push({
				dataIndex: 'enabled',
				xtype: 'checkcolumn',
				width: 28
			});
		}
		columns.push({
			dataIndex: 'name',
			flex: 1,
			renderer: Ext.util.Format.htmlEncode
		});

		return columns;
	},

/**
	* Component initialization
	*/
	initComponent: function() {
		var columns = this.getColumns();

		var toolbar = {
			doc: 'top',
			xtype: 'toolbar',
			items: []
		};

		if (this.getShowSelectAll()) {
			toolbar.items.push({
				xtype: 'button',
				arrowAlign: 'right',
				text: _('Select'),
				menu: [{
					text: _('All'),
					iconCls: 'check-all',
					itemId: 'checkAll'
				}, {
					text: _('None'),
					iconCls: 'check-none',
					itemId: 'checkNone'
				}]
			});
		}

		if (this.getShowDisableSwitcher()) {
			this.statics().countDisabledButtons++;
			toolbar.items.push({
				xtype: 'button',
				itemId: 'showDisabled',
				tooltip: _('Show disabled'),
				enableToggle: true,
				stateId: 'grouplist_disabled_show_' + this.classAlias + '_' +
					this.statics().countDisabledButtons,
				stateful: true,
				getState: function() {
					return {
						pressed: this.pressed
					}
				},
				stateEvents: ['toggle'],
				iconCls: 'g-show-disabled'
			});
		}

		if (this.getShowSelectAll() || this.getShowDisableSwitcher()) {
			toolbar = [Ext.create('Ext.toolbar.Toolbar', toolbar)];
		} else {
			toolbar = [];
		}
		var showDisabledPressed = this.getShowDisableSwitcher() ?
			toolbar[0].down('#showDisabled').pressed :
			false;

		Ext.apply(this, {
			layout: 'fit',
			dockedItems: toolbar,
			items: [{
				border: false,
				xtype: 'gridpanel',
				store: new Ext.data.Store({
					model: this.getGroupedObjectModel(),
					filters: showDisabledPressed ? [] :
						[this.getDisabledFilter()],
					sorters: [this.getNameSort()]
				}),
				viewConfig: {
					trackOver: false,
					stripeRows: false,
					getRowClass: this.getRowClass,
					cls: 'groupslist_objects_' + this.getClassAlias()
				},
				hideHeaders: true,
				multiSelect: false,
				columns: columns
			}]
		});
		this.callParent(arguments);
		// init links
		this.grid = this.down('gridpanel');
		this.gridStore = this.grid.getStore();
		this.btnShowDisabled = this.down('#showDisabled');
		this.btnCheckAll = this.down('#checkAll');
		this.btnCheckNone = this.down('#checkNone');
	}

});
