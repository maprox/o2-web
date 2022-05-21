/**
 *
 * @class O.act.panel.dn.SupplierView
 */
C.utils.inherit('O.act.panel.dn.SupplierView', {
/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on({
			afterrender: this.onAfterRender,
			scope: this
		});
	},

/**
	* After render actions
	* @protected
	*/
	onAfterRender: function() {
		// this.gridStore.load();
	},

/**
	* Loads data for a supplier by his identifier
	* @param {Object} record Supplier record object
	*/
	select: function(record) {
		this.lock();
		this.tabDocs.setSelectedSupplier(record.data.id_firm_client,
			record.data.state);
		Ext.Ajax.request({
			url: '/dn_supplier/get',
			params: {
				data: Ext.JSON.encode({
					supplier: record.get('id_firm_client')
				})
			},
			callback: function(opts, success, response) {
				// server response
				var answer = C.utils.getJSON(response.responseText, opts);
				if (answer.success) {
					this.loadInfo(answer.data['info'], record);
					this.loadDocs(answer.data['docs']);
				}
				this.unlock();
			},
			scope: this
		});
	},

/**
	* Loading information for supplier
	* @param {Object} data
	*/
	loadInfo: function(data, record) {
		if (!data) { return; }
		this.tabInfo.load(data, record);
	},

/**
	* Loading documents for supplier
	* @param {Object} data
	*/
	loadDocs: function(data) {
		if (!data) { return; }
		console.log(data);
	},

/**
	* Resets supplier tabs
	*/
	reset: function() {
		//
	}
});
