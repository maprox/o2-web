C.define('X.Group.Abstract', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_creator', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'items', type: 'object'},
			{name: 'state', type: 'int', useNull: true},
			{name: '$accessGroupGrant', type: 'object'},
			{name: '$accessGroupRevoke', type: 'object'},
			{name: '$accesslist', type: 'object', persist: false},
			{name: 'items_added', type: 'object'},
			{name: 'items_removed', type: 'object'}
		]
	},

/**
	* Returns specified type ids of each
	*/
	getAccessIds: function(type) {
		var user = [];
		Ext.Array.each(this.get('$accesslist'), function(el) {
			if (el['id_' + type]) {
				user.push(el['id_' + type]);
			}
		});

		return user;
	}
});
