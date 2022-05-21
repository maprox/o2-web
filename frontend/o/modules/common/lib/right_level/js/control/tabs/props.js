/**
 * @class O.common.lib.right_level.tab.Props
 */
C.utils.inherit('O.common.lib.right_level.tab.Props', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		/*
		this.on('recordload', this.onRecordLoad, this);
		this.driverCombobox.on({
			// Beforequery handler, applies filter to store
			beforequery: function(qe) {
				qe.combo.store.filterBy(function(record) {
					var workers = C.get('dn_worker');
					var worker = null;
					workers.each(function(w) {
						if (w.getId() === record.getId()) {
							worker = w;
							return false;
						}
					});
					if (!worker) { return false; }
					return worker.hasSpecialization('Driver');
				});
			}
		});
		*/
	},

/**
	* Record loading handler
	*/
	onRecordLoad: function(cmp, record) {
		if (this.licenseFieldset) { this.licenseFieldset.collapse(); }
		if (record && record.get('bus_license_reg_num')) {
			if (this.licenseFieldset) { this.licenseFieldset.expand(); }
		}
	}
});