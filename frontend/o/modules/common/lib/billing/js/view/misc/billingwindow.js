/**
 * @class O.window.Billing
 * @extends Ext.window.Window
 */
C.define('O.window.Billing', {
	extend: 'Ext.window.Window',

	modal: true,
	width: 300,
	bodyPadding: 10,
	border: false,

	layout: {
		type: 'fit',
		align: 'center'
	}
});
