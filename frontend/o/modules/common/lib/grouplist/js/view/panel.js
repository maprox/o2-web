/**
 *
 * @class O.lib.grouplist.Panel
 * @extends C.ui.Panel
 */
C.define('O.lib.grouplist.Panel', {
	extend: 'C.ui.Panel',

	config: {
		/**
		 * Enable search panel
		 */
		enableSearch: true,
		/**
		 * List of objects found by search
		 * @cfg {Number[]}
		 */
		search: [],
		/**
		 * Allow selecting of multiple groups (defaults to false)
		 * @type {Boolean}
		 */
		multiSelectGroups: false,
		/**
		 * Allow selecting of multiple objects (defaults to true)
		 * @type {Boolean}
		 */
		multiSelectObjects: true,
		/**
		 * Display "select all" button
		 * @type {Boolean}
		 */
		showSelectAllObjects: false,
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
		 * Xtype of groups list component
		 * @type {String}
		 */
		groupsXtype: 'grouplist_groups',
		/**
		 * Xtype of objects list component
		 * @type {String}
		 */
		objectsXtype: 'grouplist_objects'
	},

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			cls: 'groupslist',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [this.getGroupConfig(), {
				border: true,
				width: 1
			}, this.getListConfig()],
			dockedItems: [{
				xtype: 'toolbar',
				hidden: !this.getEnableSearch(),
				dock: 'top',
				items: [{
					itemId: 'searchfield',
					xtype: 'textfield',
					enableKeyEvents: true,
					emptyText: _('Search'),
					flex: 1,
					cls: 'field_search'
				}]
			}]
		});

		this.callParent(arguments);

		this.listGroups = this.down(this.getGroupsXtype());
		this.listObjects = this.down(this.getObjectsXtype());

		if (this.getEnableSearch()) {
			this.searchField = this.down('#searchfield');
		}
	},

/**
	* Returns config for groups list
	* @return {Object}
	*/
	getGroupConfig: function() {
		return {
			xtype: this.getGroupsXtype(),
			multiSelect: this.getMultiSelectGroups(),
			classAlias: this.getClassAlias(),
			flex: 1
		};
	},

/**
	* Returns config for objects list
	* @return {Object}
	*/
	getListConfig: function() {
		return {
			xtype: this.getObjectsXtype(),
			multiSelect: this.getMultiSelectObjects(),
			showSelectAll: this.getShowSelectAllObjects(),
			showDisableSwitcher: this.getShowDisableSwitcher(),
			classAlias: this.getClassAlias(),
			flex: 1,
			getRowClass: this.getRowClassObjects
		};
	}
});
