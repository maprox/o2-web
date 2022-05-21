/**
 * @class O.mon.lib.tracker.globalsat.tr600.tab.Settings
 * @extends O.mon.lib.tracker.globalsat.tab.Settings
 */

Ext.define('O.mon.lib.tracker.globalsat.tr600.tab.Settings', {
	extend: 'O.mon.lib.tracker.globalsat.tab.Settings',
	alias: 'widget.mon-lib-tracker-globalsat.tr600-tab-settings',
	itemId: 'globalsat.tr600',

/**
	* Returns a list of items for current panel
	* @param {Object} defaults
	*/
	getItems: function(defaults) {
		var items = this.callParent(arguments);
		/*items.push({
			xtype: 'fieldset',
			title: _('SOS'),
			defaults: defaults,
			items: [{
				fieldLabel: _('Phone number 1'),
				name: this.itemId + '.sos_phone_1'
			}, {
				fieldLabel: _('Phone number 2'),
				name: this.itemId + '.sos_phone_2'
			}, {
				fieldLabel: _('Phone number 3'),
				name: this.itemId + '.sos_phone_3'
			}, {
				fieldLabel: _('Phone number 4'),
				name: this.itemId + '.sos_phone_4'
			}, {
				fieldLabel: _('Phone number 5'),
				name: this.itemId + '.sos_phone_5'
			}, {
				fieldLabel: _('Phone number 6'),
				name: this.itemId + '.sos_phone_6'
			}]
		});
		items.push({
			xtype: 'fieldset',
			title: _('Voice monitor'),
			defaults: defaults,
			items: [{
				fieldLabel: _('Phone number 1'),
				name: this.itemId + '.voice_phone_1'
			}, {
				xtype: 'checkbox',
				fieldLabel: _('Call first phone, when SOS button is pressed'),
				fieldStyle: 'float: right;',
				name: this.itemId + '.voice_call_on_sos'
			}, {
				fieldLabel: _('Phone number 2'),
				name: this.itemId + '.voice_phone_2'
			}, {
				fieldLabel: _('Phone number 3'),
				name: this.itemId + '.voice_phone_3'
			}]
		});*/
		return items;
	}
});
