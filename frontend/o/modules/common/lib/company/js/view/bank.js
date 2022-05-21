/**
 * @class O.x.lib.company.tab.Bank
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.lib.company.tab.Bank', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-company-tab-bank',

	/**
	 * @constructor
	 */
	initComponent: function() {
		Ext.apply(this, {
			title: _('Bank details'),
			itemId: 'bank',
			bodyPadding: 10,
			layout: 'anchor',
			autoScroll: true,
			defaultType: 'textfield',
			items: [{
				name: this.prefix + 'bank.bank_name',
				fieldLabel: _('Bank name'),
				allowBlank: true
			}, {
				name: this.prefix + 'bank.bank_bik',
				fieldLabel: _('BIK'),
				allowBlank: true
			}, {
				name: this.prefix + 'bank.correspondent_account',
				fieldLabel: _('Correspondent account'),
				allowBlank: true
			}, {
				name: this.prefix + 'bank.payment_account',
				fieldLabel: _('Payment account'),
				vtype: 'payment_account',
				allowBlank: true
			}]
		});
		this.callParent(arguments);
	}
});