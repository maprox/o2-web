/**
 */
/**
 * Settings manager
 * @class O.manager.Settings
 * @singleton
 */
Ext.define('O.manager.Settings', {
	extend: 'Ext.util.Observable',
	singleton: true,

	/**
	 * Settings check
	 */
	onLoad: function() {
		var sets = O.manager.Model.getProxy('settings');
		if (sets && !sets.isRequisitesFilled()) {
			O.msg.warning({
				msg: _('Please fill all the requisites fields in settings. '
					+ '<br> It is required for handling your accounting info.'),
				callback: Ext.bind(this.onFillSettingsClick, this),
				delay: 0
			});
		}
	},

	/**
	 * Navigate to settings
	 */
	onFillSettingsClick: function() {
		if (O.ui.Desktop.getModule('settings')) {
			O.ui.Desktop.callModule('settings', [{value: 'firm'}]);
		} else {
			window.open('/admin#settings/firm', 'fillSettings');
		}
	}

}, function() {
	C.onready(this.onLoad, this);
});