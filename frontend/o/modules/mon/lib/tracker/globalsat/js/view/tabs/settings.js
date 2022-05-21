/**
 * @class O.mon.lib.tracker.globalsat.tab.Settings
 * @extends O.mon.lib.tracker.common.tab.Settings
 */

Ext.define('O.mon.lib.tracker.globalsat.tab.Settings', {
	extend: 'O.mon.lib.tracker.common.tab.Settings',
	alias: 'widget.mon-lib-tracker-globalsat-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			autoScroll: true,
			layout: 'anchor',
			width: 500,
			items: this.getItems({
				labelWidth: 200,
				xtype: 'textfield'
			})
		});

		this.callParent(arguments);
	},

/**
	* Returns a list of items for current panel
	* @param {Object} defaults
	*/
	getItems: function(defaults) {
		/*
		var items = [{
			xtype: 'fieldset',
			title: _('Common'),
			defaults: defaults,
			items: [{
				fieldLabel: _('Version'),
				disabled: true,
				disabledCls: '',
				name: this.itemId + '.version'
			}]
		}, {
			xtype: 'fieldset',
			title: _('Motion'),
			defaults: defaults,
			items: [{
				fieldLabel: _('Packet frequency while moving'),
				name: this.itemId + '.freq_mov'
			}, {
				fieldLabel: _('Packet frequency while idle'),
				name: this.itemId + '.freq_idle'
			}, {
				fieldLabel: _('Send packet after traveled distance'),
				name: this.itemId + '.send_mov'
			}, {
				fieldLabel: _('Send packet after angle change'),
				name: this.itemId + '.send_by_angle'
			}]
		}];
		*/
		var items = [];
		return items;
	}
});
