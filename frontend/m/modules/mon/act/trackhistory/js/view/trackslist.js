/**
 * Groups list of devices and geofences
 * @class M.lib.objectsgroupslist.Panel
 * @extend C.ui.Panel
 */
Ext.define('M.app.view.trackhistory.List', {
	extend: 'C.ui.Panel',
	alias: 'widget.listoftracks',

	/*  Configuration */
	config: {
		width: 280,
		height: '80%',
		cls: 'x-static',
		layout: 'fit'
	},

	/**
	 * @construct
	 * @private
	 */
	initialize: function() {
		// setting items
		this.setItems({
			xtype: 'list',
			emptyText: _('No device chosen'),
			store: {
				model: 'Mon.Track',
				data: []
			},
			itemTpl: new Ext.XTemplate(
				'<tpl if="this.isMoving(type)">',
					'<div>',
				'<tpl else>',
					'<div class="track_stopping">',
				'</tpl>',
					'{[Ext.Date.format(values.sdt, ' +
						'O.format.DateShort + " " + O.format.TimeShort)]}',
					' <span class="track_period">' +
						'{[this.calcPeriod(values.sdt, values.edt)]}</span>',
				'</div>',
				'<tpl if="this.isMoving(type)">',
					'<div>',
						'<span style="color:#{color};" class="track_color">' +
							'■</span> ',
						_('Odometer') +
							': {[this.calcOdometer(values.odometer)]} ' + _('km'),
					'</div>',
				'</tpl>',
				{
					isMoving: function(type){
						return type == Mon.Track._MOVING;
					},
					calcOdometer: function(odometer) {
						return (odometer/1000).toFixed(2);
					},
					calcPeriod: function(sdt, edt) {
						var secs = (edt - sdt) / 1000;
						var seconds = Math.floor((secs % 60)).toString();
						var minutes = Math.floor((secs / 60) % 60).toString();
						var hours = Math.floor((secs / 3600)).toString();

						if (seconds.length < 2) {
							seconds = '0' + seconds;
						}
						if (minutes.length < 2) {
							minutes = '0' + minutes;
						}
						if (hours.length < 2) {
							hours = '0' + hours;
						}

						if (hours != '00') {
							return hours + ':' + minutes + ':' + seconds;
						} else {
							return minutes + ':' + seconds;
						}
					}
				}
			),
			items: [{
				itemId: 'navigationBar',
				xtype: 'toolbar',
				docked: 'top',
				items: [{
					xtype: 'title',
					title: _('Track list')
				}, {
					xtype: 'spacer'
				}, {
					xtype: 'segmentedbutton',
					action: 'tabs',
					items: [{
						xtype: 'button',
						iconCls: 'delete',
						ui: 'plain',
						action: 'close',
						iconMask: true
					}]
				}]
			}]
		});
		// call parent
		this.callParent(arguments);

		this.list = this.down('list');
		this.store = this.list.getStore();
	}
});