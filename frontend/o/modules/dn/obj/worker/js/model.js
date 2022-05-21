/**
 * @class O.dn.model.Worker
 * @extends O.x.model.Person
 */
C.define('O.dn.model.Worker', {
	extend: 'O.x.model.Person',
	model: 'Dn.Worker',

/**
	* Check if worker has given specialization
	* @param {String} spec Specialization to check
	*/
	hasSpecialization: function(spec) {
		var me = this;
		var posts = C.get('dn_worker_post');
		var hasSpec = false;
		if (posts) {
			posts.each(function(post) {
				if (me.id_post == post.id) {
					Ext.Array.each(post.specialization, function(name) {
						if (name === spec) {
							hasSpec = true;
						}
					});
				}
			});
		}
		return hasSpec;
	}
});

C.define('Dn.Worker', {
	extend: 'X.Person',
	fields: [
		{name: 'id_post', type: 'int', useNull: true,
			reference: 'dn_worker_post'},
		{name: 'employee_number', type: 'int', useNull: true}
	]
});