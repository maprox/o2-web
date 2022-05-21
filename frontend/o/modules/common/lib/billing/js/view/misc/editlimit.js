/**
 * @class O.window.EditAccountLimit
 * @extends Ext.window.Window
 */
C.define('O.window.EditAccountLimit', {
	extend: 'O.window.Billing',

/** Languages */
	title: 'Edit account limit',

	lngBtnDo: 'Change limit',

	lngNewAccountLimit: 'New limit sum',
	lngNewAccountLimitDate: 'New limit expires',
	lngNewAccountLimitPermanent: 'Make new limit permanent',

/**
	* Constructor
	*/
	initComponent: function() {

		/** Save incoming data */
		var value = this.data.currentValue;
		this.accountId = this.data.accountId;

		Ext.apply(this, {
			layout: 'anchor',
			defaults: {
				anchor: '100%'
			},
			items: [{
				xtype: 'numberfield',
				value: value,
				fieldLabel: this.lngNewAccountLimit,
				name: 'value'
			}, {
				xtype: 'datefield',
				fieldLabel: this.lngNewAccountLimitDate,
				name: 'date'
			}, {
				xtype: 'checkbox',
				fieldLabel: this.lngNewAccountLimitPermanent,
				name: 'permanent'
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
				handler: this.changeAccountLimit,
				scope: this
			}, {
				xtype: 'button',
				text: _('Cancel'),
				handler: this.destroy,
				scope: this
			}]
		});

		this.fieldValue = this.down('[name=value]');
		this.fieldDate = this.down('[name=date]');
		this.fieldPermanent = this.down('[name=permanent]');

		this.fieldValue.on({
			change: this.onValueChange,
			scope: this
		});

		this.fieldDate.on({
			change: this.onValueChange,
			scope: this
		});

		this.fieldPermanent.on({
			change: this.onPermanentChange,
			scope: this
		});

		this.buttonSave = this.down('#save');

		this.show();
	}
});
