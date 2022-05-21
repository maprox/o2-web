/**
 * Events panel
 * @class O.app.controller.Events
 * @extend Ext.app.Controller
 */
Ext.define('O.app.controller.Events', {
	extend: 'Ext.app.Controller',
	views: ['Events'],

	config: {
		refs: {
			container: '#events',
			eventspanel: '#events #eventspanel',
			periodchooser: '#events #periodchooser'
		},
		control: {
			periodchooser: {
				load: 'onPeriodchooserLoad'
			}
		}
	},

/**
	* Load events according to supplied params
	* @param {Object} params
	*/
	onPeriodchooserLoad: function(params) {
		this.getEventspanel().loadPeriod(params);
	}
});
