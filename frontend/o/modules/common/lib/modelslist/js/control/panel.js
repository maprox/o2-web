/**
 * @class O.common.lib.modelslist.Panel
 */
C.utils.inherit('O.common.lib.modelslist.Panel', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.list) {
			this.list.on({
				select: 'onListSelect',
				loaded: 'onListLoaded',
				remove: 'onListRemove',
				update: 'onListUpdate',
				lock: 'onChildLock',
				unlock: 'onChildUnlock',
				scope: this
			});
		}
		if (this.tabs) {
			this.tabs.on({
				lock: 'onChildLock',
				unlock: 'onChildUnlock',
				beforetabsload: function() {
					this.list.setLoading(true);
				},
				aftertabsload: function() {
					this.list.setLoading(false);
				},
				listlock: 'onListLock',
				scope: this
			});
		}
	},

/**
	 * On list lock
	 * @param Boolean lock
	 */
	onListLock: function(lock) {
		this.list.setLock(lock);
	},

/**
	* Set firm id
	* Adds list filter by id_firm
	*/
	setFirmId: function(firmId) {
		this.firmId = firmId;

		this.list.setFirmId(firmId);
		this.tabs.setFirmId(firmId);

		// Add filter
		this.addListFilter('id_firm', firmId);
	},

/**
	* Returns currently selected record
	* @return {Ext.data.Model}
	*/
	getSelectedRecord: function() {
		return this.list.getSelectedRecord();
	},

/**
	* List item selection
	* @private
	*/
	onListSelect: function() {
		// load record into tabs
		//console.log('onListSelect', arguments);
		var record = this.getSelectedRecord();
		this.tabs.selectRecord(record);
		if (!record.getId()) {
			this.tabs.disable();
		}
	},

/**
	* Load event of a list
	*/
	onListLoaded: function() {
		//console.log('onListLoaded', arguments);
		this.tabs.selectRecord(this.getSelectedRecord());
	},

/**
	* List item remove
	*/
	onListRemove: function() {
		//console.log('onListRemoved', arguments);
		this.tabs.selectRecord(this.getSelectedRecord());
	},

/**
	* List items update
	*/
	onListUpdate: function(cmp, record, data) {
		//console.log('onListUpdated', arguments);
		this.tabs.selectRecord(this.getSelectedRecord());
	},

/**
	* Child panel lock event handler
	*/
	onChildLock: function(child) {
		this.lock();
		return false;
	},

/**
	* Child panel unlock event handler
	*/
	onChildUnlock: function(child) {
		this.unlock();
		return false;
	},

/**
	* Adds filter to list
	*/
	addListFilter: function(field, value) {
		this.list.addFilter(field, value);
	}
});
