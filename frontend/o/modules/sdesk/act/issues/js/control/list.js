/**
 * @class O.sdesk.issues.List
 */
C.utils.inherit('O.sdesk.issues.List', {

/**
	* Load issues
	*/
	load: function() {
		this.gridStore.load();
	}

});