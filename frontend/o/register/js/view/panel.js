/**
 * @fileOverview Registration panel ui
 */
/**
 * Registration panel ui
 * @class O.register.Panel
 * @extend C.ui.Panel
 */

Ext.define('O.register.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.registerpanel',

	id: 'registerPanel',
	subTitle: 'Registration window',
	autoHeight: true,

/**
	* Component initialization
	*/
	initComponent: function() {
		var error = Ext.get('access_error');
		if (error != null) {
			this.accessError(error.dom.innerHTML);
			return;
		}
		var type = window.location.pathname.split('/')[2] || 'monitoring';
		Ext.apply(this, {
			layout: 'border',
			items: [{
				region: 'north',
				cls: 'title',
				html: '<h1>' + VARIABLES['title'] + '</h1>' +
					'<div class="info">' + this.subTitle + '</div>'
			}, {
				region: 'center',
				xtype: 'register' + type,
				autoScroll: true
			}, {
				region: 'south',
				hidden: true,
				itemId: 'error',
				cls: 'error',
				html: '',
				height: 50
			}]
		});
		this.callParent(arguments);
		this.err = this.down('#error');
	},

/**
	* Displays an error message
	* @param {String} msg Error message
	*/
	displayError: function(msg) {
		this.setLoading(false);
		this.err.setVisible(true);
		this.err.update(msg);
	},

/**
	* Wrong url or expired hash
	* @param {String} msg Error message
	*/
	accessError: function(msg) {
		Ext.MessageBox.show({
			 msg: msg,
			 closable: false
		});
	}
});
