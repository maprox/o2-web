/**
 * Objects group model
 * @class O.groups.zones.model.Object
 * @extends O.lib.grouplist.model.Object
 */
C.define('O.groups.zones.model.Object', {
	extend: 'O.lib.grouplist.model.Object',
	config: {
		fields: [
			{name: 'devicecount', type: 'int'}
		]
	}
});
