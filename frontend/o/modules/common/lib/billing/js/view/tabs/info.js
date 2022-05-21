/**
 * Panel with main information of an account
 * @class O.lib.billing.tab.Info
 * @extends Ext.panel.Panel
 */
C.define('O.lib.billing.tab.Info', {
	extend: 'Ext.form.Panel',
	alias: 'widget.common-tariff-tab-info',
	itemId: 'info',

/**
	* Constructor
	*/
	initComponent: function() {

		var limitField = {
			name: 'limittext',
			fieldLabel: _('Limit value'),
			itemId: 'fieldLimitvalue'
		};

		if (C.userHasRight('billing_edit_account_limit')) {
			limitField = this.addEditButton(limitField, this.editLimitValue);
		}

		this.fieldTariff = {
			name: 'tariff',
			fieldLabel: _('Tariff'),
			itemId: 'fieldTariff'
		};

		if (C.userHasRight('billing_edit_account_tariff')) {
			this.fieldTariff = this.addEditButton(
				this.fieldTariff, this.editLimitTariff);
		}

		var balanceField = {
			name: 'balance_fmt',
			fieldLabel: _('Balance'),
			itemId: 'fieldBalance'
		};

		if (C.userHasRight('billing_edit_account_balance')) {
			balanceField = this.addEditButton(balanceField, this.editLimitBalance);
		}

		var range = C.getStore('billing_payment_type').getRange();
		var paymentTypes = [];
		var ids = {};

		Ext.each(range, function(record) {
			if (record.get('visible') &&
				!ids[record.get('id')] &&
				(record.get('param') === 'print') !== C.getSetting('f.individual')
			) {
				paymentTypes.push([record.get('id'), record.get('name')]);
				ids[record.get('id')] = true;
			}
		});

		this.fieldAmount = Ext.create('Ext.form.field.Number', {
			fieldLabel: _('Amount'),
			width: 400,
			name: 'amount',
			listeners: {
				change: {
					fn: this.onInputChange,
					scope: this
				}
			}
		});

		this.fieldType = Ext.create('Ext.form.field.ComboBox', {
			fieldLabel: _('Payment method'),
			width: 600,
			name: 'paymentType',
			editable: false,
			listConfig: {
				maxHeight: 150
			},
			store: paymentTypes,
			queryMode: 'local',
			listeners: {
				change: {
					fn: this.onInputChange,
					scope: this
				}
			}
		});

		this.fieldCreateRefill = Ext.create('Ext.button.Button', {
			text: _('Refill'),
			disabled: true,
			handler: this.createRefillWindow,
			scope: this
		});

		Ext.apply(this, {
			title: _('Information'),
			iconCls: 'billing_info',
			autoScroll: true,
			bodyPadding: 10,
			layout: {
				type: 'anchor'
			},
			defaults: {
				xtype: 'displayfield',
				labelWidth: 150,
				width: 650
			},
			items: [{
				name: 'num',
				fieldLabel: _('Account number'),
				itemId: 'fieldId'
			}, {
				name: 'sdt',
				fieldLabel: _('Creation date'),
				itemId: 'fieldDate'
			},
				balanceField,
				this.fieldTariff,
				limitField,
			{
				xtype: 'checkbox',
				name: 'billing_disabled',
				fieldLabel: _('Billing disabled'),
				itemId: 'fieldDisable',
				hidden: !C.userHasRight('billing_disable_billing'),
				listeners: {
					change: {
						scope: this,
						fn: this.billingDisable
					}
				}
			}, {
				xtype: 'fieldset',
				title: _('Refill'),
				items: [
					this.fieldAmount,
					this.fieldType,
					this.fieldCreateRefill,
					// это для note
					{
						xtype: 'component',
						html: ''
					}
				]
			}, {
				xtype: 'panel',
				cls: 'tiptext',
				padding: 10,
				hidden: !Ext.getBody().hasCls('linkomm'),
				html: '<h3>Политика возврата денежных средств.</h3>' +
					'Возврат денежных средств, принятых для зачисления на ' +
					'личный счет клиента в системе мониторинга транспорта ' +
					'ООО «Линком» производится по письменному заявлению ' +
					'клиента. Срок рассмотрения составляет 14 дней с момента ' +
					'получения заявления. Средства возвращаются в полном ' +
					'объеме, за исключением оплаты уже предоставленных ' +
					'услуг, путем зачисления на банковский счет клиента. ' +
					'Заявление на возврат денежных средств составляется в ' +
					'свободной форме, с указанием причины возврата и ' +
					'банковских реквизитов. Заявление на возврат денежных ' +
					'средств необходимо направить по адресу:  443099, г. ' +
					'Самара, ул. Фрунзе 96, оф. 35 (копию заявления ' +
					'можно направить по электронной почте: ' +
					'<a href="mailto:contact@linkomm.ru">' +
					'contact@linkomm.ru</a>, это значительно уменьшит время ' +
					'рассмотрения). Телефон контакта: +7 (846) 248-10-78.'
			}]
		});

		this.callParent(arguments);
	},

	addEditButton: function(data, handler) {
		return {
			xtype: 'fieldset',
			defaults: {
				xtype: 'displayfield',
				anchor: '100%',
				allowBlank: false
			},
			autoHeight: true,
			layout: 'anchor',
			padding: '0px',
			style: 'border: none;',
			margin: '0px',
			items: [Ext.apply(data, {
				labelWidth: 150,
				anchor: '90%',
				style: {
					float: 'left'
				}
			}), {
				xtype: 'button',
				text: '<img src="'+STATIC_PATH+'/img/edit.png" />',
				anchor: '10%',
				padding: '2px',
				handler: handler,
				scope: this
			}]
		};
	},

	formatNewTariff: function(data) {
		var date = new Date().pg_fmt(data.tariff_sdt);
		date = Ext.Date.add(date, Ext.Date.DAY, 1);
		date = Ext.Date.format(date, 'Y-m-d');

		return '<br /><span class="new_tariff">' + data.tariff +
			' ('+ _('Activates after') + ' ' + date + ')<span>';
	}
});
