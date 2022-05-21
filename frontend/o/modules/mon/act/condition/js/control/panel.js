/**
 * @class O.mon.act.condition.Panel
 * @extends C.ui.Panel
 */
C.utils.inherit('O.mon.act.condition.Panel', {

	/**
	 * @constructor
	 */
	initComponent: function() {
		this.callParent(arguments);
		this.loadData();

		this.list.on({
			deselect: this.onSelectionChange,
			select: this.onSelectionChange,
			selectionchange: this.onSelectionChange,
			scope: this
		});

		this.grid.on({
			itemclick: this.onItemClick,
			scope: this
		});

		this.info.on({
			collapse: this.displayList,
			scope: this
		});

		this.on({
			afterrender: this.setModeGroup,
			scope: this
		});
	},

	/**
	 * On device click
	 * @param grid
	 * @param record
	 */
	onItemClick: function(grid, record) {
		this.setModeItem();
		this.info.loadRecord(record);
	},

	loadData: function() {
		C.get('mon_device', function(items){
			C.get('x_group_mon_device', function(groups){
				this.listData.applyGroupsCollection(groups, 'items');
				this.listData.applyObjectsCollection(items);
				this.list.loadData(this.listData);
			}, this);
		}, this);
	},

	/**
	 * On group selected
 	 */
	onSelectionChange: function() {
		var selected = this.list.getSelectedGroup();

		if (!selected || selected == this.lastSelected) {
			return;
		}

		this.lastSelected = selected;
		var ids = this.list.getGroupObjects(selected);
		this.grid.setIds(ids);
		this.setModeGroup();
	},

	displayList: function() {
		this.list.expand()
	},

	setModeItem: function() {
		this.list.collapse();
		this.info.show();
		this.info.expand();
	},

	setModeGroup: function() {
		this.displayList();
		this.info.hide();
	}
});