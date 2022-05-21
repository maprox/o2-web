/**
 * TODO: comment this;
 */
C.define('O.mon.act.dashboard.MovementPortlet', {

	extend: 'Ext.panel.Panel',
	alias: 'widget.movementportlet',

	initComponent: function() {
		var chart, timeAxis;

		// Random data for each minute
		var generateData = (function() {
			var data = [], i = 0,
				last = false,
				date = new Date(),
				seconds = +date,
				min = Math.min,
				max = Math.max,
				random = Math.random;
			return function() {
				data = data.slice();
				data.push({
					date:  Ext.Date.add(date, Ext.Date.MINUTE, i++),
					moving: min(100, max(last? last.moving + (random() - 0.5) * 20 : random() * 100, 0)),
					connected: min(100, max(last? last.connected + (random() - 0.5) * 10 : random() * 100, 0)),
					still: min(100, max(last? last.still + (random() - 0.5) * 20 : random() * 100, 0)),
					total: 100
				});
				last = data[data.length -1];
				return data;
			};
		})();

		/*var group = false,
			groupOp = [{
				dateFormat: 'M d',
				groupBy: 'year,month,day'
			}, {
				dateFormat: 'M',
				groupBy: 'year,month'
			}];

		function regroup() {
			group = !group;
			var axis = chart.axes.get(1),
				selectedGroup = groupOp[+group];
			axis.dateFormat = selectedGroup.dateFormat;
			axis.groupBy = selectedGroup.groupBy;

			chart.redraw();
		}*/

		var store = Ext.create('Ext.data.JsonStore', {
			fields: ['date', 'moving', 'connected', 'still', 'total'],
			data: generateData()
		});
		this.chartStore = store;

		Ext.apply(this, {
			layout: 'fit',
			height: 300,
			items: [{
				xtype: 'chart',
				style: 'background:#fff',
				store: store,
				itemId: 'movementChart',
				legend: {
					position: 'right'
				},
				axes: [{
					type: 'Numeric',
					minimum: 0,
					//decimals: 0,
					//maximum: 200,
					position: 'left',
					fields: ['connected', 'moving', 'still', 'total'],
					title: _('Number of devices'),
					grid: {
						odd: {
							fill: '#dedede',
							stroke: '#ddd',
							'stroke-width': 0.5
						}
					}
				}, {
					type: 'Time',
					position: 'bottom',
					fields: 'date',
					title: _('Time'),
					dateFormat: 'H:i:s',
					groupBy: 'hour,minute,second',
					aggregateOp: 'sum',
					constrain: true,
					fromDate: new Date(),
					toDate: Ext.Date.add(new Date(), Ext.Date.MINUTE, 10)
				}],
				series: [{
					type: 'line',
					axis: ['left', 'bottom'],
					xField: 'date',
					yField: 'moving',
					title: _('Moving'),
					label: {
						display: 'none',
						field: 'moving',
						renderer: function(v) { return v >> 0; },
						'text-anchor': 'middle'
					},
					markerConfig: {
						radius: 1,
						size: 1
					}
				}, {
					type: 'line',
					axis: ['left', 'bottom'],
					xField: 'date',
					yField: 'connected',
					title: _('Connected'),
					label: {
						display: 'none',
						field: 'moving',
						renderer: function(v) { return v >> 0; },
						'text-anchor': 'middle'
					},
					markerConfig: {
						radius: 1,
						size: 1
					}
				}, {
					type: 'line',
					axis: ['left', 'bottom'],
					xField: 'date',
					yField: 'still',
					title: _('Still'),
					label: {
						display: 'none',
						field: 'moving',
						renderer: function(v) { return v >> 0; },
						'text-anchor': 'middle'
					},
					markerConfig: {
						radius: 1,
						size: 1
					}
				}/*, {
					type: 'line',
					axis: ['left', 'bottom'],
					xField: 'date',
					yField: 'total',
					title: _('Total'),
					label: {
						display: 'none',
						field: 'total',
						renderer: function(v) { return v >> 0; },
						'text-anchor': 'middle'
					},
					markerConfig: {
						radius: 1,
						size: 1
					}
				}*/]
			}]
		});

		this.callParent(arguments);

		chart = this.down('#movementChart');
		this.chart = chart;

		timeAxis = chart.axes.get(1);
		this.timeAxis = timeAxis;

		// Random data
		/*var intr = setInterval(function() {
			//console.debug('interval');
			var timeAxis = chart.axes.get(1);
			var gs = generateData();
			var toDate = timeAxis.toDate,
				lastDate = gs[gs.length - 1].date,
				markerIndex = chart.markerIndex || 0;
			if (+toDate < +lastDate) {
				markerIndex = 1;
				timeAxis.toDate = lastDate;
				timeAxis.fromDate = Ext.Date.add(Ext.Date.clone(timeAxis.fromDate), Ext.Date.MINUTE, 1);
				chart.markerIndex = markerIndex;
			}
			store.loadData(gs);
		}, 500);*/
	}
});
