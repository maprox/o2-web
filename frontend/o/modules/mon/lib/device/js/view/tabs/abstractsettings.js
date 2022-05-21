/**
 * @class O.mon.lib.device.tab.AbstractSettings
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.lib.device.tab.AbstractSettings', {
	extend: 'O.common.lib.modelslist.Tab',

/**
	* @cfg {String} settingsType
	* Alias for mon/lib/tracker/ parts + itemId
	*/
	settingsType: '',

/**
	* @constructor
	*/
	initComponent: function() {
		// Create tabs
		var tabs = [],
			type = this.settingsType,
			protocolStore = C.getStore('mon_device_protocol');

		protocolStore.each(function(record) {
			var tabAlias = 'mon-lib-tracker-' +
				record.get('alias') + '-tab-' + type;
			if (!Ext.ClassManager.getNameByAlias('widget.' + tabAlias)) {
				console.error('Unknown protocol!', tabAlias);
			} else {
				tabs.push(
					Ext.widget(tabAlias, {
						border: false,
						autoScroll: true,
						padding: 0,
						bodyPadding: 0,
						margin: 0,
						header: false
					})
				);
			}
		}, this);

		this.tabs = tabs;

		Ext.apply(this, {
			itemId: this.settingsType,
			layout: 'card',
			items: tabs
		});

		this.callParent(arguments);
	}
});
