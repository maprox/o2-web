/**
 * @class O.mon.lib.device.window.Conversions
 */
C.utils.inherit('O.mon.lib.device.window.Conversions', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.btnSave.setHandler(this.save, this);
		this.btnReset.setHandler(this.reset, this);
		this.btnCancel.setHandler(this.cancel, this);
		this.btnChangeSmoothing.on('toggle', 'changeSmooting', this);
		this.btnCheckValue.setHandler(this.checkValue, this);
		this.btnPointsAdd.setHandler(this.pointsAdd, this);
		this.btnPointsRemove.setHandler(this.pointsRemove, this);

		var sm = this.pointsGrid.getSelectionModel();
		if (sm) {
			sm.on('selectionchange', 'syncUi', this);
		}
		if (this.pointsEditor) {
			this.pointsEditor.on({
				beforeedit: 'onBeforeEdit',
				afteredit: 'onAfterEdit',
				canceledit: 'onCancelEdit',
				scope: this
			});
		}
	},

/**
	* Loading of record into window
	* @param {Mon.DeviceSensor} record
	*/
	loadConversion: function(record) {
		if (this.record != record) {
			this.record = record;
			this.reset();
		}
	},

/**
	* Conversion image loading
	*/
	loadConvertionImage: function() {
		var url = '/' + this.conversionUrl + '/graph/';
		var smoothing = this.recordGet('smoothing') ? '1' : '0';
		var conversion = escape(this.getConversionPoints(true));
		this.graph.update('<img src="' + url + '?smoothing=' + smoothing +
			'&conversion=' + conversion + '">');
	},

/**
	* Returns current edited record instance
	* @return {Ext.data.Model}
	* @protected
	*/
	getEditedRecord: function() {
		if (!this.editedRecord) {
			this.editedRecord = this.record.copy();
		}
		return this.editedRecord;
	},

/**
	* Save data for sensor
	*/
	save: function() {
		var record = this.getEditedRecord();
		// data copying
		this.record.set('smoothing', record.get('smoothing'));
		this.record.set('conversion', this.getConversionPoints(false));
		this.fireEvent('save', this, this.record);
		this.reset();
	},

/**
	* Hides this window
	*/
	cancel: function() {
		this.reset();
		this.hide();
	},

/**
	* Data reset
	*/
	reset: function() {
		this.editedRecord = null;
		// reset checking fields
		this.fieldX.setValue('');
		this.fieldY.setValue('');
		var record = this.getEditedRecord();
		// smoothing button
		if (!this.isHidden()) {
			this.btnChangeSmoothing.toggle(record.get('smoothing'));
		}
		// loading points
		var conversion = record.get('conversion');
		if (Ext.isArray(conversion)) {
			this.pointsStore.loadData(conversion);
		}
		// conversion points transform to array
		this.recordSet('conversion', this.pointsStore.getRange())
	},

/**
	* Syncronizes user interface buttons
	* @private
	*/
	syncUi: function() {
		var sm = this.pointsGrid.getSelectionModel();
		var selection = sm.getSelection();
		this.btnPointsRemove.setDisabled(selection.length == 0);
	},

/**
	* Changing record data
	* @param {String} field
	* @param {String} value
	*/
	recordSet: function(field, value) {
		var record = this.getEditedRecord();
		record.set(field, value);
		record.commit();
		this.loadConvertionImage();
		this.syncUi();
	},

/**
	* Returns record field value
	* @param {String} field
	* @return {Mixed}
	*/
	recordGet: function(field) {
		var record = this.getEditedRecord();
		return record.get(field);
	},

/**
	* Return conversion points
	* @param {Boolean} encode True to encode result into string
	* @return array
	*/
	getConversionPoints: function(encode) {
		var points = [];
		this.pointsStore.each(function(point) {
			points.push({
				x: point.get('x'),
				y: point.get('y')
			});
		});
		return encode ? Ext.encode(points) : points;
	},

/**
	* Add point to store
	* @private
	*/
	pointsAdd: function() {
		this.pointsEditor.cancelEdit();
		var store = this.pointsStore;
		// add new record to the store
		store.insert(0, {x: 0, y: 0});
		// activate editor
		this.pointsEditor.isNewItem = true;
		this.pointsEditor.startEdit(store.getAt(0), 0);
		this.editingPoint = store.getAt(0);
	},

/**
	* Remove point from store
	* @private
	*/
	pointsRemove: function() {
		var sm = this.pointsGrid.getSelectionModel();
		// remove selected points
		this.pointsStore.remove(sm.getSelection());
		this.recordSet('conversion', this.getConversionPoints());
	},

/**
	* Change smoothing of a conversion
	* @private
	*/
	changeSmooting: function(cmp, enableSmoothing) {
		this.recordSet('smoothing', enableSmoothing ? '1' : '0');
	},

/**
	* Returns selected record in a grid
	* @return {Ext.data.Model}
	*/
	getSelectedPoint: function() {
		var sm = this.pointsGrid.getSelectionModel();
		if (sm) {
			var selection = sm.getSelection();
			if (selection.length > 0) {
				return selection[0];
			}
		}
		return null;
	},

/**
	* Fires before edit is started
	*/
	onBeforeEdit: function() {
		this.editingPoint = this.getSelectedPoint();
	},

/**
	* After edit handler
	* @private
	*/
	onAfterEdit: function(e) {
		this.pointsEditor.isNewItem = false;
		var store = this.pointsStore;
		var record = this.editingPoint;
		if (!record) { return; }
		// search for duplicates
		var duplicates = [];
		store.each(function(r) {
			if (r === record) { return; }
			if (r.get('x') == record.get('x')) {
				duplicates.push(r);
			}
		});
		if (duplicates.length > 0) {
			store.remove(duplicates);
		}
		store.sort();
		this.recordSet('conversion', this.getConversionPoints());
	},

/**
	* @private
	*/
	onCancelEdit: function() {
		if (this.pointsEditor.isNewItem) {
			this.pointsStore.removeAt(0);
			this.pointsEditor.isNewItem = false;
		}
	},

/**
	*
	*/
	checkValue: function() {
		// картинка загрузки
		this.setLoading(true);
		Ext.Ajax.request({
			url: '/' + this.conversionUrl + '/check',
			params: {
				conversion: this.getConversionPoints(true),
				smoothing: this.recordGet('smoothing') ? 1 : 0,
				x: this.fieldX.getValue()
			},
			callback: function(opts, success, response) {
				this.setLoading(false);
				if (!success) { return; }
				// ответ сервера
				var answer = C.utils.getJSON(response.responseText, opts);
				if (answer.success) {
					this.fieldX.setValue(answer.data.x);
					this.fieldY.setValue(
						Ext.util.Format.round(answer.data.y, 3)
					);
				}
			},
			scope: this
		});
	}
});
