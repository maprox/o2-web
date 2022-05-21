C.define('O.comp.FirmsTabUsers', {
	extend: 'O.comp.FirmsTabProxy',
	alias: 'widget.act-firmseditor-tab-usereditor',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'common_lib_usereditor'
			}]
		});

		this.callParent(arguments);
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		this.worker.setFirmId(record.get('id'));
		this.callParent(arguments);
	}
});
