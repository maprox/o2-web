/**
 * Extended ext grid column
 * @class Ext.grid.column.Column
 */
C.utils.inherit('Ext.grid.column.Column', {

	getStateId: function () {
		return this.stateId || this.dataIndex || this.headerId;
	}
});
