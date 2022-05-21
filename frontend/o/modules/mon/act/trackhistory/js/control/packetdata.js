/**
 * Displays packet data
 * @class O.mon.trackhistory.PacketDat
 */
C.utils.inherit('O.mon.trackhistory.PacketData', {

	/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
	},

	/**
	* Функция назначения устройства, для отображения информации о нем.
	* @param {O.mon.model.Device} m Объект устройства
	*/
	setPacket: function(p) {
		this.packet = p;

		if (!(p instanceof O.mon.model.Packet)) {
			return;
		}
		var device = p.device;
		this.deviceId = device.id;

		// Params for property grid
		var params = [];

		// Name
		params.push({
			name: _('Name'),
			value: device.getName()
		});

		// Speed
		if (!p.isStaticPoint()) {
			params.push({
				name: _('Speed'),
				value: C.utils.fmtSpeed(p.speed)
			});

			// Odometer
			var odometer = (p.odometer_ext / 1000).toFixed(2);
			if (odometer) {
				params.push({
					name: _('Odometer'),
					value: odometer
				});
			}
		}

		// Coordinates
		var coordsValue = C.utils.fmtCoord(p);
		if (p.isStaticPoint()) {
			coordsValue = '<a href="#" class="set-coords">'
				+ coordsValue
				+ '</a>';
		}

		Ext.Array.push(params, [{
			name: _('Coords'),
			value: coordsValue
		}]);

		if (C.utils.equals(params, this.prevParams)) {
			return;
		}

		// Update store of a grid panel
		var store = this.down('gridpanel').getStore();
		this.updateStore(params, store);
		this.prevParams = params;

		// Update
		this.doLayout();
	},

/**
	 * Clears all data in grid
`	 */
	clearAll: function() {
		var params = {};
		var store = this.down('gridpanel').getStore();
		this.updateStore(params, store);
	},

	/**
	* Обновляет Store, записывает туда свойства
	* @param {Object[]} params данные для записи
	* @param {Ext.data.Store} store
	*/
	updateStore: function(params, store) {
		// Заносим все значения в стор
		store.removeAll();

		// Странный баг, с неудалением этих моделей из менеджера. Удалим вручную.
		Ext.ModelManager.each(function(key, model) {
			if (model.$className == 'O.mon.model.PacketProp') {
				Ext.ModelManager.unregister(model);
			}
		});

		var data = [];
		for (var i = 0; i < params.length; i++) {
			data.push({
				packetItemName: params[i].name,
				packetItemValue: params[i].value
			});
		}
		store.add(data);
	}
});