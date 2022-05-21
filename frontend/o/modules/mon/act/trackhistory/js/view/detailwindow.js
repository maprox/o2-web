/**
 *
 * Device history window
 * @class O.comp.HistoryWindow
 * @extends O.comp.HistoryPanel
 */
C.define('O.comp.HistoryWindow', {
	extend: 'O.comp.HistoryPanel',

	/**
	 * @event collapse_panel
	 * Fires whenever collapse toolbutton is pressed
	 */

	initComponent: function() {
		var size = C.utils.getPageSize();
		var margin = 50,
			w = 300, x = size.w - w - margin;
			y = 120, h_max = 400, h_calc = size.h - y - margin,
			h = (h_calc > h_max) ? h_max : h_calc;
		Ext.apply(this, {
			closable: false,
			collapseMode: 'header',
			stateId: 'trackhistory_historywindow',
			stateEvents: ['move', 'resize', 'collapse'],
			collapsible: true,
			floating: true,
			draggable: {
				delegate: '.x-panel-header',
				constrain: true
			},
			resizable: true,
			expandOnShow: false,
			collapseFirst: false,
			x: x,
			y: y,
			width: w,
			height: h
		});
		this.callParent(arguments);
	},

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
