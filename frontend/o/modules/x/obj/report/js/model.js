/**
 * @class O.x.model.Report
 * @extends O.model.Object
 */
C.define('O.x.model.Report', {
	extend: 'O.model.Object',
	model: 'X.Report'
});

C.define('X.Report', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'}, // database identifier
			{name: 'name', type: 'string'}, // name of the report
			{name: 'identifier', type: 'string'}, // report unique string id
			{name: 'remote_path', type: 'string'}, // alias within report server
			{name: 'params', type: 'auto'}, // array of report parameters
			{name: 'invisible', type: 'bool'}
		]
	}
});
