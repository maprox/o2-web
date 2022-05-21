/**
 * @class O.comp.Schedule
 */
C.inherit('O.comp.Schedule', {
/**
	* Сброс полей
	*/
	resetFields: function() {
		this.noFire = true;
		this.down('#fieldFrom').setValue('08:00');
		this.down('#fieldTo').setValue('18:00');
		this.down('#mon0').setValue(0);
		this.down('#tue0').setValue(0);
		this.down('#wed0').setValue(0);
		this.down('#thu0').setValue(0);
		this.down('#fri0').setValue(0);
		this.down('#sat0').setValue(0);
		this.down('#sun0').setValue(0);
		this.down('#mon1').setValue(1);
		this.down('#tue1').setValue(1);
		this.down('#wed1').setValue(1);
		this.down('#thu1').setValue(1);
		this.down('#fri1').setValue(1);
		this.down('#sat1').setValue(1);
		this.down('#sun1').setValue(1);
		this.down('#mon2').setValue(0);
		this.down('#tue2').setValue(0);
		this.down('#wed2').setValue(0);
		this.down('#thu2').setValue(0);
		this.down('#fri2').setValue(0);
		this.down('#sat2').setValue(0);
		this.down('#sun2').setValue(0);
	},

/**
	* Установка расписания
	* @param Object data Данные расписания
	*/
	setSchedule: function(data) {
		// данные расписания
		if (!data) { return; }
		data = Ext.clone(data);
		this.scheduleId = data.id;

		// from and to
		var uval = C.getSetting('p.utc_value');
		data.from = new Date(data.from).pg_utc(uval);
		data.to = new Date(data.to).pg_utc(uval);
		if (isNaN(data.from.getTime())) {
			data.from = '08:00';
		} else {
			data.from = Ext.Date.format(data.from, 'H:i');
		}
		if (isNaN(data.to.getTime())) {
			data.to = '18:00';
		} else {
			data.to = Ext.Date.format(data.to, 'H:i');
		}

		var setData = {};
		Ext.Object.each(data, function(key, value){
			setData['schedule.' + key] = value;
		});

		if (!('schedule.mon' in setData)) {
			setData['schedule.mon'] = 1;
		}
		if (!('schedule.tue' in setData)) {
			setData['schedule.tue'] = 1;
		}
		if (!('schedule.wed' in setData)) {
			setData['schedule.wed'] = 1;
		}
		if (!('schedule.thu' in setData)) {
			setData['schedule.thu'] = 1;
		}
		if (!('schedule.fri' in setData)) {
			setData['schedule.fri'] = 1;
		}
		if (!('schedule.sat' in setData)) {
			setData['schedule.sat'] = 1;
		}
		if (!('schedule.sun' in setData)) {
			setData['schedule.sun'] = 1;
		}
		this.getForm().setValues(setData);
	},

/**
	* Загрузка расписания в панель
	* @param {Integer} id Идентификатор расписания
	*/
	loadSchedule: function(id) {
		var schedule = this;
		// Не оповещаем об изменениях полей,
		// т.к. здесь они изменяются загрузчиком
		this.noFire = true;
		// картинка загрузки
		if (this.setLoadingable) {
			this.setLoading(true);
		}
		// запрос расписаний
		C.get('schedules', function(s, success) {
			// сброс полей
			schedule.resetFields();
			if (success) {
				schedule.setSchedule(s.items[0]);
			}
			// включаем оповещения обратно
			schedule.noFire = false;
			// выключаем картинку загрузки
			if (schedule.setLoadingable) {
				schedule.setLoading(false);
			}
		}, this, {scheduleId: id});
	},

/**
	* Получение данных по расписанию
	* @return Object
	*/
	getSchedule: function() {
		var uval = C.getSetting('p.utc_value');
		var tf = this.down('#fieldFrom').getValue();
		var tt = this.down('#fieldTo').getValue();
		if (!tf || !tt) {
			return null;
		}
		return {
			id: this.scheduleId,
			from: tf.pg_utc(uval, true),
			to: tt.pg_utc(uval, true),
			mon: this.down('#mon1').getGroupValue(),
			tue: this.down('#tue1').getGroupValue(),
			wed: this.down('#wed1').getGroupValue(),
			thu: this.down('#thu1').getGroupValue(),
			fri: this.down('#fri1').getGroupValue(),
			sat: this.down('#sat1').getGroupValue(),
			sun: this.down('#sun1').getGroupValue()
		};
	},

/**
	* Сохранение расписания
	*/
	saveChanges: function() {
		var schedule = this;
		// картинка загрузки
		if (this.setLoadingable) {
			this.setLoading(true);
		}
		// собираем данные для изменения
		var data = this.getSchedule();
		if (!data) { return; }
		// запрос на изменение данных
		O.manager.Model.set('schedules', data, function(success) {
			if (success) {
				// перезагрузка
				schedule.loadSchedule(schedule.scheduleId);
			} else if (schedule.setLoadingable) {
				// выключаем картинку загрузки
				schedule.setLoading(false);
			}
		}, this);
	},

	/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record) { return; }
		// Save "from" and "to" in utc +0
		var schedule = this.getSchedule();
		if (!schedule) { return; }
		this.getForm().updateRecord(record);
		var rsch = record.get('schedule');
		if (rsch) {
			rsch.from = schedule.from;
			rsch.to = schedule.to;
		}
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		var schedule = record.get('schedule') || {};
		schedule.id = record.get('id_schedule');

		this.setSchedule(schedule);
		this.fireEvent('recordload', this, record, noReset);
	}
});
