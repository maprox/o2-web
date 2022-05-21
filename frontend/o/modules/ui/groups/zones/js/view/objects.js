/**
 *
 * Panel with list of objects in group
 * @class O.lib.grouplist.Objects
 * @extends C.ui.Panel
 */
C.define('O.groups.zones.Objects', {
	extend: 'O.lib.grouplist.Objects',
	alias: 'widget.listgroupszones_objects',

	config: {
	/**
		* Grouped object model
		*/
		groupedObjectModel: 'O.groups.zones.model.Object'
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
			flex: 1
		});

		columns.push({
			dataIndex: 'devicecount',
			align: 'right',
			width: 40,
			renderer: function(v) {
				return (v === 0) ? '' : v;
			}
		});

		return columns;
	},

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callParent(arguments);
	}
});
