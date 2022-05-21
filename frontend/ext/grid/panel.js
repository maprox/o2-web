/**
 * Extended grid panel
 * @class Ext.grid.Panel
 */
C.utils.inherit('Ext.grid.Panel', {
	initComponent: function() {
		this.callParent(arguments);

		var stateId = this.stateId;

		if (!stateId) {
			if (this.columns && this.columns.length) {
				stateId = md5(
					Ext.Array.pluck(this.columns, "dataIndex").toString()
					+ this.model
				);
			}
		}

		Ext.apply(this, {
			stateful: true,
			stateEvents: [
				'columnhide',
				'columnshow',
				'columnmove',
				'columnresize',
				'sortchange',
				'groupchange'
			],
			stateId: stateId
		});
	},

/**
	* Apply state
	* @param state
	*/
	applyState: function(state) {

		var filteredSorters = [];
		if (state.storeState && state.storeState.sorters
			&& state.storeState.sorters.length)
		{
			for (var i = 0; i < state.storeState.sorters.length; i++) {
				var sorter = state.storeState.sorters[i];
				if (sorter.property === undefined
					&& sorter.sorterFn === undefined)
				{
					continue;
				}

				filteredSorters.push(sorter);
			}

			state.storeState.sorters = filteredSorters;
		}

		this.callParent(arguments);
	}
});
