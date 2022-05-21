/**
 * @class O.window.EditAccountBalance
 * @extends O.window.Billing
 */
C.define('O.window.EditAccountBalance', {
	extend: 'O.window.Billing',

	width: 400,

/** Languages */
	title: 'Edit account balance',

	lngBtnDo: 'Change balance',
	lngCurrentBalance: 'Current balance',
	lngChangeBalance: 'Change value',
	lngMethod: 'Payment method',
	lngNote: 'Note',

/**
	* Constructor
	*/
	initComponent: function() {

		this.accountId = this.data.accountId;
		var currentBalance = this.data.balance;

		var range = C.getStore('billing_payment_type').getRange();
		var paymentTypes = [];
		var ids = {};
		Ext.each(range, function(record){
			if (!ids[record.get('id')]) {
				paymentTypes.push(record.get('name'));
				ids[record.get('id')] = true;
			}
		});

		Ext.apply(this, {
			layout: 'anchor',
			defaults: {
				anchor: '100%'
			},
			items: [{
				xtype: 'displayfield',
				fieldLabel: this.lngCurrentBalance,
				value: Ext.util.Format.ruMoney(currentBalance)
			}, {
				xtype: 'numberfield',
				value: 0,
				fieldLabel: this.lngChangeBalance,
				name: 'value'
			}, {
				xtype: 'combo',
				fieldLabel: this.lngMethod,
				name: 'paymentType',
				editable: false,
				listConfig: {
					maxHeight: 150
				},
				store: paymentTypes,
				queryMode: 'local'
			}, {
				xtype: 'textfield',
				fieldLabel: this.lngNote,
				name: 'note'
			}]
		});

		this.callParent(arguments);

		/** Add start/cancel buttons */
		this.addDocked({
			xtype: 'toolbar',
			dock: 'bottom',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [{
				xtype: 'button',
				text: this.lngBtnDo,
				itemId: 'save',
				disabled: true,
				handler: this.changeAccountBalance,
				scope: this
			}, {
				xtype: 'button',
				text: _('Cancel'),
				handler: this.destroy,
				scope: this
			}]
		});

		this.fieldValue = this.down('[name=value]');
		this.fieldType = this.down('[name=paymentType]');
		this.fieldNote = this.down('[name=note]');

		this.fieldValue.on({
			change: this.onValueChange,
			scope: this
		});

		this.fieldType.on({
			change: this.onValueChange,
			scope: this
		});

		this.buttonSave = this.down('#save');

		this.show();
	}
});
