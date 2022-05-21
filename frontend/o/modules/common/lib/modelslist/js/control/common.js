/**
 * Interface class for common modelslist tabs and list tasks
 * @class O.common.lib.modelslist.Common
 */
C.define('O.common.lib.modelslist.Common', {
/**
	* Correct combobox values, wich were entered as new strings
	* @param {Object} data
	*/
	correctNaN: function(data) {
		Ext.iterate(data, function(key, value) {
			if (!value && isNaN(value)) {
				delete data[key];
				var fieldValue = this.getFieldValue(key);
				if (fieldValue !== undefined) {
					data[key + C.cfg.newFieldPostfix] = fieldValue;
				}
			}
		}, this);
	},

/**
	* Loads foreign proxies if foreign data was created
	* @param {Ext.data.Model} record
	* @param {Object} data
	* @param {Function} callback
	* @param {Object} scope
	*/
	loadForeignProxies: function(record, data, callback, scope) {
		var updatedProxies = [];
		record.fields.each(function(field) {
			var fieldNameNew = field.name + C.cfg.newFieldPostfix;
			if (data[fieldNameNew] !== undefined &&
				field.reference !== undefined) {
				updatedProxies.push(field.reference);

				// check proxy as "dirty"
				var proxy = O.manager.Model.getProxy(field.reference);
				if (proxy && proxy.setDirty) {
					proxy.setDirty();
				}
			}
		});
		if (updatedProxies.length > 0) {
			C.get(updatedProxies, callback, scope);
		} else {
			callback.apply(scope || this);
		}
	}

});