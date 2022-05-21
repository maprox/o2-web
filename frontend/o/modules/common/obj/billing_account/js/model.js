/**
 * Account object
 * @class O.model.billing.Account
 * @extends O.model.Object
 */
C.define('O.model.billing.Account', {
	extend: 'O.model.Object'
});

C.define('Billing.Account', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'num', type: 'int'},
			{name: 'id_type', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_tariff', type: 'int'},
			{name: 'billing_disabled', type: 'int'},
			{name: 'tariff', type: 'string'},
			{name: 'tariff_sdt', type: 'date', dateFormat: 'c'},
			{name: 'tariff_edt', type: 'date', dateFormat: 'c'},
			{name: 'new_tariff', type: 'object'},
			{name: 'sdt', type: 'string', convert: function(value) {
				return C.utils.fmtDate(new Date().pg_fmt(value), O.format.Date);
			}},
			{name: 'balance', type: 'float'},
			{name: 'balance_fmt', type: 'string', persist: false,
				convert: function(value, record) {
					var balance = record.get('balance');
					return Ext.util.Format.ruMoney(balance);
				}},
			{name: 'limitvalue', type: 'float'},
			{name: 'limitvalue_fmt', type: 'string', persist: false,
				convert: function(value, record) {
					var limitvalue = record.get('limitvalue');
					return Ext.util.Format.ruMoney(limitvalue);
				}},
			{name: 'limitvalue_edt', type: 'string', convert: function(value) {
				return C.utils.fmtDate(new Date().pg_fmt(value), O.format.Date);
			}},
			{name: 'limittext', type: 'string', convert: function(value, record) {
				var value = record.get('limitvalue_fmt'),
					edt = record.get('limitvalue_edt');
				if (!edt) {
					return value;
				}
				return value + ' (' + _('until') + ' ' + edt + ')';
			}}
		]
	}
});
