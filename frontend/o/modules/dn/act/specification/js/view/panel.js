/**
 *
 * Specifications list
 * @class O.comp.dn.Specification
 * @extends C.ui.Panel
 */
C.define('O.comp.dn.Specification', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_dn_specification',

/** Translated fields */

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			html: this.alias
		});
		this.callParent(arguments);
	}
});