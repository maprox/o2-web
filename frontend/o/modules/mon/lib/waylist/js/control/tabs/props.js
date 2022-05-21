/**
 * @class O.mon.lib.waylist.tab.Props
 */
C.utils.inherit('O.mon.lib.waylist.tab.Props', {
	/**
	 * @cfg Boolean
	 */
	loadingDone: true,
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.vehicleField) {
			this.vehicleField.on('change', this.onVehicleChange, this);
		}
		if (this.sdtField) {
			this.sdtField.on('change', this.sdtEdtChange, this);
		}
		if (this.edtField) {
			this.edtField.on('change', this.sdtEdtChange, this);
		}
		if (this.departField) {
			this.departField.on('change', this.onGarageChange, this);
		}
		if (this.returnField) {
			this.returnField.on('change', this.onGarageChange, this);
		}
		if (this.sOdometerField) {
			this.sOdometerField.on('change', this.onOdometerChange, this);
		}
		if (this.eOdometerField) {
			this.eOdometerField.on('change', this.onOdometerChange, this);
		}
		this.on('afterrender', this.setLoadingIfNotDone, this);
	},

/**
	* Form data stores initialization
	* @private
	*/
	initStores: function() {
	/*
		* Checks if worker has specialization
		* @param {Dn.Worker} record
		* @param {String} specialization
		* @return {Boolean} True if worker has specified specialization
		*/
		var fnWorkerHasSpecialization = function(record, specialization) {
			var workers = C.get('dn_worker');
			var worker = null;
			workers.each(function(w) {
				if (w.getId() === record.getId()) {
					worker = w;
					return false;
				}
			});
			if (!worker || !worker.hasSpecialization) { return false; }
			return worker.hasSpecialization(specialization);
		};
		this.driverStore.clearFilter(true);
		this.driverStore.filter([{
			filterFn: function(record) {
				return fnWorkerHasSpecialization(record, 'Driver')
			}
		}]);
		this.dispatcherStore.clearFilter(true);
		this.dispatcherStore.filter([{
			filterFn: function(record) {
				return fnWorkerHasSpecialization(record, 'Dispatcher')
			}
		}]);
		this.mechanicStore.clearFilter(true);
		this.mechanicStore.filter([{
			filterFn: function(record) {
				return fnWorkerHasSpecialization(record, 'Engineer')
			}
		}]);
	},

/**
	* On vehicle select
	*/
	onVehicleChange: function(field, newValue) {
		var record = this.getSelectedRecord();
		// Vehicle store
		var vehicleStore = C.getStore('mon_vehicle');
		if (newValue && this.fuelTypeField) {
			// Get selected vehicle
			var vehicle = vehicleStore.getById(newValue);
			if (!vehicle) {
				return;
			}
			// Change fuel
			var fuel = vehicle.get('id_fuel');
			this.fuelTypeField.setValue(fuel);
			// Change driver to default if not saved yet
			if (!record.get('id_driver')) {
				var driver = vehicle.get('id_driver');
				this.driverField.setValue(driver);
			}
		}
		this.fireEvent('vehicle_change');
	},

/**
	 * On time params change
 	 */
	sdtEdtChange: function() {
		this.fireEvent('sdt_edt_change');
	},

	/**
	 * On garage select
	 */
	onGarageChange: function(field, newValue) {
		// null прилетает когда вызывается переопределенная нами функция form.clear()
		if (newValue !== null) {
			this.getSelectedRecord().set(field.getName(), newValue);
			this.fireEvent('garage_change');
		}
	},

	/**
	 * When one of odometer fields is changed
	 * @param field
	 * @param newValue
	 */
	onOdometerChange: function(field, newValue) {
		var record = this.getSelectedRecord();
		var name = field.name.replace('_km', '');
		record.set(name, newValue * 1000);
	},

	/**
	 * Loads data from record
	 * @param {Ext.data.Model} record
	 * @param {Boolean} noReset (optional) If true, use field.setValue method
	 *     for forms to disable dirty change. Defaults to false
	 */
	selectRecord: function(record, noReset) {
		this.loadingDone = false;
		// С обратным случаем справится event afterrender, заданный при инициализации
		if (this.rendered) {
			this.setLoading(true);
		}

		C.get(['dn_worker', 'dn_worker_post'], function(){
			this.initStores();

			// Костылевато, но не знаю как еще отложить вызов функции до завершения загрузки
			this.superclass.selectRecord.call(this, record, noReset);
			this.loadingDone = true;
			this.setLoading(false);
		}, this);
	},

	/**
	 * Needed because of select record
	 */
	setLoadingIfNotDone: function(){
		if (!this.loadingDone) {
			this.setLoading(true);
		}
	}
});
