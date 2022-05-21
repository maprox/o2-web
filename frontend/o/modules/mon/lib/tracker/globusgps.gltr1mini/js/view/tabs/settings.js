/**
 * @class O.mon.lib.tracker.globusgps.gltr1mini.tab.Settings
 * @extends O.mon.lib.tracker.globusgps.tab.Settings
 */

Ext.define('O.mon.lib.tracker.globusgps.gltr1mini.tab.Settings', {
	extend: 'O.mon.lib.tracker.globusgps.tab.Settings',
	alias: 'widget.mon-lib-tracker-globusgps.gltr1mini-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'globusgps.gltr1mini'
		});
		this.callParent(arguments);
	},

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
		});*/
		return items;
	}
});
