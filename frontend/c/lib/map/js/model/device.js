/**
 * Device adding and manipulating functionality
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.Device
 * @extends Ext.Base
 */

Ext.define('C.lib.map.Device', {
	extend: 'C.lib.map.Packet',

	/**
	 * @protected
	 * @cfg Ext.util.MixedCollection
	 */
	devices: null,

	/**
	 * Метод, возвращающий указатель на список устройств.
	 * При необходимости объект списка создается
	 * @returns Ext.util.MixedCollection
	 * @protected
	 */
	getDevices: function() {
		if (!this.devices) {
			this.devices = new Ext.util.MixedCollection();
		}
		return this.devices;
	},

	/**
	 * Перерисовывает указанные устройства
	 * @param {O.mon.model.Device[]} devices Массив Объектов устройств
	 */
	redrawDevices: function(devices) {
		for (var i = 0; i < devices.length; i++) {
			var device = devices[i];
			this.deviceRemove(device);
			if (device.state === C.cfg.RECORD_IS_ENABLED) {
				this.deviceAdd(device);
			}
		}
	},

	/**
	 * Центрирует на выбранном устройстве
	 */
	focusSelectedDevice: function() {
		if (!this.isLoaded()) { return; }

		var selectedId = this.getSelectedObject('mon_device'),
			selected = this.getDevices().getByKey(selectedId);

		if (selected) {
			var packet = selected.getLastPacket(true);
			if (packet) {
				this.getEngine().moveToPoints([packet]);
			}
		}
	},

	/**
	 * Обновление списка выбранных устройств на карте.
	 * В качестве параметра list может выступать массив идентификаторов устройств
	 * либо массив объектов {@link O.mon.model.Device}
	 * @param {O.mon.model.Device[]} list Список выбранных устройств
	 * @param {Boolean} redraw Необходимость перерисовки карты
	 * @param {Boolean} selectionChange
	 */
	setDevices: function(list, redraw, selectionChange) {
		this.clearDevices(); // очищаем предыдущий список устройств

		/** Полный список всех устройств, доступных пользователю */
		C.get('mon_device', function(mlistTotal) {
			// пробегаем по списку переданных идентификаторов
			// (или объектов O.mon.model.Device)
			for (var i = 0; i < list.length; i++) {
				var item = list[i];
				if (item instanceof O.mon.model.Device) {
					this.deviceAdd(item);
				} else {
					this.deviceAdd(mlistTotal.get(item));
				}
			}
			redraw = (redraw === undefined) ? true : redraw;
			if (redraw) {
				this.updateMap();
			}
			if (selectionChange) {
				this.focusSelectedDevice();
			}
		}, this);
	},

	/**
	 * Метод, который убирает все устройства с карты
	 */
	clearDevices: function() {
		var mlist = this.getDevices();
		while (mlist.getCount() > 0) {
			this.deviceRemove(mlist.first());
		}
	},

	/**
	 * Добавление устройства к списку
	 * @param {O.mon.model.Device} device
	 * @private
	 */
	deviceAdd: function(device) {
		/** Список устройств, загруженных в карту */
		var mlist = this.getDevices();
		if (device instanceof O.mon.model.Device && !mlist.contains(device)) {
			if (this.isLoaded()) {
				this.deviceDraw(device);
			}
			mlist.add(device);
		}
	},

	/**
	 * Отрисовка устройства на карте
	 */
	deviceDraw: Ext.emptyFn,

	/**
	 * Удаление устройства из списка слежения
	 * @param {O.mon.model.Device} m
	 * @private
	 */
	deviceRemove: function(m) {
		/** Список устройств, загруженных в карту */
		var mlist = this.getDevices();
		if (m instanceof O.mon.model.Device && mlist.contains(m)) {
			if (this.isLoaded()) {
				this.deviceErase(m);
			}
			mlist.remove(m);
		}
	},

	/**
	 * Стирание устройства с карты
	 */
	deviceErase: Ext.emptyFn
});
