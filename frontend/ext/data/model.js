/**
 * @class Ext.data.Model
 */
C.utils.inherit('Ext.data.Model', {
/**
	* @constructor
	*/
	constructor: function(data) {
		// override of base Ext.data.Model for support of initialData
		this.initialData = data || {};
		this.callOverridden(arguments);
	},

	/**
	 * Returns the value of the given field
	 * @param {String} fieldName The field to fetch the value for
	 * @return {Object} The value
	 */
	get: function(field) {
		if (field && field.indexOf('.') != -1) {
			var parts = field.split('.');
			field = parts.shift();
			var key = parts.join('.');
			var fieldDefinition = this.fields.get(field);
			if (fieldDefinition && fieldDefinition.type.type == 'object') {
				return this[this.persistenceProperty][field][key];
			}
		}
		return this[this.persistenceProperty][field];
	},

	/**
	 * Sets the given field to the given value, marks the instance as dirty
	 * @param {String/Object} fieldName The field to set, or an object containing key/value pairs
	 * @param {Object} newValue The value to set
	 * @return {String[]} The array of modified field names or null if nothing was modified.
	 */
	set: function (fieldName, newValue) {
		var single = (typeof fieldName == 'string');

		if (single) {
			return this.callParent(arguments);
		}

		// find "object" fields
		var fields = this.fields,
			values = fieldName,
			obj = {};

		// get object type fields
		//var fieldsObject = fields.obj_fieldsObject;
		var fieldsObject = [];

		for (var j = 0; j < fields.length; j++) {
			var fi = fields.getAt(j);
			if (fi.type.type === 'object') {
				fieldsObject.push(fi);
			}

			if (values.hasOwnProperty(fi.name)) {
				obj[fi.name] = values[fi.name];
			}
			// combobox "id_some_entity$new" field
			var newVal = fi.name + C.cfg.newFieldPostfix;
			if (newVal in values) {
				this.modified[newVal] = values[newVal];
			}
		}

		for (var i = 0; i < fieldsObject.length; i++) {
			var f = fieldsObject[i],
				name = f.name,
				fieldObject = {};
			for (var key in values) {
				if (!values.hasOwnProperty(key)) { continue; }
				if (key.substring(0, name.length + 1) == name + '.') {
					var val = this.stringToJson(key, values[key]);
					Ext.apply(fieldObject, val[name]);
				}
			}
			if (!C.utils.isEmptyObject(fieldObject)) {
				obj[name] = fieldObject;
			}
		}

		return this.callParent([obj]);
	},

/**
	* Returns true if this model has field with specified name
	* @param {String} field Name of the field
	* @return {Boolean}
	*/
	hasField: function(field) {
		return (this.get(field) !== undefined);
	},

/**
	* Returns changes or data for model creation
	* @return {Object}
	*/
	getSubmitData: function() {
		var data = this.getChanges();
		if (!this.getId()) {
			// new record, so submit initial data
			Ext.applyIf(data, this.initialData);
		}
		// we don't want to change record identifier
		delete data.id;
		return data;
	},

/**
	* Returns record changes.
	* Rewritten to support combobox new values.
	* @return {Object}
	*/
	getChanges : function(){
		var modified = this.modified;
		var changes = {};
		for (var field in modified) {
			if (modified.hasOwnProperty(field)) {
				if (this.get(field) !== undefined && this.get(field) !== null) {
					changes[field] = this.get(field)
				} else {
					changes[field] = modified[field];
				}
			}
		}
		return changes;
	},


	/**
	 * Converts string like "entity.obj1.obj2" into object like
	 * <pre>
	 * entity: {
	*   obj1: {
	*     obj2: value
	*   }
	* }
	 * </pre>
	 * @param {String} str
	 * @param {Mixed} value
	 * @return {Object}
	 */
	stringToJson: function(str, value) {
		var result = {};
		var lastItem = null;
		var objPrev = null;
		var obj = result;
		var parts = str.split('.');
		for (var i = 0; i < parts.length; i++) {
			var item = parts[i];
			lastItem = item;
			obj[item] = {};
			objPrev = obj;
			obj = obj[item];
		}
		if (lastItem) {
			objPrev[lastItem] = value;
		}
		return result;
	}
});

C.utils.addPreprocessor(function(className, data) {
	if (data.config && data.config.fields && !data.fields) {
		data.fields = data.config.fields;
	}
	return data;
});
