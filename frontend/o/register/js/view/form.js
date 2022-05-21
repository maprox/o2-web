/**
 * Registration form base ui class
 * @class O.register.BaseForm
 * @extend Ext.form.Panel
 */

Ext.define('O.register.BaseForm', {
	extend: 'Ext.form.Panel',
	id: 'registerForm',

/** Внешний вид */
	border: false,
	bodyPadding: 20,
	defaults: {
		xtype: 'textfield',
		labelWidth: 120,
		width: 500,
		allowBlank: false
	},

/**
	* Registration successful, display components successMessage
	*/
	successAction: function() {
		Ext.widget('window', {
			modal: true,
			width: 400,
			closable: false,
			resizable: false,
			bodyPadding: 40,
			html: '<h2 style="text-align: center">' +
				this.successMessage +
			'</h2>'
		}).show();
		Ext.getCmp('registerPanel').hide();
	}
});
