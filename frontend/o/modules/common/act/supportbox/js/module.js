/**
 * SupportBox module
 * @class O.ui.module.SupportBox
 * @extends C.ui.Module
 */
C.define('O.ui.module.SupportBox', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-supportbox',

/**
	* Module type
	*/
	type: 'link',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'supportbox',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Contact the techsupport',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Report a bug / Ask a question',

/**
	* Initialization of module.
	*/
	init: function() {
		this.callParent(arguments);
		var searchResult = Ext.ComponentQuery.query('link-container');
		if (searchResult.length) {
			searchResult[0].addLink(this);
		}
	},

/**
	* Module handler
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	activate: function(params) {
		var w = Ext.create('Ext.window.Window', {
			iconCls: 'supportbox',
			title: this.textShort,
			modal: true,
			width: 500,
			height: 400,
			closeAction: 'destroy',
			bodyPadding: 10,
			border: false,
			layout: {
				type: 'fit',
				align: 'center'
			},
			items: [{
				xtype: 'supportbox'
			}]
		});
		w.show();
		var box = w.down('supportbox');
		if (box) {
			box.on('message_sent', function() {
				w.close();
			});
		}
	}

});