/**
 * Conversions from id to data
 * @class O.convert
 * @singleton
 */

Ext.define('O.convert', {

	singleton: true,

/**
	* Placeholder for Ext.data.Store instances
	* @cfg {Ext.data.Store[]}
	*/
	stores: {},

/**
	* Placeholder for O.convert.EventText instance
	*/
	eventConverter: null,

/**
	* Converts information about event into text.
	* Uses O.convert.EventText
	* @param {Ext.data.Model} record
	* @param {Object} templates
	* @return {String}
	*/
	eventText: function(record, templates) {
		if (this.eventConverter == null) {
			this.eventConverter = Ext.create('O.convert.EventText');
		}

		return this.eventConverter.convert(record, templates.tpl);
	},

/**
	* Converts date into object,
	* changes time to local according to utc settings
	* @param {String} date
	* @return {Date}
	*/
	date: function(date) {
		var utcval = C.getSetting('p.utc_value');

		var dt = new Date().pg_fmt(date);
		return (dt) ? dt.pg_utc(utcval) : null;
	},

	/**
	 * Converts float distance into readable string
	 * @param {Float} distance
	 * @return {String}
	 */
	distance: function(distance) {
		var km = (distance / 1000).toFixed(1);
		return km + ' ' + _('km');
	},

/**
	* Converts warehouse id into its name
	* @param {Integer} value
	* @return {String}
	*/
	warehouse: function(value) {
		return O.convert.fromStore('dn_warehouse_list', value, 'name');
	},

/**
	* Converts warehouse id into its address
	* @param {Integer} value
	* @return {String}
	*/
	warehouseAddress: function(value) {
		return O.convert.fromStore('dn_warehouse_list', value, 'address');
	},

/**
	* Converts product id into its name
	* @param {Integer} value
	* @return {String}
	*/
	product: function(value) {
		return O.convert.fromStore('dn_product', value, 'fullname');
	},

/**
	* Converts product id into its code
	* @param {Integer} value
	* @return {String}
	*/
	productCode: function(value) {
		return O.convert.fromStore('dn_product', value, 'code');
	},

/**
	* Converts product id into its nomenclature name
	* @param {Integer} value
	* @return {String}
	*/
	productNom: function(value) {
		return O.convert.fromStore('dn_product', value, 'measure');
	},

/**
	* Common function for getting information from store by its id
	* @param {String} storeName
	* @param {Integer} value
	* @param {String} dataIndex
	* @return {Mixed}
	*/
	fromStore: function(storeName, value, dataIndex) {
		try {
			if (!this.stores[storeName]) {
				this.stores[storeName] = C.getStore(storeName);
			}

			var store = this.stores[storeName];
		} catch (e) {
			console.error(e);
			console.warn("Check that store " + storeName + " is included in config file");
			return value;
		}

		var record = store.getById(value);

		if (Ext.isEmpty(record)) {
			return value;
		}

		return record.get(dataIndex);
	}
});

/**
 * @class O.convert.EventText
 * Converts information about event (eventid, eventval, ownerid, etc...)
 * into text string according to passed templates
 */

Ext.define('O.convert.EventText', {

	templates: null,

	convert: function(record, templates) {
		this.templates = templates;
		var text = '';
		C.get('mon_geofence', function(zones) {
		C.get('mon_device', function(devices) {
			var model = {
				zones: zones,
				devices: devices
			};
			if (record.get('dt') != null) {
				text = this.getEventText(model, record);
			}
		}, this);
		}, this);
		return text;
	},

/**
	* Функция получения темплейта
	*/
	getEventTemplate: function(eventId, eventVal) {
		if (this.templates[eventId] === undefined) { return null; }
		if (this.templates[eventId]['any'] !== undefined) { eventVal = 'any'; }
		if (this.templates[eventId][eventVal] === undefined) { return null; }
		var tpl = this.templates[eventId][eventVal];
		if (Ext.isString(tpl)) {
			tpl = new Ext.XTemplate(tpl, {
				getName: function(v) {
					if (v && v.getName) {
						return v.getName();
					}
					return '';
				}
			});
			this.templates[eventId][eventVal] = tpl;
		}
		return tpl;
	},

/**
	* Получение текста события для грида.
	* TODO придумать как переделать
	*/
	getEventText: function(model, record) {
		var res = '';
		try
		{
			var eventId = record.get('eventid');
			var eventVal = record.get('eventval');
			var tpl = this.getEventTemplate(eventId, eventVal);
			if (tpl instanceof Ext.XTemplate) {
				model.event = record.data;
				res = tpl.apply(model);
			}
		}
		catch (e)
		{
			O.msg.error({msg: e});
		}
		return res;
	}
});
