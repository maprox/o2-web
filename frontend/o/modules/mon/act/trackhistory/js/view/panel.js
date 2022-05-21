/**
 *
 * Device track history panel
 * @class O.act.TrackHistory
 * @extends C.ui.Panel
 */
C.define('O.act.TrackHistory', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_trackhistory',

	msgTrackHistory: 'Track history',
	lngEmptyPeriod: 'There are no data for selected period.',

	id: 'act_trackhistory',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			//layout: 'border',
			items: [{
				region: 'center',
				split: true,
				flex: 1,
				xtype: 'panel',
				border: false,
				bodyBorder: false,
				anchor: '100%',
				layout: 'border',
				dockedItems: [{
					dock: 'top',
					xtype: 'periodchooser',
					immediateLoad: true
				}],
				items: [{
					region: 'center',
					xtype: 'baselayer_trackhistory'
				}, {
					xtype: 'panel',
					region: 'west',
					width: 400,
					split: true,
					collapsible: true,
					animCollapse: false,
					title: _('List of objects'),
					stateId: 'trackhistory_objectspanel',
					stateful: true,
					layout: 'border',
					items: [{
						split: true,
						border: false,
						region: 'center',
						xtype: 'objectsgroupslist',
						reverseObjectSelectionModeFor: ['O.ui.groups.Devices',
							'O.ui.groups.Vehicles']
					}, {
						xtype: 'historypanel',
						stateId: 'trackhistory_historypanel',
						stateEvents: ['resize'],
						split: true,
						height: 400,
						region: 'south'
					}]
				}]
			}, {
				xtype: 'splitter'
			}, {
				//flex: 2,
				xtype: 'tracksplayer',
				//region: 'south',
				collapsible: true,
				collapseDirection: 'bottom',
				collapsed: true,
				floatable: false,
				stateful: true,
				stateId: 'tracksplayer-panel'
				//, split: true
			}]
		});
		this.callParent(arguments);
		// init links
		this.periodchooser = this.down('periodchooser');
		this.mapBaseLayer = this.down('baselayer');
		this.groupsList = this.down('objectsgroupslist');
		this.tracksPlayer = this.down('tracksplayer');
	}
});
