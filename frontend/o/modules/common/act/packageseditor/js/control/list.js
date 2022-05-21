/**
 *
 * @class O.common.act.package.List
 */
C.utils.inherit('O.common.act.package.List', {

/**
	* Returns a copy of selected record.
	* Can be overwritten by childs
	* @protected
	*/
	getCopyRecordConfig: function() {
		var data = this.callParent(arguments);
		data.alias = data.alias + '_copy';

		return data;
	}

});
