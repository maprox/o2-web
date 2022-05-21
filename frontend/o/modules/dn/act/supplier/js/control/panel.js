/**
 *
 * @class O.act.panel.dn.Supplier
 */
C.utils.inherit('O.act.panel.dn.Supplier', {
/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on({
			afterrender: this.onAfterRender,
			scope: this
		});
		this.supplierList.on({
			select: this.onSupplierListSelect,
			beforeaction: this.onSupplierListBeforeAction,
			afteraction: this.onSupplierListAfterAction,
			scope: this
		})
	},

/**
	* After render actions
	* @protected
	*/
	onAfterRender: function() {
		this.supplierView.disable();
	},

/**
	* Fires when supplier is selected in list of suppliers
	* @param {O.act.panel.dn.SupplierList} this
	* @param {Number} supplierId Identifier of a supplier
	* @param {modelSupplierAccount} record Store record
	*/
	onSupplierListSelect: function(list, supplierId, record) {
		this.supplierView.enable();
		this.supplierView.select(record);
	},

/**
	* Fires before an action on supplier is executed
	* @param {O.act.panel.dn.SupplierList} this
	* @param {Strign} action Name of an action
	*    Possible values are 'activated', 'removed'
	* @param {Number} supplierId Identifier of a supplier
	*/
	onSupplierListBeforeAction: function() {
		this.supplierView.disable();
	},

/**
	* Fires when an action on supplier was finished
	* @param {O.act.panel.dn.SupplierList} this
	* @param {Strign} action Name of an action
	*    Possible values are 'activated', 'removed'
	* @param {Number} supplierId Identifier of a supplier
	* @param {Boolean} success False if error occured
	*/
	onSupplierListAfterAction: function(list, action, supplierId, success) {
		if (action !== 'remove') {
			this.supplierView.reset();
			this.supplierView.enable();
		}
	}
});