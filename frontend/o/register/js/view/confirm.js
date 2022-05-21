/**
 * @fileOverview Registration form confirmation ui
 */
/**
 * Registration form confirmation ui
 * @class O.register.ConfirmForm
 * @extend O.register.BaseForm
 */

Ext.define('O.register.ConfirmForm', {
	extend: 'O.register.BaseForm',
	alias: 'widget.registerconfirm',

/** Заголовок формы */
	title: 'Finishing registration',

/** Адрес, на который идет запрос */
	sendUrl: C.cfg.url.registerConfirm,

/** Сообщение об ошибке */
	errorMessage: 'Login already used',

/** Text fields */
	lngLogin: 'Login',
	lngPassword: 'Password',
	lngPassword2: 'Repeat Password',
	lngAction: 'Finish Registration',

/**
	* Component initialization
	*/
	initComponent: function() {
		var hash = Ext.urlDecode(document.URL.split("?")[1]).id;

		Ext.apply(this, {
			items: [{
				name: 'login',
				fieldLabel: this.lngLogin
			}, {
				name: 'password',
				fieldLabel: this.lngPassword,
				id: 'password',
				inputType: 'password',
				vtype: 'password'
			}, {
				fieldLabel: this.lngPassword2,
				initialPassField: 'password',
				inputType: 'password',
				vtype: 'password'
			}, {
				xtype: 'hiddenfield',
				value: hash,
				name: 'hash'
			}],
			dockedItems: [{
				dock: 'bottom',
				border: false,
				layout: {
					type: 'hbox',
					padding: '20 30',
					pack: 'start',
					align: 'center'
				},
				items: [{
					xtype: 'button',
					width: 180,
					text: this.lngAction,
					handler: Ext.bind(this.submit)
				}]
			}]
		});

		this.callParent(arguments);
	},

/**
	* В случае успеха, залогиним пользователя
	* @param {Array} data отосланные данные
	*/
	successAction: function(data) {
		Ext.widget('window', {
			modal: true,
			width: 500,
			closable: false,
			resizable: false,
			bodyPadding: 40,
			items: [{
				html: '<h2>' + this.finishMessage + '</h2>'
			}]
		}).show();
		Ext.getCmp('registerPanel').hide();
		//location.href = '/?user='+data.login+'&hash='+md5(data.password);
	}
});
