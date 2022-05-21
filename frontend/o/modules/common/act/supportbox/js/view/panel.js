/**
 * @class O.common.act.supportbox.Panel
 */
C.define('O.common.act.supportbox.Panel', {
	extend: 'Ext.form.Panel',
	alias: 'widget.supportbox',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			border: false,
			cls: 'supportbox',
			layout: {
				type: 'anchor',
				align: 'stretch'
			},
			defaults: {
				labelAlign: 'top',
				anchor: '100%'
			},
			items: [{
				xtype: 'textfield',
				id: 'support-box-email',
				fieldLabel: _('Email'),
				name: 'email',
				vtype: 'email',
				hidden: !(this.showemail === true)
			}, {
				xtype: 'textarea',
				anchor: '100% 100%',
				id: 'support-box-textarea',
				fieldLabel: _('Message'),
				name: 'message'
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				items: [{
					id: 'support-box-send',
					xtype: 'button',
					text: _('Send'),
					disabled: true
				}]
			}]
		});
		this.callParent(arguments);
		// init components
		this.sendButton = this.down('#support-box-send');
		this.emailField = this.down('#support-box-email');
		this.textareaField = this.down('#support-box-textarea');
		this.supportForm = this.getForm();
	}
});