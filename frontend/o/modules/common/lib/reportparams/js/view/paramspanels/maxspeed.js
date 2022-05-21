/**
 * @fileOverview Maxspeed panel
 *
 * @class O.reports.MaxspeedPane
 * @extends O.reports.SimplePanel
 */
C.define('O.reports.MaxspeedPanel', {
	extend: 'O.reports.SimplePanel',
	title: 'Max speed',
	fieldXType: 'numberfield',
	defaultValue: 60,
	additionalParameters: {
		allowDecimals: false,
		allowBlank: false
	},

	/**
	* Component initialization
	* @constructs
	*/
	initComponent: function() {
		this.callParent(arguments);
		// Init validity
		this.itemChange();
	}
});