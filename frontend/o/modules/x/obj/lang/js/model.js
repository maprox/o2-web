/**
 * @class O.x.model.Lang
 * @extends O.model.Object
 */
C.define('O.x.model.Lang', {
	extend: 'O.model.Object',
	model: 'X.Lang'
});

C.define('X.Lang', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'display', type: 'string', convert: function(value, record){
				var name = record.get('name');

				var value = _('language_display_' + name);

				if (value == 'language_display_' + name) {
					return name;
				}

				return value;
			}},
			{name: 'state', type: 'int'}
		]
	}
});
