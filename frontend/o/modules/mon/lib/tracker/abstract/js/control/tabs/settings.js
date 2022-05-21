/**
 * @class
 */
C.utils.inherit('O.mon.lib.tracker.abstract.tab.Settings', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.toMonthField) {
			this.toMonthField.on('change', 'onMonthFieldChange', this);
		}
		if (this.fromMonthField) {
			this.fromMonthField.on('change', 'onMonthFieldChange', this);
		}
	},

/**
	* Changes day value according to selected month
	* @param {Ext.form.Field} field
	* @param {Number} value
	*/
	onMonthFieldChange: function(field, value) {
		var dayCountMatrix = [31,29,31,30,31,30,31,31,30,31,30,31];

		var dayMax = dayCountMatrix[value - 1] ?
			dayCountMatrix[value - 1] : 31;

		if (field.name == this.toMonthField.name) {
			field = this.toDayField;
		} else {
			field = this.fromDayField;
		}

		if (field.value > dayMax) {
			field.setValue(dayMax);
		}

		field.setMaxValue(dayMax);
	},

/**
	* On record load
	*/
	onRecordLoad: function(t, record) {
		// Add data to store
		var storeData = [{
			id: 0,
			name: _('Not defined')
		}];

		Ext.Array.each(record.get('sensor'), function(sensor) {
			if (sensor.state === C.cfg.RECORD_IS_ENABLED) {
				storeData.push({id: sensor.id, name: sensor.name});
			}
		});

		// Update stores
		this.sensorStore.loadData(C.utils.copy(storeData));
		this.momentaryStore.loadData(C.utils.copy(storeData));
		this.absoluteStore.loadData(C.utils.copy(storeData));
		this.ignitionStore.loadData(C.utils.copy(storeData));

		this.callParent(arguments);
	}
});
