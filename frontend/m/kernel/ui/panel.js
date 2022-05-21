/**
 * @copyright  2012, Maprox LLC
 *
 * Base class for application module panel
 * @class C.ui.Panel
 */
C.utils.inherit('C.ui.Panel', {

/**
	* Initialization
	*/
	initialize: function() {
		if (this.module && this.module instanceof C.ui.Module) {
			Ext.apply(this.config, {
				title: this.module.textShort,
				iconCls: this.module.iconCls || this.module.id
			});
		}
		this.callParent(arguments);
	},

/**
	* Locks panel while loading data
	*/
	lock: function() {
		this.mask({
			xtype: 'loadmask',
			message: _('Loading') + '...'
		});
	},

/**
	* Unlock panel
	*/
	unlock: function() {
		this.unmask();
	}

});
