/**
 * @fileOverview Msg panel
 *
 * @class O.app.controller.Msg
 * @extend Ext.app.Controller
 */
Ext.define('O.app.controller.Msg', {
	extend: 'Ext.app.Controller',
	views: ['Msg'],

	config: {
		refs: {
			container: '#msg',
			msgpanel: 'msgpanel'
		},
		control: {
			msgpanel: {
				removed: 'onWorksUpdate'
			}
		}
	},

/**
	* Controller initialization
	* @construct
	*/
	init: function() {
		O.manager.Model.bind(['n_work'], 'onWorksUpdate', this);
	},

/**
	* Update works handler
	*/
	onWorksUpdate: function() {
		var count = C.getStore('n_work').count();
		this.getContainer().setBadgeText(count || '');
	}
});