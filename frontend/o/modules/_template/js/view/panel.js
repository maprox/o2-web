/**
 * Service desk issues list
 * @class O.sdesk.Issues
 * @extends C.ui.Panel
 */
C.define('O.sdesk.Issues', {
	extend: 'C.ui.Panel',
	alias: 'widget.sdesk-issues',

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