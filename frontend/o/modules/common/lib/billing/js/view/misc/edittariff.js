/**
 *
 * @class O.window.EditAccountTariff
 * @extends Ext.window.Window
 */
C.define('O.window.EditAccountTariff', {
	extend: 'O.window.Billing',

/** Languages */
	title: 'Edit account tariff',

	lngBtnDo: 'Change tariff',
	lngNewAccountTariff: 'New tariff',

/**
	* Constructor
	*/
	initComponent: function() {

		this.accountId = this.data.accountId;
		this.currentTariffId = this.data.tariffId;

		Ext.apply(this, {
			items: [{
				xtype: 'combobox',
				fieldLabel: this.lngNewAccountTariff,
				name: 'value',
				store: C.getStore('x_tariff'),
				value: this.currentTariffId,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id'
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
				handler: this.changeAccountTariff,
				scope: this
			}, {
				xtype: 'button',
				text: _('Cancel'),
				handler: this.destroy,
				scope: this
			}]
		});

		this.fieldValue = this.down('[name=value]');

		this.fieldValue.on({
			change: this.onValueChange,
			scope: this
		});

		this.buttonSave = this.down('#save');

		this.show();
	}
});
