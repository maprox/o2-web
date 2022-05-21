/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * @class O.ui.module.Balance
 * @extends C.ui.Module
 */
C.define('O.ui.module.Balance', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-balance',

/**
	* Module type
	*/
	type: 'link',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'balance',

/**
	* Item identifier
	*/
	itemId: 'balance',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Balance',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Balance',

/**
	* Initialization of module.
	* Adding link to a link container
	*/
	init: function() {
		if (!C.userHasRight('module_billing')) {
			return;
		}
		this.callParent(arguments);
		var balance = this.getBalance();
		if (balance) {
			this.textShort = balance;
			var searchResult = Ext.ComponentQuery.query('link-container');
			if (searchResult.length) {
				searchResult[0].addLink(this);
			}
			O.manager.Model.bind(['settings'], this.onModelChange, this);
		}
	},

/**
	* Module handler
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	activate: function(params) {
		// вернет null, если это НЕ админка, иначе undefined
		if (O.ui.Desktop.callModule('billing') === null) {
			window.open('/admin#billing');
		}
	},

/**
	* On settings update
	*/
	onModelChange: function() {
		var balance = this.getBalance();
		if (balance) {
			var searchResult = Ext.query('.balance + span');
			if (searchResult.length) {
				searchResult[0].innerHTML = balance;
			}
		}
	},

/**
 * Get balance value string
 * @return String Balance
 */
	getBalance: function() {
		var balance = C.getSetting('f.balance');
		return (balance !== undefined) ?
			Ext.util.Format.ruMoney(balance) : null;
	}
});
