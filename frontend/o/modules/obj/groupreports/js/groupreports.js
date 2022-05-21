/**
 * @fileOverview Класс пакета документов
 *
 * @class O.model.GroupReports
 * @extends O.model.Group
*/
C.define('O.model.GroupReports', {
	extend: 'O.model.Group'
});

C.define('GroupReports', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'}
		]
	}
});
