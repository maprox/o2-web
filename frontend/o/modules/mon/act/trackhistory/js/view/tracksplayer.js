/**
 * Tracks player
 * @class O.mon.trackhistory.TracksPlayer
 * @extends Ext.grid.Panel
 */
C.define('O.mon.trackhistory.TracksPlayer', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tracksplayer',

	/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		// Display format for player controls
		var timeFmt = 'H:i:s / d.m.Y'

		this.playbackSpeed = 1;
		var timeStart = new Date();
		var timeEnd = new Date();

		// Create speed menu
		this.speedMenu = Ext.create('Ext.menu.Menu', {
			floating: true,
			items: [{
				text: '1x',
				value: 1
			}, {
				text: '10x',
				value: 10
			}, {
				text: '20x',
				value: 20
			}, {
				text: '30x',
				value: 30
			}, {
				text: '40x',
				value: 40
			}, {
				text: '50x',
				value: 50
			}, {
				text: '60x',
				value: 60
			}, {
				text: '70x',
				value: 70
			}, {
				text: '80x',
				value: 80
			}, {
				text: '90x',
				value: 90
			}].reverse()
		});

		Ext.apply(this, {
			itemId: 'tracks_player',
			title: _('Tracks player'),
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			bodyPadding: 0,
			border: false,
			bodyBorder: false,

			items: [{
				xtype: 'toolbar',
				itemId: 'controls',
				items: [{
					xtype: 'button',
					itemId: 'playbackSpeedBtn',
					width: 60,
					text: '1x',
					menu: this.speedMenu
				}, {
					xtype: 'tbspacer'
				}, {
					xtype: 'text',
					itemId: 'timeText'
				}, {
					xtype: 'tbspacer'
				}, {
					xtype: 'button',
					itemId: 'btnStop',
					iconCls: 'btn-stop'
				}, {
					xtype: 'button',
					itemId: 'btnPlay',
					iconCls: 'btn-play',
					disabled: true,
					action: 'play'
				}, {
					xtype: 'button',
					itemId: 'btnPause',
					hidden: true,
					iconCls: 'btn-pause'
				}, {
					xtype: 'tbspacer'
				}, {
					xtype: 'panel',
					itemId: 'timechartPanel',
					border: false,
					bodyBorder: false,
					height: 70,
					flex: 1
					//width: '100%'
				}, {
					xtype: 'tbspacer'
				}, /*{
					xtype: 'button',
					itemId: 'btnToStart',
					iconCls: 'btn-to-start',
					hidden: true
				}, {
					xtype: 'button',
					itemId: 'btnToEnd',
					iconCls: 'btn-to-end',
					hidden: true
				}, {
					xtype: 'timeslider',
					itemId: 'timeslider',
					flex: 1,
					timeStart: timeStart,
					timeEnd: timeEnd,
					timeFormat: timeFmt,
					hidden: true
				}, {
					xtype: 'tbspacer'
				},*/ {
					xtype: 'button',
					itemId: 'btnSkipStoppings',
					enableToggle: true,
					stateful: true,
					stateEvents: ['toggle'],
					stateId: 'player-skip-stoppings',
					iconCls: 'btn-skip-stoppings',
					tooltip: _('Skip stoppings'),
					getState: function() {
						return {
							pressed: this.pressed
						}
					}
				}, {
					xtype: 'button',
					itemId: 'btnFollowSelected',
					enableToggle: true,
					stateful: true,
					stateEvents: ['toggle'],
					stateId: 'player-follow-selected',
					iconCls: 'btn-follow-selected',
					tooltip: _('Follow device'),
					getState: function() {
						return {
							pressed: this.pressed
						}
					}
				}]
			}, {
				xtype: 'panel',
				flex: 1,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				border: false,
				bodyBorder: false,
				items: [{
					collapsible: true,
					title: _('Device properties'),
					collapseDirection: 'left',
					collapsed: true,
					width: 300,
					//border: false,
					//bodyBorder: false,
					region: 'west',
						xtype: 'history-packetdata',
					margins: '5 0 0 5',
					split: true,
					layout: 'fit'
				}, {
					xtype: 'panel',
					border: false,
					bodyBorder: false,
					itemId: 'sensorsChartPanel',
					flex: 1,
					region: 'center',
					layout: 'fit',
					margins: '5 5 0 0'
				}]
			}]
		});

		this.callParent(arguments);
	}
});