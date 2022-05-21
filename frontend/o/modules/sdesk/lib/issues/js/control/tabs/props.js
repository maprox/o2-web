/**
 * @class O.sdesk.lib.issues.TabProps
 */
C.utils.inherit('O.sdesk.lib.issues.TabProps', {

/**
	* @event changed
	* Fires when fields value was changed
	*/

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.getForm().trackResetOnLoad = true;
		this.getForm().on({
			dirtychange: function(){
				this.fireEvent('dirtychange', this.getForm().isDirty());
			},
			scope: this
		});

	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {String[]} dontUpdateFields Поля, которые не надо обновлять.
	*/
	loadProps: function(record, dontUpdateFields) {
		
	}

});
