/**
 * @fileOverview Bootmsg module
 *
 * @class O.ui.module.Bootmsg
 * @extends C.ui.Module
 */
C.define('O.ui.module.Bootmsg', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-bootmsg',

/**
	* Module type
	*/
	type: 'plugin',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'bootmsg',

/**
	* Initialization of module.
	* Adding link to a link container
	*/
	init: function() {
		this.callParent(arguments);
		this.checkEmail();
//		this.checkBalance();
	},

/**
	* Проверка заполнения поля E-mail
	*/
	checkEmail: function() {
		// Checkout if user has email
		if (!C.getSetting('p.email')) {
			O.msg.event({
				msg: this.msgEmailNeeded,
				delay: 10000,
				callback: function() {
					O.ui.Desktop.location('/admin#settings');
					/* так было раньше
					O.ui.Desktop.callModule('settings', [
						{name: 'user'},
						{name: 'focus', value: '[name=p.email]'}
					]);
					*/
				}
			});
		}
	},

/**
	* Проверка достаточного количества средств на балансе
	*/
	checkBalance: function() {
		if (O.userHasRightByName('module_billing')
			&& C.getSetting('f.balance') < C.getSetting('f.refill_alert')) {

			O.msg.event({
				msg: this.msgRefillAlert,
				delay: 10000,
				callback: function() {
					O.ui.Desktop.location('/admin#billing');
				}
			});
		}
	}
});
