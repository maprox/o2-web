/**
 *
 * @class O.comp.dn.Cabinet
 */
C.utils.inherit('O.comp.dn.Cabinet', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on({
			afterrender: this.onAfterRender,
			scope: this
		});
		this.dataview = this.down('dataview');
		this.dataview.getStore().on({
			datachanged: this.onStoreUpdate,
			scope: this
		});
	},

/**
	* After render handler
	*/
	onAfterRender: function() {
		var s = C.getSettings();
		var data = s.getRange();

		// Set address legal id
		if(s.get('f.addresslegal_id')) {
			this.companyRequisites.setLegalAddressId(
				s.get('f.addresslegal_id').value
			);
		}
		// Set address actual id
		if(s.get('f.addressactual_id')) {
			this.companyRequisites.setActualAddressId(
				s.get('f.addressactual_id').value
			);
		}
		this.requisitesFormPanel.getForm().setValues(data);

	},

/**
	* On store data update
	*/
	onStoreUpdate: function() {
		this.down('#offers').doComponentLayout();
	}
});
