/**
 * Track history detailed report panel
 * @class O.comp.DetailedReport
 * @extends Ext.grid.Panel
 */
C.define('O.comp.DetailedReport', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.detailedreport',

	border: false,

/**
	* @constructs
	*/
	initComponent: function() {
		var me = this;
		this.store = Ext.create('O.mon.trackhistory.TrackStore');

		// Total summary data
		this.total = {
			odometer: 0,
			odometer_selected: 0,
			moving: 0,
			still: 0
		};

		// Number of counted tracks
		this.tracksCounted = 0;

		Ext.apply(this, {
			features: [{
				ftype: 'rowbody',
				getAdditionalData: function(data, idx, record, orig) {
					var headerCt = this.view.headerCt,
						colspan = headerCt.getColumnCount(),
						typeClass = 'tt_' + record.get('type'),
						colorClass = 'tc_' + record.get('color');
					return {
						rowBody: Ext.String.format(
							'<div class="detailsGridRow ' +
								typeClass + ' ' +
								colorClass + ' ' +
								'">{0}{1}</div>',
							data.odometer_string,
							data.speed_string
						),
						rowBodyCls: 'track-' + record.get('type'),
						rowBodyColspan: colspan
					};
				}
			}, {
				ftype: 'rowwrap'
			}, {
				ftype:'groupingsummary',
				groupHeaderTpl: '{[Ext.Date.format(values.name, ' +
					'O.format.Date)]} ({rows.length})'
			}],
			border: false,
			autoScroll: true,
			layout: 'fit',
			cls: 'detailedreport',
			store: this.store,
			viewConfig: {
				getRowClass: function(record) {
					return 'tt_' + record.get('type') + ' tc_' +
						record.get('color');
				}
			},
			columns: [{
				dataIndex: 'visible',
				xtype: 'checkcolumn',
				width: 30,
				fixed: true,
				sortable: false,
				menuDisabled: true,
				listeners: {
					checkchange: function(o, index, checked) {
						me.commitItemAt(index);
						me.fireEvent('checkedchange', me.getSelectedItems());
					}
				},

				summaryType: function(tracks) {
					var result = {
						odometer: 0,
						odometer_nodata: 0,
						time: 0
					};

					// Day tracks iteration
					Ext.Array.each(tracks, function(track) {
						var data = track.data;
						if (data.type == 'moving' && data.odometer) {
							result.time += track.getTime();
						}
						if (data.type == 'sleep' && data.odometer) {
							result.odometer_nodata += data.odometer;
						}
						result.odometer += data.odometer;
						me.tracksCounted++;
					});

					// Count period summary
					if (me.tracksCounted <= me.store.data.length) {
						// Data for the whole period
						me.total.odometer += result.odometer;
						me.total.odometer_nodata += result.odometer_nodata;
						me.total.moving += result.time;

						// Update data in store
						me.summaryStore.loadData([me.total]);
					}

					// Data for day
					result.odometer = Number(result.odometer / 1000).toFixed(2);
					result.odometer_nodata = Number(
						result.odometer_nodata / 1000).toFixed(2);
					result.moving = O.timeperiod.getDuration(result.time);
					result.still = O.timeperiod.getDuration(
						24 * 60 * 60 - result.time
					);

					return result;
				},
				summaryRenderer: function(summary) {
					var tpl = [
						'</td>',
						'<td colspan="3">',
							'<div class="daysummaryrow">',
								'<div class="summarytitle">',
									_('Day summary') + ':',
								'</div>',
								'<div>',
									'<b>',
										_('Odometer'),
									':</b> {0} ', _('км'),
									', <b>',
										_('unreliably'),
									':</b> {1} ', _('км'),
								'</div>',
								'<div>',
									'<b>',
										_('Moving time'),
									':</b> {2}',
								'</div>',
								'<div>',
									'<b>',
										_('Station time'),
									':</b> {3}',
								'</div>',
							'</div>',
						'</td>'
					];
					return Ext.String.format(tpl.join(''),
						summary.odometer,
						summary.odometer_nodata,
						summary.moving,
						summary.still
					);
				}
			}, {
				header: _('Begin'),
				dataIndex: 'sdt',
				flex: 1,
				fixed: false,
				sortable: false,
				renderer: function(value) {
					return Ext.Date.format(value, O.format.Time);
				},
				menuDisabled: true
			}, {
				header: _('End'),
				dataIndex: 'edt',
				flex: 1,
				fixed: false,
				sortable: false,
				renderer: function(value, obj, record) {
					var startDay =
							Ext.Date.format(record.get('sdt'), O.format.Date),
						endDay = Ext.Date.format(value, O.format.Date);

					var format = startDay == endDay ?
						O.format.Time :
						O.format.DateShort + ' ' + O.format.Time;

					return Ext.Date.format(value, format);
				},
				menuDisabled: true
			}, {
				header: _('Duration'),
				dataIndex: 'duration',
				flex: 1,
				fixed: false,
				sortable: false,
				menuDisabled: true
			}]
		});
		this.callParent(arguments);
	},

/**
	* Method to get icon based on track type
	*/
	iconRenderer: function(value) {
		return '<img src=' + STATIC_PATH + '/img/track/' + value + '.png />';
	}
});


