/**
 *
 * Device history window
 * @class O.comp.DeviceInfoWindow
 * @extends O.comp.DeviceInfoPanel
 */
C.define('O.comp.DeviceInfoWindow', {
	extend: 'O.comp.DeviceInfoPanel',
	alias: 'widget.mapwindow',

	/**
	 * @event collapse_panel
	 * Fires whenever collapse toolbutton is pressed
	 */

/**
	* Component initialization
	*/
	initComponent: function() {
		var size = C.utils.getPageSize();
		var margin = 50,
			w = 360, x = size.w - w - margin;
			y = 120, h = 400;
		Ext.apply(this, {
			stateId: 'map_historywindow',
			stateEvents: ['move', 'resize', 'collapse'],
			floating: true,
			draggable: {
				delegate: '.x-panel-header',
				constrain: true
			},
			collapseMode: 'header',
			collapsible: true,
			expandOnShow: false,
			resizable: true,
			collapseFirst: false,
			x: x,
			y: y,
			width: w,
			height: h
		});
		this.callParent(arguments);
	},

/**
	* Returns config for folding/unfolding tool
	* @return {Object}
	*/
	getToolConfig: function() {
		return [{
			type: 'pin',
			handler: this.collapsePanels,
			scope: this
		}];
	},

/**
	* Sends signal to collapse this panel onto device list
	*/
	collapsePanels: function() {
		this.fireEvent('collapse_panel');
	},

	/**
	 * @private
	 * @override
	 * Override Component.initDraggable.
	 * Create Window draggable instead of panel draggable
	 */
	initDraggable: function() {
		this.dd = Ext.create('Ext.util.ComponentDragger', this, Ext.applyIf({
			el: this.el,
			constrainTo: this.container
		}, this.draggable));
		this.relayEvents(this.dd, ['dragstart', 'drag', 'dragend']);
	}
});
