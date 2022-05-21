/**
 * OfferValue object
 * @class O.model.dn.OfferValue
 * @extends O.model.Object
 */
C.define('O.model.dn.OfferValue', {
	extend: 'O.model.Object'
});

C.define('Dn.OfferValue', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id_offer', type: 'int'},
			{name: 'id_warehouse', type: 'int'},
			{name: 'id_warehouse$name', type: 'string'},
			{name: 'id_warehouse$address', type: 'string'},
			{name: 'id_region', type: 'int'},
			{name: 'id_region$name', type: 'string'},
			{name: 'id_product', type: 'int'},
			{name: 'id_product$name', type: 'string'},
			{name: 'price', type: 'float'},
			{name: 'feednorm_count'},
			{name: 'feednorm_value'},
			{name: 'measure', type: 'string', convert: function(value) {
				if (Ext.isString(value)) {
					return value;
				}				
				return value.name || '';
			}},
			{name: 'code', type: 'string', convert: function(value) {
				if (Ext.isNumber(value) || Ext.isString(value)) {
					return value;
				}
				return value.code || 0;
			}},
			{name: 'amount', type: 'float', convert: function(value, record) {
				if (Ext.isEmpty(value)) {
					var count = record.get('feednorm_count').count || 0;
					var amount = record.get('feednorm_value').amount || 0;
					return count * amount * 30;					
				}

				return value;
			}}
		]
	}
});
