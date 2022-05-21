/**
 * FeednormValue proxy object
 * @class O.proxy.dn.FeednormValue
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.FeednormValue', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_feednorm_value',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Feednorms',
	needPreload: true,

	model: 'Dn.FeednormValue',

	values: {
		region: {},
		warehouse: {}
	},

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.FeednormValue,
	updateStores: function(data) {
		this.values = {
			region: {},
			warehouse: {}
		};
		for (var i = 0, l = data.length; i < l; i++) {
			var v = data[i],
				type = v.id_region ? 'region' : 'warehouse',
				id = v['id_' + type] + '';
			if (!this.values[type][id]) {
				this.values[type][id] = {};
			}
			this.values[type][id][v.id_product + ''] =
				parseInt(v.amount * v.count * 30 * 10);
		}
	},

	getValue: function(id, type, productId) {
		var value = 0;
		if (this.values[type] && this.values[type][id]
			&& this.values[type][id][productId]) {
			value = this.values[type][id][productId] / 10;
		}
		return value;
	}

}, function() {
	this.prototype.superclass.register(this);
});
