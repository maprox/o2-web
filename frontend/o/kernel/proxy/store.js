/**
 * Прокси использующая ExtJS Store как источник информации
 * @class O.proxy.Store
 * @extends Ext.data.proxy.Client
 */
Ext.define('O.proxy.Store', {
	extend: 'Ext.data.proxy.Client',

/**
	* @cfg {Object} store
	* The ExtJS store object, which contains actual data.
	*/
	store: undefined,

/**
	* @cfg {Boolean} needReload
	*/
	needReload: true,

/**
	* Creates the proxy, throws an error if local storage is
	* not supported in the current browser.
	* @param {Object} config (optional) Config object.
	*/
	constructor: function(config) {
		this.callParent(arguments);
		/**
		 * @property {Object} cache
		 * Cached map of records already retrieved by this Proxy.
		 * Ensures that the same instance is always retrieved.
		 */
		this.cache = {};
		if (config.storeId === undefined) {
			Ext.Error.raise("You have to provide valid store Id");
		}
		this.store = Ext.data.StoreManager.lookup(config.storeId);
		if (typeof this.store != "object") {
			Ext.Error.raise("You have to provide valid store Id");
		}
	},

/**
	* Calls upon linked store to load data, passes current filters.
	* @param {Ext.data.Operation} operation The Operation to perform
	* @param {Function} callback Callback function to be called when
	* the Operation has completed (whether successful or not)
	* @param {Object} scope Scope to execute the callback function in
	* @method
	*/
	loadData: function(operation, callback, scope) {
		this.store.load(Ext.create('Ext.data.Operation', {
			action: 'read',
			filters: operation.filters,
			callback: function() {
				this.readLoaded(operation, callback, scope);
			},
			scope: this
		}));
		this.needReload = false;
	},

/**
	* Performs the given create operation.
	* @param {Ext.data.Operation} operation The Operation to perform
	* @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
	* @param {Object} scope Scope to execute the callback function in
	* @method
	*/
	create: function(operation, callback, scope) {
		this.store.getProxy().create(operation, callback, scope);
		var records = operation.records,
			length  = records.length,
			ids = this.getIds(operation),
			id, record, i;
		operation.setStarted();
		for (i = 0; i < length; i++) {
			record = records[i];
			if (record.phantom) {
				record.phantom = false;
			}
			var changes = record.getChanges();
			var proxyRecord = record.parent;
			if (proxyRecord) {
				proxyRecord.beginEdit();
				for (var key in changes) {
					proxyRecord.set(key, changes[key]);
				}
				proxyRecord.endEdit(true);
			}
		}
		operation.setCompleted();
		operation.setSuccessful();
		if (typeof callback == 'function') {
			callback.call(scope || this, operation);
		}
	},

/**
	* Performs the given read operation.
	* @param {Ext.data.Operation} operation The Operation to perform
	* @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
	* @param {Object} scope Scope to execute the callback function in
	* @method
	*/
	read: function(operation, callback, scope) {

		if (this.needReload) {
			this.loadData(operation, callback, scope);
		} else {
			this.readLoaded(operation, callback, scope)
		}
	},

/**
	* Performs actual read, when linked store finishes loading.
	* @param {Ext.data.Operation} operation The Operation to perform
	* @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
	* @param {Object} scope Scope to execute the callback function in
	* @method
	*/
	readLoaded: function(operation, callback, scope) {
		var records = [],
			ids = this.getIds(operation),
			length  = ids.length,
			i, recordData, record;

		//read a single record
		if (operation.id) {
			record = this.getRecord(operation.id);

			if (record) {
				records.push(record);
				operation.setSuccessful();
			}
		} else {
			for (i = operation.start; i < operation.start + operation.limit && i < length; i++) {
				records.push(this.getRecord(ids[i]));
			}
			operation.setSuccessful();
		}

		operation.setCompleted();

		operation.resultSet = Ext.create('Ext.data.ResultSet', {
			records: records,
			total: length
		});

		if (typeof callback == 'function') {
			callback.call(scope || this, operation);
		}
	},

/**
	* Performs the given update operation.
	* @param {Ext.data.Operation} operation The Operation to perform
	* @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
	* @param {Object} scope Scope to execute the callback function in
	* @method
	*/
	update: function(operation, callback, scope) {
		this.store.getProxy().update(operation, callback, scope);

		var records = operation.records,
			length = records.length,
			ids = this.getIds(operation),
			record, id, i;

		operation.setStarted();

		for (i = 0; i < length; i++) {
			record = records[i];

			//we need to update the set of ids here because it's possible that a non-phantom record was added
			//to this proxy - in which case the record's id would never have been added via the normal 'create' call
			id = record.getId();
			if (id !== undefined && Ext.Array.indexOf(ids, id) == -1) {
				ids.push(id);
			}

			var changes = record.getChanges();
			var proxyRecord = record.parent;

			if (proxyRecord) {
				proxyRecord.beginEdit();
				for (var key in changes) {
					proxyRecord.set(key, changes[key]);
				}
				proxyRecord.endEdit(true);
			}
		}

		operation.setCompleted();
		operation.setSuccessful();

		if (typeof callback == 'function') {
			callback.call(scope || this, operation);
		}
	},

/**
	* Performs the given destroy operation.
	* @param {Ext.data.Operation} operation The Operation to perform
	* @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
	* @param {Object} scope Scope to execute the callback function in
	* @method
	*/
	destroy: function(operation, callback, scope) {
		this.store.getProxy().destroy(operation, callback, scope);

		var records = operation.records,
			length  = records.length,
			ids = this.getIds(operation),

			//newIds is a copy of ids, from which we remove the destroyed records
			newIds  = [].concat(ids),
			i;

		for (i = 0; i < length; i++) {
			Ext.Array.remove(newIds, records[i].getId());
		}

		operation.setCompleted();
		operation.setSuccessful();

		if (typeof callback == 'function') {
			callback.call(scope || this, operation);
		}
	},

/**
	* @private
	* Fetches a model instance from the Proxy by ID. Runs each field's decode function (if present) to decode the data.
	* @param {String} id The record's unique ID
	* @return {Ext.data.Model} The model instance
	*/
	getRecord: function(id) {
		var proxyRecord, record;

		if (typeof id != "number") {

			proxyRecord = this.store.data.map[id];
			record = proxyRecord.copy();
			record.phantom = true;
		} else {

			proxyRecord = this.store.getById(id);
			record = proxyRecord.copy();
		}

		record.parent = proxyRecord;

		return record;
	},

/**
	* @private
	* Returns the array of record IDs stored in this Proxy
	* @return {Number[]} The record IDs. Each is cast as a Number
	*/
	getIds: function(operation) {
		var groupers = operation.groupers || [];
		var sorters = operation.sorters || [];
		sorters = groupers.concat(sorters);
		this.store.sort(sorters);

		var data = this.store.data.clone();
		data = data.filter(operation.filters)

		return data.keys.clone();
	},

/**
	* @private
	* Saves the array of ids representing the set of all records in the Proxy
	* @param {Number[]} ids The ids to set
	*/
	setIds: function(ids) {},

/**
	* Destroys all records stored in the proxy and removes all keys and values used to support the proxy from the
	* storage object.
	*/
	clear: function() {
		this.store.clearAll();
	},

/**
	* @private
	* Abstract function which should return the storage object that data will be saved to. This must be implemented
	* in each subclass.
	* @return {Object} The storage object
	*/
	getStorageObject: function() {
		return this.store;
	}
});
