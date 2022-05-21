/**
 * @fileOverview Catering facilities panel
 *
 * @class O.act.panel.CateringFacilities
 * @extends C.ui.Panel
 */
C.define('O.act.panel.CateringFacilities', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_cateringfacilities',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			html: this.alias
		});
		this.callParent(arguments);
	}
});
