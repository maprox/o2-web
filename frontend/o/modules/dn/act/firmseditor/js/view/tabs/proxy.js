C.define('O.comp.FirmsTabProxy', {
	extend: 'O.common.lib.modelslist.Tab',

	bodyPadding: 0,
	defaults: {},
	layout: 'fit',

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.worker = this.child();
	},

/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		return false;
	},

/**
	* Returns true if current tab data is valid
	* @return {Boolean}
	*/
	isValid: function() {
		return true;
	}
});
