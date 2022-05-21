/**
 * @class O.mon.lib.tracker.abstract.tab.Connection
 * @extends O.mon.lib.tracker.abstract.tab.Abstract
 */

Ext.define('O.mon.lib.tracker.abstract.tab.Connection', {
	extend: 'O.mon.lib.tracker.abstract.tab.Abstract',
	alias: 'widget.mon-lib-tracker-abstract-tab-connection',

/**
	* Flag of visibility of "Configure by SMS" button
	* @type Boolean
	*/
	canBeConfiguredBySms: false,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Connection')
		});
		this.callParent(arguments);
	},

/**
	* Adds configure by sms button
	*/
	addConfigureButton: function() {
		return this.insert({
			xtype: 'button',
			text: _('Configure by SMS')
		});
	}

});
