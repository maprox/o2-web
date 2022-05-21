/**
 *
 * Device history panel
 * @class O.comp.HistoryPanel
 * @extends Ext.panel.Panel
 */
C.define('O.comp.HistoryPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.historypanel',

	/**
	 * @event unfold
	 * Fires whenever unfold toolbutton is pressed
	 */

	msgBtnShowStoppings: 'Show all stoppings',
	msgBtnHideStoppings: 'Hide all stoppings',
	msgBtnHideAll: 'Uncheck all',
	msgTitle: 'Track history',

	initComponent: function() {
		var me = this;
		Ext.apply(this, {
			stateful: true,
			title: this.msgTitle,
			layout: 'fit',
			items: [{
				title: null,
				xtype: 'devicehistory'
			}],
			tools: this.getToolConfig(),
			dockedItems: [{
				xtype: 'toolbar',
				enableOverflow: true,
				items: [{
					xtype: 'button',
					itemId: 'hidefulltrackBtn',
					iconCls: 'hidefulltrack',
					tooltip: _('Hide full track'),
					enableToggle: true,
					stateful: true,
					stateId: 'hidefulltrack',
					stateEvents: ['toggle'],
					getState: function() {
						return {
							pressed: this.pressed
						}
					},
					applyState: function(state) {
						if (state) {
							Ext.apply(this, state);
							me.hideFullTrack(this);
						}
					},
					scope: this
				}, {
					xtype: 'button',
					text: _('Export'),
					itemId: 'btnExport',
					iconCls: 'btn-export',
					menu: {
						items: [{
							iconCls: 'gpx10',
							exportFormat: 'gpx10',
							text: _('GPX 1.0')
						}, {
							iconCls: 'gpx11',
							exportFormat: 'gpx11',
							text: _('GPX 1.1 (no speed and course)')
						}, {
							iconCls: 'kml',
							exportFormat: 'kml',
							text: _('KML (Google Earth)')
						}]
					}
				},{
					xtype: 'tbfill'
				}, {
					xtype: 'button',
					//iconCls: 'showstoppings',
					itemId: 'stoppingsBtn',
					text: this.msgBtnShowStoppings,
					enableToggle: true,
					hidden: true,
					handler: this.setShowStoppings,
					scope: this
				}, {
					xtype: 'button',
					iconCls: 'hideall',
					text: this.msgBtnHideAll,
					handler: this.hideAll,
					scope: this
				}]
			}, {
				xtype: 'dataview',
				dock: 'bottom',
				itemId: 'totaldetailsView',
				cls: 'totaldetails',
				itemSelector: 'div',
				border: false,
				store: Ext.create('Ext.data.Store', {
					model: 'O.mon.trackhistory.SummaryModel'
				}),
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
						_('Odometer'),
						': {[this.formatOdometer(values.odometer)]} ',
						_('km'),
						', ',
						_('unreliably'),
						': {[this.formatOdometer(values.odometer_nodata)]} ',
						_('km'),
						'<br/>',
						_('Selected'),
						': ',
						'{[this.formatOdometer(values.odometer_selected)]} ',
						_('km'),
						'<br/>',
						_('Moving'),
						': {[this.formatTime(values.moving)]}',
						', ',
						_('stay'),
						': {[this.formatStillTime(values.moving)]}',
					'</tpl>',
					{
						formatOdometer: function(odometer) {
							return Number(odometer / 1000).toFixed(2);
						},

						formatTime: function(time) {
							return O.timeperiod.getDuration(time);
						},

						formatStillTime: function(time) {
							if (me.period) {
								var formatedTime =  O.timeperiod.getDuration(
									Math.round((me.period.edt - me.period.sdt)
										/ 1000) - time
								);
							} else {
								return time;
							}
							return formatedTime;
						}
					}
				)
			}]
		});
		this.callParent(arguments);
		// init variables
		this.summaryView = this.down('#totaldetailsView');
		if (this.summaryView) {
			this.summaryStore = this.summaryView.getStore();
		}
		this.stoppingsButton = this.down('toolbar').down('#stoppingsBtn');
		this.btnExportGpx10 = this.down('component[exportFormat=gpx10]');
		this.btnExportGpx11 = this.down('component[exportFormat=gpx11]');
		this.btnExportKml = this.down('component[exportFormat=kml]');
		this.mapPacketInfo = this.down('devicehistory');
		this.deviceEvents = this.down('eventsinfo');
		this.detailedReport = this.down('detailedreport'); //!
		this.historySensors = this.down('historysensors');
		this.hidefulltrackBtn = this.down('#hidefulltrackBtn');
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
	* Checks/unchecks all stoppings
	*/
	setShowStoppings: function() {
		var pressed = this.stoppingsButton.pressed;

		this.detailedReport.stoppingsToggle(pressed);
		this.stoppingsButton.setText(pressed ?
			this.msgBtnHideStoppings : this.msgBtnShowStoppings);
	},

/**
	* Resets stoppings button
	*/
	resetShowStoppings: function() {
		this.down('toolbar').down('#stoppingsBtn').toggle(false).setText(
			this.msgBtnShowStoppings);
	},

/**
	* Hides all selected items
	*/
	hideAll: function() {
		this.detailedReport.hideAll();
	},

/**
	* Sends signal to unfold this panel back onto the map
	*/
	unfoldPanels: function() {
		this.fireEvent('unfold');
	}
});
