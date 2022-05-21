/**
 *
 * @class O.common.act.tariff.List
 */
C.utils.inherit('O.common.act.tariff.List', {

/**
	* Returns a copy of selected record.
	* Can be overwritten by childs
	* @protected
	*/
	getCopyRecordConfig: function() {
		var data = this.callParent(arguments);
		data.identifier = data.identifier + '_copy';

		return data;
	}

});
