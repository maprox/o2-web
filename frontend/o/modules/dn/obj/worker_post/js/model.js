/**
 * @class O.dn.model.WorkerPost
 * @extends O.model.Object
 */
C.define('O.dn.model.WorkerPost', {
	extend: 'O.model.Object',
	model: 'Dn.WorkerPost'
});

C.define('Dn.WorkerPost', {
	extend: 'Ext.data.Model',
	set: function(fieldName, value) {
		this.callParent(arguments);
		if (this.modified.specialization) {
			this.data.spec_engineer = this.hasSpecialization('Engineer');
			this.data.spec_dispatcher = this.hasSpecialization('Dispatcher');
			this.data.spec_driver = this.hasSpecialization('Driver');
		}

    },
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_superior', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'specialization', type: 'auto'},
			{name: 'spec_driver', type: 'int', persist: false,
				convert: function(v, record) {
					/*if (v !== '') {
						return v;
					}*/
					return record.hasSpecialization('Driver');
				}
			},
			{name: 'spec_engineer', type: 'int', persist: false,
				convert: function(v, record) {
					/*if (v !== '') {
						return v;
					}*/
					return record.hasSpecialization('Engineer');
				}
			},
			{name: 'spec_dispatcher', type: 'int', persist: false,
				convert: function(v, record) {
					/*if (v !== '') {
						return v;
					}*/
					return record.hasSpecialization('Dispatcher');
				}
			},
			{name: 'state', type: 'int'}
		]
	},
/**
	 * Check if post has given specialization
	 * @param {String} specName Specialization
	 * @return {Boolean}
	 */
	hasSpecialization: function(specName) {
		var spec = this.get('specialization');
		var hasSpec = false;
		Ext.Array.each(spec, function(name) {
			if (name == specName) {
				hasSpec = true;
			}
		});
		return hasSpec;
	}
});
