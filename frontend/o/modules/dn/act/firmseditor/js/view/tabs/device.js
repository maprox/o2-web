C.define('O.comp.FirmsTabDevice', {
	extend: 'O.comp.FirmsTabProxy',
	alias: 'widget.act-firmseditor-tab-device',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'mon-lib-device'
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
