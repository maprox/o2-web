/**
 * @class O.mon.lib.fuel.consumption.report.CreateWindow
 * @extends O.common.lib.modelslist.EditorWindow
 */
C.utils.inherit('O.mon.lib.fuel.consumption.report.CreateWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnCreate) {
			this.btnCreate.setHandler(this.onCreateClick, this);
		}
		if (this.btnCancel) {
			this.btnCancel.setHandler(this.hide, this);
		}

		if (this.fieldDivision) {
			var store = this.fieldDivision.getStore();
			store.insert(0, {id: null, name: _('Not specified')});
			this.fieldDivision.select(store.getAt(0));
		}
		//this.on('afterrender', 'onAfterRender', this);
	},

/**
	* Execute
	*/
	execute: function() {
		this.show();
	},

/**
	* Handler of creatre button click
	* @private
	*/
	onCreateClick: function() {
		var me = this;
		// prepare parameters
		var fmt = 'Y-m-d H:i:s';
		var date = C.utils.fmtDate(this.fieldDate.getValue(), fmt);
		var division = this.fieldDivision.getValue();
		// Check input params
		if (!date) {
			O.msg.info(_('You need to specify date'));
			return;
		}
		/*if (!division) {
			O.msg.info(_('You need to specify division'));
			return;
		}*/
		// Data
		var data = {
			dt: date,
			id_division: division
		};
		var callback = function(success, response) {
			this.setLoading(false);
			var report = response;

			if (report.data && report.data.error) {
				var error = report.data.error;
				if (error == 'existing_report') {
					O.msg.info(_('Report of this date already exists'));
				}
			} else {
				if (success && report.success && report.data) {
					this.hide();
					me.fireEvent('create', this, null, null, report);
				}
			}
		};
		this.setLoading(true);
		O.manager.Model['add'](
			'mon_fuel_consumption_report', data, callback, this);

	}
});