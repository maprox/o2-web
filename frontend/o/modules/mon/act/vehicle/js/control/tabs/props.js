/**
 * @class O.mon.vehicle.tab.Props
 */
C.utils.inherit('O.mon.vehicle.tab.Props', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
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

		this.responsibleCombobox.on({
			beforequery: function(qe) {
				qe.combo.store.clearFilter();
			}
		});
	},

/**
	* Updates record
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		this.callParent(arguments);
		if (!record) { return; }

		//if (record.modified	&&
		//	(record.modified.licence_number || record.modified.car_model)
		//) {
		//}
		if (record.get('car_model') || record.get('license_number')) {
			var name = record.get('car_model');
			if (record.get('license_number')) {
				name = name + ' ' + record.get('license_number');
			}
			if (record.get('name') != name) {
				record.set('name', name);
			}
		}

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