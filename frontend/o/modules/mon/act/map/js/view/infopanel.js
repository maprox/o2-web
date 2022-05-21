/**
 *
 * Device history window
 * @class O.comp.DeviceInfoPanel
 * @extends Ext.panel.Panel
 */
C.define('O.comp.DeviceInfoPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.mappanel',

	/**
	 * @event unfold
	 * Fires whenever unfold toolbutton is pressed
	 */

	msgTitle: 'Device info',

	initComponent: function() {
		Ext.apply(this, {
			stateful: true,
			title: this.msgTitle,
			layout: 'fit',
			items: [{
				title: null,
				border: false,
				xtype: 'mapdeviceinfo'
			}],
			tools: this.getToolConfig()
		});
		this.callParent(arguments);
	},

/**
	* Returns config for folding/unfolding tool
	* @return {Object}
	*/
	getToolConfig: function() {
		return [{
			type: 'unpin',
			handler: this.unfoldPanels,
			scope: this
		}];
	},

/**
	* Sends signal to unfold this panel back onto the map
	*/
	unfoldPanels: function() {
		this.fireEvent('unfold');
	}
});
