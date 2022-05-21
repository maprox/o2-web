/**
 * @fileOverview Product norm panel
 *
 * @class O.act.panel.ProductNorm
 * @extends C.ui.Panel
 */
C.define('O.act.panel.ProductNorm', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_productnorm',

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