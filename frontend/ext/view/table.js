C.utils.inherit('Ext.view.Table', {
/**
	* Focuses a particular row and brings it into view. Will fire the rowfocus event.
	* @param {HTMLElement/String/Number/Ext.data.Model} rowIdx
	* An HTMLElement template node, index of a template node, the id of a template node or the
	* record associated with the node.
	*/
	focusRow: function(rowIdx) {
		var me = this,
			row,
			gridCollapsed = me.ownerCt && me.ownerCt.collapsed,
			record;

		// Do not attempt to focus if hidden or owning grid is collapsed
		if (me.isVisible(true) && !gridCollapsed && (row = me.getNode(rowIdx, true)) && me.el) {
			record = me.getRecord(row);
			rowIdx = me.indexInStore(row);

			// Focusing the row scrolls it into view
			me.selModel.setLastFocused(record);
	//		row.focus();
			me.focusedRow = row;
			me.fireEvent('rowfocus', record, row, rowIdx);
		}
	},

/**
	* Render cell override to support 'param.value' dataIndex
	* @param {Ext.grid.column.Column} column The column definition for which to render a cell.
	* @param {Number} recordIndex The row index (zero based within the {@link #store}) for which to render the cell.
	* @param {Number} columnIndex The column index (zero based) for which to render the cell.
	* @param {String[]} out The output stream into which the HTML strings are appended.
	*/
	renderCell: function(column, record, recordIndex, columnIndex, out) {
		record.data[column.dataIndex] = record.get(column.dataIndex);
		this.callOverridden(arguments);
	}
});