/**
 * @fileOverview Product supply panel
 *
 * @class O.act.panel.ProductSupply
 * @extends C.ui.Panel
 */
C.define('O.act.panel.ProductSupply', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_productsupply',

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